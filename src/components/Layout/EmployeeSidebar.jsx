
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Briefcase, FileText, MessageSquare, User, Package, Building2, DollarSign, AlertTriangle } from 'lucide-react';

const EmployeeSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  const menuItems = [
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
    <div className="min-h-screen w-64 bg-blue-800 text-white flex flex-col">
      <div className="p-5 border-b border-blue-700">
        <h1 className="text-xl font-bold">LOGO</h1>
      </div>
      <div className="flex-1 overflow-y-auto">
        <ul className="mt-6 space-y-2 px-3">
          {menuItems.map((item) => (
            <li key={item.path}>
              <button
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-700 text-white'
                    : 'text-blue-200 hover:bg-blue-700 hover:text-white'
                }`}
                onClick={() => navigate(item.path)}
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="p-4 border-t border-blue-700">
        <button
          className="w-full flex items-center px-4 py-3 rounded-lg text-blue-200 hover:bg-blue-700 hover:text-white transition-colors"
          onClick={logout}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="ml-3">Déconnexion</span>
        </button>
      </div>
    </div>
  );
};

export default EmployeeSidebar;
