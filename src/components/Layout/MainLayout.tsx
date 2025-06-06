
import React, { useState } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

type ContextType = { searchQuery: string };

const MainLayout: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
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

export default MainLayout;
