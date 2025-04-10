
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Determine if user is in employee, admin or chef section
  const getUserSection = () => {
    const path = location.pathname;
    if (path.startsWith("/employee")) return "/employee";
    if (path.startsWith("/admin")) return "/admin";
    return "/";
  };

  const homePath = getUserSection();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
        <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
        <p className="text-xl text-gray-800 mb-6">Page Non Trouvée</p>
        <p className="text-gray-600 mb-6">
          Le chemin <span className="font-mono bg-gray-100 px-2 py-1 rounded">{location.pathname}</span> n'existe pas ou n'est pas accessible.
        </p>
        <Button asChild className="mb-2 w-full">
          <Link to={homePath}>
            Retourner à l'accueil
          </Link>
        </Button>
        <Button variant="outline" asChild className="w-full">
          <Link to="/login">
            Retourner à la page de connexion
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
