
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
