"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Utility component for the subtle grid background effect
const GridBackground = () => (
  <div className="absolute inset-0 z-0 opacity-10">
    {/* Simple animated radial gradient for the center glow */}
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="animate-pulse bg-linear-to-r from-blue-900/50 to-purple-900/50 blur-3xl rounded-full w-[50vh] h-[50vh] transition-all duration-1000"></div>
    </div>
    
    {/* Simple dot grid pattern */}
    <div className="w-full h-full bg-gray-950 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] bg-size-[20px_20px]"></div>
  </div>
);

// Gradient Button Component (A common pattern in both libraries)
const GradientButton = ({ children, onClick }: { children: React.ReactNode, onClick: () => void }) => (
  <button
    onClick={onClick}
    className="relative inline-flex h-12 overflow-hidden rounded-lg p-px focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
  >
    <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
    <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-gray-950 px-6 py-1 text-sm font-medium text-white backdrop-blur-3xl transition-all duration-300 hover:bg-gray-800/80">
      {children}
    </span>
  </button>
);



const App = () => {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="relative min-h-screen bg-gray-950 text-gray-200 flex items-center justify-center p-4 overflow-hidden font-inter">
      {/* Background Effect */}
      <GridBackground />

      {/* Content Container (z-index 10 to place it over the background) */}
      <div className="relative z-10 max-w-xl w-full text-center p-8 rounded-xl backdrop-blur-sm bg-gray-900/60 border border-gray-800 shadow-2xl">
        
        <h1 
          className="text-8xl sm:text-9xl font-extrabold mb-4 
                     bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-indigo-600 
                     tracking-tight transition-all duration-500 ease-in-out hover:scale-[1.02]"
        >
          404
        </h1>

        {/* Status Message */}
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          Page Not Found
        </h2>

        {/* Detailed Description */}
        <p className="text-gray-400 mb-8 max-w-sm mx-auto">
          Oops! The requested page has gone on a little adventure. It might have been moved, deleted, or never existed in the first place.
        </p>

        {/* Action Button */}
        <GradientButton onClick={handleGoHome}>
          Take Me Back Home
        </GradientButton>
      </div>
    </div>
  );
};

export default App;
