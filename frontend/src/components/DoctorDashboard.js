import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Heart, LogOut, Users, FileText, Calendar, Activity, Clock, MapPin, TrendingUp, Award } from 'lucide-react';
import { getSessionData } from '../utils/mock';
import AnimatedCounter from './enhanced/AnimatedCounter';
import LoadingSpinner from './enhanced/LoadingSpinner';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [doctorData, setDoctorData] = useState(null);
  const [sessionData, setSessionData] = useState(null);
  const [todayStats, setTodayStats] = useState({
    patientsToday: 0,
    totalConsultations: 0,
    commonSymptoms: [],
    prescribedMedicines: []
  });

  useEffect(() => {
    // Check doctor session
    const userSession = JSON.parse(localStorage.getItem('userSession') || '{}');
    if (!userSession || userSession.type !== 'doctor') {
      navigate('/login');
      return;
    }

    // Get session data
    const data = getSessionData();
    setSessionData(data);
    
    // Set doctor data
    const doctor = data.doctors.find(d => d.email === userSession.email) || data.doctors[0];
    setDoctorData(doctor);

    // Calculate today's stats
    const today = new Date().toDateString();
    const todayUsers = data.users.filter(user => {
      const userDate = new Date(user.createdAt).toDateString();
      return userDate === today;
    });

    // Extract symptoms and medicines
    const allSymptoms = [];
    const allMedicines = [];
    
    todayUsers.forEach(user => {
      if (user.symptoms) {
        allSymptoms.push(...user.symptoms);
      }
      if (user.prescribedMedicine) {
        allMedicines.push(user.prescribedMedicine);
      }
    });

    // Count occurrences
    const symptomCounts = {};
    const medicineCounts = {};
    
    allSymptoms.forEach(symptom => {
      symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1;
    });
    
    allMedicines.forEach(medicine => {
      medicineCounts[medicine] = (medicineCounts[medicine] || 0) + 1;
    });

    setTodayStats({
      patientsToday: todayUsers.length,
      totalConsultations: data.users.length,
      commonSymptoms: Object.entries(symptomCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([symptom, count]) => ({ symptom, count })),
      prescribedMedicines: Object.entries(medicineCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([medicine, count]) => ({ medicine, count }))
    });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userSession');
    navigate('/home');
  };

  const getPatientsByRegion = () => {
    if (!sessionData) return {};
    
    const regionCounts = {};
    sessionData.users.forEach(user => {
      const region = user.address.split(',').slice(-2)[0]?.trim() || 'Unknown';
      regionCounts[region] = (regionCounts[region] || 0) + 1;
    });
    
    return regionCounts;
  };

  const getDiseaseStats = () => {
    if (!sessionData) return [];
    
    const diseaseCounts = {};
    sessionData.users.forEach(user => {
      if (user.diagnosis) {
        diseaseCounts[user.diagnosis] = (diseaseCounts[user.diagnosis] || 0) + 1;
      }
    });
    
    return Object.entries(diseaseCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([disease, count]) => ({ disease, count }));
  };

  if (!doctorData || !sessionData) {
    return <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
      <LoadingSpinner size="lg" message="Loading doctor dashboard..." />
    </div>;
  }

  const regionData = getPatientsByRegion();
  const diseaseStats = getDiseaseStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full p-2">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">{t('app_name')}</h1>
              <p className="text-sm text-gray-600">Doctor Portal</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('logout')}</span>
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${doctorData.name}&backgroundColor=blue`} />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xl font-bold">
                  {doctorData.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center space-x-3">
                <span>Welcome, {doctorData.name}!</span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  <Award className="w-3 h-3 mr-1" />
                  {doctorData.specialization}
                </Badge>
              </h2>
              
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center space-x-2 bg-white px-3 py-1 rounded-full shadow-sm">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
                
                <div className="flex items-center space-x-2 bg-white px-3 py-1 rounded-full shadow-sm">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span>98% Patient Satisfaction</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                <AnimatedCounter end={todayStats.patientsToday} />
              </div>
              <p className="text-sm text-gray-600">Patients Today</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t('patients_today')}</p>
                  <p className="text-3xl font-bold text-blue-600"><AnimatedCounter end={todayStats.patientsToday} /></p>
                </div>
                <div className="bg-blue-100 rounded-full p-3">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Patients</p>
                  <p className="text-3xl font-bold text-cyan-600"><AnimatedCounter end={sessionData.users.length} /></p>
                </div>
                <div className="bg-cyan-100 rounded-full p-3">
                  <FileText className="w-6 h-6 text-cyan-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Cases</p>
                  <p className="text-3xl font-bold text-green-600"><AnimatedCounter end={diseaseStats.length} /></p>
                </div>
                <div className="bg-green-100 rounded-full p-3">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Age</p>
                  <p className="text-3xl font-bold text-purple-600">
                    <AnimatedCounter end={Math.round(sessionData.users.reduce((sum, u) => sum + parseInt(u.age), 0) / sessionData.users.length)} />
                  </p>
                </div>
                <div className="bg-purple-100 rounded-full p-3">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="patients" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="patients">Today's Patients</TabsTrigger>
            <TabsTrigger value="symptoms">Common Symptoms</TabsTrigger>
            <TabsTrigger value="medicines">Prescribed Medicines</TabsTrigger>
            <TabsTrigger value="regions">Regional Data</TabsTrigger>
          </TabsList>

          {/* Today's Patients */}
          <TabsContent value="patients">
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
              <CardHeader>
                <CardTitle>Today's Patient Consultations</CardTitle>
                <CardDescription>Overview of patients treated today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sessionData.users.map((patient, index) => (
                    <div key={patient.userId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="bg-blue-100 rounded-full p-2">
                          <Users className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{patient.fullName}</h4>
                          <p className="text-sm text-gray-600">{patient.age} years, {patient.gender}</p>
                          <p className="text-xs text-gray-500">{patient.profession}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {patient.diagnosis || 'General Consultation'}
                        </p>
                        <p className="text-xs text-gray-600">
                          {patient.symptoms ? patient.symptoms.join(', ') : 'No specific symptoms'}
                        </p>
                        <Badge variant="outline" className="mt-1">
                          {patient.bloodGroup}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Common Symptoms */}
          <TabsContent value="symptoms">
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
              <CardHeader>
                <CardTitle>Most Common Symptoms Today</CardTitle>
                <CardDescription>Symptoms reported by patients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {todayStats.commonSymptoms.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <span className="font-medium text-gray-900">{item.symptom}</span>
                      <Badge variant="secondary" className="bg-red-100 text-red-800">
                        {item.count} patient{item.count > 1 ? 's' : ''}
                      </Badge>
                    </div>
                  ))}
                  {todayStats.commonSymptoms.length === 0 && (
                    <p className="text-gray-500 text-center py-8">No symptoms data available for today</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Prescribed Medicines */}
          <TabsContent value="medicines">
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
              <CardHeader>
                <CardTitle>Most Prescribed Medicines</CardTitle>
                <CardDescription>Medicines prescribed to patients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {todayStats.prescribedMedicines.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="font-medium text-gray-900">{item.medicine}</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {item.count} prescription{item.count > 1 ? 's' : ''}
                      </Badge>
                    </div>
                  ))}
                  {todayStats.prescribedMedicines.length === 0 && (
                    <p className="text-gray-500 text-center py-8">No prescription data available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Regional Data */}
          <TabsContent value="regions">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5" />
                    <span>Patients by Region</span>
                  </CardTitle>
                  <CardDescription>Distribution of patients across Kerala</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(regionData).map(([region, count]) => (
                      <div key={region} className="flex items-center justify-between p-3 bg-teal-50 rounded-lg">
                        <span className="font-medium text-gray-900">{region}</span>
                        <Badge variant="secondary" className="bg-teal-100 text-teal-800">
                          {count} patient{count > 1 ? 's' : ''}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Disease Statistics</CardTitle>
                  <CardDescription>Most common diagnoses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {diseaseStats.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <span className="font-medium text-gray-900">{item.disease}</span>
                        <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                          {item.count} case{item.count > 1 ? 's' : ''}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DoctorDashboard;