import Header from './components/Header';
import Footer from './components/Footer';
import AboutUs from './pages/AboutUs';
import Support from './pages/Support';
import Home from './pages/Home';
import { Route, Routes } from "react-router-dom";

const App = () => {
    return (
        
            <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
                <Header />
                <main className="container mx-auto px-4 py-8 flex-grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<AboutUs />} />
                        <Route path="/support" element={<Support />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        
    );
};

export default App;