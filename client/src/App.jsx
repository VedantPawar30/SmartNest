import React, { useState, useEffect, useMemo } from 'react';
import { Search, MapPin, Calendar, Users, DollarSign, Star, Wifi, Wind, ParkingCircle, Utensils, Tv, Sun, X, Loader2, Building2, ChevronLeft, ChevronRight } from 'lucide-react';

// --- Main App Component ---
// NOTE: The main App component structure is provided for completeness. 
// The only change you need to make is to replace your HotelCard component with the one below.
const App = () => {
    const [searchParams, setSearchParams] = useState({
        search: 'Pune',
        checkIn: '',
        checkOut: '',
        price: 30000,
        numAdults: 2,
        preferences: ['Free Wi-Fi', 'Air conditioning'],
    });
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showIntro, setShowIntro] = useState(true);

    useEffect(() => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dayAfter = new Date(tomorrow);
        dayAfter.setDate(dayAfter.getDate() + 4);

        setSearchParams(prev => ({
            ...prev,
            checkIn: today.toISOString().split('T')[0],
            checkOut: dayAfter.toISOString().split('T')[0],
        }));
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({ ...prev, [name]: value }));
    };

    const handlePreferenceChange = (preference) => {
        setSearchParams(prev => {
            const newPreferences = prev.preferences.includes(preference)
                ? prev.preferences.filter(p => p !== preference)
                : [...prev.preferences, preference];
            return { ...prev, preferences: newPreferences };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setResults([]);
        setShowIntro(false);

        try {
            const response = await fetch('http://localhost:4000/api/v1/home', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(searchParams),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.success && data.msg && data.msg.length > 0) {
                setResults(data.msg);
            } else {
                setError("We couldn't find any hotels matching your criteria. Please try a different search.");
            }
        } catch (err) {
            console.error("API call failed:", err);
            setError(err.message || "Something went wrong. Please check your connection and try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <HeroSection />
                <SearchForm 
                    params={searchParams}
                    onInputChange={handleInputChange}
                    onPreferenceChange={handlePreferenceChange}
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                />
                <ResultsDisplay 
                    results={results}
                    isLoading={isLoading}
                    error={error}
                    showIntro={showIntro}
                />
            </main>
            <Footer />
        </div>
    );
};


// --- Helper Components (No Changes) ---
const Header = () => ( <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-40 border-b border-slate-200"> <div className="container mx-auto px-4 py-4 flex justify-between items-center"> <div className="flex items-center gap-2"> <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-emerald-500"> <path d="M12 2L4 8V20C4 20.5523 4.44772 21 5 21H19C19.5523 21 20 20.5523 20 20V8L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/> <path d="M16 15.8333C16 17.5987 14.2091 19 12 19C9.79086 19 8 17.5987 8 15.8333C8 14.068 9.79086 12.6667 12 12.6667C14.2091 12.6667 16 14.068 16 15.8333Z" fill="currentColor" opacity="0.3"/> <path d="M12 12.6667V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/> </svg> <h1 className="text-2xl font-bold text-slate-800">Smart Nest</h1> </div> <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600"> <a href="#" className="hover:text-emerald-500 transition-colors">Stays</a> <a href="#" className="hover:text-emerald-500 transition-colors">Experiences</a> <a href="#" className="hover:text-emerald-500 transition-colors">About Us</a> <a href="#" className="hover:text-emerald-500 transition-colors">Support</a> </nav> </div> </header> );
const HeroSection = () => ( <div className="text-center my-12"> <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight"> Find Your Perfect Nest </h2> <p className="text-lg text-slate-600 max-w-2xl mx-auto"> Let our AI find the ideal stay for you. Just tell us what you're looking for, and we'll handle the rest. </p> </div> );
const SearchForm = ({ params, onInputChange, onPreferenceChange, onSubmit, isLoading }) => { const amenities = [ "Free Wi-Fi", "Air conditioning", "Pet-friendly", "Free parking", "Kitchen", "Pool", "Washer", "Gym" ]; return ( <form onSubmit={onSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-slate-200 mb-12"> <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"> <div className="lg:col-span-1"> <label htmlFor="search" className="text-sm font-medium text-slate-700 mb-2 flex items-center"><MapPin className="w-4 h-4 mr-2" />Destination</label> <input type="text" id="search" name="search" value={params.search} onChange={onInputChange} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition" placeholder="e.g., Goa, India" /> </div> <div className="lg:col-span-1 grid grid-cols-2 gap-4"> <div> <label htmlFor="checkIn" className="text-sm font-medium text-slate-700 mb-2 flex items-center"><Calendar className="w-4 h-4 mr-2" />Check-in</label> <input type="date" id="checkIn" name="checkIn" value={params.checkIn} onChange={onInputChange} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition" min={new Date().toISOString().split('T')[0]}/> </div> <div> <label htmlFor="checkOut" className="text-sm font-medium text-slate-700 mb-2 flex items-center"><Calendar className="w-4 h-4 mr-2" />Check-out</label> <input type="date" id="checkOut" name="checkOut" value={params.checkOut} onChange={onInputChange} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition" min={params.checkIn}/> </div> </div> <div> <label htmlFor="numAdults" className="text-sm font-medium text-slate-700 mb-2 flex items-center"><Users className="w-4 h-4 mr-2" />Guests</label> <input type="number" id="numAdults" name="numAdults" value={params.numAdults} onChange={onInputChange} min="1" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition" /> </div> <div> <label htmlFor="price" className="text-sm font-medium text-slate-700 mb-2 flex items-center"><DollarSign className="w-4 h-4 mr-2" />Total Budget (INR)</label> <input type="range" id="price" name="price" min="5000" max="100000" step="1000" value={params.price} onChange={onInputChange} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500" /> <div className="text-center font-semibold text-emerald-600 mt-1">₹{Number(params.price).toLocaleString('en-IN')}</div> </div> </div> <div className="mt-6"> <h4 className="text-sm font-medium text-slate-700 mb-3">I'm looking for...</h4> <div className="flex flex-wrap gap-3"> {amenities.map(amenity => ( <button key={amenity} type="button" onClick={() => onPreferenceChange(amenity)} className={`px-4 py-2 text-sm rounded-full border transition-all duration-200 flex items-center gap-2 ${params.preferences.includes(amenity) ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm' : 'bg-white text-slate-700 border-slate-300 hover:border-emerald-400'}`}> {params.preferences.includes(amenity) ? <X className="w-4 h-4" /> : <AmenityIcon name={amenity} />} {amenity} </button> ))} </div> </div> <div className="mt-8 text-center"> <button type="submit" disabled={isLoading} className="bg-emerald-500 text-white font-bold text-lg px-12 py-4 rounded-full hover:bg-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-300 transition-all duration-300 transform hover:scale-105 disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center mx-auto"> {isLoading ? <Loader2 className="animate-spin mr-3" /> : <Search className="mr-3" />} {isLoading ? 'Thinking...' : 'Find My Nest'} </button> </div> </form> ); };
const AmenityIcon = ({ name }) => { switch(name) { case "Free Wi-Fi": return <Wifi className="w-4 h-4" />; case "Air conditioning": return <Wind className="w-4 h-4" />; case "Pet-friendly": return <Building2 className="w-4 h-4" />; case "Free parking": return <ParkingCircle className="w-4 h-4" />; case "Kitchen": return <Utensils className="w-4 h-4" />; case "Pool": return <Sun className="w-4 h-4" />; case "Washer": return <Tv className="w-4 h-4" />; case "Gym": return <Star className="w-4 h-4" />; default: return <Star className="w-4 h-4" />; } };
const ResultsDisplay = ({ results, isLoading, error, showIntro }) => { if (isLoading) { return <LoadingSkeleton />; } if (error) { return <div className="text-center py-16 px-6 bg-red-50 border border-red-200 rounded-2xl"> <h3 className="text-2xl font-bold text-red-700 mb-2">Oops!</h3> <p className="text-red-600">{error}</p> </div>; } if (showIntro) { return <div className="text-center py-16 px-6 bg-emerald-50 border border-emerald-200 rounded-2xl"> <h3 className="text-2xl font-bold text-emerald-800 mb-2">Ready to Discover?</h3> <p className="text-emerald-700">Fill out the form above and let our AI find the perfect stay for you.</p> </div>; } if (results.length === 0 && !showIntro) { return <div className="text-center py-16 px-6 bg-slate-100 border border-slate-200 rounded-2xl"> <h3 className="text-2xl font-bold text-slate-700 mb-2">No Results</h3> <p className="text-slate-600">We couldn't find any hotels matching your criteria. Please try a different search.</p> </div>; } return ( <div className="space-y-8"> <h2 className="text-3xl font-bold text-slate-900 border-b pb-4">Top 3 AI Recommendations</h2> {results.map((hotel, index) => ( <HotelCard key={hotel.property_token || index} hotel={hotel} /> ))} </div> ); };
const LoadingSkeleton = () => ( <div className="space-y-8 animate-pulse"> <div className="h-8 bg-slate-200 rounded w-1/3"></div> {[...Array(3)].map((_, i) => ( <div key={i} className="bg-white p-4 rounded-2xl shadow-md border border-slate-200 flex flex-col md:flex-row gap-6"> <div className="md:w-1/3 h-64 bg-slate-200 rounded-xl"></div> <div className="md:w-2/3 space-y-4"> <div className="h-6 bg-slate-200 rounded w-3/4"></div> <div className="h-4 bg-slate-200 rounded w-full"></div> <div className="h-4 bg-slate-200 rounded w-5/6"></div> <div className="h-10 bg-slate-200 rounded w-1/2"></div> <div className="flex justify-between items-end"> <div className="h-12 bg-slate-200 rounded w-1/3"></div> <div className="h-12 bg-slate-200 rounded-full w-32"></div> </div> </div> </div> ))} </div> );
const Footer = () => ( <footer className="bg-slate-100 border-t border-slate-200 mt-16"> <div className="container mx-auto px-4 py-8 text-center text-slate-500 text-sm"> <p>&copy; {new Date().getFullYear()} Smart Nest. All rights reserved.</p> <p className="mt-2">Your intelligent travel companion, powered by AI.</p> </div> </footer> );


// --- REVISED HotelCard Component ---
// This is the only part you need to replace in your file.
const HotelCard = ({ hotel }) => {
    const [currentImage, setCurrentImage] = useState(0);

    // These functions now work directly with the hotel.images array from the API.
    const nextImage = (e) => {
        e.stopPropagation(); 
        if (hotel.images && hotel.images.length > 1) {
            setCurrentImage(prev => (prev + 1) % hotel.images.length);
        }
    };

    const prevImage = (e) => {
        e.stopPropagation();
        if (hotel.images && hotel.images.length > 1) {
            setCurrentImage(prev => (prev - 1 + hotel.images.length) % hotel.images.length);
        }
    };

    return (
        <div className="bg-white p-4 rounded-2xl shadow-md border border-slate-200 flex flex-col md:flex-row gap-6 hover:shadow-xl hover:border-emerald-300 transition-all duration-300">
            {/* Image Gallery */}
            <div className="md:w-1/3 relative overflow-hidden rounded-xl">
                {/* We check if the images array exists and has items. */}
                {hotel.images && hotel.images.length > 0 ? (
                    <>
                        <img 
                            // We optimistically try to load the original_image.
                            src={hotel.images[currentImage].original_image} 
                            alt={hotel.name} 
                            className="w-full h-full object-cover transition-transform duration-500 ease-in-out"
                            // Our robust onError handler is the safety net. If an image fails, this will be triggered.
                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x400/e2e8f0/64748b?text=Image+Not+Found'; }}
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
                    // This fallback shows if the hotel object has no 'images' array at all.
                    <div className="w-full h-full bg-slate-200 flex items-center justify-center rounded-xl">
                        <Building2 className="w-12 h-12 text-slate-400" />
                    </div>
                )}
            </div>
            
            {/* Hotel Details (No changes needed here) */}
            <div className="md:w-2/3 flex flex-col">
                <div>
                    <h3 className="text-2xl font-bold text-slate-900">{hotel.name || "Unnamed Property"}</h3>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                        <Star className="w-4 h-4 text-amber-400" fill="currentColor" />
                        <span>{hotel.overall_rating || 'N/A'} ({hotel.reviews || 0} reviews)</span>
                    </div>
                </div>
                <div className="my-4 p-4 bg-emerald-50 border-l-4 border-emerald-400 rounded-r-lg">
                    <p className="text-sm text-emerald-800 font-medium">
                        <span className="font-bold">AI Recommendation:</span> {hotel.reason || "This is a great choice based on your preferences."}
                    </p>
                </div>
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

export default App;
