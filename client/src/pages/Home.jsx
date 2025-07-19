import { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion"; // Import Framer Motion

const socket = io(import.meta.env.VITE_BACKEND_URL); // ✅ Connect WebSocket

export default function Home() {
  const [hotels, setHotels] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState(500);
  const [checkIn, setCheckIn] = useState(new Date());
  const [checkOut, setCheckOut] = useState(new Date());

  // Guest Selection State
  const [numRooms, setNumRooms] = useState(1);
  const [numAdults, setNumAdults] = useState(1);
  const [numChildren, setNumChildren] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Modal State
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Socket listener for hotels data
  useEffect(() => {
    socket.on("hotels_data", (data) => {
      console.log("Received hotels data:", data);

      // Check if data is an array before setting state
      if (Array.isArray(data)) {
        setHotels(data);
      } else {
        console.error("Received invalid hotel data format:", data);
        setHotels([]);
      }
      setIsLoading(false);
    });

    return () => socket.off("hotels_data");
  }, []);

  // Validate dates
  const validateDates = () => {
    // Ensure check-out is after check-in
    if (checkOut <= checkIn) {
      const newCheckOut = new Date(checkIn);
      newCheckOut.setDate(newCheckOut.getDate() + 1);
      setCheckOut(newCheckOut);
    }

    // Ensure dates are not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkIn < today) {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      setCheckIn(tomorrow);

      const dayAfter = new Date(tomorrow);
      dayAfter.setDate(dayAfter.getDate() + 1);
      setCheckOut(dayAfter);
    }
  };

  // Call validateDates when dates change or before search
  useEffect(() => {
    validateDates();
  }, [checkIn, checkOut]);

  // Fetch hotels
  const fetchHotels = () => {
    setIsLoading(true);
    validateDates();

    socket.emit("fetch_hotels", {
      search: searchQuery,
      checkIn: checkIn.toISOString().split("T")[0],
      checkOut: checkOut.toISOString().split("T")[0],
      maxPrice: maxPrice,
      numRooms: numRooms,
      numAdults: numAdults,
      numChildren: numChildren,
    });
  };

  // Modal component to display all images of a hotel
  const HotelImagesModal = ({ hotel, onClose }) => {
    if (!hotel) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="bg-white p-6 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4">{hotel.name}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {hotel.all_images.map((image, index) => (
              <img
                key={index}
                src={image.thumbnail || image.original_image}
                alt={`${hotel.name} - Image ${index + 1}`}
                className="w-full h-48 object-cover rounded-md"
              />
            ))}
          </div>
          <button
            onClick={onClose}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full min-h-screen ">
      <div className="fixed inset-0 bg-cover bg-center bg-no-repeat bg-[url(/background-hero.jpg)] z-0"></div>
      {/* Dark Overlay */}
      <div className="fixed inset-0 bg-black opacity-50 z-0"></div>

      <div className="relative z-10 min-h-screen overflow-auto">
        <Navbar />

        <div className="container mx-auto flex justify-center mt-10">
          <div className="w-full max-w-8xl px-10 py-10">
            <h1 className="text-[50px] font-bold font-playfair text-center text-white mb-6">
              "Find Your Perfect Stay, the Smart Way!"
            </h1>

            {/* 🔹 Search Box + Results Container */}
            <div className="bg-white/35 w-full p-6 rounded-lg shadow-lg">
              {/* 🔹 Search Filters */}
              <div className="flex flex-wrap items-end justify-center gap-6">
                {/* Search Location */}
                <div className="flex flex-col">
                  <label className="mb-1 font-bold font-comfortaa text-black">Search Location</label>
                  <input
                    type="text"
                    placeholder="Search by city, Landmark..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border p-2 rounded w-64 bg-white text-black shadow-sm"
                  />
                </div>

                {/* Budget Filter */}
                <div className="flex flex-col">
                  <label className="font-bold mb-1 font-comfortaa text-black">Budget</label>
                  <div className="flex items-center">
                    <input
                      type="range"
                      min="500"
                      max="50000"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="cursor-pointer w-32"
                    />
                    <span className="ml-2 font-bold text-gray-800">₹{maxPrice}</span>
                  </div>
                </div>

                {/* Check-in & Check-out Dates */}
                <div className="flex flex-col">
                  <label className="font-bold mb-1 font-comfortaa text-black">Check-in Date</label>
                  <DatePicker selected={checkIn} onChange={(date) => setCheckIn(date)} className="border p-2 rounded bg-white text-black shadow-sm" />
                </div>
                <div className="flex flex-col">
                  <label className="font-bold mb-1 font-comfortaa text-black">Check-out Date</label>
                  <DatePicker selected={checkOut} onChange={(date) => setCheckOut(date)} className="border p-2 rounded bg-white text-black shadow-sm" />
                </div>

                {/* Search Button with Framer Motion */}
                <motion.button
                  className="bg-blue-600 font-bold text-white px-6 py-2 rounded hover:bg-blue-800 transition shadow-lg flex items-center justify-center"
                  onClick={fetchHotels}
                  disabled={isLoading} // Disable button while loading
                  whileTap={{ scale: 0.9 }} // Scale down on click
                  whileHover={{ scale: 1.1 }} // Scale up on hover
                  transition={{ type: "spring", stiffness: 300, damping: 10 }} // Spring animation
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Loading...
                    </>
                  ) : (
                    "Search"
                  )}
                </motion.button>
  

              </div>

              {/* 🔹 Hotel Results */}
              <div className="mt-6">
                {hotels.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {hotels.map((hotel, index) => (
                      <div
                        key={index}
                        className="bg-white justify-self-center w-3/4 p-4 rounded-lg shadow-md hover:shadow-lg transition transform hover:scale-105 cursor-pointer"
                        onClick={() => {
                          setSelectedHotel(hotel);
                          setIsModalOpen(true);
                        }}
                      >
                        <img
                          src={hotel.image || "https://via.placeholder.com/300"}
                          alt={hotel.name}
                          className="w-full object-cover h-60 rounded-md"
                        />
                        <h3 className="font-bold text-xl mt-3">{hotel.name}</h3>
                        <p className="text-gray-600">{hotel.location}</p>
                        <p className="text-blue-500 font-bold">{hotel.price_per_night} per night</p>
                        <p className="text-yellow-500">⭐ {hotel.rating}</p>
                        {/* Amenities and Booking Section - Flex container to place items side by side */}
                          <div className="flex justify-between items-center mt-2">
                            {/* Amenities Section with hover popup */}
                            <div className="relative group">
                              {/* Amenities popup positioned above the button */}
                              <div className="absolute left-0 bottom-full mb-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 z-10 p-3">
                                <h4 className="font-bold text-gray-800 mb-2">Amenities</h4>
                                {hotel.amenities && hotel.amenities.length > 0 ? (
                                  <ul className="text-sm text-left">
                                    {hotel.amenities.map((amenity, i) => (
                                      <li key={i} className="mb-1 flex items-center">
                                        <span className="mr-2 text-green-500">✓</span>
                                        {amenity}
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-sm text-gray-500">No amenities information available</p>
                                )}
                                {/* Add a small arrow pointing down to the button */}
                                <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-white border-r border-b border-gray-200"></div>
                              </div>
                              
                              {/* Amenities button */}
                              <button 
                                className="bg-green-500 text-white px-3 py-1 rounded text-sm font-medium hover:bg-green-600 transition"
                              >
                                View Amenities
                              </button>
                            </div>

                            {/* Booking Link Section */}
                            <a 
                              href={hotel.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-blue-700 transition"
                              onClick={(e) => e.stopPropagation()} // Prevent triggering the card onClick
                            >
                              Book From Here
                            </a>
                            
                          </div>
                          {/* Review Section */}
                          <div className="mt-3 border-t pt-2">
                              <h4 className="font-semibold text-gray-800">Guest Review</h4>
                              {hotel.review ? (
                                <p className="text-sm text-gray-600 mt-1">{hotel.review}</p>
                              ) : (
                                <p className="text-sm text-gray-500 mt-1">No review available</p>
                              )}
                          </div>
                        </div>
                        
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-600 mt-4">No hotels found. Try adjusting your search.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Hotel Images */}
      {isModalOpen && (
        <HotelImagesModal
          hotel={selectedHotel}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}