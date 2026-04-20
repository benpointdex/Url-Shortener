import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import api from '../services/api';

const MyUrlsPage: React.FC = () => {
  const [urls, setUrls] = useState<any[]>([]);
  const [filteredUrls, setFilteredUrls] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [urlToDelete, setUrlToDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    setLoading(true);
    try {
      const response = await api.get('/urls/myurls');
      setUrls(response.data);
      setFilteredUrls(response.data);
    } catch (err) {
      console.error('Error fetching URLs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const results = urls.filter(url =>
      url.originalUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
      url.shortUrl.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUrls(results);
  }, [searchTerm, urls]);

  const copyToClipboard = (shortUrl: string, id: string) => {
    const redirBase = import.meta.env.VITE_REDIR_BASE_URL || window.location.host;
    navigator.clipboard.writeText(`${redirBase}/${shortUrl}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const deleteUrl = async (id: number) => {
    try {
      await api.delete(`/urls/${id}`);
      setUrlToDelete(null);
      fetchUrls();
    } catch (err) {
      console.error('Error deleting URL:', err);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-6xl font-[1000] italic tracking-tight mb-2">My Links</h1>
          <p className="text-black/40 font-black uppercase text-[10px] tracking-widest px-1">All your shortened URLs</p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80 group">
             <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-black/20 text-lg group-hover:text-black transition-colors">search</span>
             <input 
              type="text" 
              placeholder="Search links" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white px-16 py-5 rounded-[24px] border-2 border-black outline-none font-black text-[13px] tracking-tight placeholder:text-black/10 shadow-[8px_8px_0_rgba(0,0,0,1)] hover:shadow-none transition-all"
             />
          </div>
          <button className="bg-white px-8 py-5 rounded-[24px] border-2 border-black font-black uppercase tracking-widest text-[10px] shadow-[8px_8px_0_rgba(0,0,0,1)] hover:shadow-none transition-all">
            Newest ↓
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border-2 border-black shadow-[16px_16px_0_rgba(0,0,0,1)] overflow-hidden min-h-[500px]">
        {loading ? (
          <div className="p-32 text-center flex flex-col items-center justify-center h-full">
            <div className="w-12 h-12 bg-black border-2 border-black rounded-full animate-pulse mb-6"></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-black/20">Synching Database...</p>
          </div>
        ) : filteredUrls.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-black">
                  <th className="px-8 py-6 text-[11px] font-black uppercase tracking-widest text-black/40">Original URL</th>
                  <th className="px-8 py-6 text-[11px] font-black uppercase tracking-widest text-black/40">Short URL</th>
                  <th className="px-8 py-6 text-[11px] font-black uppercase tracking-widest text-black/40 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUrls.map((url) => (
                  <tr key={url.id} className="border-b border-black/5 hover:bg-black/[0.01] transition-colors group">
                    <td className="px-8 py-6">
                       <p className="text-[13px] font-black tracking-tighter truncate max-w-sm lowercase opacity-40 group-hover:opacity-100 transition-opacity">
                         {url.originalUrl}
                       </p>
                    </td>
                    <td className="px-8 py-6">
                       <p className="text-[14px] font-[1000] tracking-tighter lowercase">
                         {(import.meta.env.VITE_REDIR_BASE_URL || window.location.host).replace('https://', '')}/{url.shortUrl}
                       </p>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <button 
                            onClick={() => copyToClipboard(url.shortUrl, url.id)}
                            className="w-11 h-11 rounded-full border border-black/10 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all relative"
                          >
                             <span className="material-symbols-outlined text-[18px]">{copiedId === url.id ? 'done' : 'content_copy'}</span>
                             {copiedId === url.id && (
                               <span className="absolute -top-10 bg-black text-white text-[9px] font-black uppercase tracking-widest py-1 px-3 rounded-lg animate-in fade-in slide-in-from-bottom-2">
                                 Copied
                               </span>
                             )}
                          </button>
                          <a 
                            href={`${import.meta.env.VITE_REDIR_BASE_URL || window.location.origin}/${url.shortUrl}`} target="_blank" rel="noopener noreferrer"
                            className="w-11 h-11 rounded-full border border-black/10 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all"
                          >
                             <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                          </a>
                          <Link 
                            to={`/analytics?shortUrl=${url.shortUrl}`}
                            className="w-11 h-11 rounded-full border border-black/10 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all"
                          >
                             <span className="material-symbols-outlined text-[18px]">bar_chart</span>
                          </Link>
                          <button 
                            onClick={() => setUrlToDelete(url.id)}
                            className="w-11 h-11 rounded-full border border-black/10 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
                          >
                             <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-32 text-center h-[500px] flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-black border-2 border-black rounded-[24px] rotate-[-5deg] flex items-center justify-center mb-8 shadow-[8px_8px_0_rgba(0,0,0,0.1)]">
               <span className="material-symbols-outlined text-white text-3xl">inbox</span>
            </div>
            <h3 className="text-3xl font-[1000] italic tracking-tighter mb-4">No links detected</h3>
            <p className="text-xs font-black text-black/30 uppercase tracking-[0.2em] mb-12">Initialize your first redirection asset.</p>
            <Link to="/dashboard" className="px-12 py-5 bg-black text-white rounded-[24px] font-black uppercase tracking-widest text-[11px] shadow-[12px_12px_0_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
              Initialize Link
            </Link>
          </div>
        )}
      </div>
      
      {/* Delete Confirmation Modal */}
      {urlToDelete !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setUrlToDelete(null)}></div>
           <div className="relative bg-white w-full max-w-sm rounded-[40px] p-12 border-2 border-black shadow-[20px_20px_0_rgba(0,0,0,1)] text-center animate-in zoom-in-95 duration-300">
              <div className="w-20 h-20 bg-red-500 rounded-3xl rotate-[-5deg] flex items-center justify-center text-white mx-auto mb-8 shadow-[8px_8px_0_rgba(0,0,0,0.1)]">
                 <span className="material-symbols-outlined text-4xl">delete_forever</span>
              </div>
              <h3 className="text-4xl font-[1000] italic tracking-tighter mb-4 text-black text-center">Delete <br/>Link?</h3>
              <p className="text-sm font-black text-black/40 mb-10 tracking-tight leading-relaxed mx-auto max-w-[200px]">
                Are you sure? Once deleted, this link cannot be recovered.
              </p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => deleteUrl(urlToDelete)}
                  className="w-full py-5 bg-red-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-xl shadow-red-500/20"
                >
                  Delete
                </button>
                <button 
                  onClick={() => setUrlToDelete(null)}
                  className="w-full py-5 bg-white text-black/40 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black/5 hover:text-black transition-all"
                >
                  Cancel
                </button>
              </div>
           </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default MyUrlsPage;
