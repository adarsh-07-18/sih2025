import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Heart, Shield, Users, Languages, FileText, Activity, Sparkles, TrendingUp, Award } from 'lucide-react';
import FloatingNotification from './enhanced/FloatingNotification';
import AnimatedCounter from './enhanced/AnimatedCounter';

const LandingPage = () => {
  const navigate = useNavigate();
  const { currentLanguage, changeLanguage, t } = useLanguage();

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' }
  ];

  const features = [
    {
      icon: Languages,
      title: t('feature1_title'),
      description: t('feature1_desc')
    },
    {
      icon: Shield,
      title: t('feature2_title'),
      description: t('feature2_desc')
    },
    {
      icon: Activity,
      title: t('feature3_title'),
      description: t('feature3_desc')
    }
  ];

  const loginTypes = [
    {
      type: 'user',
      title: t('user_login'),
      icon: Users,
      description: 'Access your health records and connect with doctors',
      gradient: 'from-teal-500 to-emerald-500'
    },
    {
      type: 'doctor',
      title: t('doctor_login'),
      icon: FileText,
      description: 'Manage your patients and medical consultations',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      type: 'admin',
      title: t('admin_login'),
      icon: Activity,
      description: 'Monitor system statistics and health trends',
      gradient: 'from-purple-500 to-pink-500'
    }
  ];

  const handleLogin = (type) => {
    navigate(`/login?type=${type}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 relative">
      <FloatingNotification />
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-40 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 hover:text-teal-600 transition-colors duration-300">{t('app_name')}</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <Select value={currentLanguage} onValueChange={changeLanguage}>
              <SelectTrigger className="w-40 hover:bg-gray-50 transition-colors duration-200">
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.nativeName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-teal-100 to-emerald-100 rounded-full p-1 animate-pulse">
              <div className="bg-white rounded-full px-4 py-2 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span className="text-sm font-medium text-teal-700">Trusted by 10,000+ users</span>
              </div>
            </div>
          </div>
          
          <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight animate-in fade-in-0 slide-in-from-bottom-4 duration-1000">
            {t('tagline')}
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed animate-in fade-in-0 slide-in-from-bottom-4 duration-1000 delay-200">
            {t('hero_desc')}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-1000 delay-400">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white px-8 py-4 text-lg font-semibold rounded-full transform transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl"
              onClick={() => navigate('/login')}
            >
              <Heart className="w-5 h-5 mr-2" />
              {t('get_started')}
            </Button>
            
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-4 h-4 text-teal-600" />
                <span><AnimatedCounter end={99} suffix="%" /> Success Rate</span>
              </div>
              <div className="flex items-center space-x-1">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>ISO Certified</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Background decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-teal-100 to-emerald-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-16 w-24 h-24 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-10 w-16 h-16 bg-gradient-to-r from-teal-200 to-emerald-200 rounded-full opacity-25 animate-pulse delay-500"></div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12 animate-in fade-in-0 slide-in-from-bottom-4 duration-1000">
            {t('features_title')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="text-center hover:shadow-xl transition-all duration-500 transform hover:scale-105 border-0 bg-white/80 backdrop-blur-sm group animate-in fade-in-0 slide-in-from-bottom-4 duration-1000"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-gradient-to-r from-teal-100 to-emerald-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg">
                    <feature.icon className="w-8 h-8 text-teal-600 group-hover:text-teal-700 transition-colors duration-300" />
                  </div>
                  <CardTitle className="text-xl text-gray-800 group-hover:text-teal-700 transition-colors duration-300">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-base group-hover:text-gray-700 transition-colors duration-300">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Login Options Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {t('select_login_type')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loginTypes.map((loginType, index) => (
              <Card 
                key={index} 
                className="cursor-pointer hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 border-0 bg-white/90 backdrop-blur-sm overflow-hidden group relative animate-in fade-in-0 slide-in-from-bottom-4 duration-1000"
                style={{ animationDelay: `${index * 150}ms` }}
                onClick={() => handleLogin(loginType.type)}
              >
                <div className={`h-2 bg-gradient-to-r ${loginType.gradient} group-hover:h-3 transition-all duration-300`}></div>
                
                {/* Hover glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${loginType.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                
                <CardHeader className="text-center pb-4 relative z-10">
                  <div className={`mx-auto w-16 h-16 bg-gradient-to-r ${loginType.gradient} rounded-full flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-xl transition-all duration-300 relative`}>
                    <loginType.icon className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
                    
                    {/* Pulse effect */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${loginType.gradient} rounded-full opacity-75 group-hover:animate-ping`}></div>
                  </div>
                  <CardTitle className="text-xl text-gray-800 group-hover:text-gray-900 transition-colors duration-300 font-semibold">
                    {loginType.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center relative z-10">
                  <CardDescription className="text-gray-600 text-base mb-4 group-hover:text-gray-700 transition-colors duration-300">
                    {loginType.description}
                  </CardDescription>
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-gray-50 group-hover:border-gray-300 transition-all duration-200 font-medium"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">
                      {t('login')}
                    </span>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center items-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full p-2">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-lg font-semibold">{t('app_name')}</h4>
          </div>
          <p className="text-gray-400">
            © 2024 Swasth Saathi. Building healthier communities across India.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;