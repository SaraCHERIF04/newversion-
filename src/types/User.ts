
export interface User {
  id: string;
  name: string;
  email: string;
  telephone?: string;
  role: 'admin' | 'chef' | 'employee';
  status: 'active' | 'inactive';
  createdAt: string;
  avatar?: string;
}
