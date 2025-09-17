import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Heart, LogOut, Users, Activity, TrendingUp, BarChart3, MapPin, Stethoscope, Calendar, AlertTriangle } from 'lucide-react';
import { getSessionData, mockData } from '../utils/mock';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [sessionData, setSessionData] = useState(null);
  const [overallStats, setOverallStats] = useState({});
  const [healthTrends, setHealthTrends] = useState([]);

  useEffect(() => {
    // Check admin session
    const userSession = JSON.parse(localStorage.getItem('userSession') || '{}');
    if (!userSession || userSession.type !== 'admin') {
      navigate('/login');
      return;
    }

    // Get session data
    const data = getSessionData();
    setSessionData(data);

    // Calculate overall statistics
    const stats = calculateOverallStats(data);
    setOverallStats(stats);

    // Set health trends for Kerala regions
    setHealthTrends(mockData.keralaTrends.regions);
  }, [navigate]);

  const calculateOverallStats = (data) => {
    const users = data.users || [];
    const today = new Date().toDateString();
    
    // Today's users
    const todayUsers = users.filter(user => {
      const userDate = new Date(user.createdAt).toDateString();
      return userDate === today;
    });

    // Age distribution
    const ageGroups = {
      '0-18': 0,
      '19-35': 0,
      '36-50': 0,
      '51-65': 0,
      '65+': 0
    };

    users.forEach(user => {
      const age = parseInt(user.age);
      if (age <= 18) ageGroups['0-18']++;
      else if (age <= 35) ageGroups['19-35']++;
      else if (age <= 50) ageGroups['36-50']++;
      else if (age <= 65) ageGroups['51-65']++;
      else ageGroups['65+']++;
    });

    // Disease distribution
    const diseases = {};
    users.forEach(user => {
      if (user.diagnosis) {
        diseases[user.diagnosis] = (diseases[user.diagnosis] || 0) + 1;
      }
    });

    // Medicine distribution
    const medicines = {};
    users.forEach(user => {
      if (user.prescribedMedicine) {
        medicines[user.prescribedMedicine] = (medicines[user.prescribedMedicine] || 0) + 1;
      }
    });

    // Gender distribution
    const genderStats = {
      male: users.filter(u => u.gender === 'male').length,
      female: users.filter(u => u.gender === 'female').length,
      other: users.filter(u => u.gender === 'other').length
    };

    return {
      totalUsers: users.length,
      todayUsers: todayUsers.length,
      totalDoctors: data.doctors?.length || 1,
      averageAge: users.length > 0 ? Math.round(users.reduce((sum, u) => sum + parseInt(u.age), 0) / users.length) : 0,
      ageGroups,
      diseases: Object.entries(diseases).sort(([,a], [,b]) => b - a).slice(0, 10),
      medicines: Object.entries(medicines).sort(([,a], [,b]) => b - a).slice(0, 10),
      genderStats,
      completionRate: users.filter(u => u.profileCompleted).length / Math.max(users.length, 1) * 100
    };
  };

  const handleLogout = () => {
    localStorage.removeItem('userSession');
    navigate('/home');
  };

  const getRegionHealthScore = (region) => {
    // Simple health score calculation based on disease distribution
    const totalPatients = region.totalPatients;
    const chronicDiseases = region.commonDiseases.filter(d => 
      ['Diabetes', 'Hypertension', 'Cardiovascular'].includes(d.name)
    ).reduce((sum, d) => sum + d.count, 0);
    
    const healthScore = Math.max(0, 100 - (chronicDiseases / totalPatients * 100));
    return Math.round(healthScore);
  };

  if (!sessionData) {
    return <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading admin dashboard...</p>
      </div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-2">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">{t('app_name')}</h1>
              <p className="text-sm text-gray-600">System Administration</p>
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
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            System Overview
          </h2>
          <div className="flex items-center space-x-4 text-gray-600">
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              Administrator
            </Badge>
            <span className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date().toLocaleDateString()}</span>
            </span>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t('total_users')}</p>
                  <p className="text-3xl font-bold text-purple-600">{overallStats.totalUsers}</p>
                  <p className="text-xs text-gray-500 mt-1">+{overallStats.todayUsers} today</p>
                </div>
                <div className="bg-purple-100 rounded-full p-3">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t('diseases_reported')}</p>
                  <p className="text-3xl font-bold text-red-600">{overallStats.diseases?.length || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">Unique conditions</p>
                </div>
                <div className="bg-red-100 rounded-full p-3">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t('medicines_prescribed')}</p>
                  <p className="text-3xl font-bold text-green-600">{overallStats.medicines?.length || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">Different medicines</p>
                </div>
                <div className="bg-green-100 rounded-full p-3">
                  <Stethoscope className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                  <p className="text-3xl font-bold text-blue-600">{Math.round(overallStats.completionRate)}%</p>
                  <p className="text-xs text-gray-500 mt-1">Profile completion</p>
                </div>
                <div className="bg-blue-100 rounded-full p-3">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">System Overview</TabsTrigger>
            <TabsTrigger value="demographics">Demographics</TabsTrigger>
            <TabsTrigger value="health">Health Analytics</TabsTrigger>
            <TabsTrigger value="kerala">{t('health_trends')}</TabsTrigger>
          </TabsList>

          {/* System Overview */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Daily User Registration</CardTitle>
                  <CardDescription>New users joining the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Today</span>
                      <span className="text-2xl font-bold text-purple-600">{overallStats.todayUsers}</span>
                    </div>
                    <Progress value={(overallStats.todayUsers / overallStats.totalUsers) * 100} className="h-2" />
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Total Users: {overallStats.totalUsers}</span>
                      <span>Growth: +{Math.round((overallStats.todayUsers / Math.max(overallStats.totalUsers - overallStats.todayUsers, 1)) * 100)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                  <CardDescription>Platform performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Profile Completion</span>
                      <span className="text-sm font-bold text-green-600">{Math.round(overallStats.completionRate)}%</span>
                    </div>
                    <Progress value={overallStats.completionRate} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Active Doctors</span>
                      <span className="text-sm font-bold text-blue-600">{overallStats.totalDoctors}</span>
                    </div>
                    <Progress value={100} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Data Quality</span>
                      <span className="text-sm font-bold text-purple-600">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Demographics */}
          <TabsContent value="demographics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Age Distribution</CardTitle>
                  <CardDescription>Users by age groups</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(overallStats.ageGroups || {}).map(([group, count]) => (
                      <div key={group} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{group} years</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={(count / overallStats.totalUsers) * 100} className="w-24 h-2" />
                          <span className="text-sm font-bold w-8">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Average Age</span>
                      <span className="font-bold">{overallStats.averageAge} years</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Gender Distribution</CardTitle>
                  <CardDescription>Users by gender</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(overallStats.genderStats || {}).map(([gender, count]) => (
                      <div key={gender} className="flex items-center justify-between">
                        <span className="text-sm font-medium capitalize">{gender}</span>
                        <div className="flex items-center space-x-2">
                          <Progress 
                            value={(count / overallStats.totalUsers) * 100} 
                            className="w-24 h-2" 
                          />
                          <span className="text-sm font-bold w-12">
                            {Math.round((count / overallStats.totalUsers) * 100)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Health Analytics */}
          <TabsContent value="health">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Most Common Diseases</CardTitle>
                  <CardDescription>Top health conditions reported</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(overallStats.diseases || []).map(([disease, count], index) => (
                      <div key={disease} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Badge variant="secondary" className="bg-red-100 text-red-800">
                            #{index + 1}
                          </Badge>
                          <span className="font-medium text-gray-900">{disease}</span>
                        </div>
                        <span className="text-sm font-bold text-red-600">{count} cases</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Most Prescribed Medicines</CardTitle>
                  <CardDescription>Frequently prescribed medications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(overallStats.medicines || []).map(([medicine, count], index) => (
                      <div key={medicine} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            #{index + 1}
                          </Badge>
                          <span className="font-medium text-gray-900">{medicine}</span>
                        </div>
                        <span className="text-sm font-bold text-green-600">{count} prescriptions</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Kerala Health Trends */}
          <TabsContent value="kerala">
            <div className="space-y-6">
              <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5" />
                    <span>{t('health_trends')}</span>
                  </CardTitle>
                  <CardDescription>Regional health statistics across Kerala</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {healthTrends.map((region, index) => (
                      <div key={region.name} className="border rounded-lg p-4 bg-teal-50">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-bold text-gray-900">{region.name}</h4>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Health Score</p>
                            <p className="text-2xl font-bold text-teal-600">
                              {getRegionHealthScore(region)}/100
                            </p>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                            <span>Total Patients</span>
                            <span className="font-bold">{region.totalPatients}</span>
                          </div>
                          <Progress value={getRegionHealthScore(region)} className="h-2" />
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-800">Common Diseases:</p>
                          {region.commonDiseases.slice(0, 3).map((disease, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs">
                              <span className="text-gray-700">{disease.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {disease.count} ({disease.percentage}%)
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Overall Kerala Stats */}
              <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Kerala Overall Statistics</CardTitle>
                  <CardDescription>State-wide health infrastructure</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-teal-600">{mockData.keralaTrends.overallStats.totalPatients}</p>
                      <p className="text-sm text-gray-600">Total Patients</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-blue-600">{mockData.keralaTrends.overallStats.totalDoctors}</p>
                      <p className="text-sm text-gray-600">Active Doctors</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-green-600">{mockData.keralaTrends.overallStats.totalHospitals}</p>
                      <p className="text-sm text-gray-600">Partner Hospitals</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-purple-600">{mockData.keralaTrends.overallStats.averageAge}</p>
                      <p className="text-sm text-gray-600">Avg Age</p>
                    </div>
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

export default AdminDashboard;