import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import Footer from './Footer';

function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />
      <main className="flex-grow p-4 container mx-auto">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;