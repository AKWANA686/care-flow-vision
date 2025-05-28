
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Play, Shield, Zap, Users, Lock } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50" />
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 medical-gradient rounded-full opacity-20 animate-float" />
        <div className="absolute top-40 right-20 w-32 h-32 bg-green-200 rounded-full opacity-30 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-blue-200 rounded-full opacity-40 animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="animate-slide-up">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-6">
              <Zap className="w-4 h-4 mr-2" />
              HIPAA Compliant Healthcare Platform
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Revolutionize{' '}
              <span className="text-gradient">Patient Care</span>{' '}
              with Smart Follow-ups
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Transform healthcare delivery with our comprehensive platform that automates follow-ups, 
              predicts health risks, and ensures no patient falls through the cracks.
            </p>

            {/* Key Benefits */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center">
                <div className="bg-blue-100 w-10 h-10 rounded-xl flex items-center justify-center mr-3">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-sm font-medium text-gray-700">HIPAA Compliant</p>
              </div>
              <div className="flex items-center">
                <div className="bg-green-100 w-10 h-10 rounded-xl flex items-center justify-center mr-3">
                  <Lock className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-sm font-medium text-gray-700">Secure Authentication</p>
              </div>
              <div className="flex items-center">
                <div className="bg-purple-100 w-10 h-10 rounded-xl flex items-center justify-center mr-3">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-sm font-medium text-gray-700">Dual-Role Access</p>
              </div>
              <div className="flex items-center">
                <div className="bg-orange-100 w-10 h-10 rounded-xl flex items-center justify-center mr-3">
                  <Zap className="w-5 h-5 text-orange-600" />
                </div>
                <p className="text-sm font-medium text-gray-700">AI-Powered Insights</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button 
                size="lg" 
                className="medical-gradient text-white hover:opacity-90 transition-all duration-300 transform hover:scale-105"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-gray-300 hover:border-blue-400 transition-colors"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>

            {/* User Type Badges */}
            <div className="flex flex-wrap gap-3">
              <Badge variant="outline" className="border-2 border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100">
                For Doctors
              </Badge>
              <Badge variant="outline" className="border-2 border-green-200 bg-green-50 text-green-700 hover:bg-green-100">
                For Patients
              </Badge>
              <Badge variant="outline" className="border-2 border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100">
                For Healthcare Systems
              </Badge>
            </div>

            {/* Social Proof */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-4">Trusted by leading healthcare organizations</p>
              <div className="flex items-center space-x-8 opacity-60">
                <span className="font-bold text-lg">St.John's Ambulance</span>
                <span className="font-bold text-lg">Nairobi Hospital</span>
                <span className="font-bold text-lg">Aga Khan University Hospital</span>
              </div>
            </div>
          </div>

          {/* Right Content - Healthcare Professional Image & Dashboard Preview */}
          <div className="relative animate-slide-up" style={{ animationDelay: '0.3s' }}>
            {/* Healthcare Professional Image */}
            <div className="relative mb-6">
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop&crop=face"
                alt="Healthcare professional using digital technology"
                className="w-full h-80 object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
              
              {/* Feature badges on image */}
              <div className="absolute bottom-4 left-4 flex gap-2">
                <Badge className="bg-white/90 text-blue-600 hover:bg-white">
                  Real-time Monitoring
                </Badge>
                <Badge className="bg-white/90 text-green-600 hover:bg-white">
                  AI Predictions
                </Badge>
              </div>
            </div>

            <div className="relative">
              {/* Main Dashboard Card */}
              <div className="glass-effect rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Patient Dashboard</h3>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse-slow" />
                    <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse-slow" style={{ animationDelay: '1s' }} />
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }} />
                  </div>
                </div>
                
                {/* Mock Analytics */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <p className="text-sm text-blue-600 font-medium">Active Patients</p>
                    <p className="text-2xl font-bold text-blue-800">2,847</p>
                    <p className="text-xs text-green-600">↑ 12% this month</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-xl">
                    <p className="text-sm text-green-600 font-medium">Follow-up Rate</p>
                    <p className="text-2xl font-bold text-green-800">94%</p>
                    <p className="text-xs text-green-600">↑ 8% this month</p>
                  </div>
                </div>

                {/* Mock Chart */}
                <div className="h-32 bg-gradient-to-r from-blue-100 to-green-100 rounded-xl flex items-end justify-center p-4">
                  <div className="flex items-end space-x-2">
                    {[40, 65, 45, 80, 55, 70, 85].map((height, index) => (
                      <div
                        key={index}
                        className="medical-gradient rounded-t w-4"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Login Card */}
              <div className="absolute -top-10 -right-10 glass-effect rounded-xl p-4 shadow-lg animate-float bg-white/90 border border-blue-100 w-64">
                <h4 className="font-medium text-sm mb-2 text-blue-800">Dual-Role Login System</h4>
                <div className="space-y-2">
                  <div className="bg-blue-50 rounded p-2 text-xs flex items-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                    <span>Doctor Portal Access</span>
                  </div>
                  <div className="bg-green-50 rounded p-2 text-xs flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    <span>Patient Portal Access</span>
                  </div>
                </div>
              </div>

              {/* Subscription Card */}
              <div className="absolute -bottom-6 -left-6 glass-effect rounded-xl p-4 shadow-lg animate-float bg-white/90 border border-green-100" style={{ animationDelay: '3s' }}>
                <h4 className="font-medium text-sm mb-2 text-green-800">Subscription Plans</h4>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Free Tier Available</span>
                  <Badge className="bg-green-500">New</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
