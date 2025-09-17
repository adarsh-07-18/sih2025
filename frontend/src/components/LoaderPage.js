import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Heart } from 'lucide-react';

const LoaderPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center space-y-6">
        {/* Logo */}
        <div className="relative">
          <div className="bg-white rounded-full p-6 shadow-xl border-2 border-teal-100">
            <Heart className="w-16 h-16 text-teal-600 animate-pulse" />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full animate-ping"></div>
        </div>
        
        {/* App Name */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 tracking-wide">
            {t('app_name')}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-emerald-500 mx-auto rounded-full"></div>
        </div>
        
        {/* Loading Indicator */}
        <div className="flex flex-col items-center space-y-4 mt-8">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-teal-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-3 h-3 bg-teal-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-3 h-3 bg-teal-500 rounded-full animate-bounce"></div>
          </div>
          <p className="text-gray-600 text-lg font-medium">{t('loading')}</p>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-teal-100 rounded-full opacity-50 animate-pulse"></div>
      <div className="absolute bottom-20 right-16 w-16 h-16 bg-emerald-100 rounded-full opacity-40 animate-pulse [animation-delay:-1s]"></div>
      <div className="absolute top-1/3 right-10 w-12 h-12 bg-teal-200 rounded-full opacity-30 animate-pulse [animation-delay:-2s]"></div>
    </div>
  );
};

export default LoaderPage;