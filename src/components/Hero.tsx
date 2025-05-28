
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Play, Shield, Zap, Users, Lock } from 'lucide-react';
import VideoModal from './VideoModal';
import FreeTrialModal from './FreeTrialModal';

const Hero = () => {
  const [isFreeTrialModalOpen, setIsFreeTrialModalOpen] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 medical-gradient rounded-full opacity-20 animate-float" />
        <div className="absolute top-40 right-20 w-32 h-32 bg-green-200 dark:bg-green-800 rounded-full opacity-30 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-blue-200 dark:bg-blue-800 rounded-full opacity-40 animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="animate-slide-up">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium mb-6">
              <Zap className="w-4 h-4 mr-2" />
              HIPAA Compliant Healthcare Platform
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-gray-900 dark:text-white">
              Revolutionize{' '}
              <span className="text-gradient">Patient Care</span>{' '}
              with Smart Follow-ups
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Transform healthcare delivery with our comprehensive platform that automates follow-ups, 
              predicts health risks, and ensures no patient falls through the cracks.
            </p>

            {/* Key Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center">
                <div className="bg-blue-100 dark:bg-blue-900 w-10 h-10 rounded-xl flex items-center justify-center mr-3">
                  <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">HIPAA Compliant</p>
              </div>
              <div className="flex items-center">
                <div className="bg-green-100 dark:bg-green-900 w-10 h-10 rounded-xl flex items-center justify-center mr-3">
                  <Lock className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Secure Authentication</p>
              </div>
              <div className="flex items-center">
                <div className="bg-purple-100 dark:bg-purple-900 w-10 h-10 rounded-xl flex items-center justify-center mr-3">
                  <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Dual-Role Access</p>
              </div>
              <div className="flex items-center">
                <div className="bg-orange-100 dark:bg-orange-900 w-10 h-10 rounded-xl flex items-center justify-center mr-3">
                  <Zap className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">AI-Powered Insights</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button 
                size="lg" 
                className="medical-gradient text-white hover:opacity-90 transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
                onClick={() => setIsFreeTrialModalOpen(true)}
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <VideoModal 
                videoUrl="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="CareFlow Vision Platform Demo"
              >
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-400 transition-colors w-full sm:w-auto text-gray-900 dark:text-gray-100"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </VideoModal>
            </div>

            {/* User Type Badges */}
            <div className="flex flex-wrap gap-3 mb-8">
              <Badge variant="outline" className="border-2 border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900">
                For Doctors
              </Badge>
              <Badge variant="outline" className="border-2 border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/50 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900">
                For Patients
              </Badge>
              <Badge variant="outline" className="border-2 border-purple-200 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900">
                For Healthcare Systems
              </Badge>
            </div>

            {/* Social Proof */}
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Trusted by leading healthcare organizations</p>
              <div className="flex flex-wrap items-center gap-4 sm:gap-8 opacity-60">
                <span className="font-bold text-sm sm:text-lg text-gray-700 dark:text-gray-300">St.John's Ambulance</span>
                <span className="font-bold text-sm sm:text-lg text-gray-700 dark:text-gray-300">Nairobi Hospital</span>
                <span className="font-bold text-sm sm:text-lg text-gray-700 dark:text-gray-300">Aga Khan University Hospital</span>
              </div>
            </div>
          </div>

          {/* Right Content - Healthcare Professional Image & Dashboard Preview */}
          <div className="relative animate-slide-up" style={{ animationDelay: '0.3s' }}>
            {/* Healthcare Professional Image - Black Doctor and Patient */}
            <div className="relative mb-6">
              <img 
                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&h=400&fit=crop&crop=face"
                alt="Black doctor consulting with black patient using digital technology"
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
              <div className="glass-effect rounded-2xl p-6 shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Patient Dashboard</h3>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse-slow" />
                    <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse-slow" style={{ animationDelay: '1s' }} />
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }} />
                  </div>
                </div>
                
                {/* Mock Analytics */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-blue-50 dark:bg-blue-900/50 p-4 rounded-xl">
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Active Patients</p>
                    <p className="text-2xl font-bold text-blue-800 dark:text-blue-300">2,847</p>
                    <p className="text-xs text-green-600 dark:text-green-400">↑ 12% this month</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/50 p-4 rounded-xl">
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">Follow-up Rate</p>
                    <p className="text-2xl font-bold text-green-800 dark:text-green-300">94%</p>
                    <p className="text-xs text-green-600 dark:text-green-400">↑ 8% this month</p>
                  </div>
                </div>

                {/* Mock Chart */}
                <div className="h-32 bg-gradient-to-r from-blue-100 to-green-100 dark:from-blue-900/50 dark:to-green-900/50 rounded-xl flex items-end justify-center p-4">
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
              <div className="absolute -top-10 -right-10 glass-effect rounded-xl p-4 shadow-lg animate-float bg-white/90 dark:bg-gray-800/90 border border-blue-100 dark:border-blue-700 w-64">
                <h4 className="font-medium text-sm mb-2 text-blue-800 dark:text-blue-300">Dual-Role Login System</h4>
                <div className="space-y-2">
                  <div className="bg-blue-50 dark:bg-blue-900/50 rounded p-2 text-xs flex items-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                    <span className="text-gray-700 dark:text-gray-300">Doctor Portal Access</span>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/50 rounded p-2 text-xs flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    <span className="text-gray-700 dark:text-gray-300">Patient Portal Access</span>
                  </div>
                </div>
              </div>

              {/* Subscription Card */}
              <div className="absolute -bottom-6 -left-6 glass-effect rounded-xl p-4 shadow-lg animate-float bg-white/90 dark:bg-gray-800/90 border border-green-100 dark:border-green-700" style={{ animationDelay: '3s' }}>
                <h4 className="font-medium text-sm mb-2 text-green-800 dark:text-green-300">Subscription Plans</h4>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">Free Tier Available</span>
                  <Badge className="bg-green-500">New</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Free Trial Modal */}
      <FreeTrialModal 
        isOpen={isFreeTrialModalOpen} 
        onClose={() => setIsFreeTrialModalOpen(false)} 
      />
    </section>
  );
};

export default Hero;
