
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Dr. Sarah Kimani",
    role: "Cardiologist",
    avatar: "/placeholder.svg", 
    content: "CareFlow Vision has transformed how I manage patient follow-ups. The automated reminders have reduced our no-show rate by 67%, and the analytics dashboard gives me instant insights into patient compliance."
  },
  {
    name: "Dr. John Indiatsi",
    role: "Primary Care Physician",
    avatar: "/placeholder.svg",
    content: "As a physician with over 2,000 active patients, keeping track of follow-ups was overwhelming. CareFlow Vision streamlined our entire process, saving my staff 15+ hours per week on administrative tasks."
  },
  {
    name: "Dr. Caleb Omondi",
    role: "Pediatrician",
    avatar: "/placeholder.svg",
    content: "The patient engagement tools are exceptional. Parents appreciate the reminders and educational resources, and I can see exactly who needs attention. Our practice saw a 45% improvement in treatment compliance."
  }
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            Trusted by <span className="text-gradient">Healthcare Providers</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how CareFlow Vision is transforming patient care and practice efficiency for medical professionals worldwide.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              className="bg-white border-none shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <Quote className="h-8 w-8 text-blue-500 mb-4 opacity-50" />
                <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-4">
                    <AvatarImage src={testimonial.avatar} />
                    <AvatarFallback className="bg-blue-100 text-blue-800">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-blue-600">{testimonial.role}</p>
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
