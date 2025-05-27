
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, X, Check, AlertTriangle, Info, Calendar, MessageSquare } from 'lucide-react';

interface NotificationCenterProps {
  userType: 'patient' | 'doctor';
}

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'appointment' | 'message';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const NotificationCenter = ({ userType }: NotificationCenterProps) => {
  const [notifications, setNotifications] = useState<Notification[]>(
    userType === 'patient' ? [
      {
        id: '1',
        type: 'appointment',
        title: 'Appointment Reminder',
        message: 'Your appointment with Dr. Sarah Johnson is tomorrow at 2:00 PM',
        timestamp: '2 hours ago',
        read: false
      },
      {
        id: '2',
        type: 'message',
        title: 'New Message',
        message: 'Dr. Johnson sent you test results',
        timestamp: '1 day ago',
        read: false
      },
      {
        id: '3',
        type: 'info',
        title: 'Test Results Available',
        message: 'Your blood work results are now available for download',
        timestamp: '2 days ago',
        read: true
      }
    ] : [
      {
        id: '1',
        type: 'warning',
        title: 'Critical Alert',
        message: 'Patient Michael Chen has elevated blood pressure (180/95)',
        timestamp: '5 minutes ago',
        read: false
      },
      {
        id: '2',
        type: 'appointment',
        title: 'Upcoming Appointment',
        message: 'John Smith appointment in 30 minutes',
        timestamp: '30 minutes ago',
        read: false
      },
      {
        id: '3',
        type: 'message',
        title: 'Patient Message',
        message: 'Emma Davis sent a message about medication side effects',
        timestamp: '1 hour ago',
        read: false
      },
      {
        id: '4',
        type: 'info',
        title: 'System Update',
        message: 'Patient monitoring system updated successfully',
        timestamp: '3 hours ago',
        read: true
      }
    ]
  );

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return Calendar;
      case 'message':
        return MessageSquare;
      case 'warning':
        return AlertTriangle;
      default:
        return Info;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'appointment':
        return 'bg-blue-50 border-blue-200';
      case 'message':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          {unreadCount > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={markAllAsRead}
            >
              <Check className="w-4 h-4 mr-1" />
              Mark all read
            </Button>
          )}
        </div>
        <CardDescription>
          Stay updated with important alerts and messages
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map((notification) => {
                const IconComponent = getIcon(notification.type);
                return (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border ${getTypeColor(notification.type)} ${
                      !notification.read ? 'ring-2 ring-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <IconComponent className="w-5 h-5 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">
                            {notification.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {notification.timestamp}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="h-6 w-6 p-0"
                          >
                            <Check className="w-3 h-3" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeNotification(notification.id)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default NotificationCenter;
