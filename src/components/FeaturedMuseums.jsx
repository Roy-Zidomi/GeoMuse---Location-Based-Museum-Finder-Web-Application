import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import museumNasionalImage from '../assets/museumNasional.jpg';
import museumAngkutImage from '../assets/museumAngkut.jpg';
import museumTsunamiImage from '../assets/museumTsunami.jpg';
import museumUllenSentaluImage from '../assets/museumUllen-Sentalu.jpg';

const FeaturedMuseums = () => {
  const { t } = useLanguage();
  const featured = [
    {
      name: t('fm_1_name'),
      location: t('fm_1_loc'),
      description: t('fm_1_desc'),
      image: museumNasionalImage,
      link: "https://www.museumnasional.or.id/"
    },
    {
      name: t('fm_2_name'),
      location: t('fm_2_loc'),
      description: t('fm_2_desc'),
      image: museumAngkutImage,
      link: "https://jtp.id/museumangkut/"
    },
    {
      name: t('fm_3_name'),
      location: t('fm_3_loc'),
      description: t('fm_3_desc'),
      image: museumTsunamiImage,
      link: "https://museumtsunami.acehprov.go.id/"
    },
    {
      name: t('fm_4_name'),
      location: t('fm_4_loc'),
      description: t('fm_4_desc'),
      image: museumUllenSentaluImage,
      link: "https://www.ullensentalu.com/"
    }
  ];

  return (
    <section id="featured" className="py-24 bg-slate-50 dark:bg-slate-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex justify-between items-end mb-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              {t('featured_title')}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              {t('featured_subtitle')}
            </p>
          </div>
          <Link
            to="/map"
            className="hidden md:flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium hover:scale-105 transition-transform shadow-sm"
          >
            {t('view_map')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((museum, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group cursor-pointer bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 hover-card-effect flex flex-col h-full"
            >
              <div className="relative h-48 overflow-hidden bg-slate-200 dark:bg-slate-800">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${museum.image})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <span className="glass-panel px-3 py-1 rounded-full text-xs font-semibold text-white bg-black/30">
                    {t('must_visit')}
                  </span>
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-start gap-2 mb-3 text-emerald-600 dark:text-emerald-400">
                  <MapPin className="w-4 h-4 mt-1 shrink-0" />
                  <span className="text-sm font-medium">{museum.location}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {museum.name}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 flex-grow">
                  {museum.description}
                </p>
                {museum.link ? (
                  <a
                    href={museum.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-center text-sm font-semibold text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-500 transition-colors"
                  >
                    {t('learn_more')}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                ) : (
                  <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-center text-sm font-semibold text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-500 transition-colors">
                    {t('learn_more')}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <Link
          to="/map"
          className="mt-12 w-full md:hidden flex justify-center items-center gap-2 px-6 py-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium shadow-sm"
        >
          {t('view_map')}
          <ArrowRight className="w-4 h-4" />
        </Link>

      </div>
    </section>
  );
};

export default FeaturedMuseums;
