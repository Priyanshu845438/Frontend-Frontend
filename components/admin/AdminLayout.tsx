


import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.tsx';
import AdminHeader from './AdminHeader.tsx';

const AdminLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-brand-dark overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;