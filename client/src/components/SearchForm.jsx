import { MapPin, Calendar, Users, DollarSign, Search, Loader2, X } from 'lucide-react';
import AmenityIcon from './AmenityIcon';

const SearchForm = ({ params, onInputChange, onPreferenceChange, onSubmit, isLoading }) => {
    const amenities = [
        "Free Wi-Fi", "Air conditioning", "Pet-friendly", "Free parking", 
        "Kitchen", "Pool", "Washer", "Gym"
    ];

    return (
        <form onSubmit={onSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-slate-200 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Destination */}
                <div className="lg:col-span-1">
                    <label htmlFor="search" className="text-sm font-medium text-slate-700 mb-2 flex items-center"><MapPin className="w-4 h-4 mr-2" />Destination</label>
                    <input type="text" id="search" name="search" value={params.search} onChange={onInputChange} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition" placeholder="e.g., Goa, India" />
                </div>
                {/* Check-in & Check-out */}
                <div className="lg:col-span-1 grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="checkIn" className="text-sm font-medium text-slate-700 mb-2 flex items-center"><Calendar className="w-4 h-4 mr-2" />Check-in</label>
                        <input type="date" id="checkIn" name="checkIn" value={params.checkIn} onChange={onInputChange} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition" min={new Date().toISOString().split('T')[0]}/>
                    </div>
                    <div>
                        <label htmlFor="checkOut" className="text-sm font-medium text-slate-700 mb-2 flex items-center"><Calendar className="w-4 h-4 mr-2" />Check-out</label>
                        <input type="date" id="checkOut" name="checkOut" value={params.checkOut} onChange={onInputChange} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition" min={params.checkIn}/>
                    </div>
                </div>
                {/* Guests */}
                <div>
                    <label htmlFor="numAdults" className="text-sm font-medium text-slate-700 mb-2 flex items-center"><Users className="w-4 h-4 mr-2" />Guests</label>
                    <input type="number" id="numAdults" name="numAdults" value={params.numAdults} onChange={onInputChange} min="1" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition" />
                </div>
                {/* Budget */}
                <div>
                    <label htmlFor="price" className="text-sm font-medium text-slate-700 mb-2 flex items-center"><DollarSign className="w-4 h-4 mr-2" />Total Budget (INR)</label>
                    <input type="range" id="price" name="price" min="5000" max="100000" step="1000" value={params.price} onChange={onInputChange} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                    <div className="text-center font-semibold text-emerald-600 mt-1">₹{Number(params.price).toLocaleString('en-IN')}</div>
                </div>
            </div>
            
            {/* Preferences */}
            <div className="mt-6">
                <h4 className="text-sm font-medium text-slate-700 mb-3">I'm looking for...</h4>
                <div className="flex flex-wrap gap-3">
                    {amenities.map(amenity => (
                        <button key={amenity} type="button" onClick={() => onPreferenceChange(amenity)} className={`px-4 py-2 text-sm rounded-full border transition-all duration-200 flex items-center gap-2 ${params.preferences.includes(amenity) ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm' : 'bg-white text-slate-700 border-slate-300 hover:border-emerald-400'}`}>
                            {params.preferences.includes(amenity) ? <X className="w-4 h-4" /> : <AmenityIcon name={amenity} />}
                            {amenity}
                        </button>
                    ))}
                </div>
            </div>
            
            {/* Submit Button */}
            <div className="mt-8 text-center">
                <button type="submit" disabled={isLoading} className="bg-emerald-500 text-white font-bold text-lg px-12 py-4 rounded-full hover:bg-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-300 transition-all duration-300 transform hover:scale-105 disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center mx-auto">
                    {isLoading ? <Loader2 className="animate-spin mr-3" /> : <Search className="mr-3" />}
                    {isLoading ? 'Thinking...' : 'Find My Nest'}
                </button>
            </div>
        </form>
    );
};

export default SearchForm;