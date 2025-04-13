import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../../modules/user/hooks/useUser';

function Navigation() {
  const location = useLocation();
  const { user, isLoading, logout } = useUser();
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <nav className="bg-gradient-to-r from-green-600 to-teal-500 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap justify-between items-center">
          <Link to="/" className="text-xl font-bold flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            EcoTrack
          </Link>
          
          <div className="flex space-x-2 md:space-x-6 mt-2 md:mt-0">
            <Link 
              to="/" 
              className={`hover:text-green-200 ${isActive('/') ? 'font-bold border-b-2 border-white' : ''}`}
            >
              Home
            </Link>
            
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`hover:text-green-200 ${isActive('/dashboard') ? 'font-bold border-b-2 border-white' : ''}`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/audit" 
                  className={`hover:text-green-200 ${isActive('/audit') ? 'font-bold border-b-2 border-white' : ''}`}
                >
                  Energy Audit
                </Link>
                <Link 
                  to="/recommendations" 
                  className={`hover:text-green-200 ${isActive('/recommendations') ? 'font-bold border-b-2 border-white' : ''}`}
                >
                  Recommendations
                </Link>
              </>
            ) : null}
          </div>
          
          <div>
            {isLoading ? (
              <span>Loading...</span>
            ) : user ? (
              <div className="flex items-center">
                <span className="mr-2 hidden md:inline">{user.email}</span>
                <button 
                  onClick={logout}
                  className="bg-white text-green-600 px-3 py-1 rounded-md hover:bg-green-100 transition cursor-pointer text-sm"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button className="bg-white text-green-600 px-4 py-2 rounded-md hover:bg-green-100 transition cursor-pointer">
                Get Started
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;