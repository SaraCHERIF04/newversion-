
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, BellRing } from 'lucide-react';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Notification } from '@/types/User';

type HeaderProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isEmployee?: boolean;
  isResponsable?: boolean;
};

// Sample notifications per role
const getSampleNotifications = (role: string): Notification[] => {
  const baseNotifications: Notification[] = [
    {
      id: '1',
      userId: '1',
      title: 'Bienvenue',
      message: 'Bienvenue sur la plateforme de gestion de projets Sonelgaz',
      type: 'info',
      read: false,
      createdAt: new Date().toISOString(),
      link: '#'
    }
  ];

  if (role === 'admin') {
    return [
      ...baseNotifications,
      {
        id: '2',
        userId: '1',
        title: 'Nouvel utilisateur',
        message: 'Un nouvel utilisateur a été créé et attend validation',
        type: 'info',
        read: false,
        createdAt: new Date().toISOString(),
        link: '/admin/users'
      },
      {
        id: '3',
        userId: '1',
        title: 'Mise à jour système',
        message: 'Une mise à jour du système est disponible',
        type: 'warning',
        read: false,
        createdAt: new Date().toISOString(),
        link: '/admin/parametres'
      }
    ];
  } else if (role === 'chef') {
    return [
      ...baseNotifications,
      {
        id: '2',
        userId: '1',
        title: 'Nouveau document',
        message: 'Un nouveau document a été ajouté au projet "Projet X"',
        type: 'info',
        read: false,
        createdAt: new Date().toISOString(),
        link: '/documents'
      },
      {
        id: '3',
        userId: '1',
        title: 'Nouvel incident',
        message: 'Un nouvel incident a été signalé et nécessite votre attention',
        type: 'warning',
        read: false,
        createdAt: new Date().toISOString(),
        link: '/incidents'
      },
      {
        id: '4',
        userId: '1',
        title: 'Réunion',
        message: 'Rappel: Réunion de projet demain à 10h',
        type: 'info',
        read: false,
        createdAt: new Date().toISOString(),
        link: '/reunion'
      }
    ];
  } else if (role === 'responsable') {
    return [
      ...baseNotifications,
      {
        id: '2',
        userId: '1',
        title: 'Incident critique',
        message: 'Un incident critique a été signalé et nécessite une intervention immédiate',
        type: 'error',
        read: false,
        createdAt: new Date().toISOString(),
        link: '/responsable/incidents'
      },
      {
        id: '3',
        userId: '1',
        title: 'Suivi d\'incident',
        message: 'Un suivi d\'incident a été ajouté',
        type: 'info',
        read: false,
        createdAt: new Date().toISOString(),
        link: '/responsable/incidents'
      }
    ];
  } else if (role === 'employee') {
    return [
      ...baseNotifications,
      {
        id: '2',
        userId: '1',
        title: 'Nouveau projet',
        message: 'Vous avez été assigné à un nouveau projet',
        type: 'info',
        read: false,
        createdAt: new Date().toISOString(),
        link: '/employee/projects'
      },
      {
        id: '3',
        userId: '1',
        title: 'Document à valider',
        message: 'Un document nécessite votre validation',
        type: 'warning',
        read: false,
        createdAt: new Date().toISOString(),
        link: '/employee/documents'
      }
    ];
  }

  return baseNotifications;
};

// Function to get background color based on notification type
const getNotificationColor = (type: string) => {
  switch (type) {
    case 'info':
      return 'bg-blue-50 border-blue-200';
    case 'warning':
      return 'bg-yellow-50 border-yellow-200';
    case 'error':
      return 'bg-red-50 border-red-200';
    case 'success':
      return 'bg-green-50 border-green-200';
    default:
      return 'bg-gray-50 border-gray-200';
  }
};

const Header: React.FC<HeaderProps> = ({ searchQuery, setSearchQuery, isEmployee = false, isResponsable = false }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const [userProfile, setUserProfile] = useState({
    name: '',
    firstName: '',
    role: '',
    profileImage: ''
  });

  // Load user profile and set notifications
  useEffect(() => {
    const userRole = localStorage.getItem('userRole') || '';
    
    // Set default profile info based on role
    let profileInfo = {
      name: 'Rowles',
      firstName: 'Alexa',
      role: 'Chef de projet',
      profileImage: 'https://randomuser.me/api/portraits/women/44.jpg'
    };

    // Override with role-specific info
    if (isEmployee) {
      profileInfo = {
        name: 'Dupont',
        firstName: 'Jean',
        role: 'Employé',
        profileImage: 'https://randomuser.me/api/portraits/men/32.jpg'
      };
    } else if (isResponsable) {
      profileInfo = {
        name: 'Benali',
        firstName: 'Ahmed',
        role: 'Responsable',
        profileImage: 'https://randomuser.me/api/portraits/men/36.jpg'
      };
    } else if (userRole === 'admin') {
      profileInfo = {
        name: 'Booles',
        firstName: 'Alexa',
        role: 'Administrateur',
        profileImage: 'https://randomuser.me/api/portraits/women/43.jpg'
      };
    }

    // Check for saved profile
    let savedProfileKey = 'userProfile';
    if (isEmployee) {
      savedProfileKey = 'userProfileEmployee';
    } else if (isResponsable) {
      savedProfileKey = 'userProfileResponsable';
    }
    
    const savedProfile = localStorage.getItem(savedProfileKey);
    
    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile);
        profileInfo = {
          name: parsedProfile.name || profileInfo.name,
          firstName: parsedProfile.firstName || profileInfo.firstName,
          role: parsedProfile.role || profileInfo.role,
          profileImage: parsedProfile.profileImage || profileInfo.profileImage,
        };
      } catch (error) {
        console.error("Error parsing profile:", error);
      }
    }

    setUserProfile(profileInfo);

    // Get role-based notifications
    let currentRole = userRole;
    if (isEmployee) currentRole = 'employee';
    if (isResponsable) currentRole = 'responsable';
    
    // Load saved notifications or use sample ones
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      try {
        const parsedNotifications = JSON.parse(savedNotifications);
        setNotifications(parsedNotifications);
        setUnreadCount(parsedNotifications.filter((n: Notification) => !n.read).length);
      } catch (error) {
        console.error("Error parsing notifications:", error);
        const sampleNotifications = getSampleNotifications(currentRole);
        setNotifications(sampleNotifications);
        setUnreadCount(sampleNotifications.length);
      }
    } else {
      const sampleNotifications = getSampleNotifications(currentRole);
      setNotifications(sampleNotifications);
      setUnreadCount(sampleNotifications.length);
      localStorage.setItem('notifications', JSON.stringify(sampleNotifications));
    }
  }, [isEmployee, isResponsable]);

  // Handle global search navigation
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // If we're not already on a page that consumes the search query,
    // navigate to an appropriate page based on user role
    const searchConsumingPages = ['/project', '/documents', '/employee/projects', '/employee/documents', '/responsable/incidents', '/admin/users'];
    const shouldNavigate = !searchConsumingPages.some(page => location.pathname.startsWith(page));
    
    if (shouldNavigate && query.length > 0) {
      if (isEmployee) {
        navigate('/employee/projects');
      } else if (isResponsable) {
        navigate('/responsable/incidents');
      } else if (localStorage.getItem('userRole') === 'admin') {
        navigate('/admin/users');
      } else {
        navigate('/project');
      }
    }
  };

  const handleNotificationClick = (notification: Notification, index: number) => {
    // Mark as read
    const updatedNotifications = [...notifications];
    updatedNotifications[index].read = true;
    setNotifications(updatedNotifications);
    setUnreadCount(unreadCount - 1);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    
    // Navigate to the link if provided
    if (notification.link) {
      navigate(notification.link);
    }
  };

  const handleMarkAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    setNotifications(updatedNotifications);
    setUnreadCount(0);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('userRole');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('userProfileEmployee');
    localStorage.removeItem('userProfileResponsable');
    
    // Redirect to login page
    navigate('/login');
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="relative w-full max-w-md">
        <input
          type="text"
          placeholder="Rechercher..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full rounded-full border border-gray-300 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <img 
          src="https://apua-asea.org/wp-content/uploads/2023/01/sonelgaz.png" 
          alt="Sonelgaz Logo" 
          className="h-10"
        />
        
        <Popover>
          <PopoverTrigger asChild>
            <button className="relative text-gray-500 hover:text-gray-700">
              {unreadCount > 0 ? (
                <BellRing className="h-6 w-6" />
              ) : (
                <Bell className="h-6 w-6" />
              )}
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {unreadCount}
                </span>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0 max-h-80 overflow-y-auto">
            <div className="flex justify-between items-center p-3 border-b">
              <h3 className="font-medium">Notifications</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Tout marquer comme lu
                </button>
              )}
            </div>
            <div className="divide-y divide-gray-100">
              {notifications.length > 0 ? (
                notifications.map((notification, index) => (
                  <div 
                    key={notification.id}
                    className={cn(
                      "p-3 cursor-pointer hover:bg-gray-50",
                      !notification.read && "bg-blue-50"
                    )}
                    onClick={() => handleNotificationClick(notification, index)}
                  >
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-sm">{notification.title}</p>
                      <span className={cn(
                        "inline-block w-2 h-2 rounded-full",
                        notification.read ? "bg-gray-300" : "bg-blue-500"
                      )}></span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500 text-sm">
                  Aucune notification
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>

        <div className="relative">
          <button
            className="flex items-center gap-2"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium text-gray-700">
                {userProfile.firstName} {userProfile.name}
              </span>
              <span className="text-xs text-gray-500">
                {userProfile.role}
              </span>
            </div>
            <Avatar className="h-8 w-8">
              <AvatarImage 
                src={userProfile.profileImage} 
                alt={`${userProfile.firstName} ${userProfile.name}`} 
              />
              <AvatarFallback>
                {userProfile.firstName?.charAt(0)}{userProfile.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 top-full z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="py-1" role="menu" aria-orientation="vertical">
                <button
                  onClick={() => {
                    navigate(isEmployee 
                      ? '/employee/profile' 
                      : isResponsable 
                        ? '/responsable/profile'
                        : localStorage.getItem('userRole') === 'admin' 
                          ? '/admin/profile' 
                          : '/profile');
                    setIsProfileOpen(false);
                  }}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  Votre profil
                </button>
                <button
                  onClick={() => {
                    navigate(isEmployee 
                      ? '/employee/parametres' 
                      : isResponsable 
                        ? '/responsable/parametres'
                        : localStorage.getItem('userRole') === 'admin' 
                          ? '/admin/parametres' 
                          : '/parametres');
                    setIsProfileOpen(false);
                  }}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  Paramètres
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  Se déconnecter
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
