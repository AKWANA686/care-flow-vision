
import { useState } from 'react';
import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import FreeTrialModal from './FreeTrialModal';

const Testimonials = () => {
  const [isFreeTrialModalOpen, setIsFreeTrialModalOpen] = useState(false);
  
  const testimonials = [
    {
      name: "Dr. Sarah Mitchell",
      role: "Cardiologist, St. Mary's Hospital",
      content: "This platform has revolutionized how we manage patient follow-ups. The automated reminder system has reduced our no-show rate by 40%, and the real-time monitoring capabilities have helped us catch critical issues early.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1594824405180-096c5c7f5beb?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Maria Rodriguez",
      role: "Patient - Diabetes Management",
      content: "As someone managing diabetes, this platform keeps me connected with my healthcare team. The automated reminders help me stay on track with appointments, and I love being able to message my doctor directly.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Dr. James Chen",
      role: "Internal Medicine, Metro Health",
      content: "The AI-powered insights have been game-changing. We can now predict which patients need immediate attention and proactively schedule follow-ups. It's like having a smart assistant that never sleeps.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Jennifer Thompson",
      role: "Patient - Post-Surgery Care",
      content: "After my surgery, this platform made my recovery so much smoother. The video consultations saved me multiple trips to the hospital, and my doctor could monitor my progress in real-time.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Dr. Amanda Foster",
      role: "Emergency Medicine Director",
      content: "The real-time patient monitoring has been crucial in our emergency department. We can track vital signs remotely and get alerts for any concerning changes. It's enhanced our response time significantly.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1594824405180-096c5c7f5beb?w=150&h=150&fit=crop&crop=center"
    },
    {
      name: "Robert Kim",
      role: "Patient - Chronic Care Management",
      content: "Managing my chronic condition has never been easier. The platform reminds me of medications, tracks my symptoms, and keeps my care team informed. I feel more in control of my health.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Trusted by Healthcare Professionals & Patients
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Join thousands of healthcare providers and patients who have transformed their care experience with our platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="relative">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover ring-4 ring-blue-100 dark:ring-blue-800 group-hover:ring-blue-200 dark:group-hover:ring-blue-700 transition-all duration-300"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white dark:border-gray-800"></div>
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-lg">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>

                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                <div className="relative">
                  <Quote className="absolute top-0 left-0 w-8 h-8 text-blue-200 dark:text-blue-700 transform -translate-x-2 -translate-y-2" />
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic pl-6">
                    "{testimonial.content}"
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">10,000+</div>
              <div className="text-gray-600 dark:text-gray-400">Active Patients</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">500+</div>
              <div className="text-gray-600 dark:text-gray-400">Healthcare Providers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">94%</div>
              <div className="text-gray-600 dark:text-gray-400">Follow-up Success Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">40%</div>
              <div className="text-gray-600 dark:text-gray-400">Reduction in No-shows</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Transform Your Healthcare Experience?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join the growing community of healthcare professionals and patients who are experiencing better outcomes with our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setIsFreeTrialModalOpen(true)}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Start Free Trial
            </button>
            <button className="px-8 py-3 border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 rounded-lg font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
              Schedule Demo
            </button>
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

export default Testimonials;
