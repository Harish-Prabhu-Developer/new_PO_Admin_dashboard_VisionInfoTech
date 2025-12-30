import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react';

const LayoutPage = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    {
      id: 1,
      name: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard size={20} />,
      active: location.pathname === '/dashboard'
    },
    {
      id: 2,
      name: 'Users',
      path: '/users',
      icon: <Users size={20} />,
      active: location.pathname === '/users'
    },
    {
      id: 3,
      name: 'Examples',
      path: '/example',
      icon: <FileText size={20} />,
      active: location.pathname === '/example'
    }
  ];

  // Close mobile sidebar when clicking outside
  const handleOverlayClick = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="flex h-screen w-full bg-gray-50">
      {/* Mobile overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={handleOverlayClick}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        transform transition-transform duration-300 ease-in-out
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        flex flex-col
        bg-linear-to-b from-gray-900 to-gray-800
        text-white
        ${isSidebarOpen ? 'w-64' : 'w-20'}
        h-screen
        shadow-xl
      `}>
        
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className={`flex items-center space-x-3 ${!isSidebarOpen && 'justify-center w-full'}`}>
            <div className="w-8 h-8 rounded-lg bg-linear-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="font-bold">L</span>
            </div>
            {isSidebarOpen && (
              <h1 className="text-xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Dashboard
              </h1>
            )}
          </div>
          
          {/* Desktop toggle button */}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-700 transition-colors"
          >
            {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
          
          {/* Mobile close button */}
          <button 
            onClick={() => setIsMobileSidebarOpen(false)}
            className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Sidebar Menu */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <Link
                  to={item.path}
                  className={`
                    flex items-center space-x-3
                    px-3 py-3
                    rounded-lg
                    transition-all duration-200
                    hover:bg-gray-700 hover:shadow-lg
                    ${item.active ? 'bg-linear-to-r from-blue-600/20 to-purple-600/20 border-l-4 border-blue-500' : ''}
                    ${!isSidebarOpen && 'justify-center'}
                  `}
                  onClick={() => setIsMobileSidebarOpen(false)}
                >
                  <div className={`${item.active ? 'text-blue-400' : 'text-gray-300'}`}>
                    {item.icon}
                  </div>
                  {isSidebarOpen && (
                    <span className={`font-medium ${item.active ? 'text-white' : 'text-gray-300'}`}>
                      {item.name}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>

         
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-700">
          <div className={`flex items-center ${!isSidebarOpen ? 'justify-center' : 'justify-between'}`}>
            {isSidebarOpen ? (
              <>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-linear-to-r from-blue-500 to-purple-500"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">John Doe</p>
                    <p className="text-xs text-gray-400 truncate">Admin</p>
                  </div>
                </div>
                <button className="p-2 rounded-lg hover:bg-gray-700 transition-colors">
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <div className="w-8 h-8 rounded-full bg-linear-to-r from-blue-500 to-purple-500"></div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <button 
                onClick={() => setIsMobileSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Menu size={24} className="text-gray-600" />
              </button>
              
              {/* Breadcrumb */}
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
                <span className="font-medium">Home</span>
                <ChevronRight size={16} />
                <span className="capitalize">
                  {location.pathname.split('/').pop() || 'Dashboard'}
                </span>
              </div>
            </div>

            {/* User Profile & Notifications */}
            <div className="flex items-center space-x-4">
              <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 text-sm font-bold">3</span>
                </div>
              </button>
              
              <div className="hidden md:flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-linear-to-r from-blue-500 to-purple-500"></div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
};

export default LayoutPage;