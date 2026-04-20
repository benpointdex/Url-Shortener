import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const [usernameInput, setUsernameInput] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await api.post('/auth/public/login', {
        username: usernameInput,
        password: password
      });
      
      if (response.data && response.data.token) {
        login(response.data.token, usernameInput);
        navigate('/dashboard');
      } else {
        setError('Invalid server response');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || err.response?.data || 'Invalid username or password';
      setError(typeof errorMessage === 'string' ? errorMessage : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-black antialiased flex flex-col items-center selection:bg-black selection:text-white">
      {/* Absolute Header for Logo */}
      <header className="absolute top-0 left-0 right-0 p-10 flex justify-center lg:justify-start lg:px-20">
         <Link to="/" className="text-3xl font-[1000] tracking-tighter text-black">
          SHORTIFY<span className="text-black/10 w-1.5 h-1.5 rounded-full bg-current ml-1 mt-auto mb-2"></span>
        </Link>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-32 py-32 lg:py-0">
        <section className="flex-1 text-center lg:text-left">
           <div className="mb-10">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] bg-black text-white shadow-2xl shadow-black/20">
                Verified System
              </span>
           </div>
           <h1 className="text-7xl lg:text-[110px] font-[1000] leading-[0.85] tracking-[-0.05em] mb-12">
             Welcome <br/>
             <span className="italic text-transparent" style={{ WebkitTextStroke: '1px black' }}>back.</span>
           </h1>
           <p className="text-lg font-black text-black/40 leading-relaxed max-w-sm mx-auto lg:mx-0 tracking-tight">
             Access your high-velocity redirection hub. 
             Precision is the only rule for every creator.
           </p>
        </section>

        <section className="w-full max-w-[480px]">
           <div className="bg-white p-10 lg:p-14 rounded-[40px] border-2 border-black shadow-[12px_12px_0_rgba(0,0,0,1)]">
              <h2 className="text-3xl font-[1000] italic tracking-tighter mb-10">Sign In</h2>
              
              <form onSubmit={handleLogin} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black/30 px-2">Username</label>
                  <input 
                    type="text" 
                    placeholder="username" 
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="w-full px-8 py-5 rounded-[20px] bg-[#f9f9f9] border-2 border-transparent focus:border-black outline-none font-black tracking-tight placeholder:text-black/5 transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black/30 px-2">Password</label>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-8 py-5 rounded-[20px] bg-[#f9f9f9] border-2 border-transparent focus:border-black outline-none font-black tracking-tight placeholder:text-black/5 transition-all"
                    required
                  />
                </div>

                {error && <p className="text-[10px] font-black uppercase tracking-widest text-red-500 text-center">{error}</p>}

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-6 bg-black text-white rounded-[20px] font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-black/20 disabled:opacity-50"
                >
                  {loading ? 'Authenticating...' : 'Sign In'}
                </button>
              </form>

              <div className="mt-12 pt-8 border-t border-black/5 text-center">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-30">
                  Unauthorized access is strictly monitored.
                </p>
                <div className="mt-4">
                  <Link to="/register" className="text-[10px] font-black uppercase tracking-widest text-black underline underline-offset-8 decoration-2 hover:decoration-black/10 transition-all">
                    Initialize New Account
                  </Link>
                </div>
              </div>
           </div>
        </section>
      </main>
    </div>
  );
};

export default LoginPage;
