import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  getPublicStats, 
  getPublicByProvince, 
  getPublicByCategory, 
  getPublicTopRegencies 
} from '../api/museumApi';
import StatCards from './admin/StatCards';
import ChartProvince from './admin/ChartProvince';
import ChartCategory from './admin/ChartCategory';
import ChartTopRegency from './admin/ChartTopRegency';
import { BarChart3, PieChart as PieChartIcon, TrendingUp } from 'lucide-react';

const MuseumStats = () => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [chartProvince, setChartProvince] = useState([]);
  const [chartCategory, setChartCategory] = useState([]);
  const [chartRegency, setChartRegency] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsRes, provRes, catRes, regRes] = await Promise.all([
          getPublicStats(),
          getPublicByProvince(),
          getPublicByCategory(),
          getPublicTopRegencies({ limit: 10 })
        ]);
        
        setStats(statsRes.data || {});
        setChartProvince(provRes.data || []);
        setChartCategory(catRes.data || []);
        setChartRegency(regRes.data || []);
      } catch (error) {
        console.error('Failed to fetch public stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <section id="stats" className="py-24 bg-slate-50 dark:bg-slate-950/50 transition-colors duration-300">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header Section */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="h-0.5 w-12 bg-emerald-500 rounded-full" />
            <span className="text-sm font-bold tracking-[0.2em] text-emerald-600 dark:text-emerald-400 uppercase">
              {t('stats_title')}
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-800 dark:text-white mb-6 leading-tight">
            {t('stats_subtitle')}
          </h2>
        </div>

        {/* Global Stats Cards */}
        <div className="mb-12">
          <StatCards stats={stats} loading={loading} />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-12">
          <div className="group transition-all duration-500">
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                <BarChart3 size={20} />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white">{t('chart_province_title')}</h3>
            </div>
            <ChartProvince data={chartProvince} loading={loading} />
          </div>

          <div className="group transition-all duration-500">
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                <PieChartIcon size={20} />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white">{t('chart_category_title')}</h3>
            </div>
            <ChartCategory data={chartCategory} loading={loading} />
          </div>
        </div>

        {/* Top Regencies Chart - Wide */}
        <div className="group transition-all duration-500">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
              <TrendingUp size={20} />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-white">{t('chart_regency_title')}</h3>
          </div>
          <ChartTopRegency data={chartRegency} loading={loading} />
        </div>
      </div>
    </section>
  );
};

export default MuseumStats;
