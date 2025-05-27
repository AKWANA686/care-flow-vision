
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Menu, 
  Activity, 
  Calendar, 
  MessageSquare, 
  User, 
  Bell, 
  Settings, 
  LogOut,
  Phone,
  Video,
  FileText,
  Shield
} from 'lucide-react';

interface MobileNavigationProps {
  userType: 'patient' | 'doctor';
  userName: string;
  onLogout: () => void;
  onOpenModal: (modalType: string) => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  badge?: string;
}

const MobileNavigation = ({ userType, userName, onLogout, onOpenModal }: MobileNavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const patientMenuItems: MenuItem[] = [
    { id: 'appointments', label: 'Book Appointment', icon: Calendar },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: '3' },
    { id: 'records', label: 'Medical Records', icon: FileText },
    { id: 'video-call', label: 'Video Call', icon: Video },
    { id: 'emergency', label: 'Emergency Contact', icon: Phone },
  ];

  const doctorMenuItems: MenuItem[] = [
    { id: 'patients', label: 'Patient List', icon: User },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'messages', label: 'Send Message', icon: MessageSquare },
    { id: 'video-call', label: 'Video Call', icon: Video },
    { id: 'analytics', label: 'Analytics', icon: Activity },
  ];

  const menuItems = userType === 'patient' ? patientMenuItems : doctorMenuItems;

  const handleMenuClick = (itemId: string) => {
    onOpenModal(itemId);
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">{userName}</h3>
                <Badge variant="secondary" className="text-xs">
                  {userType === 'patient' ? 'Patient' : 'Doctor'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Main Menu */}
          <div className="flex-1 py-4">
            <div className="space-y-2">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className="w-full justify-start h-12"
                    onClick={() => handleMenuClick(item.id)}
                  >
                    <IconComponent className="w-5 h-5 mr-3" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <Badge variant="destructive" className="ml-2 text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
            <div className="flex items-center mb-2">
              <Shield className="w-4 h-4 text-red-600 mr-2" />
              <span className="text-sm font-semibold text-red-800">Privacy Protected</span>
            </div>
            <p className="text-xs text-red-700">
              All medical data is encrypted and HIPAA compliant. Your privacy is our priority.
            </p>
          </div>

          {/* Bottom Actions */}
          <div className="border-t pt-4 space-y-2">
            <Button variant="ghost" className="w-full justify-start" onClick={() => handleMenuClick('notifications')}>
              <Bell className="w-5 h-5 mr-3" />
              Notifications
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => handleMenuClick('settings')}>
              <Settings className="w-5 h-5 mr-3" />
              Settings
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={onLogout}>
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavigation;
