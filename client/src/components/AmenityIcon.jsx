// Amenity Icon Helper
import { Wifi, Wind, Building2, ParkingCircle, Utensils, Sun, Tv, Star } from 'lucide-react';
const AmenityIcon = ({ name }) => {
    switch(name) {
        case "Free Wi-Fi": return <Wifi className="w-4 h-4" />;
        case "Air conditioning": return <Wind className="w-4 h-4" />;
        case "Pet-friendly": return <Building2 className="w-4 h-4" />;
        case "Free parking": return <ParkingCircle className="w-4 h-4" />;
        case "Kitchen": return <Utensils className="w-4 h-4" />;
        case "Pool": return <Sun className="w-4 h-4" />;
        case "Washer": return <Tv className="w-4 h-4" />; // Placeholder icon
        case "Gym": return <Star className="w-4 h-4" />; // Placeholder icon
        default: return <Star className="w-4 h-4" />;
    }
};

export default AmenityIcon;