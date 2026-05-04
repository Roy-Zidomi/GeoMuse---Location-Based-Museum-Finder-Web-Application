import React from 'react';
import { Pannellum } from 'pannellum-react';

const VirtualTour = ({ imageUrl, title }) => {
  return (
    <div className="virtual-tour-container w-full mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></svg>
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Virtual Tour</h2>
      </div>

      <div className="relative group rounded-3xl overflow-hidden border-2 border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-900 min-h-[300px] flex items-center justify-center">
        {imageUrl ? (
          <Pannellum
            width="100%"
            height="500px"
            image={imageUrl}
            pitch={10}
            yaw={180}
            hfov={110}
            autoLoad
            showZoomCtrl={true}
            showFullscreenCtrl={true}
            mouseZoom={false}
            onLoad={() => console.log("Panorama loaded: " + title)}
          >
            <Pannellum.Hotspot
              type="info"
              pitch={11}
              yaw={-167}
              text="Informasi Koleksi"
            />
          </Pannellum>
        ) : (
          <div className="text-center p-8">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
            </div>
            <p className="text-slate-400 font-medium">Virtual Tour Belum Tersedia</p>
          </div>
        )}

        {imageUrl && (
          <div className="absolute bottom-4 left-4 z-10 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs font-medium border border-white/20">
            Gunakan mouse/sentuh untuk memutar • Scroll untuk zoom
          </div>
        )}
      </div>
    </div>
  );
};

export default VirtualTour;
