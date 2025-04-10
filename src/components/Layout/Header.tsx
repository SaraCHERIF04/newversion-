
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type HeaderProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isEmployee?: boolean;
};

const Header: React.FC<HeaderProps> = ({ searchQuery, setSearchQuery, isEmployee = false }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState({
    name: '',
    firstName: '',
    role: '',
    profileImage: ''
  });

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
    } else if (userRole === 'admin') {
      profileInfo = {
        name: 'Booles',
        firstName: 'Alexa',
        role: 'Administrateur',
        profileImage: 'https://randomuser.me/api/portraits/women/43.jpg'
      };
    }

    // Check for saved profile
    const savedProfile = isEmployee ? 
      localStorage.getItem('userProfileEmployee') : 
      localStorage.getItem('userProfile');
    
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
  }, [isEmployee]);

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('userRole');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('userProfileEmployee');
    
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
          onChange={(e) => setSearchQuery(e.target.value)}
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
        <button className="relative text-gray-500 hover:text-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            1
          </span>
        </button>

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
                    navigate(isEmployee ? '/employee/profile' : localStorage.getItem('userRole') === 'admin' ? '/admin/profile' : '/profile');
                    setIsProfileOpen(false);
                  }}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  Votre profil
                </button>
                <button
                  onClick={() => {
                    navigate(isEmployee ? '/employee/parametres' : localStorage.getItem('userRole') === 'admin' ? '/admin/parametres' : '/parametres');
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
