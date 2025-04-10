
export interface User {
  id: string;
  name: string;
  email: string;
  telephone?: string;
  matricule?: string;
  gender?: 'male' | 'female';
  role: 'admin' | 'chef' | 'employee';
  status: 'active' | 'inactive';
  createdAt: string;
  avatar?: string;
  // Added fields based on the form shown in the images
  prenom?: string;
}
