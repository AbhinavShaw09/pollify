const MinimalLoader = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <svg className="w-20 h-20" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="loaderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:"#6366f1", stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:"#6366f1", stopOpacity:1}} />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="45" fill="none" stroke="#1f2937" strokeWidth="5" opacity="0.3" />
      <circle
        cx="50" cy="50" r="45" fill="none" stroke="url(#loaderGradient)" strokeWidth="5"
        strokeLinecap="round" strokeDasharray="282.74" className="animate-svg-load"
        style={{ 
          transformOrigin: '50% 50%',
          filter: 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.8))'
        }}
      />
      <style>{`
        @keyframes svg-load {
          0% { stroke-dashoffset: 282.74; transform: rotate(0deg); }
          50% { stroke-dashoffset: 141.37; transform: rotate(360deg); }
          100% { stroke-dashoffset: 282.74; transform: rotate(720deg); }
        }
        .animate-svg-load { animation: svg-load 2s cubic-bezier(0.4, 0.0, 0.2, 1) infinite; }
      `}</style>
    </svg>
  </div>
);

export default MinimalLoader;
