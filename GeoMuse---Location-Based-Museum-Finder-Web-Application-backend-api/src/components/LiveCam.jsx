import React from 'react';

const LiveCam = ({ url }) => {
  // Fungsi untuk mengekstrak ID YouTube jika URL adalah link YouTube
  const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYouTubeId(url);

  return (
    <div className="live-cam-container w-full mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-xl bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 relative">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 7l-7 5 7 5V7z" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          Museum Live Cam
          <span className="px-2 py-0.5 rounded text-[10px] bg-red-500 text-white animate-pulse">LIVE</span>
        </h2>
      </div>

      <div className="rounded-3xl overflow-hidden border-2 border-slate-200 dark:border-slate-800 shadow-2xl bg-black aspect-video">
        {url ? (
          videoId ? (
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=0&mute=1`}
              title="Live Stream Museum"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
              <p className="text-sm">Format URL tidak didukung atau sedang offline.</p>
            </div>
          )
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-3 bg-slate-900">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-slate-600 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
            </div>
            <p className="text-sm font-medium">Live Cam Belum Tersedia</p>
          </div>
        )}
      </div>
      {url && (
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 text-center italic">
          *Streaming langsung dari area museum untuk memantau situasi terkini.
        </p>
      )}
    </div>
  );
};

export default LiveCam;
