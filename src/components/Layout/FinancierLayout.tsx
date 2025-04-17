
import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import FinancierSidebar from './FinancierSidebar';
import Header from './Header';

const FinancierLayout = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'financier') {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <FinancierSidebar />
      <div className="flex-1">
        <Header 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery}
          isFinancier={true}
        />
        <main className="px-6 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default FinancierLayout;
