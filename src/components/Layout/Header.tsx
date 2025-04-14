import React, { useState, useEffect } from 'react';
import { Bell, LogOut, Settings, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import SonelgazLogo from '@/components/Layout/SonelgazLogo';
import { getUserNotifications, markNotificationAsRead, markAllNotificationsAsRead, getUnreadNotificationsCount } from '@/types/User';

interface NotificationItemProps {
  notification: any;
  onClick: (notificationId: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onClick }) => (
  <div 
    className={`p-3 cursor-pointer hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
    onClick={() => onClick(notification.id)}
  >
    <div className="flex justify-between">
      <h4 className="font-medium">{notification.title}</h4>
      <span className="text-xs text-gray-500">
        {new Date(notification.createdAt).toLocaleDateString()}
      </span>
    </div>
    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
  </div>
);

const Header = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notificationOpen, setNotificationOpen] = useState(false);

  // Get the user from localStorage
  const userFromLocalStorage = localStorage.getItem('currentUser');
  const currentUser = userFromLocalStorage ? JSON.parse(userFromLocalStorage) : null;
  
  // Load notifications
  useEffect(() => {
    if (currentUser?.id) {
      const fetchNotifications = () => {
        const userNotifications = getUserNotifications(currentUser.id);
        setNotifications(userNotifications);
        
        const count = getUnreadNotificationsCount(currentUser.id);
        setUnreadCount(count);
      };
      
      fetchNotifications();
      
      // Add event listener for notification updates
      const handleNotificationsUpdate = (event: any) => {
        if (event.detail.userId === currentUser.id || 
            event.detail.targetUserIds?.includes(currentUser.id)) {
          fetchNotifications();
        }
      };
      
      window.addEventListener('notificationsUpdated', handleNotificationsUpdate);
      
      return () => {
        window.removeEventListener('notificationsUpdated', handleNotificationsUpdate);
      };
    }
  }, [currentUser]);
  
  const handleMarkAsRead = (notificationId: string) => {
    if (currentUser?.id) {
      markNotificationAsRead(currentUser.id, notificationId);
      
      // Update the notifications list
      const updatedNotifications = notifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      );
      
      setNotifications(updatedNotifications);
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };
  
  const handleMarkAllAsRead = () => {
    if (currentUser?.id) {
      markAllNotificationsAsRead(currentUser.id);
      
      // Update all notifications to read
      const updatedNotifications = notifications.map(notification => ({ 
        ...notification, 
        read: true 
      }));
      
      setNotifications(updatedNotifications);
      setUnreadCount(0);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    toast({
      title: "Déconnexion réussie",
      description: "Vous avez été déconnecté avec succès.",
    });
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center">
      <SonelgazLogo />
      
      <div className="flex items-center space-x-4">
        <Popover open={notificationOpen} onOpenChange={setNotificationOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0">
            <Card>
              <CardContent className="p-0">
                <div className="p-2 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="font-medium">Notifications</h3>
                  {notifications.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
                      Tout marquer comme lu
                    </Button>
                  )}
                </div>
                <ScrollArea className="h-[300px]">
                  {notifications.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {notifications.map((notification) => (
                        <NotificationItem
                          key={notification.id}
                          notification={notification}
                          onClick={(notificationId) => {
                            handleMarkAsRead(notificationId);
                            setNotificationOpen(false);
                            if (notification.link) {
                              navigate(notification.link);
                            }
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      Aucune notification
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </PopoverContent>
        </Popover>
        
        <Link to="/parametres">
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </Link>
        
        <Button variant="ghost" size="icon" onClick={handleLogout}>
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
