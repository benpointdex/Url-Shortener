import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import api from '../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const DashboardPage: React.FC = () => {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({ totalLinks: 0, totalClicks: 0 });
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const urlsRes = await api.get('/urls/myurls');
      const totalLinks = urlsRes.data.length;

      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 7);

      const statsRes = await api.get('/urls/totalClicks', {
        params: {
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0]
        }
      });

      const clickCounts: Record<string, number> = statsRes.data;
      const totalClicks = Object.values(clickCounts).reduce((a, b) => a + Number(b), 0);

      const labels = Object.keys(clickCounts).sort();
      const dataValues = labels.map(label => clickCounts[label]);

      setStats({ totalLinks, totalClicks });
      setChartData({
        labels,
        datasets: [
          {
            fill: true,
            label: 'Clicks',
            data: dataValues,
            borderColor: '#000',
            backgroundColor: 'rgba(0, 0, 0, 0.03)',
            borderWidth: 3,
            pointBackgroundColor: '#fff',
            pointBorderColor: '#000',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: 0.4,
          },
        ],
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    try {
      const normalizedUrl = url.includes('://') ? url : `https://${url}`;
      const response = await api.post('/urls/shorten', { originalUrl: normalizedUrl });
      setShortUrl(response.data.shortUrl);
      setUrl('');
      fetchDashboardData();
    } catch (err) {
      console.error('Error creating link:', err);
    }
  };

  const copyToClipboard = () => {
    const redirBase = import.meta.env.VITE_REDIR_BASE_URL || window.location.origin;
    navigator.clipboard.writeText(`${redirBase}/${shortUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-6xl font-[1000] italic tracking-tight mb-2">Dashboard</h1>
        <p className="text-black/40 font-black uppercase text-[10px] tracking-widest px-1">Overview of your links and activity</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        {/* Create Link Input area (Main Feature) */}
        <div className="lg:col-span-8 bg-black text-white p-8 lg:p-10 rounded-[32px] border-2 border-black shadow-[12px_12px_0_rgba(0,0,0,0.1)] relative overflow-hidden group flex flex-col justify-center min-h-[300px]">
          <h2 className="text-3xl font-[1000] italic tracking-tight mb-8">Create Short Link</h2>
          <form onSubmit={handleCreate} className="space-y-4 max-w-2xl">
            <div className="flex flex-col md:flex-row gap-4">
              <input 
                type="text" 
                placeholder="Enter URL (https://...)" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 bg-white/10 px-8 py-5 rounded-2xl border-none outline-none font-black text-sm tracking-tight placeholder:text-white/20 focus:bg-white/20 transition-all border-2 border-transparent focus:border-white/10"
                required
              />
              <button 
                type="submit"
                className="bg-white text-black px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10 whitespace-nowrap"
              >
                Create Link
              </button>
            </div>
          </form>

          {shortUrl && (
            <div className="mt-8 flex items-center justify-between bg-white text-black p-5 px-8 rounded-2xl animate-in zoom-in-95 duration-300 max-w-sm border-2 border-black shadow-[4px_4px_0_rgba(0,0,0,1)]">
               <div className="flex flex-col">
                 <p className="text-[9px] font-black uppercase tracking-widest text-black/40 mb-1">Your Shortened Link</p>
                 <p className="font-black text-lg lowercase tracking-tighter truncate">
                   {(import.meta.env.VITE_REDIR_BASE_URL || window.location.origin).replace('https://', '')}/{shortUrl}
                 </p>
               </div>
               <button onClick={copyToClipboard} className="text-black/20 hover:text-black transition-colors relative ml-4 px-4 py-3 bg-black/5 rounded-xl">
                 <span className="material-symbols-outlined text-xl">{copied ? 'done' : 'content_copy'}</span>
                 {copied && (
                   <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-bottom-2">
                     Copied
                   </span>
                 )}
               </button>
            </div>
          )}
        </div>

        {/* Stats Column */}
        <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
          {/* Total Links Card */}
          <div className="bg-white p-8 rounded-[32px] border-2 border-black shadow-[12px_12px_0_rgba(0,0,0,1)] transition-transform hover:-translate-x-1 hover:-translate-y-1 flex flex-col justify-between">
            <p className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-3">Total Links</p>
            <div className="flex items-end justify-between">
              <h2 className="text-5xl font-[1000] italic tracking-tighter">{loading ? '...' : stats.totalLinks}</h2>
              <div className="flex items-center gap-1 text-[10px] font-black text-black/20 uppercase tracking-widest mb-1">
                Growth <span className="text-black italic">Active</span>
              </div>
            </div>
          </div>

          {/* Total Clicks Card */}
          <div className="bg-white p-8 rounded-[32px] border-2 border-black shadow-[12px_12px_0_rgba(0,0,0,1)] transition-transform hover:-translate-x-1 hover:-translate-y-1 flex flex-col justify-between">
            <p className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-3">Total Clicks</p>
            <div className="flex items-end justify-between">
              <h2 className="text-5xl font-[1000] italic tracking-tighter">{loading ? '...' : stats.totalClicks}</h2>
              <div className="flex items-center gap-1 text-[10px] font-black text-black/20 uppercase tracking-widest mb-1">
                +8% this week
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chart Card */}
      <div className="bg-white p-8 lg:p-12 rounded-[32px] border-2 border-black shadow-[16px_16px_0_rgba(0,0,0,1)]">
        <h2 className="text-2xl font-[1000] italic tracking-tight mb-8">Clicks (Last 7 days)</h2>
        <div className="h-[350px] w-full">
           {loading ? (
             <div className="h-full w-full bg-[#f9f9f9] rounded-[30px] animate-pulse flex items-center justify-center text-[10px] font-black uppercase tracking-widest opacity-10">
               Syncing.
             </div>
           ) : chartData && (
             <Line
               data={chartData}
               options={{
                 responsive: true,
                 maintainAspectRatio: false,
                 plugins: {
                   legend: { display: false },
                   tooltip: {
                     backgroundColor: '#000',
                     titleFont: { family: 'Inter', weight: 900, size: 12 },
                     bodyFont: { family: 'Inter', weight: 900, size: 12 },
                     padding: 12,
                     cornerRadius: 12,
                     displayColors: false,
                   },
                 },
                 scales: {
                   x: {
                     grid: { display: false },
                     ticks: { font: { family: 'Inter', weight: 900, size: 10 }, color: '#aaa' },
                   },
                   y: {
                     beginAtZero: true,
                     grid: { color: 'rgba(0,0,0,0.03)' },
                     ticks: { font: { family: 'Inter', weight: 900, size: 10 }, color: '#aaa' },
                   },
                 },
               }}
             />
           )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
