import {Info} from 'lucide-react';
import {Sparkles, Hotel} from 'lucide-react';
const AboutUs = () => (
    <div className="animate-fade-in">
        <div className="text-center py-16">
            <Info className="mx-auto text-emerald-500 w-16 h-16 mb-4" />
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">About Smart Nest</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Smart Nest is a revolutionary travel platform that leverages the power of Artificial Intelligence to redefine your hotel booking experience. We believe finding the perfect stay should be as delightful as the trip itself.
            </p>
        </div>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 text-left">
            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
                <h3 className="text-2xl font-bold text-slate-800 mb-3 flex items-center"><Sparkles className="text-emerald-500 mr-3" /> Our Mission</h3>
                <p className="text-slate-600">
                    Our mission is to eliminate the endless scrolling and uncertainty of hotel searching. By understanding your unique preferences for amenities, budget, and travel style, our AI curates a personalized list of top recommendations, saving you time and ensuring a perfect match for your needs.
                </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
                <h3 className="text-2xl font-bold text-slate-800 mb-3 flex items-center"><Hotel className="text-emerald-500 mr-3" /> How It Works</h3>
                <p className="text-slate-600">
                    Simply input your destination, dates, and what you're looking for in a stay. Our advanced AI model analyzes millions of data points—from user reviews to amenity lists and pricing trends—to generate a ranked list of the best options, complete with a reason for each recommendation.
                </p>
            </div>
        </div>
    </div>
);
export default AboutUs;