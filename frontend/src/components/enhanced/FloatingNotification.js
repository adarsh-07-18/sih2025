import React, { useState, useEffect } from 'react';
import { Bell, X, Heart, Activity, Users } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';

const FloatingNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  const sampleNotifications = [
    {
      id: 1,
      title: 'Health Reminder',
      message: 'Time for your daily medication',
      type: 'health',
      icon: Heart,
      time: '2 min ago'
    },
    {
      id: 2,
      title: 'New Patient Alert',
      message: 'Patient John Doe has registered',
      type: 'patient',
      icon: Users,
      time: '5 min ago'
    },
    {
      id: 3,
      title: 'System Update',
      message: 'Health data synchronized successfully',
      type: 'system',
      icon: Activity,
      time: '10 min ago'
    }
  ];

  useEffect(() => {
    // Simulate notifications appearing
    const timer = setTimeout(() => {
      setNotifications(sampleNotifications);
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'health': return 'text-red-500';
      case 'patient': return 'text-blue-500';
      case 'system': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  if (!isVisible || notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => {
        const Icon = notification.icon;
        return (
          <Card 
            key={notification.id}
            className="bg-white/95 backdrop-blur-sm shadow-lg border-0 animate-in slide-in-from-right-full duration-500"
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-full bg-gray-100 ${getIconColor(notification.type)}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {notification.title}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {notification.time}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeNotification(notification.id)}
                  className="h-6 w-6 p-0 hover:bg-gray-100"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default FloatingNotification;