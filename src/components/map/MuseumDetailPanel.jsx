import React, { useState, useEffect, useCallback } from 'react';
import {
  X, MapPin, Building2, Tag, Globe,
  Star, MessageCircle, Image, ThumbsUp, ThumbsDown,
  Send, Camera, Loader2, Navigation, LogIn, Lock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import {
  getMuseumInteractions, postMuseumReview, reactToInteraction,
  postMuseumPhoto
} from '../../api/museumApi';

const MuseumDetailPanel = ({ museum, onClose }) => {
  const { t } = useLanguage();
  const { isUserAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('summary'); // 'summary', 'review', 'photo'
  const [interactions, setInteractions] = useState([]);
  const [loadingContent, setLoadingContent] = useState(false);

  // Review form state
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  // Photo upload state
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const fetchInteractions = useCallback(async () => {
    if (!museum) return;
    setLoadingContent(true);
    try {
      const res = await getMuseumInteractions(museum.id);
      setInteractions(res.data || []);
    } catch (err) {
      console.error("Gagal memuat interaksi:", err);
    } finally {
      setLoadingContent(false);
    }
  }, [museum]);

  useEffect(() => {
    fetchInteractions();
  }, [fetchInteractions]);

  const reviews = interactions.filter(i => i.type === 'REVIEW');
  const photos = interactions.filter(i => i.type === 'PHOTO');

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.comment) return;

    setSubmittingReview(true);
    try {
      await postMuseumReview({ ...newReview, museum_id: museum.id });
      setNewReview({ rating: 5, comment: '' });
      fetchInteractions();
    } catch (err) {
      alert("Gagal mengirim ulasan. Pastikan Anda sudah login.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleReaction = async (id, type) => {
    try {
      await reactToInteraction(id, type);
      fetchInteractions();
    } catch (err) {
      console.error("Gagal bereaksi:", err);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);
    formData.append('museum_id', museum.id);

    setUploadingPhoto(true);
    try {
      await postMuseumPhoto(formData);
      fetchInteractions();
    } catch (err) {
      alert("Gagal mengunggah foto");
    } finally {
      setUploadingPhoto(false);
    }
  };

  if (!museum) return null;

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900 shadow-2xl overflow-y-auto overflow-x-hidden border-l border-slate-200 dark:border-slate-800 scrollbar-thin">
      {/* Search Header Style */}
      <div className="relative h-48 sm:h-56 shrink-0 bg-slate-200 dark:bg-slate-800 overflow-hidden">
        {photos && photos.length > 0 ? (
          <img
            src={`http://localhost:5000${photos[0].photo_url}`}
            className="w-full h-full object-cover"
            alt={museum.nama_museum}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
            <Image size={48} strokeWidth={1} />
            <p className="text-xs mt-2">{t('no_photo')}</p>
          </div>
        )}

        {/* Floating Controls */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
          <div className="flex-1 bg-white dark:bg-slate-900 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 px-4 py-2.5 flex items-center gap-2">
            <span className="font-semibold text-sm truncate text-slate-800 dark:text-white flex-1">{museum.nama_museum}</span>
            <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <X size={18} className="text-slate-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Info Content */}
      <div className="flex-none flex flex-col">
        <div className="px-5 pt-5 pb-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
            {museum.nama_museum}
          </h2>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <span>{reviews.length > 0 ? (reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(1) : '5.0'}</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill={i <= 4 ? "currentColor" : "none"} />)}
              </div>
              <span className="text-slate-400 font-normal text-sm">({reviews.length})</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
              <Tag size={12} className="text-emerald-500" />
              {t(museum.nama_kategori || 'Museum')}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="sticky top-0 z-20 bg-white dark:bg-slate-900 flex border-b border-slate-200 dark:border-slate-800 px-5 translate-y-[-1px]">
          {['summary', 'review', 'photo'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-1 mr-6 text-sm font-semibold capitalize relative transition-colors ${activeTab === tab ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                }`}
            >
              {t(tab)}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content Area */}
        <div className="px-5 py-6">
          {activeTab === 'summary' && (
            <div className="space-y-6">
              <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 italic mb-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase">{t('description')}</h4>
                {museum.deskripsi ? museum.deskripsi : t('no_description')}
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-emerald-50 dark:bg-emerald-900/10 p-3 rounded-xl border border-emerald-100 dark:border-emerald-800/50">
                  <h4 className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase mb-1">{t('ticket_price')}</h4>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{museum.harga_tiket || t('not_available')}</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-xl border border-blue-100 dark:border-blue-800/50">
                  <h4 className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase mb-1">{t('management')}</h4>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{museum.kepengurusan || t('not_available')}</p>
                </div>
              </div>

              {/* Website Link */}
              {museum.website_url && (
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50 mb-4 group hover:border-emerald-500/50 transition-colors">
                  <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500">
                    <Globe size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase">{t('official_website')}</h4>
                    <a
                      href={museum.website_url.startsWith('http') ? museum.website_url : `https://${museum.website_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline truncate block"
                    >
                      {t('visit_website')}
                    </a>
                  </div>
                </div>
              )}
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-500 shrink-0 h-fit">
                    <Globe size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase">{t('province')}</h4>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{museum.nama_provinsi || '-'}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 shrink-0 h-fit">
                    <Building2 size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase">{t('regency')}</h4>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{museum.nama_kabupaten || '-'}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 shrink-0 h-fit">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase">{t('coordinate')}</h4>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{museum.latitude}, {museum.longitude}</p>
                  </div>
                </div>
              </div>

              {/* Google Maps Button */}
              <a
                href={`https://www.google.com/maps?q=${museum.latitude},${museum.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm transition-all border border-slate-200 dark:border-slate-700"
              >
                <Navigation size={18} className="text-blue-500" />
                {t('get_route')}
              </a>
            </div>
          )}

          {activeTab === 'review' && (
            <div className="space-y-6">
              {/* Add Review Form */}
              {isUserAuthenticated ? (
                <form onSubmit={handleReviewSubmit} className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white">{t('share_your_experience')}</h4>
                  <div className="flex items-center gap-2 mb-2">
                    {[1, 2, 3, 4, 5].map(num => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setNewReview({ ...newReview, rating: num })}
                        className={`transition-all ${newReview.rating >= num ? 'text-amber-500 scale-110' : 'text-slate-300'}`}
                      >
                        <Star size={20} fill={newReview.rating >= num ? "currentColor" : "none"} />
                      </button>
                    ))}
                  </div>
                  <textarea
                    placeholder={t('tell_us_about_your_visit')}
                    value={newReview.comment}
                    onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm h-28 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                  />
                  <button
                    disabled={submittingReview}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                  >
                    {submittingReview ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    {t('submit_review')}
                  </button>
                </form>
              ) : (
                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 text-center">
                  <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4 text-slate-500 dark:text-slate-400">
                    <Lock size={20} />
                  </div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-4">{t('must_login_review')}</p>
                  <Link 
                    to="/login"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
                  >
                    <LogIn size={16} />
                    {t('login')}
                  </Link>
                </div>
              )}

              {/* Interaction List (Specificly Reviews) */}
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <MessageCircle size={32} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">{t('no_review_yet')}</p>
                  </div>
                ) : (
                  reviews.map((rev) => (
                    <div key={rev.id} className="border-b border-slate-100 dark:border-slate-800 pb-4">
                      <div className="flex justify-between items-start mb-1.5">
                        <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{rev.user_name}</span>
                        <div className="flex items-center gap-0.5 text-amber-500">
                          {[1, 2, 3, 4, 5].map(i => <Star key={i} size={10} fill={i <= rev.rating ? "currentColor" : "none"} />)}
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-2.5">{rev.comment}</p>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleReaction(rev.id, 'like')}
                          className="flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-emerald-500"
                        >
                          <ThumbsUp size={14} /> {rev.likes || 0}
                        </button>
                        <button
                          onClick={() => handleReaction(rev.id, 'dislike')}
                          className="flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-rose-500"
                        >
                          <ThumbsDown size={14} /> {rev.dislikes || 0}
                        </button>
                        <span className="text-[10px] text-slate-400 ml-auto">{new Date(rev.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'photo' && (
            <div className="space-y-6">
              {/* Photo Upload Section */}
              <div className="flex flex-col gap-3">
                {isUserAuthenticated ? (
                  <label className="flex-1 cursor-pointer group">
                    <div className="h-28 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center text-slate-400 group-hover:border-emerald-500 group-hover:text-emerald-500 transition-all bg-slate-50 dark:bg-slate-800/30">
                      {uploadingPhoto ? (
                        <Loader2 size={24} className="animate-spin" />
                      ) : (
                        <>
                          <Camera size={24} />
                          <span className="text-[11px] font-bold mt-1 uppercase tracking-wider">{t('upload_photo')}</span>
                        </>
                      )}
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} disabled={uploadingPhoto} />
                  </label>
                ) : (
                  <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 text-center">
                    <Camera size={24} className="mx-auto mb-2 text-slate-400 opacity-50" />
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-3">{t('must_login_photo')}</p>
                    <Link 
                      to="/login"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-500 hover:underline"
                    >
                      <LogIn size={14} />
                      {t('login')}
                    </Link>
                  </div>
                )}
              </div>

              {/* Photo Grid */}
              <div className="grid grid-cols-2 gap-3">
                {photos.length === 0 ? (
                  <div className="col-span-2 text-center py-8 text-slate-400">
                    <Image size={32} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">{t('no_photo_yet')}</p>
                  </div>
                ) : (
                  photos.map((p) => (
                    <div key={p.id} className="aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-800 group relative">
                      <img
                        src={`http://localhost:5000${p.photo_url}`}
                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                        alt={t('museum_visit')}
                      />
                      <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-2 text-white">
                          <button onClick={() => handleReaction(p.id, 'like')} className="text-[10px] flex items-center gap-1 hover:text-emerald-400"><ThumbsUp size={12} /> {p.likes}</button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MuseumDetailPanel;
