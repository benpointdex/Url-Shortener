import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await api.post('/auth/public/register', { username, email, password });
      setShowSuccessModal(true);
    } catch (err: any) {
      console.error('Registration error:', err);
      const errorMessage = err.response?.data?.message || err.response?.data || 'Failed to register. Please try again.';
      setError(typeof errorMessage === 'string' ? errorMessage : 'Registration failed');
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
                Open Access
              </span>
           </div>
           <h1 className="text-7xl lg:text-[110px] font-[1000] leading-[0.85] tracking-[-0.05em] mb-12">
             Start <br/>
             <span className="italic text-transparent" style={{ WebkitTextStroke: '1px black' }}>shortening</span> <br/>
             today.
           </h1>
           <p className="text-lg font-black text-black/40 leading-relaxed max-w-sm mx-auto lg:mx-0 tracking-tight">
             Built for precision. Used by creators of the web. 
             Join our high-velocity redirection hub.
           </p>
        </section>

        <section className="w-full max-w-[480px]">
           <div className="bg-white p-10 lg:p-14 rounded-[40px] border-2 border-black shadow-[12px_12px_0_rgba(0,0,0,1)]">
              <h2 className="text-3xl font-[1000] italic tracking-tighter mb-10">Create Profile</h2>
              
              <form onSubmit={handleRegister} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black/30 px-2">Username</label>
                  <input 
                    type="text" 
                    placeholder="username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-8 py-5 rounded-[20px] bg-[#f9f9f9] border-2 border-transparent focus:border-black outline-none font-black tracking-tight placeholder:text-black/5 transition-all"
                    required
                  />
                </div>

                 <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black/30 px-2">Email</label>
                  <input 
                    type="email" 
                    placeholder="user@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                  {loading ? 'Initializing...' : 'Create Account'}
                </button>
              </form>

              <div className="mt-12 pt-8 border-t border-black/5 text-center">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-30">
                  By joining, you agree to our terms.
                </p>
                <div className="mt-4">
                  <Link to="/login" className="text-[10px] font-black uppercase tracking-widest text-black underline underline-offset-8 decoration-2 hover:decoration-black/10 transition-all">
                    Return to Login
                  </Link>
                </div>
              </div>
           </div>
        </section>
      </main>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
           <div className="relative bg-white w-full max-w-sm rounded-[40px] p-12 border-2 border-black shadow-[20px_20px_0_rgba(0,0,0,1)] text-center animate-in zoom-in-95 duration-300">
              <div className="w-20 h-20 bg-black rounded-3xl rotate-[-5deg] flex items-center justify-center text-white mx-auto mb-8 shadow-[8px_8px_0_rgba(0,0,0,0.1)]">
                 <span className="material-symbols-outlined text-4xl">verified_user</span>
              </div>
              <h3 className="text-4xl font-[1000] italic tracking-tighter mb-4 text-black text-center">Account <br/>Created!</h3>
              <p className="text-sm font-black text-black/40 mb-10 tracking-tight leading-relaxed mx-auto max-w-[200px]">
                Your profile is ready. You can now log in to your dashboard.
              </p>
              <button 
                onClick={() => navigate('/login')}
                className="w-full py-5 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/20 group"
              >
                Go to Login <span className="ml-2 group-hover:ml-4 transition-all">→</span>
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default RegisterPage;
