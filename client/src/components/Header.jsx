
import {Link, NavLink} from "react-router-dom";
import { HomeIcon, Info, LifeBuoy } from 'lucide-react';

const Header = () => (
    <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-40 border-b border-slate-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-emerald-500">
                    <path d="M12 2L4 8V20C4 20.5523 4.44772 21 5 21H19C19.5523 21 20 20.5523 20 20V8L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 15.8333C16 17.5987 14.2091 19 12 19C9.79086 19 8 17.5987 8 15.8333C8 14.068 9.79086 12.6667 12 12.6667C14.2091 12.6667 16 14.068 16 15.8333Z" fill="currentColor" opacity="0.3"/>
                    <path d="M12 12.6667V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h1 className="text-2xl font-bold text-slate-800">Smart Nest</h1>
            </Link>
            <nav className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-600">
                <NavLink to="/" className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${isActive ? 'bg-emerald-100 text-emerald-600' : 'hover:bg-slate-100'}`}> <HomeIcon className="w-4 h-4" /> Stays </NavLink>
                <NavLink to="/about" className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${isActive ? 'bg-emerald-100 text-emerald-600' : 'hover:bg-slate-100'}`}> <Info className="w-4 h-4" /> About Us </NavLink>
                <NavLink to="/support" className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${isActive ? 'bg-emerald-100 text-emerald-600' : 'hover:bg-slate-100'}`}> <LifeBuoy className="w-4 h-4" /> Support </NavLink>
            </nav>
        </div>
    </header>
);

export default Header;
