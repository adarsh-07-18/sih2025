import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Heart, LogOut, User, Upload, FileText, Plus, Edit, Save, X, Camera, Bell, Shield, Activity } from 'lucide-react';
import { toast } from '../hooks/use-toast';
import AnimatedCounter from './enhanced/AnimatedCounter';
import LoadingSpinner from './enhanced/LoadingSpinner';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [userProfile, setUserProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [medicalInfo, setMedicalInfo] = useState('');
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    // Get user session and profile data
    const userSession = JSON.parse(localStorage.getItem('userSession') || '{}');
    if (!userSession || userSession.type !== 'user') {
      navigate('/login');
      return;
    }

    const profileKey = `profile_${userSession.id}`;
    const profile = JSON.parse(localStorage.getItem(profileKey) || '{}');
    
    if (!profile.profileCompleted) {
      navigate('/questionnaire');
      return;
    }

    setUserProfile(profile);
    setEditedProfile(profile);

    // Load existing documents and medical info
    const storedDocs = JSON.parse(localStorage.getItem(`documents_${profile.userId}`) || '[]');
    const storedMedInfo = localStorage.getItem(`medicalInfo_${profile.userId}`) || '';
    setDocuments(storedDocs);
    setMedicalInfo(storedMedInfo);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userSession');
    navigate('/home');
  };

  const handleEditProfile = () => {
    setEditMode(true);
  };

  const handleSaveProfile = () => {
    const userSession = JSON.parse(localStorage.getItem('userSession') || '{}');
    const profileKey = `profile_${userSession.id}`;
    
    const updatedProfile = {
      ...editedProfile,
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem(profileKey, JSON.stringify(updatedProfile));
    setUserProfile(updatedProfile);
    setEditMode(false);
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const handleCancelEdit = () => {
    setEditedProfile(userProfile);
    setEditMode(false);
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newDocuments = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      type: file.type,
      size: file.size,
      uploadDate: new Date().toISOString(),
      url: URL.createObjectURL(file) // In real app, this would be uploaded to server
    }));

    const updatedDocs = [...documents, ...newDocuments];
    setDocuments(updatedDocs);
    localStorage.setItem(`documents_${userProfile.userId}`, JSON.stringify(updatedDocs));
    
    toast({
      title: "Documents Uploaded",
      description: `${files.length} document(s) uploaded successfully.`,
    });
  };

  const handleAddMedicalInfo = () => {
    if (medicalInfo.trim()) {
      localStorage.setItem(`medicalInfo_${userProfile.userId}`, medicalInfo);
      toast({
        title: "Medical Information Saved",
        description: "Your medical information has been saved.",
      });
    }
  };

  const handleDeleteDocument = (docId) => {
    const updatedDocs = documents.filter(doc => doc.id !== docId);
    setDocuments(updatedDocs);
    localStorage.setItem(`documents_${userProfile.userId}`, JSON.stringify(updatedDocs));
    
    toast({
      title: "Document Deleted",
      description: "Document has been removed.",
    });
  };

  if (!userProfile) {
    return <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 flex items-center justify-center">
      <LoadingSpinner size="lg" message="Loading your dashboard..." />
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full p-2">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">{t('app_name')}</h1>
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
        <div className="mb-8 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl p-6 border border-teal-100">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userProfile.fullName}`} />
                <AvatarFallback className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-xl font-bold">
                  {userProfile.fullName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center space-x-3">
                <span>{t('welcome')}, {userProfile.fullName}!</span>
                <Badge variant="secondary" className="bg-teal-100 text-teal-800">
                  Active
                </Badge>
              </h2>
              
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center space-x-2 bg-white px-3 py-1 rounded-full shadow-sm">
                  <User className="w-4 h-4 text-teal-600" />
                  <span className="font-medium">{t('user_id')}: {userProfile.userId}</span>
                </div>
                
                <div className="flex items-center space-x-2 bg-white px-3 py-1 rounded-full shadow-sm">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>Verified</span>
                </div>
                
                <div className="flex items-center space-x-2 text-gray-600">
                  <Activity className="w-4 h-4" />
                  <span>Member since {new Date(userProfile.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-teal-600">
                <AnimatedCounter end={98} suffix="%" />
              </div>
              <p className="text-sm text-gray-600">Profile Complete</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                <AnimatedCounter end={documents.length} />
              </div>
              <p className="text-sm text-blue-700">Documents</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200 border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                <AnimatedCounter end={userProfile.age} />
              </div>
              <p className="text-sm text-green-700">Age (Years)</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200 border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {userProfile.bloodGroup}
              </div>
              <p className="text-sm text-purple-700">Blood Group</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200 border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                <AnimatedCounter end={Math.floor(Math.random() * 10) + 1} />
              </div>
              <p className="text-sm text-orange-700">Health Score</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Details */}
          <div className="lg:col-span-2">
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>{t('profile_details')}</span>
                  </CardTitle>
                  <CardDescription>Your personal and medical information</CardDescription>
                </div>
                {!editMode ? (
                  <Button variant="outline" onClick={handleEditProfile} className="flex items-center space-x-2">
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={handleCancelEdit} size="sm">
                      <X className="w-4 h-4" />
                    </Button>
                    <Button onClick={handleSaveProfile} size="sm" className="bg-teal-500 hover:bg-teal-600">
                      <Save className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>{t('full_name')}</Label>
                    {editMode ? (
                      <Input
                        value={editedProfile.fullName}
                        onChange={(e) => setEditedProfile({...editedProfile, fullName: e.target.value})}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 p-2 bg-gray-50 rounded">{userProfile.fullName}</p>
                    )}
                  </div>
                  <div>
                    <Label>{t('age')}</Label>
                    {editMode ? (
                      <Input
                        type="number"
                        value={editedProfile.age}
                        onChange={(e) => setEditedProfile({...editedProfile, age: e.target.value})}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 p-2 bg-gray-50 rounded">{userProfile.age} years</p>
                    )}
                  </div>
                  <div>
                    <Label>{t('gender')}</Label>
                    <p className="mt-1 p-2 bg-gray-50 rounded capitalize">{userProfile.gender}</p>
                  </div>
                  <div>
                    <Label>{t('blood_group')}</Label>
                    <p className="mt-1 p-2 bg-gray-50 rounded">{userProfile.bloodGroup}</p>
                  </div>
                  <div>
                    <Label>{t('profession')}</Label>
                    {editMode ? (
                      <Input
                        value={editedProfile.profession}
                        onChange={(e) => setEditedProfile({...editedProfile, profession: e.target.value})}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 p-2 bg-gray-50 rounded">{userProfile.profession}</p>
                    )}
                  </div>
                  <div>
                    <Label>{t('phone')}</Label>
                    {editMode ? (
                      <Input
                        value={editedProfile.phone}
                        onChange={(e) => setEditedProfile({...editedProfile, phone: e.target.value})}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 p-2 bg-gray-50 rounded">{userProfile.phone}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label>{t('address')}</Label>
                  {editMode ? (
                    <Textarea
                      value={editedProfile.address}
                      onChange={(e) => setEditedProfile({...editedProfile, address: e.target.value})}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 p-2 bg-gray-50 rounded">{userProfile.address}</p>
                  )}
                </div>
                
                <div>
                  <Label>{t('medical_history')}</Label>
                  {editMode ? (
                    <Textarea
                      value={editedProfile.medicalHistory}
                      onChange={(e) => setEditedProfile({...editedProfile, medicalHistory: e.target.value})}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 p-2 bg-gray-50 rounded">{userProfile.medicalHistory || 'None recorded'}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            {/* Upload Documents */}
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="w-5 h-5" />
                  <span>{t('upload_documents')}</span>
                </CardTitle>
                <CardDescription>Upload medical reports, prescriptions, etc.</CardDescription>
              </CardHeader>
              <CardContent>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Label htmlFor="file-upload">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-teal-500 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Click to upload documents</p>
                    <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG, DOC files</p>
                  </div>
                </Label>
                
                {documents.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="font-medium text-gray-800">Uploaded Documents:</h4>
                    {documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-gray-500" />
                          <span className="text-sm truncate">{doc.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteDocument(doc.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Add Medical Information */}
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>{t('add_medical_info')}</span>
                </CardTitle>
                <CardDescription>Add current symptoms, medications, or notes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Describe your current health status, symptoms, or any medical updates..."
                  value={medicalInfo}
                  onChange={(e) => setMedicalInfo(e.target.value)}
                  className="min-h-[100px]"
                />
                <Button 
                  onClick={handleAddMedicalInfo}
                  className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white"
                >
                  {t('save')} Medical Information
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;