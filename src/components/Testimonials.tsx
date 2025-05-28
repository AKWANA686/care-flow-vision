
import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Dr. Sarah Mitchell",
      role: "Cardiologist, St. Mary's Hospital",
      content: "This platform has revolutionized how we manage patient follow-ups. The automated reminder system has reduced our no-show rate by 40%, and the real-time monitoring capabilities have helped us catch critical issues early.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Maria Rodriguez",
      role: "Patient - Diabetes Management",
      content: "As someone managing diabetes, this platform keeps me connected with my healthcare team. The automated reminders help me stay on track with appointments, and I love being able to message my doctor directly.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Dr. James Chen",
      role: "Internal Medicine, Metro Health",
      content: "The AI-powered insights have been game-changing. We can now predict which patients need immediate attention and proactively schedule follow-ups. It's like having a smart assistant that never sleeps.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=150&h=150&fit=crop&crop=faces"
    },
    {
      name: "Jennifer Thompson",
      role: "Patient - Post-Surgery Care",
      content: "After my surgery, this platform made my recovery so much smoother. The video consultations saved me multiple trips to the hospital, and my doctor could monitor my progress in real-time.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&h=150&fit=crop&crop=center"
    },
    {
      name: "Dr. Amanda Foster",
      role: "Emergency Medicine Director",
      content: "The real-time patient monitoring has been crucial in our emergency department. We can track vital signs remotely and get alerts for any concerning changes. It's enhanced our response time significantly.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=150&h=150&fit=crop&crop=entropy"
    },
    {
      name: "Robert Kim",
      role: "Patient - Chronic Care Management",
      content: "Managing my chronic condition has never been easier. The platform reminds me of medications, tracks my symptoms, and keeps my care team informed. I feel more in control of my health.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=150&h=150&fit=crop&crop=center"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Trusted by Healthcare Professionals & Patients
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of healthcare providers and patients who have transformed their care experience with our platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="relative">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover ring-4 ring-blue-100 group-hover:ring-blue-200 transition-all duration-300"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="font-semibold text-gray-900 text-lg">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>

                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                <div className="relative">
                  <Quote className="absolute top-0 left-0 w-8 h-8 text-blue-200 transform -translate-x-2 -translate-y-2" />
                  <p className="text-gray-700 leading-relaxed italic pl-6">
                    "{testimonial.content}"
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-gray-600">Active Patients</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
              <div className="text-gray-600">Healthcare Providers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">94%</div>
              <div className="text-gray-600">Follow-up Success Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">40%</div>
              <div className="text-gray-600">Reduction in No-shows</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Healthcare Experience?
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join the growing community of healthcare professionals and patients who are experiencing better outcomes with our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Start Free Trial
            </button>
            <button className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              Schedule Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
