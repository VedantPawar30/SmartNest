// Hotel Card Component
import { ChevronLeft, ChevronRight, MapPin, Star } from 'lucide-react';
import AmenityIcon from './AmenityIcon';
import { useState } from 'react';

const HotelCard = ({ hotel }) => {
    const [currentImage, setCurrentImage] = useState(0);

    const nextImage = () => {
        setCurrentImage(prev => (prev + 1) % (hotel.images?.length || 1));
    };
    const prevImage = () => {
        setCurrentImage(prev => (prev - 1 + (hotel.images?.length || 1)) % (hotel.images?.length || 1));
    };

    return (
        <div className="bg-white p-4 rounded-2xl shadow-md border border-slate-200 flex flex-col md:flex-row gap-6 hover:shadow-xl hover:border-emerald-300 transition-all duration-300">
            {/* Image Gallery */}
            <div className="md:w-1/3 relative overflow-hidden rounded-xl">
                {hotel.images && hotel.images.length > 0 ? (
                    <>
                        <img 
                            src={hotel.images[currentImage].thumbnail}
                            referrerPolicy='no-referrer' 
                            alt={hotel.name} 
                            className="w-full h-full object-cover transition-transform duration-500 ease-in-out"
                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x400/e2e8f0/64748b?text=Image+Error'; }}
                        />
                        {hotel.images.length > 1 && (
                            <>
                                <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full text-slate-700 hover:bg-white transition">
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full text-slate-700 hover:bg-white transition">
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                                    {currentImage + 1} / {hotel.images.length}
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <div className="w-full h-full bg-slate-200 flex items-center justify-center rounded-xl">
                        <MapPin className="w-12 h-12 text-slate-400" />
                    </div>
                )}
            </div>
            
            {/* Hotel Details */}
            <div className="md:w-2/3 flex flex-col">
                <div>
                    <h3 className="text-2xl font-bold text-slate-900">{hotel.name || "Unnamed Property"}</h3>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                        <Star className="w-4 h-4 text-amber-400" fill="currentColor" />
                        <span>{hotel.overall_rating || 'N/A'} ({hotel.reviews || 0} reviews)</span>
                    </div>
                </div>

                {/* AI Reason */}
                <div className="my-4 p-4 bg-emerald-50 border-l-4 border-emerald-400 rounded-r-lg">
                    <p className="text-sm text-emerald-800 font-medium">
                        <span className="font-bold">AI Recommendation:</span> {hotel.reason || "This is a great choice based on your preferences."}
                    </p>
                </div>

                {/* Amenities */}
                <div className="mb-4">
                    <h4 className="text-sm font-semibold mb-2">Key Amenities</h4>
                    <div className="flex flex-wrap gap-4">
                        {hotel.amenities?.slice(0, 5).map(amenity => (
                            <div key={amenity} className="flex items-center gap-2 text-sm text-slate-600">
                                <AmenityIcon name={amenity} />
                                <span>{amenity}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-auto flex justify-between items-end">
                    <div>
                        <p className="text-sm text-slate-500">Price per night</p>
                        <p className="text-2xl font-bold text-slate-800">
                            {hotel.rate_per_night?.lowest || 'N/A'}
                        </p>
                    </div>
                    <a href={hotel.link || '#'} target="_blank" rel="noopener noreferrer" className="bg-emerald-500 text-white font-bold px-6 py-3 rounded-full hover:bg-emerald-600 transition-all transform hover:scale-105">
                        View Deal
                    </a>
                </div>
            </div>
        </div>
    );
};

export default HotelCard;