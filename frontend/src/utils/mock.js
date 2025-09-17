// Mock data for the healthcare platform
export const mockData = {
  // Sample users for demonstration
  sampleUsers: [
    {
      userId: 'USER_1735025234001',
      fullName: 'Arjun Nair',
      age: '32',
      gender: 'male',
      profession: 'Software Engineer',
      phone: '+91-9876543210',
      address: 'Kakkanad, Kochi, Kerala 682037',
      emergencyContact: '+91-9876543211',
      bloodGroup: 'O+',
      medicalHistory: 'Hypertension, managed with medication',
      currentMedications: 'Amlodipine 5mg daily',
      citizenType: 'indian',
      identificationId: '123456789012',
      createdAt: '2024-12-24T08:30:00.000Z',
      profileCompleted: true,
      symptoms: ['Headache', 'High BP'],
      diagnosis: 'Hypertension',
      prescribedMedicine: 'Amlodipine 5mg',
      visitDate: '2024-12-24'
    },
    {
      userId: 'USER_1735025234002',
      fullName: 'Priya Menon',
      age: '28',
      gender: 'female',
      profession: 'Teacher',
      phone: '+91-9876543212',
      address: 'Thiruvananthapuram, Kerala 695001',
      emergencyContact: '+91-9876543213',
      bloodGroup: 'A+',
      medicalHistory: 'Diabetes Type 2',
      currentMedications: 'Metformin 500mg twice daily',
      citizenType: 'indian',
      identificationId: '123456789013',
      createdAt: '2024-12-24T09:15:00.000Z',
      profileCompleted: true,
      symptoms: ['Fatigue', 'Increased thirst'],
      diagnosis: 'Diabetes Type 2',
      prescribedMedicine: 'Metformin 500mg',
      visitDate: '2024-12-24'
    },
    {
      userId: 'USER_1735025234003',
      fullName: 'Ravi Kumar',
      age: '45',
      gender: 'male',
      profession: 'Business Owner',
      phone: '+91-9876543214',
      address: 'Kozhikode, Kerala 673001',
      emergencyContact: '+91-9876543215',
      bloodGroup: 'B+',
      medicalHistory: 'Asthma',
      currentMedications: 'Salbutamol inhaler as needed',
      citizenType: 'indian',
      identificationId: '123456789014',
      createdAt: '2024-12-24T10:00:00.000Z',
      profileCompleted: true,
      symptoms: ['Shortness of breath', 'Wheezing'],
      diagnosis: 'Asthma exacerbation',
      prescribedMedicine: 'Salbutamol inhaler',
      visitDate: '2024-12-24'
    }
  ],

  // Health trends data for Kerala regions
  keralaTrends: {
    regions: [
      {
        name: 'Thiruvananthapuram',
        totalPatients: 156,
        commonDiseases: [
          { name: 'Diabetes', count: 45, percentage: 28.8 },
          { name: 'Hypertension', count: 38, percentage: 24.4 },
          { name: 'Cardiovascular', count: 32, percentage: 20.5 },
          { name: 'Respiratory', count: 25, percentage: 16.0 },
          { name: 'Others', count: 16, percentage: 10.3 }
        ]
      },
      {
        name: 'Kochi',
        totalPatients: 189,
        commonDiseases: [
          { name: 'Hypertension', count: 52, percentage: 27.5 },
          { name: 'Diabetes', count: 48, percentage: 25.4 },
          { name: 'Respiratory', count: 35, percentage: 18.5 },
          { name: 'Cardiovascular', count: 31, percentage: 16.4 },
          { name: 'Others', count: 23, percentage: 12.2 }
        ]
      },
      {
        name: 'Kozhikode',
        totalPatients: 142,
        commonDiseases: [
          { name: 'Respiratory', count: 38, percentage: 26.8 },
          { name: 'Diabetes', count: 35, percentage: 24.6 },
          { name: 'Hypertension', count: 32, percentage: 22.5 },
          { name: 'Cardiovascular', count: 22, percentage: 15.5 },
          { name: 'Others', count: 15, percentage: 10.6 }
        ]
      },
      {
        name: 'Thrissur',
        totalPatients: 123,
        commonDiseases: [
          { name: 'Diabetes', count: 34, percentage: 27.6 },
          { name: 'Hypertension', count: 31, percentage: 25.2 },
          { name: 'Cardiovascular', count: 25, percentage: 20.3 },
          { name: 'Respiratory', count: 21, percentage: 17.1 },
          { name: 'Others', count: 12, percentage: 9.8 }
        ]
      }
    ],
    overallStats: {
      totalPatients: 610,
      totalDoctors: 45,
      totalHospitals: 28,
      averageAge: 38.5,
      genderDistribution: {
        male: 52.3,
        female: 47.7
      }
    }
  },

  // Common diseases and medicines
  commonDiseases: [
    'Diabetes Type 2',
    'Hypertension',
    'Asthma',
    'Cardiovascular Disease',
    'Arthritis',
    'Depression',
    'Anxiety',
    'Migraine',
    'COPD',
    'Thyroid Disorders'
  ],

  commonMedicines: [
    'Metformin 500mg',
    'Amlodipine 5mg',
    'Salbutamol inhaler',
    'Aspirin 75mg',
    'Atorvastatin 20mg',
    'Levothyroxine 50mcg',
    'Omeprazole 20mg',
    'Paracetamol 500mg',
    'Ibuprofen 400mg',
    'Cetirizine 10mg'
  ]
};

// Function to get or initialize session data
export const getSessionData = () => {
  const stored = localStorage.getItem('sessionData');
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Initialize with sample data
  const initialData = {
    users: mockData.sampleUsers,
    doctors: [
      {
        id: 'DOC_001',
        name: 'Dr. Ramesh Kumar',
        email: 'doctor@swasth.com',
        specialization: 'General Medicine',
        patientsToday: mockData.sampleUsers.length,
        totalPatients: 156
      }
    ],
    stats: {
      totalUsers: mockData.sampleUsers.length,
      diseasesReported: mockData.commonDiseases.length,
      medicinesPrescribed: mockData.commonMedicines.length,
      dailyVisits: mockData.sampleUsers.length
    }
  };
  
  localStorage.setItem('sessionData', JSON.stringify(initialData));
  return initialData;
};

// Function to update session data
export const updateSessionData = (data) => {
  localStorage.setItem('sessionData', JSON.stringify(data));
};

// Function to add new user to session
export const addUserToSession = (userData) => {
  const sessionData = getSessionData();
  sessionData.users.push(userData);
  sessionData.stats.totalUsers = sessionData.users.length;
  updateSessionData(sessionData);
};

// Function to get user statistics
export const getUserStats = () => {
  const sessionData = getSessionData();
  return {
    totalUsers: sessionData.users.length,
    todayUsers: sessionData.users.filter(user => {
      const userDate = new Date(user.createdAt).toDateString();
      const today = new Date().toDateString();
      return userDate === today;
    }).length,
    avgAge: sessionData.users.reduce((sum, user) => sum + parseInt(user.age), 0) / sessionData.users.length,
    genderDistribution: {
      male: sessionData.users.filter(u => u.gender === 'male').length,
      female: sessionData.users.filter(u => u.gender === 'female').length,
      other: sessionData.users.filter(u => u.gender === 'other').length
    }
  };
};