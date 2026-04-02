import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children, showSidebar = false }) => {
  const { currentUser } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full">
      <Navbar />
      <div className="flex flex-1 w-full">
        {showSidebar && currentUser && <Sidebar />}
        <main className={`flex-1 ${showSidebar ? 'p-4 md:p-8' : ''}`}>
          <div className="w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
