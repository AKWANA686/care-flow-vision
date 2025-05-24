
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, User, Stethoscope, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate registration
    setTimeout(() => {
      navigate('/login');
      setIsLoading(false);
    }, 2000);
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
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-600 mt-2">Join CareFlow Vision today</p>
        </div>

        <Card className="glass-effect border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-center">Register</CardTitle>
            <CardDescription className="text-center">
              Choose your account type
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
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input id="first-name" placeholder="John" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input id="last-name" placeholder="Doe" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date-of-birth">Date of Birth</Label>
                    <Input id="date-of-birth" type="date" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patient-email">Email</Label>
                    <Input id="patient-email" type="email" placeholder="john@example.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patient-password">Password</Label>
                    <Input id="patient-password" type="password" required />
                  </div>
                  <Button
                    type="submit"
                    className="w-full medical-gradient text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating Account...' : 'Register as Patient'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="doctor">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="doctor-first-name">First Name</Label>
                      <Input id="doctor-first-name" placeholder="Dr. Jane" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="doctor-last-name">Last Name</Label>
                      <Input id="doctor-last-name" placeholder="Smith" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="license-number">Medical License Number</Label>
                    <Input id="license-number" placeholder="MD123456" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialization">Specialization</Label>
                    <Input id="specialization" placeholder="Cardiology" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doctor-email">Email</Label>
                    <Input id="doctor-email" type="email" placeholder="dr.smith@hospital.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doctor-password">Password</Label>
                    <Input id="doctor-password" type="password" required />
                  </div>
                  <Button
                    type="submit"
                    className="w-full medical-gradient text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating Account...' : 'Register as Doctor'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:underline">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
