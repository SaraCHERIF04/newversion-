
import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Briefcase, 
  FileText, 
  MessageSquare, 
  User, 
  Package, 
  LayoutDashboard,
  AlertTriangle,
  Building2,
  DollarSign,
  Settings,
  Info,
  LogOut
} from 'lucide-react';

const EmployeeSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  const menuItems = [
    { name: 'Project', path: '/employee/projects', icon: <Briefcase className="w-5 h-5" /> },
    { name: 'sous_projet', path: '/employee/sous-projets', icon: <Package className="w-5 h-5" /> },
    { name: 'Dashboard', path: '/employee', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Incidents', path: '/employee/incidents', icon: <AlertTriangle className="w-5 h-5" /> },
    { name: 'Documents', path: '/employee/documents', icon: <FileText className="w-5 h-5" /> },
    { name: 'Réunion', path: '/employee/reunions', icon: <MessageSquare className="w-5 h-5" /> },
    { name: 'Paramètres', path: '/employee/parametres', icon: <Settings className="w-5 h-5" /> },
    { name: 'About US', path: '/employee/about', icon: <Info className="w-5 h-5" /> },
  ];

  const logout = () => {
    localStorage.removeItem('currentUserId');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <aside className="fixed h-full w-64 bg-white shadow-lg z-10">
      <div className="flex flex-col h-full">
        <div className="p-5 flex items-center border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded bg-orange-500 flex items-center justify-center mr-3">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 10L21 5V19L13 14V10Z" fill="#0052CC" />
                <path d="M3 19L11 14V10L3 5V19Z" fill="#0052CC" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-sonelgaz-blue">SONELGAZ</h1>
              <p className="text-sm text-gray-600">Projects</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto pt-5 pb-5">
          <ul className="space-y-1 px-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`w-full flex items-center text-left px-4 py-3 rounded-md transition-colors ${
                    isActive(item.path)
                      ? 'bg-indigo-900 text-white font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className={`mr-3 ${isActive(item.path) ? 'text-white' : 'text-gray-400'}`}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <button
            className="w-full flex items-center px-4 py-3 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={logout}
          >
            <LogOut className="w-5 h-5 mr-3 text-gray-400" />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default EmployeeSidebar;
