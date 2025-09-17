import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Progress } from '../components/ui/progress';
import { Heart, ArrowLeft, ArrowRight } from 'lucide-react';

const UserQuestionnaire = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: '',
    profession: '',
    phone: '',
    address: '',
    emergencyContact: '',
    bloodGroup: '',
    medicalHistory: '',
    currentMedications: ''
  });

  const questions = [
    {
      key: 'fullName',
      label: t('full_name'),
      type: 'text',
      placeholder: 'Enter your full name',
      required: true
    },
    {
      key: 'age',
      label: t('age'),
      type: 'number',
      placeholder: 'Enter your age',
      required: true
    },
    {
      key: 'gender',
      label: t('gender'),
      type: 'select',
      options: [
        { value: 'male', label: t('male') },
        { value: 'female', label: t('female') },
        { value: 'other', label: t('other') }
      ],
      required: true
    },
    {
      key: 'profession',
      label: t('profession'),
      type: 'text',
      placeholder: 'Enter your profession',
      required: true
    },
    {
      key: 'phone',
      label: t('phone'),
      type: 'tel',
      placeholder: 'Enter your phone number',
      required: true
    },
    {
      key: 'address',
      label: t('address'),
      type: 'textarea',
      placeholder: 'Enter your complete address',
      required: true
    },
    {
      key: 'emergencyContact',
      label: t('emergency_contact'),
      type: 'text',
      placeholder: 'Emergency contact number',
      required: true
    },
    {
      key: 'bloodGroup',
      label: t('blood_group'),
      type: 'select',
      options: [
        { value: 'A+', label: 'A+' },
        { value: 'A-', label: 'A-' },
        { value: 'B+', label: 'B+' },
        { value: 'B-', label: 'B-' },
        { value: 'AB+', label: 'AB+' },
        { value: 'AB-', label: 'AB-' },
        { value: 'O+', label: 'O+' },
        { value: 'O-', label: 'O-' }
      ],
      required: true
    },
    {
      key: 'medicalHistory',
      label: t('medical_history'),
      type: 'textarea',
      placeholder: 'Describe any past medical conditions, surgeries, or chronic illnesses',
      required: false
    },
    {
      key: 'currentMedications',
      label: t('current_medications'),
      type: 'textarea',
      placeholder: 'List any medications you are currently taking',
      required: false
    }
  ];

  const progress = ((currentStep + 1) / questions.length) * 100;
  const currentQuestion = questions[currentStep];

  const handleInputChange = (value) => {
    setFormData({
      ...formData,
      [currentQuestion.key]: value
    });
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Get user session data
    const userSession = JSON.parse(localStorage.getItem('userSession') || '{}');
    
    // Generate unique user ID
    const userId = `USER_${Date.now()}`;
    const profileData = {
      ...formData,
      userId,
      citizenType: userSession.citizenType,
      identificationId: userSession.id,
      createdAt: new Date().toISOString(),
      profileCompleted: true
    };

    // Store profile data
    localStorage.setItem(`profile_${userSession.id}`, JSON.stringify(profileData));
    
    // Update user session
    userSession.profileCompleted = true;
    userSession.userId = userId;
    localStorage.setItem('userSession', JSON.stringify(userSession));

    // Also store in session data for admin/doctor access
    const sessionData = JSON.parse(localStorage.getItem('sessionData') || '{}');
    if (!sessionData.users) sessionData.users = [];
    sessionData.users.push(profileData);
    localStorage.setItem('sessionData', JSON.stringify(sessionData));

    navigate('/user-dashboard');
  };

  const isCurrentStepValid = () => {
    const value = formData[currentQuestion.key];
    return !currentQuestion.required || (value && value.trim());
  };

  const renderInput = () => {
    switch (currentQuestion.type) {
      case 'select':
        return (
          <Select value={formData[currentQuestion.key]} onValueChange={handleInputChange}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder={`Select ${currentQuestion.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {currentQuestion.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'textarea':
        return (
          <Textarea
            value={formData[currentQuestion.key]}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={currentQuestion.placeholder}
            className="mt-2 min-h-[100px]"
          />
        );
      default:
        return (
          <Input
            type={currentQuestion.type}
            value={formData[currentQuestion.key]}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={currentQuestion.placeholder}
            className="mt-2"
          />
        );
    }
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
            <span>Back</span>
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
        <Card className="w-full max-w-2xl bg-white/90 backdrop-blur-sm shadow-xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
              {t('health_questionnaire')}
            </CardTitle>
            <CardDescription className="text-gray-600 mb-4">
              {t('please_answer')}
            </CardDescription>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Question {currentStep + 1} of {questions.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-gradient-to-r from-teal-50 to-emerald-50 p-6 rounded-lg">
              <Label className="text-lg font-semibold text-gray-800 mb-2 block">
                {currentQuestion.label}
                {currentQuestion.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              {renderInput()}
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t('back')}</span>
              </Button>

              {currentStep === questions.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  disabled={!isCurrentStepValid()}
                  className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white flex items-center space-x-2"
                >
                  <span>{t('submit')}</span>
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!isCurrentStepValid()}
                  className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white flex items-center space-x-2"
                >
                  <span>{t('next')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserQuestionnaire;