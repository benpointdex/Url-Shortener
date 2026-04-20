import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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

const AnalyticsPage: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialShortUrl = searchParams.get('shortUrl') || '';

  const [urls, setUrls] = useState<any[]>([]);
  const [selectedUrl, setSelectedUrl] = useState(initialShortUrl);
  const [startDate, setStartDate] = useState(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [chartData, setChartData] = useState<any>(null);
  const [recentClicks, setRecentClicks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUrls();
  }, []);

  useEffect(() => {
    if (selectedUrl) {
      fetchAnalytics();
    }
  }, [selectedUrl, startDate, endDate]);

  const fetchUrls = async () => {
    try {
      const response = await api.get('/urls/myurls');
      setUrls(response.data);
      if (!selectedUrl && response.data.length > 0) {
        setSelectedUrl(response.data[0].shortUrl);
      }
    } catch (err) {
      console.error('Error fetching URLs:', err);
    }
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const statsRes = await api.get(`/urls/analytics/${selectedUrl}`, {
        params: { startDate, endDate }
      });
      
      const clickCounts: Record<string, number> = statsRes.data;
      const labels = Object.keys(clickCounts).sort();
      const dataValues = labels.map(label => clickCounts[label]);

      setChartData({
        labels,
        datasets: [
          {
            fill: true,
            label: 'Clicks',
            data: dataValues,
            borderColor: '#000',
            backgroundColor: 'rgba(0,0,0,0.03)',
            borderWidth: 3,
            pointBackgroundColor: '#fff',
            pointBorderColor: '#000',
            pointBorderWidth: 2,
            pointRadius: 4,
            tension: 0.4,
          },
        ],
      });

      const recentRes = await api.get(`/urls/recentClicks/${selectedUrl}`);
      setRecentClicks(recentRes.data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-14">
        <h1 className="text-6xl font-[1000] italic tracking-tight mb-2">Analytics</h1>
        <p className="text-black/40 font-black uppercase text-[10px] tracking-widest px-1">Track link performance</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        <section className="flex-1 space-y-10">
          {/* Filters Bar with thick border */}
          <div className="p-8 lg:p-10 bg-white rounded-[40px] border-2 border-black shadow-[12px_12px_0_rgba(0,0,0,1)] flex flex-wrap items-end gap-x-8 gap-y-6">
            <div className="flex-1 min-w-[240px] space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black/30 px-2 leading-none">Select Link</label>
              <select 
                value={selectedUrl}
                onChange={(e) => setSelectedUrl(e.target.value)}
                className="w-full px-7 py-5 rounded-[20px] bg-[#f9f9f9] border border-black/5 outline-none font-black text-xs tracking-tight transition-all focus:border-black/20"
              >
                {urls.map((url) => (
                  <option key={url.id} value={url.shortUrl}>{url.shortUrl}</option>
                ))}
              </select>
            </div>
            
            <div className="flex-1 min-w-[150px] space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black/30 px-2 leading-none">Start Date</label>
              <input 
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-7 py-5 rounded-[20px] bg-[#f9f9f9] border border-black/5 outline-none font-black text-xs tracking-tight transition-all focus:border-black/20"
              />
            </div>

            <div className="flex-1 min-w-[150px] space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black/30 px-2 leading-none">End Date</label>
              <input 
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-7 py-5 rounded-[20px] bg-[#f9f9f9] border border-black/5 outline-none font-black text-xs tracking-tight transition-all focus:border-black/20"
              />
            </div>
          </div>

          {/* Main Chart Card with thick border */}
          <div className="bg-white p-10 lg:p-14 rounded-[50px] border-2 border-black shadow-[16px_16px_0_rgba(0,0,0,1)]">
             <h2 className="text-2xl font-[1000] italic tracking-tight mb-12">Clicks Over Time</h2>
             <div className="h-[430px] w-full">
                {loading ? (
                   <div className="h-full w-full bg-[#f9f9f9] rounded-[30px] animate-pulse flex items-center justify-center text-[10px] font-black uppercase tracking-[0.2em] opacity-10">
                    Loading Lattice...
                   </div>
                ) : chartData && (
                  <Line 
                    data={chartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                        tooltip: { backgroundColor: '#000', titleFont: { family: 'Inter', weight: 900 }, bodyFont: { family: 'Inter', weight: 900 }, padding: 12, cornerRadius: 12, displayColors: false },
                      },
                      scales: {
                        x: { grid: { display: false }, ticks: { font: { family: 'Inter', weight: 900, size: 10 }, color: '#aaa' } },
                        y: { 
                          beginAtZero: true,
                          grid: { color: 'rgba(0,0,0,0.03)' }, 
                          ticks: { font: { family: 'Inter', weight: 900, size: 10 }, color: '#aaa' } 
                        },
                      }
                    }}
                  />
                )}
             </div>
          </div>
        </section>

        {/* Sidebar: Recent Clicks with thick border */}
        <aside className="w-full lg:w-[420px] space-y-8">
           <div className="bg-white p-12 rounded-[50px] border-2 border-black shadow-[16px_16px_0_rgba(0,0,0,1)] min-h-[600px] flex flex-col">
              <h2 className="text-2xl font-[1000] italic tracking-tight mb-12">Recent Clicks</h2>
              
              <div className="space-y-4 flex-1">
                 {recentClicks.length > 0 ? (
                   recentClicks.map((click, i) => (
                     <div key={i} className="p-7 bg-[#f9f9f9] rounded-[30px] border-2 border-transparent hover:border-black transition-all group hover:bg-white hover:-translate-x-1 hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-3">
                           <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
                             {new Date(click.clickDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                           </span>
                           <span className="material-symbols-outlined text-sm opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all font-black">{click.device === 'Mobile' ? 'smartphone' : 'desktop_windows'}</span>
                        </div>
                        <p className="text-[14px] font-[1000] tracking-tighter mb-1 truncate">{click.location || 'Anonymous Context'}</p>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 group-hover:opacity-100 transition-all italic">
                          {click.os} · {click.browser}
                        </p>
                     </div>
                   ))
                 ) : (
                   <div className="flex-1 flex flex-col items-center justify-center opacity-10">
                      <span className="material-symbols-outlined text-4xl mb-6 font-black">analytics</span>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em]">Zero Events</p>
                   </div>
                 )}
              </div>
           </div>
        </aside>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;
