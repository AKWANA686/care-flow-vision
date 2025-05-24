
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, User, Stethoscope, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [patientForm, setPatientForm] = useState({
    email: '',
    password: '',
    patientId: ''
  });
  const [doctorForm, setDoctorForm] = useState({
    email: '',
    password: '',
    licenseNumber: ''
  });

  const handlePatientLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate authentication
    setTimeout(() => {
      localStorage.setItem('userType', 'patient');
      localStorage.setItem('userEmail', patientForm.email);
      localStorage.setItem('patientId', patientForm.patientId);
      navigate('/patient-dashboard');
      setIsLoading(false);
    }, 1500);
  };

  const handleDoctorLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate authentication
    setTimeout(() => {
      localStorage.setItem('userType', 'doctor');
      localStorage.setItem('userEmail', doctorForm.email);
      localStorage.setItem('licenseNumber', doctorForm.licenseNumber);
      navigate('/doctor-dashboard');
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center text-gray-600 hover:text-primary mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="medical-gradient p-2 rounded-xl">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gradient">CareFlow Vision</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Sign in to access your healthcare dashboard</p>
        </div>

        <Card className="glass-effect border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Choose your account type to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="patient" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="patient" className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Patient</span>
                </TabsTrigger>
                <TabsTrigger value="doctor" className="flex items-center space-x-2">
                  <Stethoscope className="w-4 h-4" />
                  <span>Doctor</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="patient">
                <form onSubmit={handlePatientLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="patient-id">Patient ID</Label>
                    <Input
                      id="patient-id"
                      type="text"
                      placeholder="Enter your patient ID"
                      value={patientForm.patientId}
                      onChange={(e) => setPatientForm({...patientForm, patientId: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patient-email">Email</Label>
                    <Input
                      id="patient-email"
                      type="email"
                      placeholder="Enter your email"
                      value={patientForm.email}
                      onChange={(e) => setPatientForm({...patientForm, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patient-password">Password</Label>
                    <Input
                      id="patient-password"
                      type="password"
                      placeholder="Enter your password"
                      value={patientForm.password}
                      onChange={(e) => setPatientForm({...patientForm, password: e.target.value})}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full medical-gradient text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In as Patient'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="doctor">
                <form onSubmit={handleDoctorLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="doctor-license">Medical License Number</Label>
                    <Input
                      id="doctor-license"
                      type="text"
                      placeholder="Enter your license number"
                      value={doctorForm.licenseNumber}
                      onChange={(e) => setDoctorForm({...doctorForm, licenseNumber: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doctor-email">Email</Label>
                    <Input
                      id="doctor-email"
                      type="email"
                      placeholder="Enter your email"
                      value={doctorForm.email}
                      onChange={(e) => setDoctorForm({...doctorForm, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doctor-password">Password</Label>
                    <Input
                      id="doctor-password"
                      type="password"
                      placeholder="Enter your password"
                      value={doctorForm.password}
                      onChange={(e) => setDoctorForm({...doctorForm, password: e.target.value})}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full medical-gradient text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In as Doctor'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary hover:underline">
                  Register here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
