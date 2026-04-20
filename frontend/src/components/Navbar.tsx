import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-black/5 px-6 py-5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="text-[24px] font-[1000] tracking-tighter text-black flex items-center hover:opacity-70 transition-opacity">
          SHORTIFY<span className="text-black/20 w-1 h-1 rounded-full bg-current ml-0.5 mt-auto mb-1.5"></span>
        </Link>

        {/* Auth Group */}
        <div className="flex items-center gap-6">
          {!isAuthenticated ? (
            <>
              <Link
                to="/register"
                className="bg-black text-white text-[10px] font-black uppercase tracking-widest px-8 py-3 rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                className="text-[10px] font-black uppercase tracking-widest text-black hover:bg-black/5 px-6 py-2.5 rounded-full transition-all border border-black/5"
              >
                Dashboard
              </Link>
              <button
                onClick={() => { logout(); navigate('/'); }}
                className="bg-black text-white text-[10px] font-black uppercase tracking-widest px-8 py-3 rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
