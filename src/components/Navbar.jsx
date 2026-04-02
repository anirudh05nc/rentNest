import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, LogOut, User, MessageSquare, Menu, X, Plus } from 'lucide-react';

const Navbar = () => {
  const { currentUser, userData, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-primary-600">
              <Home className="h-8 w-8" />
              <span>RentNest</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/properties" className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">Browse</Link>
            {currentUser && (
              <>
                <Link to="/dashboard" className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">Dashboard</Link>
                <Link to="/add-property" className="flex items-center gap-1 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 transition">
                  <Plus size={18} />
                  <span>Add Property</span>
                </Link>
                <Link to="/chat" className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
                  <MessageSquare size={18} />
                  Messages
                </Link>
              </>
            )}
            
            {currentUser ? (
              <div className="flex items-center gap-4 ml-4 pl-4 border-l">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                    <User size={18} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{userData?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600">Sign In</Link>
                <Link to="/register" className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700">Get Started</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b px-4 pt-2 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top duration-300">
          <Link 
            to="/properties" 
            onClick={() => setIsMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600"
          >
            Browse Properties
          </Link>
          {currentUser ? (
            <>
              <Link 
                to="/dashboard" 
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600"
              >
                Dashboard
              </Link>
              <Link 
                to="/add-property" 
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600"
              >
                Add Property
              </Link>
              <Link 
                to="/chat" 
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600 flex items-center gap-2"
              >
                <MessageSquare size={18} />
                Messages
              </Link>
              <div className="pt-4 mt-4 border-t flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                    <User size={20} />
                  </div>
                  <div className="text-sm font-medium text-gray-900">{userData?.name}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="pt-4 mt-4 border-t grid grid-cols-2 gap-4">
              <Link 
                to="/login" 
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center px-4 py-2 border rounded-lg text-sm font-medium text-gray-700"
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
