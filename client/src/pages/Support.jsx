import { useState } from 'react';
import { LifeBuoy, Send, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';


const Support = () => {
    // State for form inputs
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    // State for submission status
    const [status, setStatus] = useState({
        loading: false,
        error: '',
        success: '',
    });

    // Handle input changes
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, error: '', success: '' });

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/mail`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to send message. Please try again later.');
            }

            const result = await response.json();
            setStatus({ loading: false, error: '', success: result.message });
            setFormData({ name: '', email: '', message: '' }); // Clear form on success

        } catch (err) {
            setStatus({ loading: false, error: err.message, success: '' });
        }
    };

    return (
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
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                        <input type="text" id="name" value={formData.name} onChange={handleChange} required className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition" placeholder="John Doe" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                        <input type="email" id="email" value={formData.email} onChange={handleChange} required className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition" placeholder="you@example.com" />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                        <textarea id="message" rows="4" value={formData.message} onChange={handleChange} required className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition" placeholder="How can we help you today?"></textarea>
                    </div>
                    <div className="text-center">
                        <button type="submit" disabled={status.loading} className="bg-emerald-500 text-white font-bold text-lg px-12 py-3 rounded-full hover:bg-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-300 transition-all duration-300 transform hover:scale-105 disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center w-full md:w-auto mx-auto">
                            {status.loading ? <Loader2 className="animate-spin mr-2" /> : <Send className="mr-2 w-5 h-5" />}
                            {status.loading ? 'Sending...' : 'Send Message'}
                        </button>
                    </div>
                </form>
                {/* Status Messages */}
                {status.success && (
                    <div className="mt-4 p-3 flex items-center gap-3 text-sm bg-green-50 text-green-700 border border-green-200 rounded-lg">
                        <CheckCircle className="w-5 h-5" />
                        {status.success}
                    </div>
                )}
                {status.error && (
                    <div className="mt-4 p-3 flex items-center gap-3 text-sm bg-red-50 text-red-700 border border-red-200 rounded-lg">
                        <AlertTriangle className="w-5 h-5" />
                        {status.error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Support;