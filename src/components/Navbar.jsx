import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun, Menu, X, Landmark, Map, Languages, User, LogOut, UserCircle, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { lang, t, toggleLanguage } = useLanguage();
  const { user, isUserAuthenticated, userLogout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const MotionDiv = motion.div;
  const MotionAside = motion.aside;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: t('home'), id:'home', href: '#home' },
    { name: t('about'), id:'about', href: '#what-is-museum' },
    { name: t('types'), id:'types', href: '#types' },
    { name: t('benefits'), id:'benefits', href: '#benefits' },
    { name: t('featured'), id:'featured', href: '#featured' },
    { name: t('faq'), id:'faq', href: '#faq' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-2 sm:px-3 lg:px-4">
      <MotionDiv
        initial={false}
        animate={{ y: isScrolled ? 10 : 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className={`relative mx-auto transition-all duration-500 ${isScrolled
            ? 'w-full max-w-7xl rounded-[2rem] bg-white/75 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-700/60 shadow-[0_20px_50px_rgba(15,23,42,0.18)] dark:shadow-[0_20px_60px_rgba(2,6,23,0.65)]'
            : 'w-full max-w-none rounded-none bg-transparent border border-transparent shadow-none'
          }`}
      >
        <div className={`px-4 sm:px-6 lg:px-8 transition-all duration-500 ${isScrolled ? 'py-3' : 'py-5'}`}>
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 cursor-pointer">
              <div className="bg-emerald-100 dark:bg-emerald-900/50 p-2 rounded-xl text-emerald-600 dark:text-emerald-400">
                <Landmark size={24} />
              </div>
              <span className="font-bold text-xl tracking-tight hidden sm:block">
                Museum<span className="text-emerald-600 dark:text-emerald-400">Nesia</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={isLandingPage ? link.href : `/${link.href}`}
                  className="text-sm font-medium text-slate-600 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400 px-3 py-2 rounded-lg transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={toggleLanguage}
                className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300"
                aria-label="Toggle language"
              >
                <Languages size={18} />
                <span className="text-xs font-bold uppercase">{lang}</span>
              </button>
              <button
                onClick={toggleTheme}
                className="hidden md:flex p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <Link
                to="/map"
                className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-indigo-500 hover:from-emerald-600 hover:to-indigo-600 text-white text-sm font-medium shadow-lg shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40 hover:-translate-y-0.5"
              >
                <Map size={16} />
                {t('explore_map')}
              </Link>

              {/* User Account */}
              <div className="hidden md:flex items-center gap-2 border-l border-slate-200 dark:border-slate-700 pl-4 ml-1">
                {isUserAuthenticated ? (
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-bold text-slate-800 dark:text-white line-clamp-1 max-w-[100px]">{user?.name}</span>
                      <button 
                        onClick={userLogout}
                        className="text-[10px] font-bold text-red-500 hover:text-red-600 uppercase tracking-tighter"
                      >
                        {t('logout')}
                      </button>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <User size={18} />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link 
                      to="/login"
                      className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-500 transition-colors uppercase tracking-wider"
                    >
                      {t('login')}
                    </Link>
                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                    <Link 
                      to="/register"
                      className="text-xs font-bold text-emerald-500 hover:text-emerald-600 transition-colors uppercase tracking-wider"
                    >
                      {t('register')}
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 text-slate-600 dark:text-slate-300"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <MotionDiv
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 z-[70] bg-slate-950/45 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <MotionAside
                initial={{ x: -320 }}
                animate={{ x: 0 }}
                exit={{ x: -340 }}
                transition={{ type: 'spring', stiffness: 280, damping: 30 }}
                className="h-full w-[84%] max-w-xs bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-4 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-base font-semibold text-slate-800 dark:text-white">Menu</span>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-lg text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    aria-label="Close menu"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="px-4 py-4 space-y-2 flex-1 overflow-y-auto">
                  {navLinks.map((link) => (
                    <a
                      key={link.id}
                      href={isLandingPage ? link.href : `/${link.href}`}
                      className="block px-4 py-3 text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.name}
                    </a>
                  ))}
                </div>

                <div className="px-4 py-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex gap-2">
                    <button
                      onClick={toggleLanguage}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium transition-colors"
                    >
                      <Languages size={18} />
                      {lang === 'id' ? 'Indonesia' : 'English'}
                    </button>
                    <button
                      onClick={toggleTheme}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium transition-colors"
                    >
                      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                  </div>
                  <Link
                    to="/map"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-indigo-500 text-white font-medium shadow-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Map size={16} />
                    {t('explore_map')}
                  </Link>

                  {/* Mobile User Section */}
                  <div className="pt-2">
                    {isUserAuthenticated ? (
                      <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <UserCircle size={24} />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-800 dark:text-white">{user?.name}</span>
                            <span className="text-xs text-slate-500">{user?.email}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => { userLogout(); setIsMobileMenuOpen(false); }}
                          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 text-red-600 text-sm font-bold hover:bg-red-100 transition-colors"
                        >
                          <LogOut size={16} />
                          {t('logout')}
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <Link
                          to="/login"
                          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold text-sm"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <LogIn size={16} />
                          {t('login')}
                        </Link>
                        <Link
                          to="/register"
                          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 text-white font-bold text-sm"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <UserCircle size={16} />
                          {t('register')}
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </MotionAside>
            </MotionDiv>
          )}
        </AnimatePresence>
      </MotionDiv>
    </nav>
  );
};

export default Navbar;
