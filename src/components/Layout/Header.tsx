import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, BellRing, Search } from 'lucide-react';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Notification } from '@/types/User';
import { 
  CommandDialog, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList,
  CommandSeparator 
} from "@/components/ui/command";
import { DialogTitle } from "@/components/ui/dialog";

type HeaderProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isEmployee?: boolean;
  isResponsable?: boolean;
};

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

interface SearchResult {
  id: string;
  title: string;
  description?: string;
  type: 'project' | 'subproject' | 'reunion' | 'document' | 'incident' | 'user';
  link: string;
}

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
  const [openCommandMenu, setOpenCommandMenu] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole') || '';
    
    let profileInfo = {
      name: 'Rowles',
      firstName: 'Alexa',
      role: 'Chef de projet',
      profileImage: 'https://randomuser.me/api/portraits/women/44.jpg'
    };

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

    let currentRole = userRole;
    if (isEmployee) currentRole = 'employee';
    if (isResponsable) currentRole = 'responsable';
    
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

  const performGlobalSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const normalizedQuery = query.toLowerCase().trim();
    const results: SearchResult[] = [];
    const userRole = isEmployee ? 'employee' : isResponsable ? 'responsable' : localStorage.getItem('userRole');
    
    try {
      if (!isResponsable || userRole === 'admin' || userRole === 'chef') {
        const projectsString = localStorage.getItem('projects');
        if (projectsString) {
          const projects = JSON.parse(projectsString);
          const matchedProjects = projects.filter((project: any) => 
            project.name?.toLowerCase().includes(normalizedQuery) || 
            project.description?.toLowerCase().includes(normalizedQuery) ||
            project.id?.toLowerCase().includes(normalizedQuery) ||
            project.code?.toLowerCase().includes(normalizedQuery)
          );
          
          matchedProjects.forEach((project: any) => {
            results.push({
              id: project.id,
              title: project.name || 'Projet sans nom',
              description: project.description?.substring(0, 50) || 'Aucune description',
              type: 'project',
              link: isEmployee 
                ? `/employee/projects/${project.id}` 
                : isResponsable 
                  ? `/responsable/projects/${project.id}`
                  : `/project/${project.id}`
            });
          });
        }
      }
    } catch (error) {
      console.error("Error searching projects:", error);
    }
    
    try {
      if (!isResponsable || userRole === 'admin' || userRole === 'chef') {
        const subProjectsString = localStorage.getItem('subProjects');
        if (subProjectsString) {
          const subProjects = JSON.parse(subProjectsString);
          const matchedSubProjects = subProjects.filter((subProject: any) => 
            subProject.name?.toLowerCase().includes(normalizedQuery) || 
            subProject.description?.toLowerCase().includes(normalizedQuery) ||
            subProject.id?.toLowerCase().includes(normalizedQuery)
          );
          
          matchedSubProjects.forEach((subProject: any) => {
            results.push({
              id: subProject.id,
              title: subProject.name || 'Sous-projet sans nom',
              description: `Projet: ${subProject.projectName || 'non spécifié'}`,
              type: 'subproject',
              link: isEmployee 
                ? `/employee/sous-projets/${subProject.id}` 
                : isResponsable 
                  ? `/responsable/sous-projets/${subProject.id}`
                  : `/sous-projet/${subProject.id}`
            });
          });
        }
      }
    } catch (error) {
      console.error("Error searching subprojects:", error);
    }
    
    try {
      if (!isResponsable || userRole === 'admin' || userRole === 'chef') {
        const meetingsString = localStorage.getItem('meetings');
        if (meetingsString) {
          const meetings = JSON.parse(meetingsString);
          const matchedMeetings = meetings.filter((meeting: any) => 
            meeting.title?.toLowerCase().includes(normalizedQuery) || 
            meeting.description?.toLowerCase().includes(normalizedQuery) ||
            meeting.id?.toLowerCase().includes(normalizedQuery) ||
            meeting.pvNumber?.toLowerCase().includes(normalizedQuery) ||
            meeting.location?.toLowerCase().includes(normalizedQuery)
          );
          
          matchedMeetings.forEach((meeting: any) => {
            results.push({
              id: meeting.id,
              title: meeting.title || `PV ${meeting.pvNumber || ''}`,
              description: meeting.location || 'Aucun lieu spécifié',
              type: 'reunion',
              link: isEmployee 
                ? `/employee/reunions/${meeting.id}` 
                : isResponsable 
                  ? `/responsable/reunions/${meeting.id}`
                  : `/reunion/${meeting.id}`
            });
          });
        }
      }
    } catch (error) {
      console.error("Error searching meetings:", error);
    }
    
    try {
      if (!isResponsable || userRole === 'admin' || userRole === 'chef') {
        const documentsString = localStorage.getItem('documents');
        if (documentsString) {
          const documents = JSON.parse(documentsString);
          const matchedDocuments = documents.filter((document: any) => 
            document.title?.toLowerCase().includes(normalizedQuery) || 
            document.description?.toLowerCase().includes(normalizedQuery) ||
            document.id?.toLowerCase().includes(normalizedQuery) ||
            document.fileName?.toLowerCase().includes(normalizedQuery)
          );
          
          matchedDocuments.forEach((document: any) => {
            results.push({
              id: document.id,
              title: document.title || document.fileName || 'Document sans titre',
              description: document.description?.substring(0, 50) || 'Aucune description',
              type: 'document',
              link: isEmployee 
                ? `/employee/documents/${document.id}` 
                : isResponsable 
                  ? `/responsable/documents/${document.id}`
                  : `/documents/${document.id}`
            });
          });
        }
      }
    } catch (error) {
      console.error("Error searching documents:", error);
    }
    
    try {
      const incidentsString = localStorage.getItem('incidents');
      if (incidentsString) {
        const incidents = JSON.parse(incidentsString);
        const matchedIncidents = incidents.filter((incident: any) => 
          incident.title?.toLowerCase().includes(normalizedQuery) || 
          incident.description?.toLowerCase().includes(normalizedQuery) ||
          incident.id?.toLowerCase().includes(normalizedQuery) ||
          incident.code?.toLowerCase().includes(normalizedQuery)
        );
        
        matchedIncidents.forEach((incident: any) => {
          results.push({
            id: incident.id,
            title: incident.title || `Incident #${incident.code || ''}`,
            description: incident.description?.substring(0, 50) || 'Aucune description',
            type: 'incident',
            link: isEmployee 
              ? `/employee/incidents/${incident.id}` 
              : isResponsable 
                ? `/responsable/incidents/${incident.id}`
                : `/incidents/${incident.id}`
          });
        });
      }
    } catch (error) {
      console.error("Error searching incidents:", error);
    }
    
    if (userRole === 'admin') {
      try {
        const usersString = localStorage.getItem('users');
        if (usersString) {
          const users = JSON.parse(usersString);
          const matchedUsers = users.filter((user: any) => 
            user.name?.toLowerCase().includes(normalizedQuery) || 
            user.firstName?.toLowerCase().includes(normalizedQuery) ||
            user.email?.toLowerCase().includes(normalizedQuery) ||
            user.id?.toLowerCase().includes(normalizedQuery) ||
            user.userId?.toLowerCase().includes(normalizedQuery)
          );
          
          matchedUsers.forEach((user: any) => {
            results.push({
              id: user.id || user.userId,
              title: `${user.firstName || ''} ${user.name || ''}`,
              description: user.email || 'Aucun email',
              type: 'user',
              link: `/admin/users/${user.id || user.userId}`
            });
          });
        }
      } catch (error) {
        console.error("Error searching users:", error);
      }
    }
    
    setSearchResults(results);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length >= 2) {
      performGlobalSearch(query);
      setOpenCommandMenu(true);
    }
  };

  const handleSelectSearchResult = (link: string) => {
    setOpenCommandMenu(false);
    setSearchQuery('');
    navigate(link);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'project':
        return '📁';
      case 'subproject':
        return '📋';
      case 'reunion':
        return '🗓️';
      case 'document':
        return '📄';
      case 'incident':
        return '⚠️';
      case 'user':
        return '👤';
      default:
        return '🔍';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'project':
        return 'Projet';
      case 'subproject':
        return 'Sous-projet';
      case 'reunion':
        return 'Réunion';
      case 'document':
        return 'Document';
      case 'incident':
        return 'Incident';
      case 'user':
        return 'Utilisateur';
      default:
        return 'Résultat';
    }
  };

  const handleNotificationClick = (notification: Notification, index: number) => {
    const updatedNotifications = [...notifications];
    updatedNotifications[index].read = true;
    setNotifications(updatedNotifications);
    setUnreadCount(unreadCount - 1);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    
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
    localStorage.removeItem('userRole');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('userProfileEmployee');
    localStorage.removeItem('userProfileResponsable');
    
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
          onFocus={() => {
            if (searchQuery.length >= 2) {
              performGlobalSearch(searchQuery);
              setOpenCommandMenu(true);
            }
          }}
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
          <Search className="h-5 w-5" />
        </div>
        
        <CommandDialog open={openCommandMenu} onOpenChange={setOpenCommandMenu}>
          <DialogTitle className="sr-only">Recherche globale</DialogTitle>
          <CommandInput 
            placeholder="Tapez pour rechercher..." 
            value={searchQuery}
            onValueChange={(value) => {
              setSearchQuery(value);
              performGlobalSearch(value);
            }}
          />
          <CommandList>
            <CommandEmpty>Aucun résultat trouvé</CommandEmpty>
            {['project', 'subproject', 'reunion', 'document', 'incident', 'user'].map(type => {
              const resultsOfType = searchResults.filter(r => r.type === type);
              if (resultsOfType.length === 0) return null;
              
              return (
                <CommandGroup key={type} heading={getTypeLabel(type)}>
                  {resultsOfType.map(result => (
                    <CommandItem 
                      key={`${result.type}-${result.id}`} 
                      onSelect={() => handleSelectSearchResult(result.link)}
                      className="flex items-center"
                    >
                      <span className="mr-2">{getTypeIcon(result.type)}</span>
                      <div>
                        <p className="font-medium">{result.title}</p>
                        {result.description && (
                          <p className="text-xs text-gray-500 truncate">{result.description}</p>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              );
            })}
          </CommandList>
        </CommandDialog>
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
