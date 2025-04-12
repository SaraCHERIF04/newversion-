
import React, { useState, useEffect } from 'react';
import { Outlet, useOutletContext, useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import Header from './Header';

type ContextType = { searchQuery: string };

const AdminLayout: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Verify user is logged in as admin, if not redirect to login
  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1">
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <main className="px-6 py-6">
          <Outlet context={{ searchQuery }} />
        </main>
      </div>
    </div>
  );
};

export function useSearchQuery() {
  return useOutletContext<ContextType>();
}

export default AdminLayout;
