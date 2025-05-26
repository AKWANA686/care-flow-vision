
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import VitalSignsChart from '@/components/VitalSignsChart';
import VitalSignsCard from '@/components/VitalSignsCard';
import { formatToEAT, formatTimeEAT } from '@/utils/timeUtils';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  AlertTriangle, 
  Heart, 
  Activity,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  Phone,
  MessageSquare,
  Mail,
  Thermometer,
  Droplets
} from 'lucide-react';

const DashboardPreview = () => {
  // Updated with Kenyan names
  const patientData = [
    { name: "Sharon Nyambogo", condition: "Diabetes", risk: "Low", lastVisit: "2 days ago", vitals: "Normal", location: "Westlands" },
    { name: "John Karanja", condition: "Hypertension", risk: "Medium", lastVisit: "5 days ago", vitals: "Elevated", location: "Karen" },
    { name: "Grace Mwadzoya", condition: "Post-Surgery", risk: "High", lastVisit: "1 day ago", vitals: "Monitoring", location: "Kilimani" },
    { name: "Abdul Mohammed", condition: "Heart Disease", risk: "High", lastVisit: "3 hours ago", vitals: "Critical", location: "Eastleigh" },
    { name: "Cyprian Nyakundi", condition: "Routine Checkup", risk: "Low", lastVisit: "1 week ago", vitals: "Normal", location: "Upper Hill" },
  ];

  const upcomingAppointments = [
    { patient: "Tabitha Njeri", time: formatTimeEAT(new Date(Date.now() + 2 * 60 * 60 * 1000)), type: "Follow-up", location: "Kasarani" },
    { patient: "Ruth Nyamwea", time: formatTimeEAT(new Date(Date.now() + 3.5 * 60 * 60 * 1000)), type: "Consultation", location: "Lavington" },
    { patient: "Angela Kakai", time: formatTimeEAT(new Date(Date.now() + 4.25 * 60 * 60 * 1000)), type: "Check-up", location: "Parklands" },
  ];

  // Sample vital signs data with proper Kenya context
  const vitalSigns = [
    {
      title: "Heart Rate",
      value: 78,
      unit: "bpm",
      icon: <Heart className="w-5 h-5 text-red-500" />,
      trend: "stable" as const,
      status: "normal" as const,
      normalRange: "60-100 bpm"
    },
    {
      title: "Blood Pressure",
      value: "120/80",
      unit: "mmHg",
      icon: <Activity className="w-5 h-5 text-blue-500" />,
      trend: "up" as const,
      status: "normal" as const,
      normalRange: "<120/80 mmHg"
    },
    {
      title: "Temperature",
      value: 98.6, // Will be converted to Celsius
      unit: "°F",
      icon: <Thermometer className="w-5 h-5 text-orange-500" />,
      trend: "stable" as const,
      status: "normal" as const,
      normalRange: "36.1-37.2°C",
      isTemperature: true
    },
    {
      title: "O2 Saturation",
      value: 97,
      unit: "%",
      icon: <Droplets className="w-5 h-5 text-purple-500" />,
      trend: "down" as const,
      status: "normal" as const,
      normalRange: "95-100%"
    }
  ];

  return (
    <section id="dashboard" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 dark:text-white">
            Intelligent{' '}
            <span className="text-gradient">Dashboard Experience</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Get real-time insights into patient health across Nairobi, track follow-up compliance, 
            and make data-driven decisions with our comprehensive dashboard featuring East Africa Time synchronization.
          </p>
        </div>

        {/* Enhanced Vital Signs Cards */}
        <div className="mb-12 animate-slide-up">
          <h3 className="text-2xl font-bold mb-6 text-center dark:text-white">Live Vital Signs Monitoring</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {vitalSigns.map((vital, index) => (
              <VitalSignsCard key={index} {...vital} />
            ))}
          </div>
        </div>

        {/* Real-time Vital Signs Chart */}
        <div className="mb-12 animate-slide-up">
          <VitalSignsChart />
        </div>

        {/* Dashboard Layout */}
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Quick Stats */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="glass-effect border-0 shadow-lg animate-slide-up dark:bg-gray-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center dark:text-white">
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
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Across Nairobi facilities
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-0 shadow-lg animate-slide-up dark:bg-gray-800" style={{ animationDelay: '0.1s' }}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center dark:text-white">
                  <Calendar className="w-5 h-5 mr-2 text-green-600" />
                  Follow-up Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 mb-2">94%</div>
                <div className="flex items-center text-sm text-green-600">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  +8% improvement
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  EAT timezone tracking
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-0 shadow-lg animate-slide-up dark:bg-gray-800" style={{ animationDelay: '0.2s' }}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center dark:text-white">
                  <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
                  Priority Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600 mb-2">7</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Require attention</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Updated: {formatTimeEAT(new Date())}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-6 space-y-6">
            {/* Patient List with Kenyan names and locations */}
            <Card className="glass-effect border-0 shadow-lg animate-slide-up dark:bg-gray-800" style={{ animationDelay: '0.3s' }}>
              <CardHeader>
                <CardTitle className="text-xl dark:text-white">Patient Monitoring - Nairobi Network</CardTitle>
                <CardDescription className="dark:text-gray-300">Real-time patient status across Nairobi healthcare facilities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patientData.map((patient, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white dark:bg-gray-700 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">{patient.name.split(' ').map(n => n[0]).join('')}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">{patient.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{patient.condition}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">📍 {patient.location}</p>
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
                          <p className="text-sm font-medium dark:text-white">{patient.vitals}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{patient.lastVisit}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Health Analytics Chart */}
            <Card className="glass-effect border-0 shadow-lg animate-slide-up dark:bg-gray-800" style={{ animationDelay: '0.4s' }}>
              <CardHeader>
                <CardTitle className="text-xl flex items-center dark:text-white">
                  <Activity className="w-5 h-5 mr-2" />
                  Health Trends Analytics - Kenya
                </CardTitle>
                <CardDescription className="dark:text-gray-300">Patient outcome trends across Nairobi healthcare network</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-xl flex items-end justify-center p-6">
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
                <div className="mt-4 flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Jan</span>
                  <span>Dec</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Appointments & Alerts */}
          <div className="lg:col-span-3 space-y-6">
            {/* Upcoming Appointments with EAT times */}
            <Card className="glass-effect border-0 shadow-lg animate-slide-up dark:bg-gray-800" style={{ animationDelay: '0.5s' }}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center dark:text-white">
                  <Clock className="w-5 h-5 mr-2 text-purple-600" />
                  Today's Schedule (EAT)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingAppointments.map((appointment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                      <div>
                        <p className="font-medium text-sm dark:text-white">{appointment.patient}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-300">{appointment.type}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">📍 {appointment.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-purple-600">{appointment.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="glass-effect border-0 shadow-lg animate-slide-up dark:bg-gray-800" style={{ animationDelay: '0.6s' }}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg dark:text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start bg-blue-50 text-blue-700 hover:bg-blue-100 border-0 dark:bg-blue-900/20 dark:text-blue-300 dark:hover:bg-blue-900/30">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Patient
                </Button>
                <Button className="w-full justify-start bg-green-50 text-green-700 hover:bg-green-100 border-0 dark:bg-green-900/20 dark:text-green-300 dark:hover:bg-green-900/30">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <Button className="w-full justify-start bg-purple-50 text-purple-700 hover:bg-purple-100 border-0 dark:bg-purple-900/20 dark:text-purple-300 dark:hover:bg-purple-900/30">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Reminder
                </Button>
                <Button className="w-full justify-start bg-orange-50 text-orange-700 hover:bg-orange-100 border-0 dark:bg-orange-900/20 dark:text-orange-300 dark:hover:bg-orange-900/30">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Follow-up
                </Button>
              </CardContent>
            </Card>

            {/* Live Monitoring Status */}
            <Card className="glass-effect border-0 shadow-lg animate-slide-up dark:bg-gray-800" style={{ animationDelay: '0.7s' }}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center dark:text-white">
                  <Heart className="w-5 h-5 mr-2 text-red-500" />
                  Live Monitoring - Kenya
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm dark:text-gray-300">Active Sensors</span>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2" />
                      <span className="text-sm font-semibold dark:text-white">247</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm dark:text-gray-300">Critical Alerts</span>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse mr-2" />
                      <span className="text-sm font-semibold dark:text-white">3</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm dark:text-gray-300">System Status</span>
                    <div className="flex items-center">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm font-semibold text-green-600 dark:text-green-400">Optimal</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Last sync: {formatToEAT(new Date())}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;
