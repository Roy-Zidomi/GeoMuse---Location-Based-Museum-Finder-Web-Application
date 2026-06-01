import React, { useEffect, useRef } from 'react';

const CubemapViewer = ({ cubeMap }) => {
  const viewerRef = useRef(null);

  useEffect(() => {
    // Load CSS
    if (!document.getElementById('pannellum-css-cdn')) {
      const link = document.createElement('link');
      link.id = 'pannellum-css-cdn';
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css';
      document.head.appendChild(link);
    }
    
    let viewer = null;
    let isMounted = true;

    function initViewer() {
      if (viewerRef.current && window.pannellum && isMounted) {
        viewer = window.pannellum.viewer(viewerRef.current, {
          type: "cubemap",
          cubeMap: cubeMap,
          autoLoad: true,
          showZoomCtrl: true
        });
      }
    }

    // Load JS
    if (!document.getElementById('pannellum-js-cdn')) {
      const script = document.createElement('script');
      script.id = 'pannellum-js-cdn';
      script.src = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js';
      script.async = true;
      script.onload = initViewer;
      document.head.appendChild(script);
    } else {
      if (window.pannellum) {
        initViewer();
      } else {
        document.getElementById('pannellum-js-cdn').addEventListener('load', initViewer);
      }
    }

    return () => {
      isMounted = false;
      if (viewer) {
        viewer.destroy();
      }
      const scriptEl = document.getElementById('pannellum-js-cdn');
      if (scriptEl) {
        scriptEl.removeEventListener('load', initViewer);
      }
    };
  }, [cubeMap]);

  return <div ref={viewerRef} style={{ width: '100%', height: '100%' }} />;
};

export default CubemapViewer;
