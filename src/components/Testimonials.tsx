
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    name: "Dr. Sharon Nyambogo",
    role: "Cardiologist at Nairobi Hospital",
    location: "Westlands, Nairobi",
    avatar: "/placeholder.svg", 
    rating: 5,
    content: "CareFlow Vision has revolutionized how I manage patient follow-ups at Nairobi Hospital. The automated reminders have reduced our no-show rate by 67%, and the analytics dashboard gives me instant insights into patient compliance. My patients in Westlands love the convenient mobile access."
  },
  {
    name: "John Karanja",
    role: "Diabetes Patient",
    location: "Karen, Nairobi", 
    avatar: "/placeholder.svg",
    rating: 5,
    content: "As a busy professional working in Karen, having my health data accessible through CareFlow Vision has been a game-changer. Dr. Nyambogo can monitor my diabetes remotely, and I receive timely medication reminders via SMS. The platform keeps me connected to quality healthcare despite my hectic schedule."
  },
  {
    name: "Grace Mwadzoya",
    role: "Pediatric Nurse",
    location: "Kilimani, Nairobi",
    avatar: "/placeholder.svg",
    rating: 5,
    content: "The patient communication features are exceptional. Parents in Kilimani appreciate the appointment reminders and educational resources. I can see exactly which children need attention, and our clinic has seen a 45% improvement in treatment compliance since implementing CareFlow Vision."
  },
  {
    name: "Abdul Mohammed",
    role: "Family Medicine Doctor",
    location: "Eastleigh, Nairobi",
    avatar: "/placeholder.svg",
    rating: 5,
    content: "Serving the diverse community in Eastleigh, CareFlow Vision helps me manage over 500 families efficiently. The multi-language support and cultural sensitivity features make healthcare more accessible to our Somali and Arabic-speaking patients."
  },
  {
    name: "Cyprian Nyakundi",
    role: "Hospital Administrator",
    location: "Upper Hill, Nairobi",
    avatar: "/placeholder.svg",
    rating: 5,
    content: "From an administrative perspective, CareFlow Vision has streamlined our operations at our Upper Hill facility. The real-time dashboard helps us track patient flow, reduce wait times, and optimize doctor schedules. Staff productivity has increased by 30%."
  },
  {
    name: "Tabitha Njeri",
    role: "Expectant Mother",
    location: "Kasarani, Nairobi",
    avatar: "/placeholder.svg",
    rating: 5,
    content: "During my pregnancy journey in Kasarani, CareFlow Vision kept me connected with my gynecologist. The appointment reminders, vital signs tracking, and educational content made me feel supported throughout. The emergency contact feature gave me peace of mind."
  }
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-slide functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating 
            ? 'text-yellow-400 fill-yellow-400' 
            : 'text-gray-300 dark:text-gray-600'
        }`}
      />
    ));
  };

  return (
    <section id="testimonials" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 dark:text-white">
            Trusted by <span className="text-gradient">Healthcare Providers</span> in Nairobi
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            See how CareFlow Vision is transforming patient care and practice efficiency for medical professionals across Nairobi's leading healthcare facilities.
          </p>
        </div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <Card className="bg-white dark:bg-gray-800 border-none shadow-xl min-h-[400px] animate-slide-up">
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center">
                <Quote className="h-12 w-12 text-blue-500 mb-6 opacity-50" />
                
                <div className="mb-6">
                  {renderStars(testimonials[currentIndex].rating)}
                </div>

                <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 italic leading-relaxed">
                  "{testimonials[currentIndex].content}"
                </p>

                <div className="flex flex-col items-center">
                  <Avatar className="h-16 w-16 mb-4">
                    <AvatarImage src={testimonials[currentIndex].avatar} />
                    <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-lg">
                      {testimonials[currentIndex].name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                    {testimonials[currentIndex].name}
                  </h4>
                  <p className="text-blue-600 dark:text-blue-400 font-medium">
                    {testimonials[currentIndex].role}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    📍 {testimonials[currentIndex].location}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-lg"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-lg"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Pagination Dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-blue-600 scale-125'
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
              />
            ))}
          </div>

          {/* Auto-play indicator */}
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              {isAutoPlaying ? '⏸️ Pause' : '▶️ Auto-play'}
            </button>
          </div>
        </div>

        {/* Grid view for larger screens */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-8 mt-16">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <Card 
              key={index}
              className="bg-white dark:bg-gray-800 border-none shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="mb-4">
                  {renderStars(testimonial.rating)}
                </div>
                <Quote className="h-8 w-8 text-blue-500 mb-4 opacity-50" />
                <p className="text-gray-700 dark:text-gray-300 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-4">
                    <AvatarImage src={testimonial.avatar} />
                    <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</p>
                    <p className="text-sm text-blue-600 dark:text-blue-400">{testimonial.role}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">📍 {testimonial.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
