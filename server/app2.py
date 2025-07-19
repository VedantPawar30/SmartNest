from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO
from serpapi import GoogleSearch
import json
from datetime import datetime, timedelta
import google.generativeai as genai
import re
from dotenv import load_dotenv
import os

load_dotenv()  # take environment variables from .env

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*") 

api_key = os.getenv("GOOGLE_API_KEY")
serpapi_key = os.getenv("SERPAPI_KEY")
fallback_serpapi_key = os.getenv("FALLBACK_SERPAPI_KEY")  
genai.configure(api_key=api_key)

def clean_and_extract_json(raw_content, max_elements=3):
    try:
        # Remove non-printable control characters
        cleaned_content = re.sub(r'[^\x20-\x7E]', '', raw_content)
        
        # First try to parse the entire string as a JSON array
        try:
            parsed_json = json.loads(cleaned_content)
            if isinstance(parsed_json, list):
                return parsed_json[:max_elements]  # Return at most max_elements
        except json.JSONDecodeError:
            pass  # If full parsing fails, continue with character-by-character approach
        
        # Original character-by-character approach as fallback
        valid_objects = []
        brace_count = 0
        current_object = ""
        
        for char in cleaned_content:
            current_object += char
            if char == "{":
                brace_count += 1
            elif char == "}":
                brace_count -= 1
            
            if brace_count == 0 and current_object.strip():
                try:
                    valid_json = json.loads(current_object)
                    valid_objects.append(valid_json)
                    if len(valid_objects) == max_elements:
                        break
                except json.JSONDecodeError:
                    pass
                current_object = ""
        
        return valid_objects if valid_objects else []
    except Exception as e:
        print(f"Error processing file: {str(e)}")
        return []
    

def date_difference(date1, date2):
    # Convert string dates to datetime objects
    format_str = "%Y-%m-%d"  # Format: YYYY-MM-DD
    d1 = datetime.strptime(date1, format_str)
    d2 = datetime.strptime(date2, format_str)
    
    # Calculate the difference
    diff_days = abs((d2 - d1).days)  # Store difference in an integer variable
    
    return diff_days


@socketio.on("fetch_hotels")
def handle_fetch_hotels(data):
    print("reachecd")
    try:
        search = data.get('search', '')
        check_in_date = data.get('checkIn', '')
        check_out_date = data.get('checkOut', '')
        budget = int(data.get('maxPrice', 500))
        num_rooms = int(data.get('numRooms', 1))
        num_adults = int(data.get('numAdults', 1))
        num_children = int(data.get('numChildren', 0))

        difference = date_difference(check_in_date, check_out_date)

        budget = budget/difference
        
        # Call SerpAPI
        params = {
            "engine": "google_hotels",
            "q": f"{search} hotels" if search else "popular hotels",
            "check_in_date": check_in_date,
            "check_out_date": check_out_date,
            "adults": num_adults,
            "children": num_children,
            "currency": "INR",
            "gl": "in",
            "hl": "en",
            "api_key": serpapi_key
        }

        print(f"SerpAPI params: {params}")
        search = GoogleSearch(params)
        results = search.get_dict()
        
        # Check for errors
        if 'error' in results:
            print(f"SerpAPI Error: {results['error']}")
            
            # Try alternative approach - some engines may not need dates
            fallback_params = {
                "engine": "google_search",
                "q": f"{search} hotels",
                "location": "India",
                "gl": "in",
                "hl": "en",
                "api_key": fallback_serpapi_key
            }
            
            print("Trying fallback API call with regular Google Search")
            fallback_search = GoogleSearch(fallback_params)
            results = fallback_search.get_dict()
        
        # Print response keys for debugging
        print("SerpAPI Response Keys:", list(results.keys()))

        # Try different potential locations for hotel data
        hotels_data = []
        
        # Check each possible location where hotel data might be
        if 'hotels_results' in results:
            print("Found hotels in 'hotels_results'")
            hotels_data = results['hotels_results']
        elif 'properties' in results:
            print("Found hotels in 'properties'")
            hotels_data = results['properties']
        elif 'organic_results' in results:
            print("Using organic search results as hotel data")
            hotels_data = results['organic_results']

        filtered_hotels = [hotel for hotel in hotels_data if hotel.get('rate_per_night', {}).get('extracted_lowest', 0) <= budget]

        prompt = f"""
        Please analyze the {json.dumps(filtered_hotels, indent=2)} JSON file that contains hotel data and sort the hotels from best to worst. When sorting, please consider all available factors including:
        - Overall rating (the higher the better)
        - Available amenities, 
        - Reviews (number of reviews and the breakdown of ratings)
        - and all other factors available
        Return the results as a *valid JSON list* with the following fields for each hotel:
        - "name" , "rate_per_night" , "hotel_class" , "images", "overall_ratings", "link", "amenities", "review_summary"(which would be summarized from deeply analyzing "reviews_breakdown", and if it is not available leave it empty) 

        Ensure the response is *strictly a valid JSON array* and nothing else.
        """

        model_name = "models/gemini-2.0-flash"
        model = genai.GenerativeModel(model_name)
        print("request sent")
        response = model.generate_content(prompt)
        final_hotels = clean_and_extract_json(response.text)

        print(f"type of final_hotels: {type(final_hotels)}")
        print(f"Number of hotels found: {len(final_hotels)}")
        
        # If we found hotels, format them for frontend
        formatted_hotels = []
        for hotel in final_hotels:
            # Find image URL with fallbacks
            image_url = None
            if 'images' in hotel:
                # Check if the images field is a list of strings
                if isinstance(hotel['images'], list) and len(hotel['images']) > 0:
                    if isinstance(hotel['images'][0], str):
                        # Images is a list of URL strings
                        image_url = hotel['images'][0]
                    elif isinstance(hotel['images'][0], dict):
                        # Images is a list of dictionaries
                        image_url = hotel['images'][0].get('thumbnail') or hotel['images'][0].get('original_image')
            
            # Additional fallbacks if image wasn't found above
            if not image_url:
                if 'thumbnail' in hotel:
                    image_url = hotel['thumbnail']
                elif 'image' in hotel:
                    image_url = hotel['image']
                elif 'thumbnail_image' in hotel:
                    image_url = hotel['thumbnail_image']
                elif 'photos' in hotel and len(hotel['photos']) > 0:
                    if isinstance(hotel['photos'][0], dict):
                        image_url = hotel['photos'][0].get('image', '')
                    elif isinstance(hotel['photos'][0], str):
                        image_url = hotel['photos'][0]
                    
            # Default image if none found
            if not image_url:
                image_url = "https://via.placeholder.com/300x200.png?text=Hotel+Image"
                
            # Get hotel name - handle both dictionary and string cases
            if isinstance(hotel, dict):
                name = hotel.get('name', hotel.get('title', 'Unknown Hotel'))
                
                # Get hotel link
                link = hotel.get('link', '')
                
                # Get hotel location
                location = hotel.get('address', hotel.get('location', hotel.get('snippet', '')))

                # Get price - handle different formats
                if isinstance(hotel.get('rate_per_night'), dict):
                    price_str = hotel['rate_per_night'].get('extracted_lowest', 'Price Not Available')
                else:
                    price_str = hotel.get('rate_per_night', 'Price Not Available')
                
                # Get rating
                rating = hotel.get('overall_ratings', hotel.get('rating', hotel.get('stars', -1)))
                amenities = hotel.get('amenities', [])
                review = hotel.get('review_summary', '')
                
                # Get all images
                all_images = []
                if 'images' in hotel and isinstance(hotel['images'], list):
                    all_images = hotel['images']
            else:
                # In case the hotel is not a dictionary (fallback)
                name = "Unknown Hotel"
                link = ""
                location = ""
                price_str = "Price Not Available"
                rating = -1
                amenities = []
                review = ""
                all_images = []
            
            if isinstance(rating, (int, float)):
                rating = f"{rating:.1f}"

            formatted_hotel = {
                "name": name,
                "location": location,
                "price_per_night": price_str,
                "rating": rating,
                "image": image_url,
                "amenities": amenities,
                "all_images": all_images,
                "link": link,
                "review": review,
            }
            formatted_hotels.append(formatted_hotel)
        
        print(f"Sending {len(formatted_hotels)} hotels to frontend")
        socketio.emit("hotels_data", formatted_hotels)

    except Exception as e:
        print("Error in backend:", str(e))
        import traceback
        traceback.print_exc()
        
        # Send mock data instead of empty array when there's an error
        fallback_hotels = [
            {
                "name": "Error Recovery Hotel",
                "location": f"Search: {data.get('search', 'Unknown')}",
                "price_per_night": "₹5000",
                "rating": "4.0",
                "image": "https://via.placeholder.com/300x200.png?text=API+Error+Fallback"
            },
            {
                "name": "Backup Resort & Spa",
                "location": "Error handling location",
                "price_per_night": "₹6000",
                "rating": "4.2",
                "image": "https://via.placeholder.com/300x200.png?text=Try+Again"
            }
        ]
        socketio.emit("hotels_data", fallback_hotels)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)