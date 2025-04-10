
import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Briefcase, 
  FileText, 
  MessageSquare, 
  User, 
  Package, 
  Building2, 
  DollarSign, 
  AlertTriangle, 
  LogOut,
  LayoutDashboard
} from 'lucide-react';

const EmployeeSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  const menuItems = [
    { name: 'Dashboard', path: '/employee', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Projets', path: '/employee/projects', icon: <Briefcase className="w-5 h-5" /> },
    { name: 'Sous-Projets', path: '/employee/sous-projets', icon: <Package className="w-5 h-5" /> },
    { name: 'Documents', path: '/employee/documents', icon: <FileText className="w-5 h-5" /> },
    { name: 'Réunions', path: '/employee/reunions', icon: <MessageSquare className="w-5 h-5" /> },
    { name: 'Incidents', path: '/employee/incidents', icon: <AlertTriangle className="w-5 h-5" /> },
    { name: 'Maître d\'Ouvrage', path: '/employee/maitre-ouvrage', icon: <Building2 className="w-5 h-5" /> },
    { name: 'Marché', path: '/employee/marche', icon: <DollarSign className="w-5 h-5" /> },
    { name: 'Profil', path: '/employee/profile', icon: <User className="w-5 h-5" /> },
  ];

  const logout = () => {
    localStorage.removeItem('currentUserId');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <aside className="fixed h-full w-64 bg-sonelgaz-blue text-white shadow-lg z-10">
      <div className="flex flex-col h-full">
        <div className="p-5 flex items-center border-b border-blue-800">
          <img 
            src="https://apua-asea.org/wp-content/uploads/2023/01/sonelgaz.png" 
            alt="Sonelgaz Logo" 
            className="h-8 mr-3"
          />
          <h1 className="text-xl font-bold">SONELGAZ</h1>
        </div>
        
        <nav className="flex-1 overflow-y-auto pt-5 pb-5">
          <ul className="space-y-1 px-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`w-full flex items-center text-left px-4 py-3 rounded-md transition-colors ${
                    isActive(item.path)
                      ? 'bg-blue-800 text-white font-medium'
                      : 'text-gray-200 hover:bg-blue-800/50'
                  }`}
                >
                  <span className="text-gray-100">
                    {item.icon}
                  </span>
                  <span className="ml-3">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-blue-800">
          <button
            className="w-full flex items-center px-4 py-3 rounded-md text-gray-200 hover:bg-blue-800/50 transition-colors"
            onClick={logout}
          >
            <LogOut className="w-5 h-5 text-gray-100" />
            <span className="ml-3">Déconnexion</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default EmployeeSidebar;
