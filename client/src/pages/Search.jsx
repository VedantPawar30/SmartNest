import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import HotelCard from "../components/HotelCard";

export default function Search() {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/search`);
      setHotels(data);
    }
    fetchData();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-6 mt-10">
        <h1 className="text-3xl font-bold mb-5">Search Results</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {hotels.length > 0 ? (
            hotels.map((hotel, index) => <HotelCard key={index} hotel={hotel} />)
          ) : (
            <p className="text-center col-span-3">No results found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
