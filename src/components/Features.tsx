
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Brain, 
  MessageSquare, 
  Calendar, 
  Bell, 
  Activity, 
  Shield, 
  Smartphone, 
  BarChart3,
  Heart,
  Stethoscope,
  Users,
  Zap
} from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Brain,
      title: "AI Predictive Analytics",
      description: "Advanced machine learning algorithms predict health risks and recommend proactive interventions before issues escalate.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Activity,
      title: "Real-time Vital Monitoring", 
      description: "Continuous monitoring of patient vitals with instant alerts for healthcare providers when abnormalities are detected.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: MessageSquare,
      title: "Smart Communication Hub",
      description: "Multi-channel messaging system with AI-powered language translation and automated response suggestions.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Calendar,
      title: "Dynamic Scheduling",
      description: "Intelligent appointment scheduling that adapts to patient needs, provider availability, and urgency levels.",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: Bell,
      title: "Smart Alert System",
      description: "Customizable notification system with escalation protocols ensuring critical information reaches the right person.",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Comprehensive dashboards with population health insights, treatment effectiveness, and operational metrics.",
      gradient: "from-teal-500 to-green-500"
    }
  ];

  const additionalFeatures = [
    {
      icon: Shield,
      title: "HIPAA Compliance",
      description: "Enterprise-grade security with end-to-end encryption"
    },
    {
      icon: Smartphone,
      title: "Mobile First",
      description: "Optimized mobile experience for patients and providers"
    },
    {
      icon: Heart,
      title: "Patient Engagement",
      description: "Gamified health tracking with rewards and achievements"
    },
    {
      icon: Stethoscope,
      title: "Clinical Integration",
      description: "Seamless EHR integration with major healthcare systems"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Multi-disciplinary care team coordination tools"
    },
    {
      icon: Zap,
      title: "IoT Integration",
      description: "Connect with wearables and smart medical devices"
    }
  ];

  return (
    <section id="features" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            Powerful Features for{' '}
            <span className="text-gradient">Modern Healthcare</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive platform combines cutting-edge AI technology with intuitive design 
            to revolutionize patient care and healthcare delivery.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="text-center">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} p-4 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-full h-full text-white" />
                </div>
                <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Features */}
        <div className="bg-white rounded-3xl p-8 shadow-xl">
          <h3 className="text-2xl font-bold text-center mb-8">Additional Capabilities</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalFeatures.map((feature, index) => (
              <div 
                key={index} 
                className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="medical-gradient p-3 rounded-xl">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
