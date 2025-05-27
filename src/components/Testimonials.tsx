
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    name: "Sharon Nyambogo",
    role: "Diabetes Patient",
    location: "Kilimani, Nairobi",
    avatar: "/kenyan-woman-1.jpg",
    rating: 5,
    content: "CareFlow Vision transformed how I manage my diabetes in Nairobi. The glucose tracking and automatic reminders help me stay on top of my condition. My endocrinologist at Nairobi Hospital can monitor my readings in real-time!"
  },
  {
    name: "John Karanja", 
    role: "IT Consultant",
    location: "Westlands, Nairobi",
    avatar: "/kenyan-man-1.jpg",
    rating: 5,
    content: "As a busy professional in Westlands, having my health data accessible through CareFlow Vision gives me peace of mind. I can video consult my doctor during lunch breaks and get e-prescriptions delivered to my pharmacy."
  },
  {
    name: "Grace Mwadzoya",
    role: "Teacher",
    location: "Karen, Nairobi",
    avatar: "/kenyan-woman-2.jpg", 
    rating: 5,
    content: "The doctor-patient communication feature helped me tremendously during my pregnancy. My OB-GYN at Aga Khan Hospital responded quickly to all my questions, and the appointment reminders were lifesavers!"
  },
  {
    name: "David Omondi",
    role: "Small Business Owner",
    location: "Eastleigh, Nairobi",
    avatar: "/kenyan-man-2.jpg",
    rating: 4,
    content: "Being able to access my family's medical records from my phone in Eastleigh has saved us countless trips to the clinic. The Swahili language option makes it easy for my elderly parents to use too."
  },
  {
    name: "Wanjiku Muthoni",
    role: "Retiree",
    location: "Runda, Nairobi", 
    avatar: "/kenyan-woman-3.jpg",
    rating: 5,
    content: "At my age, keeping track of medications was challenging. CareFlow Vision's voice reminders in Kikuyu help me take my pills on time. My daughter in Mombasa can also check on my health remotely."
  }
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < rating 
            ? 'text-yellow-400 fill-yellow-400' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section id="testimonials" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            What <span className="text-blue-600">Kenyans Say</span> About CareFlow
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Real stories from patients and doctors across Nairobi's neighborhoods
          </p>
        </div>

        {/* Mobile/Tablet Carousel */}
        <div className="md:hidden relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-2">
                  <Card className="bg-white border-none shadow-lg h-full">
                    <CardContent className="p-6">
                      <div className="flex justify-center mb-4">
                        {renderStars(testimonial.rating)}
                      </div>
                      <Quote className="h-8 w-8 text-blue-500 mx-auto mb-4 opacity-50" />
                      <p className="text-gray-700 mb-6 italic text-center">
                        "{testimonial.content}"
                      </p>
                      <div className="flex flex-col items-center">
                        <Avatar className="h-14 w-14 mb-3 border-2 border-blue-100">
                          <AvatarImage src={testimonial.avatar} />
                          <AvatarFallback className="bg-blue-100 text-blue-800 font-medium">
                            {testimonial.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <h4 className="font-semibold text-gray-900 text-center">
                          {testimonial.name}
                        </h4>
                        <p className="text-blue-600 text-sm text-center">
                          {testimonial.role}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          {testimonial.location}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <Button
            variant="ghost"
            size="icon"
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow-md hover:bg-gray-100"
          >
            <ChevronLeft className="h-5 w-5 text-blue-600" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-md hover:bg-gray-100"
          >
            <ChevronRight className="h-5 w-5 text-blue-600" />
          </Button>

          {/* Pagination Dots */}
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-blue-600 w-3.5'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              className="bg-white border-none shadow-md hover:shadow-lg transition-shadow duration-300 h-full"
            >
              <CardContent className="p-6 h-full flex flex-col">
                <div className="flex justify-center mb-3">
                  {renderStars(testimonial.rating)}
                </div>
                <Quote className="h-7 w-7 text-blue-500 mx-auto mb-4 opacity-50" />
                <p className="text-gray-700 mb-6 italic text-center flex-grow">
                  "{testimonial.content}"
                </p>
                <div className="flex flex-col items-center">
                  <Avatar className="h-14 w-14 mb-3 border-2 border-blue-100">
                    <AvatarImage src={testimonial.avatar} />
                    <AvatarFallback className="bg-blue-100 text-blue-800 font-medium">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <h4 className="font-semibold text-gray-900 text-center">
                    {testimonial.name}
                  </h4>
                  <p className="text-blue-600 text-sm text-center">
                    {testimonial.role}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {testimonial.location}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 text-sm mb-2">TRUSTED BY HEALTHCARE PROVIDERS ACROSS</p>
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8">
            {['Nairobi Hospital', 'Aga Khan', 'MP Shah', 'Kenyatta National', 'Gertrudes'].map((name) => (
              <div key={name} className="text-gray-700 font-medium">{name}</div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
