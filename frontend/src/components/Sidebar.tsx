import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar: React.FC = () => {
  const { logout, username } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
    { name: 'My URLs', icon: 'link', path: '/my-urls' },
    { name: 'Analytics', icon: 'analytics', path: '/analytics' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-black/5 flex flex-col h-screen sticky top-0">
      <div className="p-8 border-b border-black/5">
        <Link to="/" className="text-2xl font-black tracking-tighter text-black">SHORTIFY</Link>
      </div>

      <nav className="flex-grow py-8 px-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-4 px-6 py-4 rounded-xl font-bold tracking-tight transition-all duration-200 ${
              location.pathname === item.path
                ? 'bg-black text-white shadow-xl shadow-black/10 scale-105'
                : 'text-black/40 hover:text-black hover:bg-black/5'
            }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="text-sm uppercase tracking-widest">{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="p-8 border-t border-black/5">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center font-black text-black">
            {username?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate text-black">{username}</p>
            <p className="text-[10px] uppercase font-black tracking-widest text-black/20">Member</p>
          </div>
        </div>
        <button
          onClick={() => { logout(); navigate('/'); }}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-black uppercase tracking-widest text-[11px] bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200"
        >
          <span className="material-symbols-outlined text-sm">logout</span>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
