require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

exports.getHotelRecommendations= async(allHotels,budget,preferences) =>{
    try {
       
   

        if (allHotels.length === 0) {
            return res.status(404).json({ message: "No hotels match your criteria." });
        }
        
        // To keep the prompt clean, only pass relevant data to Gemini
        const hotelsForPrompt = allHotels.map(h => ({
            name: h?.name,
            property_token: h?.property_token,
            rating: h?.overall_rating,
            reviews: h?.reviews,
            price: h?.rate_per_night?.extracted_lowest,
            amenities: h?.amenities
        }));


        // 3. Construct the prompt for Gemini
        const prompt = `
            You are an expert hotel recommendation assistant.
            A user is looking for a hotel with the following preferences:
            - Required amenities: ${preferences.join(", ")}
            -Minimum Budget : ${Math.floor(budget * 0.8)}
            - Maximum Budget : ${Math.floor(budget * 1.2)}
         

            Analyze this list of available hotels:
            ${JSON.stringify(hotelsForPrompt, null, 2)}

            Based on the user's preferences, please rank the top 3 hotels. Consider all factors: a higher rating and more reviews are better, but staying well within budget is also important. The presence of the required amenities is mandatory.

            Return your answer as a JSON array of objects, where each object contains only the "property_token","Hotel Name" and a brief "reason" for the recommendation. Do not include any other text or explanation outside of the JSON array.

            Example format:
            [
              {
                "hotel_name": "name of hotel",
                "price per night":"price per night",
                "property_token": "some_token_here",
                "reason": "Excellent rating and has all required amenities well within budget."
              },
              {
                "hotel_name": "name of another hotel",
                "price per night":"price per night",
                "property_token": "another_token_here",
                "reason": "Good value for the price, though the rating is slightly lower."
              }
            ]
        `;

       
        // 4. Call the Gemini API
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
                response_mime_type: "application/json",
            },
        });
        const response = await result.response;
        const text = response.text();

        // 5. Parse the response and send it to the client
        const rankedHotels = JSON.parse(text); // The text from Gemini should be a clean JSON string

        // You can use the returned tokens to find the full hotel objects if needed
        const top3HotelDetails = rankedHotels.map(rankedHotel => {
            const fullDetail = allHotels.find(h => h.property_token === rankedHotel.property_token);
            return { ...fullDetail, reason: rankedHotel.reason };
        });


       return top3HotelDetails;

    } catch (error) {
        console.error("Error getting recommendations:", error);
      
    }
}
