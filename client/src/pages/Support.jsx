import { LifeBuoy } from "lucide-react";
const Support = () => (
    <div className="animate-fade-in">
        <div className="text-center py-16">
            <LifeBuoy className="mx-auto text-emerald-500 w-16 h-16 mb-4" />
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">Support Center</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                We're here to help! If you have any questions or need assistance, please don't hesitate to reach out.
            </p>
        </div>
        <div className="max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
            <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">Contact Us</h3>
            <form className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                    <input type="text" id="name" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition" placeholder="John Doe" />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                    <input type="email" id="email" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition" placeholder="you@example.com" />
                </div>
                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                    <textarea id="message" rows="4" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition" placeholder="How can we help you today?"></textarea>
                </div>
                <div className="text-center">
                    <button type="submit" className="bg-emerald-500 text-white font-bold text-lg px-12 py-3 rounded-full hover:bg-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-300 transition-all duration-300 transform hover:scale-105">
                        Send Message
                    </button>
                </div>
            </form>
        </div>
    </div>
);
export default Support;