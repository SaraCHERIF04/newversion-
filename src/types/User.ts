
export interface User {
  id: string;
  name: string;
  email: string;
  telephone?: string;
  matricule?: string;
  gender?: 'male' | 'female';
  role: 'admin' | 'chef' | 'employee' | 'responsable';
  status: 'En poste' | 'En congé' | 'Maladie' | 'Mission' | 'Formation' | 'Disponible';
  createdAt: string;
  avatar?: string;
  prenom?: string;
  notifications?: Notification[];
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createdAt: string;
  link?: string;
}

// Add a helper function to create and save notifications
export const addNotification = (
  targetUserIds: string[],
  title: string,
  message: string,
  type: 'info' | 'warning' | 'success' | 'error' = 'info',
  link?: string
) => {
  const usersString = localStorage.getItem('users');
  
  if (usersString) {
    try {
      const users: User[] = JSON.parse(usersString);
      const updatedUsers = users.map(user => {
        if (targetUserIds.includes(user.id)) {
          const notifications = user.notifications || [];
          notifications.unshift({
            id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            userId: user.id,
            title,
            message,
            type,
            read: false,
            createdAt: new Date().toISOString(),
            link
          });
          
          return {
            ...user,
            notifications
          };
        }
        return user;
      });
      
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    } catch (error) {
      console.error('Error updating notifications:', error);
    }
  }
};
