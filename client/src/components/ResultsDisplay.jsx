import LoadingSkeleton from './LoadingSkeleton';
import HotelCard from './HotelCard';

const ResultsDisplay = ({ results, isLoading, error, showIntro }) => {
    if (isLoading) return <LoadingSkeleton />;
    if (error) return <div className="text-center py-16 ...">{error}</div>;
    if (showIntro) return <div className="text-center py-16 ...">Fill out the form</div>;
    if (results.length === 0) return <div className="text-center py-16 ...">No Results</div>;

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-slate-900 border-b pb-4">Top 3 AI Recommendations</h2>
            {results.map((hotel, index) => (
                <HotelCard key={hotel.property_token || index} hotel={hotel} />
            ))}
        </div>
    );
};

export default ResultsDisplay;
