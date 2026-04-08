import React, { useState, useEffect } from 'react';
import { getAdminInteractions, deleteAdminInteraction } from '../../api/adminApi';
import { Trash2, MessageSquare, Image as ImageIcon, Star, ExternalLink } from 'lucide-react';

const InteractionTable = () => {
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState(''); // 'REVIEW' or 'PHOTO'

  const fetchInteractions = async () => {
    setLoading(true);
    try {
      const res = await getAdminInteractions({ page, limit: 10, type: typeFilter });
      setInteractions(res.data || []);
      setPagination(res.pagination || {});
    } catch (e) {
      console.error('Failed to fetch interactions:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInteractions();
  }, [page, typeFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus interaksi ini?')) return;
    try {
      await deleteAdminInteraction(id);
      fetchInteractions();
    } catch (e) {
      alert('Gagal menghapus interaksi');
    }
  };

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const IMAGE_BASE_URL = API_BASE_URL.replace('/api', '');

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Header & Filter */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Kelola Interaksi</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Moderasi ulasan dan foto dari pengunjung.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <select 
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            <option value="">Semua Tipe</option>
            <option value="REVIEW">Ulasan (Rating)</option>
            <option value="PHOTO">Foto Pengunjung</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-semibold">Museum & Pengguna</th>
              <th className="px-6 py-4 font-semibold">Tipe & Konten</th>
              <th className="px-6 py-4 font-semibold">Waktu</th>
              <th className="px-6 py-4 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan="4" className="px-6 py-4"><div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-lg w-full"></div></td>
                </tr>
              ))
            ) : interactions.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-slate-500 italic">Tidak ada interaksi ditemukan</td>
              </tr>
            ) : (
              interactions.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 dark:text-white text-sm">{item.nama_museum}</span>
                      <span className="text-xs text-slate-500">Oleh: {item.user_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3 items-start">
                      <div className={`p-2 rounded-lg shrink-0 ${item.type === 'REVIEW' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                        {item.type === 'REVIEW' ? <MessageSquare size={16} /> : <ImageIcon size={16} />}
                      </div>
                      <div className="flex flex-col max-w-xs">
                        {item.type === 'REVIEW' && (
                          <div className="flex items-center gap-1 mb-1">
                            {[...Array(5)].map((_, idx) => (
                              <Star key={idx} size={12} className={idx < item.rating ? "fill-amber-400 text-amber-400" : "text-slate-300"} />
                            ))}
                          </div>
                        )}
                        <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">{item.comment}</p>
                        {item.photo_url && (
                          <a 
                            href={`${IMAGE_BASE_URL}${item.photo_url}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="mt-2 text-xs text-emerald-600 flex items-center gap-1 hover:underline"
                          >
                            Lihat Foto Full <ExternalLink size={10} />
                          </a>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {new Date(item.created_at).toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Hapus"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.total_pages > 1 && (
        <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex justify-center gap-2">
          {[...Array(pagination.total_pages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${page === i + 1 ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default InteractionTable;
