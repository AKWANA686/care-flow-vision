import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Heart, 
  Calendar, 
  FileText, 
  Shield, 
  LogOut,
  Activity,
  Clock,
  Bell,
  MessageSquare,
  Phone,
  Download,
  CreditCard,
  Video
} from 'lucide-react';
import BookAppointmentModal from '@/components/BookAppointmentModal';
import RequestRecordsModal from '@/components/RequestRecordsModal';
import DownloadReportsModal from '@/components/DownloadReportsModal';
import MessageDoctorModal from '@/components/MessageDoctorModal';
import EmergencyContactModal from '@/components/EmergencyContactModal';
import PatientMessagesModal from '@/components/PatientMessagesModal';
import VideoCallModal from '@/components/VideoCallModal';
import MobileNavigation from '@/components/MobileNavigation';
import NotificationCenter from '@/components/NotificationCenter';
import SubscriptionStatus from '@/components/SubscriptionStatus';
import TransactionHistory from '@/components/TransactionHistory';
import { useIsMobile } from '@/hooks/use-mobile';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [patientData, setPatientData] = useState({
    name: 'John Doe',
    patientId: 'P-001234',
    email: '',
    nextAppointment: '2024-01-15 at 2:00 PM',
    lastVisit: '2024-01-08',
    doctor: 'Dr. Sarah Johnson'
  });

  // Modal states
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isRecordsModalOpen, setIsRecordsModalOpen] = useState(false);
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isPatientMessagesModalOpen, setIsPatientMessagesModalOpen] = useState(false);
  const [isVideoCallModalOpen, setIsVideoCallModalOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const userType = localStorage.getItem('userType');
    const userEmail = localStorage.getItem('userEmail');
    const patientId = localStorage.getItem('patientId');
    
    if (userType !== 'patient') {
      navigate('/login');
      return;
    }
    
    setPatientData(prev => ({
      ...prev,
      email: userEmail || '',
      patientId: patientId || 'P-001234'
    }));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userType');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('patientId');
    navigate('/');
  };

  const handleMobileModalOpen = (modalType: string) => {
    switch (modalType) {
      case 'appointments':
        setIsBookingModalOpen(true);
        break;
      case 'messages':
        setIsPatientMessagesModalOpen(true);
        break;
      case 'records':
        setIsRecordsModalOpen(true);
        break;
      case 'video-call':
        setIsVideoCallModalOpen(true);
        break;
      case 'emergency':
        setIsEmergencyModalOpen(true);
        break;
      case 'notifications':
        setShowNotifications(true);
        break;
    }
  };

  const vitalSigns = {
    heartRate: '72 bpm',
    bloodPressure: '120/80 mmHg',
    temperature: '98.6°F',
    weight: '165 lbs'
  };

  const upcomingAppointments = [
    { date: '2024-01-15', time: '2:00 PM', doctor: 'Dr. Sarah Johnson', type: 'Follow-up' },
    { date: '2024-01-22', time: '10:30 AM', doctor: 'Dr. Michael Chen', type: 'Cardiology' },
  ];

  const testResults = [
    { name: 'Blood Work', date: '2024-01-08', status: 'Normal', confidential: true },
    { name: 'X-Ray Chest', date: '2024-01-05', status: 'Normal', confidential: true },
    { name: 'ECG', date: '2024-01-03', status: 'Normal', confidential: true },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              {isMobile && (
                <MobileNavigation
                  userType="patient"
                  userName={patientData.name}
                  onLogout={handleLogout}
                  onOpenModal={handleMobileModalOpen}
                />
              )}
              <div className="medical-gradient p-2 rounded-xl">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gradient">Patient Portal</h1>
                <p className="text-sm text-gray-600">Welcome back, {patientData.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {!isMobile && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative"
                  >
                    <Bell className="w-4 h-4" />
                    <Badge variant="destructive" className="absolute -top-2 -right-2 w-5 h-5 p-0 text-xs">
                      3
                    </Badge>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsVideoCallModalOpen(true)}
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Call Doctor
                  </Button>
                  <Badge variant="secondary" className="flex items-center">
                    <Shield className="w-3 h-3 mr-1" />
                    Confidential
                  </Badge>
                </>
              )}
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="flex items-center"
                size={isMobile ? "sm" : "default"}
              >
                <LogOut className="w-4 h-4 mr-2" />
                {!isMobile && "Logout"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Notifications Panel */}
        {showNotifications && !isMobile && (
          <div className="mb-6">
            <NotificationCenter userType="patient" />
          </div>
        )}

        <div className={`grid ${isMobile ? 'grid-cols-1' : 'lg:grid-cols-12'} gap-6`}>
          {/* Left Sidebar - Patient Info & Subscription */}
          <div className={`${isMobile ? 'col-span-1' : 'lg:col-span-3'} space-y-6`}>
            {/* Patient Info Card */}
            <Card className="glass-effect border-0 shadow-lg">
              <CardHeader className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-white" />
                </div>
                <CardTitle>{patientData.name}</CardTitle>
                <CardDescription>Patient ID: {patientData.patientId}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm">
                  <p className="text-gray-600">Email:</p>
                  <p className="font-medium">{patientData.email}</p>
                </div>
                <div className="text-sm">
                  <p className="text-gray-600">Primary Care Doctor:</p>
                  <p className="font-medium">{patientData.doctor}</p>
                </div>
                <div className="text-sm">
                  <p className="text-gray-600">Last Visit:</p>
                  <p className="font-medium">{patientData.lastVisit}</p>
                </div>
                <div className="pt-4 space-y-2">
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => setIsPatientMessagesModalOpen(true)}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    View Messages
                  </Button>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => setIsVideoCallModalOpen(true)}
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Video Call
                  </Button>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => setIsEmergencyModalOpen(true)}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Emergency Contact
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Subscription Status */}
            <SubscriptionStatus />

            {/* Quick Actions */}
            <Card className="glass-effect border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full justify-start bg-blue-50 text-blue-700 hover:bg-blue-100 border-0"
                  onClick={() => setIsBookingModalOpen(true)}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Appointment
                </Button>
                <Button 
                  className="w-full justify-start bg-green-50 text-green-700 hover:bg-green-100 border-0"
                  onClick={() => setIsRecordsModalOpen(true)}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Request Records
                </Button>
                <Button 
                  className="w-full justify-start bg-purple-50 text-purple-700 hover:bg-purple-100 border-0"
                  onClick={() => setIsReportsModalOpen(true)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Reports
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className={`${isMobile ? 'col-span-1' : 'lg:col-span-6'} space-y-6`}>
            {/* Vital Signs */}
            <Card className="glass-effect border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-red-500" />
                  Latest Vital Signs
                </CardTitle>
                <CardDescription>Recorded during your last visit</CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-2'} gap-4`}>
                  <div className="text-center p-4 bg-red-50 rounded-xl">
                    <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-red-600">{vitalSigns.heartRate}</p>
                    <p className="text-sm text-gray-600">Heart Rate</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <Activity className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-600">{vitalSigns.bloodPressure}</p>
                    <p className="text-sm text-gray-600">Blood Pressure</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-xl">
                    <div className="w-8 h-8 bg-orange-500 rounded-full mx-auto mb-2"></div>
                    <p className="text-2xl font-bold text-orange-600">{vitalSigns.temperature}</p>
                    <p className="text-sm text-gray-600">Temperature</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-xl">
                    <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-2"></div>
                    <p className="text-2xl font-bold text-green-600">{vitalSigns.weight}</p>
                    <p className="text-sm text-gray-600">Weight</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transaction History */}
            <TransactionHistory />

            {/* Test Results - CONFIDENTIAL */}
            <Card className="glass-effect border-0 shadow-lg border-l-4 border-l-red-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Test Results
                  </CardTitle>
                  <Badge variant="destructive" className="flex items-center">
                    <Shield className="w-3 h-3 mr-1" />
                    CONFIDENTIAL
                  </Badge>
                </div>
                <CardDescription>Your private medical test results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {testResults.map((test, index) => (
                    <div key={index} className={`flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 ${isMobile ? 'flex-col space-y-2' : ''}`}>
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{test.name}</h4>
                          <p className="text-sm text-gray-600">{test.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge 
                          variant={test.status === 'Normal' ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          {test.status}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Download className="w-3 h-3 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Appointments */}
          {!isMobile && (
            <div className="lg:col-span-3 space-y-6">
              {/* Appointments */}
              <Card className="glass-effect border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                    Upcoming Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment, index) => (
                      <div key={index} className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary">{appointment.type}</Badge>
                          <span className="text-xs text-gray-600">{appointment.date}</span>
                        </div>
                        <p className="font-semibold text-blue-900">{appointment.doctor}</p>
                        <p className="text-sm text-blue-700">{appointment.time}</p>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-4 medical-gradient text-white">
                    <Calendar className="w-4 h-4 mr-2" />
                    Book New Appointment
                  </Button>
                </CardContent>
              </Card>

              {/* Notifications */}
              <Card className="glass-effect border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="w-5 h-5 mr-2 text-orange-600" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <p className="text-sm font-medium text-orange-900">Appointment Reminder</p>
                      <p className="text-xs text-orange-700">Your appointment is in 2 days</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm font-medium text-green-900">Test Results Available</p>
                      <p className="text-xs text-green-700">New lab results are ready</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm font-medium text-blue-900">Message from Doctor</p>
                      <p className="text-xs text-blue-700">Dr. Johnson sent you a message</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <BookAppointmentModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        patientId={patientData.patientId}
      />
      <RequestRecordsModal
        isOpen={isRecordsModalOpen}
        onClose={() => setIsRecordsModalOpen(false)}
        patientId={patientData.patientId}
      />
      <DownloadReportsModal
        isOpen={isReportsModalOpen}
        onClose={() => setIsReportsModalOpen(false)}
        patientId={patientData.patientId}
      />
      <MessageDoctorModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        patientId={patientData.patientId}
      />
      <EmergencyContactModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />
      <PatientMessagesModal
        isOpen={isPatientMessagesModalOpen}
        onClose={() => setIsPatientMessagesModalOpen(false)}
        patientId={patientData.patientId}
      />
      <VideoCallModal
        isOpen={isVideoCallModalOpen}
        onClose={() => setIsVideoCallModalOpen(false)}
        userType="patient"
      />
    </div>
  );
};

export default PatientDashboard;
