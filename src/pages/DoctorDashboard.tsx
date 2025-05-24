
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import VitalSignsChart from '@/components/VitalSignsChart';
import { 
  Stethoscope, 
  Users, 
  Calendar, 
  TrendingUp, 
  AlertTriangle, 
  LogOut,
  Activity,
  Clock,
  CheckCircle2,
  Phone,
  MessageSquare,
  Mail,
  FileText,
  Heart
} from 'lucide-react';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [doctorData, setDoctorData] = useState({
    name: 'Dr. Sarah Johnson',
    specialization: 'Cardiology',
    email: '',
    licenseNumber: ''
  });

  useEffect(() => {
    const userType = localStorage.getItem('userType');
    const userEmail = localStorage.getItem('userEmail');
    const licenseNumber = localStorage.getItem('licenseNumber');
    
    if (userType !== 'doctor') {
      navigate('/login');
      return;
    }
    
    setDoctorData(prev => ({
      ...prev,
      email: userEmail || '',
      licenseNumber: licenseNumber || ''
    }));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userType');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('licenseNumber');
    navigate('/');
  };

  const patientData = [
    { 
      name: "Sarah Johnson", 
      condition: "Diabetes", 
      risk: "Low", 
      lastVisit: "2 days ago", 
      vitals: "Normal",
      patientId: "P-001234",
      confidential: true
    },
    { 
      name: "Michael Chen", 
      condition: "Hypertension", 
      risk: "Medium", 
      lastVisit: "5 days ago", 
      vitals: "Elevated",
      patientId: "P-001235",
      confidential: true
    },
    { 
      name: "Emma Davis", 
      condition: "Post-Surgery", 
      risk: "High", 
      lastVisit: "1 day ago", 
      vitals: "Monitoring",
      patientId: "P-001236",
      confidential: true
    },
  ];

  const upcomingAppointments = [
    { patient: "John Smith", time: "2:00 PM", type: "Follow-up", patientId: "P-001237" },
    { patient: "Lisa Brown", time: "3:30 PM", type: "Consultation", patientId: "P-001238" },
    { patient: "David Wilson", time: "4:15 PM", type: "Check-up", patientId: "P-001239" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="medical-gradient p-2 rounded-xl">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gradient">Doctor Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome back, {doctorData.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">{doctorData.specialization}</Badge>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="flex items-center"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Real-time Vital Signs Chart */}
        <div className="mb-12">
          <VitalSignsChart />
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Quick Stats */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="glass-effect border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-600" />
                  Active Patients
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600 mb-2">2,847</div>
                <div className="flex items-center text-sm text-green-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +12% this month
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-green-600" />
                  Today's Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 mb-2">12</div>
                <div className="text-sm text-gray-600">3 completed, 9 remaining</div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
                  Critical Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600 mb-2">3</div>
                <div className="text-sm text-gray-600">Require immediate attention</div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="glass-effect border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start bg-blue-50 text-blue-700 hover:bg-blue-100 border-0">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Patient
                </Button>
                <Button className="w-full justify-start bg-green-50 text-green-700 hover:bg-green-100 border-0">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <Button className="w-full justify-start bg-purple-50 text-purple-700 hover:bg-purple-100 border-0">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Reminder
                </Button>
                <Button className="w-full justify-start bg-orange-50 text-orange-700 hover:bg-orange-100 border-0">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Follow-up
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-6 space-y-6">
            {/* Patient List - CONFIDENTIAL ACCESS */}
            <Card className="glass-effect border-0 shadow-lg border-l-4 border-l-red-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Patient Monitoring</CardTitle>
                  <Badge variant="destructive" className="flex items-center">
                    <Stethoscope className="w-3 h-3 mr-1" />
                    DOCTOR ACCESS
                  </Badge>
                </div>
                <CardDescription>Real-time patient status and confidential health indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patientData.map((patient, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">{patient.name.split(' ').map(n => n[0]).join('')}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{patient.name}</h4>
                          <p className="text-sm text-gray-600">ID: {patient.patientId}</p>
                          <p className="text-sm text-gray-600">{patient.condition}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge 
                          variant={patient.risk === 'High' ? 'destructive' : patient.risk === 'Medium' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {patient.risk} Risk
                        </Badge>
                        <div className="text-right">
                          <p className="text-sm font-medium">{patient.vitals}</p>
                          <p className="text-xs text-gray-500">{patient.lastVisit}</p>
                        </div>
                        <Button size="sm" variant="outline">
                          <FileText className="w-3 h-3 mr-1" />
                          View Records
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Health Analytics Chart */}
            <Card className="glass-effect border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Health Trends Analytics
                </CardTitle>
                <CardDescription>Patient outcome trends across your practice</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl flex items-end justify-center p-6">
                  <div className="flex items-end space-x-4 w-full">
                    {[65, 78, 45, 89, 67, 82, 94, 73, 88, 76, 91, 85].map((height, index) => (
                      <div
                        key={index}
                        className="medical-gradient rounded-t flex-1 min-h-[20px] opacity-80 hover:opacity-100 transition-opacity"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex justify-between text-sm text-gray-600">
                  <span>Jan</span>
                  <span>Dec</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Appointments & Monitoring */}
          <div className="lg:col-span-3 space-y-6">
            {/* Upcoming Appointments */}
            <Card className="glass-effect border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-purple-600" />
                  Today's Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingAppointments.map((appointment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border border-gray-200">
                      <div>
                        <p className="font-medium text-sm">{appointment.patient}</p>
                        <p className="text-xs text-gray-600">{appointment.type}</p>
                        <p className="text-xs text-gray-500">ID: {appointment.patientId}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-purple-600">{appointment.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Live Monitoring Status */}
            <Card className="glass-effect border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-red-500" />
                  Live Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Sensors</span>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2" />
                      <span className="text-sm font-semibold">247</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Critical Alerts</span>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse mr-2" />
                      <span className="text-sm font-semibold">3</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">System Status</span>
                    <div className="flex items-center">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm font-semibold text-green-600">Optimal</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Patient Alerts */}
            <Card className="glass-effect border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
                  Recent Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-sm font-medium text-red-900">High BP Alert</p>
                    <p className="text-xs text-red-700">Michael Chen - 180/95</p>
                    <p className="text-xs text-gray-500">2 min ago</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="text-sm font-medium text-orange-900">Missed Medication</p>
                    <p className="text-xs text-orange-700">Emma Davis - Evening dose</p>
                    <p className="text-xs text-gray-500">1 hour ago</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-sm font-medium text-yellow-900">Follow-up Due</p>
                    <p className="text-xs text-yellow-700">Sarah Johnson - Diabetes check</p>
                    <p className="text-xs text-gray-500">Today</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
