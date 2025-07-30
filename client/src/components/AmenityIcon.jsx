import {  Star, Wifi, Wind, ParkingCircle, Tv, Sun,Waves,Baby,Beer,BatteryCharging,PawPrint, UtensilsCrossed, Sparkles, ConciergeBell, Coffee, Dumbbell, Accessibility } from 'lucide-react';

const AmenityIcon = ({ name }) => {
    switch(name) { 
        case "Free Wi-Fi": return <Wifi className="w-4 h-4" />;
        case "TV": return <Tv className="w-4 h-4" />;
        case "Air-conditioned": return <Wind className="w-4 h-4" />; 
        case "Pet-friendly": return <PawPrint className="w-4 h-4" />; 
        case "Free parking": return <ParkingCircle className="w-4 h-4" />; 
        case "Pool": return <Sun className="w-4 h-4" />; 
        case "Restaurant": return <UtensilsCrossed className="w-4 h-4" />;
        case "Room service": return <ConciergeBell className="w-4 h-4" />;
        case "Fitness center": return <Dumbbell className="w-4 h-4" />;
        case "Spa": return <Sparkles className="w-4 h-4" />;
        case "Free breakfast": return <Coffee className="w-4 h-4" />;
        case "Wheelchair accessible": return <Accessibility className="w-4 h-4" />;
        case "Beach access": return <Waves className="w-4 h-4" />;
        case "Child-friendly": return <Baby className="w-4 h-4" />;
        case "Bar": return <Beer className="w-4 h-4" />;
        case "EV charger": return <BatteryCharging className="w-4 h-4" />;
        default: return <Star className="w-4 h-4" />; 
    } 
};

export default AmenityIcon;
