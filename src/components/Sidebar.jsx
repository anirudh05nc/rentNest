import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Home, 
  MessageSquare, 
  Settings,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { userData } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);

  const links = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Find Properties', icon: Home, path: '/properties' },
    { name: 'My Listings', icon: Home, path: '/my-properties' },
    { name: 'Add Property', icon: PlusCircle, path: '/add-property' },
    { name: 'Messages', icon: MessageSquare, path: '/chat' },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg md:hidden"
      >
        {isOpen ? <X /> : <Menu />}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white border-r transition-transform duration-300 ease-in-out md:sticky md:top-16 md:h-[calc(100vh-64px)] md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-full flex-col bg-white">
          <div className="flex-1 space-y-1 px-4 py-6">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                    isActive 
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' 
                    : 'text-gray-600 hover:bg-primary-50 hover:text-primary-700'
                  }`}
                >
                  <Icon size={20} className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-primary-600'} />
                  {link.name}
                </Link>
              );
            })}
          </div>
          
          <div className="border-t p-4">
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900">
              <Settings size={20} />
              Settings
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
