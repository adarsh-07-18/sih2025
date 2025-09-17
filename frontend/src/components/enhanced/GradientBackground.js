import React from 'react';

const GradientBackground = ({ children, variant = 'default' }) => {
  const getGradientClass = () => {
    switch (variant) {
      case 'healthcare':
        return 'bg-gradient-to-br from-teal-50 via-white to-emerald-50';
      case 'doctor':
        return 'bg-gradient-to-br from-blue-50 via-white to-cyan-50';
      case 'admin':
        return 'bg-gradient-to-br from-purple-50 via-white to-pink-50';
      default:
        return 'bg-gradient-to-br from-teal-50 via-white to-emerald-50';
    }
  };

  return (
    <div className={`min-h-screen ${getGradientClass()} relative overflow-hidden`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-teal-100/30 to-emerald-100/30 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-16 w-24 h-24 bg-gradient-to-r from-emerald-100/40 to-teal-100/40 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-1/3 right-10 w-16 h-16 bg-gradient-to-r from-teal-200/25 to-emerald-200/25 rounded-full animate-pulse delay-500"></div>
          <div className="absolute bottom-1/4 left-1/4 w-20 h-20 bg-gradient-to-r from-emerald-200/20 to-teal-200/20 rounded-full animate-pulse delay-2000"></div>
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default GradientBackground;