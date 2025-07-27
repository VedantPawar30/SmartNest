// Results Display Component
import LoadingSkeleton from './LoadingSkeleton';
import HotelCard from './HotelCard';

const ResultsDisplay = ({ results, isLoading, error, showIntro }) => {
    if (isLoading) {
        return <LoadingSkeleton />;
    }
    if (error) {
        return <div className="text-center py-16 px-6 bg-red-50 border border-red-200 rounded-2xl">
            <h3 className="text-2xl font-bold text-red-700 mb-2">Oops!</h3>
            <p className="text-red-600">{error}</p>
        </div>;
    }
    if (showIntro) {
        return <div className="text-center py-16 px-6 bg-emerald-50 border border-emerald-200 rounded-2xl">
            <h3 className="text-2xl font-bold text-emerald-800 mb-2">Ready to Discover?</h3>
            <p className="text-emerald-700">Fill out the form above and let our AI find the perfect stay for you.</p>
        </div>;
    }
    if (results.length === 0 && !showIntro) {
        return <div className="text-center py-16 px-6 bg-slate-100 border border-slate-200 rounded-2xl">
            <h3 className="text-2xl font-bold text-slate-700 mb-2">No Results</h3>
            <p className="text-slate-600">We couldn't find any hotels matching your criteria. Please try a different search.</p>
        </div>;
    }

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-slate-900 border-b pb-4">Top 3 AI Recommendations</h2>
            {results.map((hotel, index) => (
                <HotelCard key={hotel.property_token || index} hotel={hotel} />
            ))}
        </div>
    );
};

export default ResultsDisplay