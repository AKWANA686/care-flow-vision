import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Crown } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import PaymentModal from './PaymentModal';

const Pricing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: string } | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const plans = [
    {
      name: "Nairobi Basic",
      price: "Ksh. 2,000",
      period: "/month",
      description: "Perfect for small clinics and individual practitioners in Nairobi",
      icon: Zap,
      popular: false,
      features: [
        "Up to 500 patients",
        "Basic follow-up automation",
        "SMS & WhatsApp reminders",
        "Standard reporting",
        "Email support",
        "Mobile app access",
        "HIPAA compliance",
        "Basic integrations"
      ]
    },
    {
      name: "Kenya Professional",
      price: "Ksh. 6,000",
      period: "/month",
      description: "Advanced features for growing healthcare facilities across Kenya",
      icon: Star,
      popular: true,
      features: [
        "Up to 2,500 patients",
        "AI-powered risk assessment",
        "Multi-channel communication",
        "Advanced analytics dashboard",
        "Priority support",
        "Custom workflows",
        "EHR integrations",
        "IoT device connectivity",
        "Team collaboration tools",
        "API access"
      ]
    },
    {
      name: "East Africa Enterprise",
      price: "Custom",
      period: "pricing",
      description: "Comprehensive solution for large healthcare systems in East Africa",
      icon: Crown,
      popular: false,
      features: [
        "Unlimited patients",
        "Full AI suite & predictions",
        "White-label solution",
        "Custom integrations",
        "Dedicated account manager",
        "24/7 premium support",
        "Advanced security features",
        "Population health analytics",
        "Blockchain medical records",
        "Revenue optimization tools",
        "Clinical trial management",
        "Custom development"
      ]
    }
  ];

  const handlePlanSelect = (plan: { name: string; price: string }) => {
    const userType = localStorage.getItem('userType');
    const userId = userType === 'patient'
      ? localStorage.getItem('patientId')
      : localStorage.getItem('licenseNumber');

    if (!userType || !userId) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to subscribe to a plan',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    if (plan.name === 'East Africa Enterprise') {
      // Handle enterprise plan differently
      toast({
        title: 'Contact Sales',
        description: 'Please contact our sales team for enterprise pricing',
      });
      return;
    }

    setSelectedPlan(plan);
    setIsPaymentModalOpen(true);
  };

  return (
    <section id="pricing" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            Simple,{' '}
            <span className="text-gradient">Transparent Pricing</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the perfect plan for your healthcare organization.
            All plans include our core features with no hidden fees.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-slide-up ${
                plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="medical-gradient text-white px-4 py-1 text-sm font-medium">
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-8">
                <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
                  plan.popular ? 'medical-gradient' : 'bg-gray-100'
                }`}>
                  <plan.icon className={`w-8 h-8 ${plan.popular ? 'text-white' : 'text-gray-600'}`} />
                </div>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-600 ml-1">{plan.period}</span>
                </div>
                <CardDescription className="text-gray-600 mt-2">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <Button
                  className={`w-full ${
                    plan.popular
                      ? 'medical-gradient text-white hover:opacity-90'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  } transition-all duration-300`}
                  size="lg"
                  onClick={() => handlePlanSelect({ name: plan.name, price: plan.price })}
                >
                  {plan.name === "East Africa Enterprise" ? "Contact Sales" : "Subscribe Now"}
                </Button>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Everything included:</h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ROI Section */}
        <div className="mt-20 bg-white rounded-3xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">Return on Investment</h3>
            <p className="text-gray-600">Healthcare organizations using CareFlow Vision see measurable results</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">67%</div>
              <p className="text-sm text-gray-600">Reduction in missed appointments</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">45%</div>
              <p className="text-sm text-gray-600">Improvement in patient compliance</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">$2.3M</div>
              <p className="text-sm text-gray-600">Average annual cost savings</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">8.5x</div>
              <p className="text-sm text-gray-600">ROI within first year</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {selectedPlan && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setSelectedPlan(null);
          }}
          plan={selectedPlan}
          onSuccess={() => {
            toast({
              title: 'Payment Successful',
              description: 'Thank you for subscribing to CareFlow Vision!',
            });
          }}
        />
      )}
    </section>
  );
};

export default Pricing;
