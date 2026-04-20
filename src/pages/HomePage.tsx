import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const [url, setUrl] = useState('');
  const navigate = useNavigate();

  const handleRedirect = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-black antialiased selection:bg-black selection:text-white overflow-x-hidden">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-32 lg:pt-32 lg:pb-48">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24 relative">
          {/* Hero Content */}
          <div className="flex-1 text-left z-10 w-full lg:w-auto">
            <h1 className="text-6xl md:text-8xl lg:text-[120px] font-[1000] leading-[0.8] tracking-[-0.06em] text-black mb-12">
              Shortening <br/>
              <span className="italic">infrastructure</span> <br/>
              <span className="text-transparent drop-shadow-[1px_1px_0_#000] lg:drop-shadow-[2px_2px_0_#000]" style={{ WebkitTextStroke: '1px black' }}>for everyone.</span>
            </h1>

            {/* Custom Input Field - Cal.com style */}
            <div className="max-w-3xl">
              <form onSubmit={handleRedirect} className="flex flex-col md:flex-row items-stretch gap-4">
                <div className="flex-grow flex items-stretch bg-white rounded-[20px] border-2 border-black overflow-hidden shadow-[8px_8px_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                  <div className="bg-[#f0f0f0] px-6 flex items-center border-r-2 border-dashed border-black/20">
                    <span className="text-sm font-black text-black/40 lowercase tracking-tight">
                      {(import.meta.env.VITE_REDIR_BASE_URL || 'shortify.com').replace('https://', '').replace(/\/$/, '')}/
                    </span>
                  </div>
                  <input 
                    type="text" 
                    placeholder="your-long-url-here" 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-grow px-6 py-5 text-lg font-black tracking-tight outline-none placeholder:text-black/10"
                  />
                </div>
                <button 
                  type="submit"
                  className="px-10 py-5 bg-black text-white rounded-[20px] border-2 border-black font-black uppercase tracking-widest text-[11px] shadow-[8px_8px_0_rgba(0,0,0,0.1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all shrink-0"
                >
                  Shorten Link <span className="ml-2">→</span>
                </button>
              </form>
            </div>
          </div>

          {/* Graphics Card Style - Optimised for better visability */}
          <div className="hidden lg:flex relative w-[420px] h-[580px] bg-white rounded-[60px] border border-black/5 shadow-[0_40px_100px_rgba(0,0,0,0.05)] overflow-hidden shrink-0">
            {/* Shortify API Card */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 p-7 bg-[#f9f9f9] rounded-[40px] border border-black/5 w-72 shadow-2xl shadow-black/5 rotate-[-2deg]">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-black text-sm">S</div>
                <div>
                  <p className="text-[11px] font-[900]">Shortify API</p>
                  <p className="text-[9px] font-black text-black/20 uppercase tracking-widest">v4.0 Core</p>
                </div>
              </div>
              <h2 className="text-2xl font-[1000] italic tracking-tight mb-4 leading-none">High Output.</h2>
              <div className="space-y-3">
                 {[1,2].map(i => (
                  <div key={i} className="flex items-center gap-3 py-2 border-t border-black/5">
                    <span className="w-1.5 h-1.5 rounded-full bg-black/10"></span>
                    <span className="flex-1 h-3 bg-black/5 rounded-full"></span>
                  </div>
                 ))}
              </div>
            </div>

            {/* Status Card */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 p-8 bg-white rounded-[40px] border-2 border-black text-black w-80 shadow-2xl shadow-black/20 rotate-[3deg] z-10 transition-all hover:scale-105 active:scale-95 cursor-pointer">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-black/40 mb-2">Systems</p>
              <h2 className="text-3xl font-[1000] italic tracking-tight mb-4 leading-none">99.9% Up</h2>
              <p className="text-[10px] font-bold opacity-30 leading-relaxed">
                Global system is peak efficient. No latency detected.
              </p>
            </div>
            
            {/* Grid Pattern */}
            <div className="absolute inset-0 grid grid-cols-6 grid-rows-10 opacity-[0.03] pointer-events-none">
              {Array.from({ length: 60 }).map((_, i) => (
                <div key={i} className="border-r border-b border-black"></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
