export default function HotelCard({ hotel }) {
  return (
    <div className="border p-4 shadow-lg rounded-lg hover:shadow-2xl transition">
      <img src={hotel.image} alt={hotel.name} className="w-full h-48 object-cover rounded-md" />
      <h2 className="text-xl font-semibold mt-2">{hotel.name}</h2>
      <p className="text-gray-500">{hotel.location}</p>
      <p className="text-green-600 font-semibold">${hotel.price} / night</p>
      <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800 transition">
        Book Now
      </button>
    </div>
  );
}
