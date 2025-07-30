const LoadingSkeleton = () => (
    <div className="space-y-8 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-1/3"></div>
        {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl shadow-md border border-slate-200 flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3 h-64 bg-slate-200 rounded-xl"></div>
                <div className="md:w-2/3 space-y-4">
                    <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                    <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                    <div className="h-10 bg-slate-200 rounded w-1/2"></div>
                    <div className="flex justify-between items-end">
                        <div className="h-12 bg-slate-200 rounded w-1/3"></div>
                        <div className="h-12 bg-slate-200 rounded-full w-32"></div>
                    </div>
                </div>
            </div>
        ))}
    </div>
);

export default LoadingSkeleton;
