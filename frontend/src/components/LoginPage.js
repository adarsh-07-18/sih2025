import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Alert, AlertDescription } from '../components/ui/alert';
import { ArrowLeft, Heart, Users, FileText, Activity, AlertCircle } from 'lucide-react';
import { toast } from '../hooks/use-toast';

const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState(searchParams.get('type') || 'user');
  const [citizenType, setCitizenType] = useState('indian');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [userForm, setUserForm] = useState({
    aadhaar: '',
    passport: ''
  });
  const [doctorForm, setDoctorForm] = useState({
    email: '',
    password: ''
  });
  const [adminForm, setAdminForm] = useState({
    accessCode: ''
  });

  const handleUserLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (citizenType === 'indian') {
        if (!userForm.aadhaar || userForm.aadhaar.length !== 12) {
          setError('Please enter a valid 12-digit Aadhaar number');
          return;
        }
      } else {
        if (!userForm.passport.trim()) {
          setError('Please enter your passport number');
          return;
        }
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store user session data
      const userData = {
        type: 'user',
        citizenType,
        id: citizenType === 'indian' ? userForm.aadhaar : userForm.passport,
        loginTime: new Date().toISOString()
      };
      localStorage.setItem('userSession', JSON.stringify(userData));
      
      // Check if user has completed questionnaire
      const existingProfile = localStorage.getItem(`profile_${userData.id}`);
      if (existingProfile) {
        navigate('/user-dashboard');
      } else {
        navigate('/questionnaire');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDoctorLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!doctorForm.email || !doctorForm.password) {
        setError('Please enter both email and password');
        return;
      }

      // Dummy authentication
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (doctorForm.email === 'doctor@swasth.com' && doctorForm.password === 'doctor123') {
        const doctorData = {
          type: 'doctor',
          email: doctorForm.email,
          name: 'Dr. Ramesh Kumar',
          loginTime: new Date().toISOString()
        };
        localStorage.setItem('userSession', JSON.stringify(doctorData));
        navigate('/doctor-dashboard');
      } else {
        setError('Invalid credentials. Use doctor@swasth.com / doctor123');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!adminForm.accessCode) {
        setError('Please enter the access code');
        return;
      }

      // Dummy authentication
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (adminForm.accessCode === 'ADMIN2024') {
        const adminData = {
          type: 'admin',
          accessCode: adminForm.accessCode,
          name: 'System Administrator',
          loginTime: new Date().toISOString()
        };
        localStorage.setItem('userSession', JSON.stringify(adminData));
        navigate('/admin-dashboard');
      } else {
        setError('Invalid access code. Use ADMIN2024');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const tabConfig = {
    user: { icon: Users, gradient: 'from-teal-500 to-emerald-500' },
    doctor: { icon: FileText, gradient: 'from-blue-500 to-cyan-500' },
    admin: { icon: Activity, gradient: 'from-purple-500 to-pink-500' }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/home')}
            className="flex items-center space-x-2 hover:bg-teal-50"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Button>
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full p-2">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">{t('app_name')}</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
              {t('select_login_type')}
            </CardTitle>
            <CardDescription className="text-gray-600">
              Choose your role to continue
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-6">
                {Object.entries(tabConfig).map(([key, config]) => {
                  const Icon = config.icon;
                  return (
                    <TabsTrigger 
                      key={key} 
                      value={key} 
                      className="flex items-center space-x-1"
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {/* User Login */}
              <TabsContent value="user" className="space-y-4">
                <div className={`h-1 bg-gradient-to-r ${tabConfig.user.gradient} rounded-full mb-4`}></div>
                
                <Select value={citizenType} onValueChange={setCitizenType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="indian">{t('indian_citizen')}</SelectItem>
                    <SelectItem value="foreign">{t('foreign_citizen')}</SelectItem>
                  </SelectContent>
                </Select>

                <form onSubmit={handleUserLogin} className="space-y-4">
                  {citizenType === 'indian' ? (
                    <div>
                      <Label htmlFor="aadhaar">{t('aadhaar_number')}</Label>
                      <Input
                        id="aadhaar"
                        type="text"
                        placeholder={t('enter_aadhaar')}
                        value={userForm.aadhaar}
                        onChange={(e) => setUserForm({...userForm, aadhaar: e.target.value})}
                        maxLength="12"
                        className="mt-1"
                      />
                    </div>
                  ) : (
                    <div>
                      <Label htmlFor="passport">{t('passport_number')}</Label>
                      <Input
                        id="passport"
                        type="text"
                        placeholder={t('enter_passport')}
                        value={userForm.passport}
                        onChange={(e) => setUserForm({...userForm, passport: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                  )}
                  
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <Button 
                    type="submit" 
                    className={`w-full bg-gradient-to-r ${tabConfig.user.gradient} hover:opacity-90 text-white`}
                    disabled={loading}
                  >
                    {loading ? 'Logging in...' : t('login')}
                  </Button>
                </form>
              </TabsContent>

              {/* Doctor Login */}
              <TabsContent value="doctor" className="space-y-4">
                <div className={`h-1 bg-gradient-to-r ${tabConfig.doctor.gradient} rounded-full mb-4`}></div>
                
                <form onSubmit={handleDoctorLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="doctor-email">{t('doctor_email')}</Label>
                    <Input
                      id="doctor-email"
                      type="email"
                      placeholder="doctor@swasth.com"
                      value={doctorForm.email}
                      onChange={(e) => setDoctorForm({...doctorForm, email: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="doctor-password">{t('password')}</Label>
                    <Input
                      id="doctor-password"
                      type="password"
                      placeholder="Enter password"
                      value={doctorForm.password}
                      onChange={(e) => setDoctorForm({...doctorForm, password: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <Button 
                    type="submit" 
                    className={`w-full bg-gradient-to-r ${tabConfig.doctor.gradient} hover:opacity-90 text-white`}
                    disabled={loading}
                  >
                    {loading ? 'Logging in...' : t('login')}
                  </Button>
                </form>
              </TabsContent>

              {/* Admin Login */}
              <TabsContent value="admin" className="space-y-4">
                <div className={`h-1 bg-gradient-to-r ${tabConfig.admin.gradient} rounded-full mb-4`}></div>
                
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="access-code">{t('access_code')}</Label>
                    <Input
                      id="access-code"
                      type="password"
                      placeholder="Enter access code"
                      value={adminForm.accessCode}
                      onChange={(e) => setAdminForm({...adminForm, accessCode: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <Button 
                    type="submit" 
                    className={`w-full bg-gradient-to-r ${tabConfig.admin.gradient} hover:opacity-90 text-white`}
                    disabled={loading}
                  >
                    {loading ? 'Logging in...' : t('login')}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;