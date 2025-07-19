import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blend-multiply text-white py-4">
      <div className="container mx-auto flex justify-center space-x-6  mt-4 items-center px-6">
        {/* img tag */}
        <img src="/logo.png" alt="Heading" className="h-10" />
        <h1 className="text-5xl font-bold font-playfair">SmartNest</h1>
        {/* <div className="space-x-4">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/search" className="hover:underline">Find Hotels</Link>
        </div> */}
      </div>
    </nav>
  );
}
