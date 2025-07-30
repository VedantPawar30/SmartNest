import { useState, useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import SearchForm from '../components/SearchForm';
import ResultsDisplay from '../components/ResultsDisplay';


const Home = () => {
    const [searchParams, setSearchParams] = useState({
        search: '',
        checkIn: '',
        checkOut: '',
        price: 30000,
        numAdults: 2,
        preferences: [],
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
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/home`, {
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
        <>
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
        </>
    );
};

export default Home;