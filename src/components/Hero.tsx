
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Shield, Zap, Users } from 'lucide-react';

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
              AI-Powered Healthcare Platform
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
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center">
                <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-sm font-medium text-gray-700">HIPAA Compliant</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-sm font-medium text-gray-700">Real-time AI</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-sm font-medium text-gray-700">Multi-channel</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="medical-gradient text-white hover:opacity-90 transition-all duration-300 transform hover:scale-105"
              >
                Start Free Trial
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

            {/* Social Proof */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-4">Trusted by leading healthcare organizations</p>
              <div className="flex items-center space-x-8 opacity-60">
                <span className="font-bold text-lg">Mayo Clinic</span>
                <span className="font-bold text-lg">Johns Hopkins</span>
                <span className="font-bold text-lg">Cleveland Clinic</span>
              </div>
            </div>
          </div>

          {/* Right Content - Dashboard Preview */}
          <div className="relative animate-slide-up" style={{ animationDelay: '0.3s' }}>
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

              {/* Floating Cards */}
              <div className="absolute -top-4 -right-4 glass-effect rounded-xl p-4 shadow-lg animate-float">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <p className="text-sm font-medium">Live Monitoring</p>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 glass-effect rounded-xl p-4 shadow-lg animate-float" style={{ animationDelay: '2s' }}>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                  <p className="text-sm font-medium">AI Predictions</p>
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
