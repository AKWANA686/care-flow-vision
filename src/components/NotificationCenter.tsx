
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bell, 
  Calendar, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle, 
  X,
  Settings,
  Filter
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: string;
  type: 'appointment' | 'message' | 'alert' | 'reminder' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
}

interface NotificationCenterProps {
  userType: 'patient' | 'doctor';
}

const NotificationCenter = ({ userType }: NotificationCenterProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    // Sample notifications - in real app, fetch from API
    const sampleNotifications: Notification[] = [
      {
        id: '1',
        type: 'appointment',
        title: 'Appointment Reminder',
        message: 'Your appointment with Dr. Johnson is tomorrow at 2:00 PM',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: false,
        priority: 'high'
      },
      {
        id: '2',
        type: 'message',
        title: 'New Message',
        message: userType === 'patient' 
          ? 'Dr. Johnson sent you a message about your test results' 
          : 'Patient Sarah Johnson sent you a message',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        read: false,
        priority: 'medium'
      },
      {
        id: '3',
        type: 'alert',
        title: 'Critical Alert',
        message: userType === 'patient' 
          ? 'Your blood pressure reading requires attention'
          : 'Patient Michael Chen has critical vital signs',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        read: true,
        priority: 'high'
      },
      {
        id: '4',
        type: 'reminder',
        title: 'Medication Reminder',
        message: userType === 'patient' 
          ? 'Time to take your evening medication'
          : 'Patient Emma Davis missed medication dose',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
        read: true,
        priority: 'medium'
      },
      {
        id: '5',
        type: 'system',
        title: 'System Update',
        message: 'New features have been added to your dashboard',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        read: false,
        priority: 'low'
      }
    ];

    setNotifications(sampleNotifications);
  }, [userType]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'appointment': return Calendar;
      case 'message': return MessageSquare;
      case 'alert': return AlertTriangle;
      case 'reminder': return Bell;
      case 'system': return Settings;
      default: return Bell;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-50 border-red-200';
      case 'medium': return 'bg-orange-50 border-orange-200';
      case 'low': return 'bg-blue-50 border-blue-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    toast({
      title: "Notification dismissed",
      description: "Notification has been removed"
    });
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    toast({
      title: "All marked as read",
      description: "All notifications have been marked as read"
    });
  };

  const filteredNotifications = notifications.filter(notif => 
    filter === 'all' || notif.type === filter
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Card className="w-full max-w-2xl mx-auto glass-effect border-0 shadow-lg">
      <CardHeader>
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
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => setFilter(filter === 'all' ? 'alert' : 'all')}>
              <Filter className="w-4 h-4 mr-1" />
              {filter === 'all' ? 'All' : 'Alerts'}
            </Button>
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                <CheckCircle className="w-4 h-4 mr-1" />
                Mark all read
              </Button>
            )}
          </div>
        </div>
        <CardDescription>
          Stay updated with important alerts and reminders
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No notifications</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => {
                const IconComponent = getNotificationIcon(notification.type);
                return (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                      !notification.read ? getPriorityColor(notification.priority) : 'bg-gray-50 border-gray-200'
                    } ${!notification.read ? 'border-l-4' : ''}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <IconComponent className={`w-5 h-5 mt-0.5 ${
                          notification.priority === 'high' ? 'text-red-600' :
                          notification.priority === 'medium' ? 'text-orange-600' : 'text-blue-600'
                        }`} />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className={`text-sm font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            )}
                          </div>
                          <p className={`text-sm ${!notification.read ? 'text-gray-700' : 'text-gray-500'}`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 ml-2">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="h-6 w-6 p-0"
                          >
                            <CheckCircle className="w-3 h-3" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => dismissNotification(notification.id)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default NotificationCenter;
