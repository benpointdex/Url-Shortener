import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<LayoutProps> = ({ children }) => {
  const { username, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: 'grid_view' },
    { label: 'Links', path: '/my-urls', icon: 'link' },
    { label: 'Analytics', path: '/analytics', icon: 'bar_chart' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-[#f9f9f9] text-black antialiased selection:bg-black selection:text-white">
      {/* Sidebar */}
      <aside className="w-72 border-r border-black/5 flex flex-col fixed inset-y-0 bg-white shadow-[20px_0_40px_rgba(0,0,0,0.01)] z-40">
        <div className="p-10">
          <Link to="/" className="text-2xl font-[1000] tracking-tighter text-black flex items-center">
            SHORTIFY<span className="text-black/10 w-1.5 h-1.5 rounded-full bg-current ml-1 mt-auto mb-1.5"></span>
          </Link>
        </div>

        <nav className="flex-1 px-6 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group ${
                  isActive 
                    ? 'bg-black text-white shadow-xl shadow-black/10' 
                    : 'text-black/40 hover:bg-black/5 hover:text-black'
                }`}
              >
                <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-white' : 'text-black/20 group-hover:text-black'}`}>
                  {item.icon}
                </span>
                <span className="text-[13px] font-black uppercase tracking-widest">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6">
          <div className="bg-[#f9f9f9] rounded-[30px] p-6 border border-black/5 group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-[1000] text-sm">
                {username?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black truncate tracking-tight uppercase opacity-30">Account</p>
                <p className="text-sm font-[1000] truncate tracking-tight">{username}</p>
              </div>
            </div>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full py-3 text-[10px] font-black uppercase tracking-widest text-black/20 hover:text-black hover:bg-white rounded-xl transition-all border border-transparent hover:border-black/5"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 min-h-screen">
        <div className="max-w-7xl mx-auto px-8 py-12">
          {children}
        </div>
      </main>

      {/* Custom Logout Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowLogoutConfirm(false)}></div>
           <div className="relative bg-white w-full max-w-sm rounded-[40px] p-12 border-2 border-black shadow-[20px_20px_0_rgba(0,0,0,1)] text-center animate-in zoom-in-95 duration-300">
              <h3 className="text-3xl font-[1000] italic tracking-tighter mb-4 text-black">Ready to go?</h3>
              <p className="text-sm font-black text-black/40 mb-10 tracking-tight leading-relaxed">
                Are you sure you want to sign out? <br/>You can log back in anytime.
              </p>
              <div className="flex flex-col gap-3">
                 <button 
                  onClick={handleLogout}
                  className="w-full py-5 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/20"
                 >
                   Log out
                 </button>
                 <button 
                  onClick={() => setShowLogoutConfirm(false)}
                  className="w-full py-5 bg-white text-black/40 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black/5 hover:text-black transition-all"
                 >
                   Cancel
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
