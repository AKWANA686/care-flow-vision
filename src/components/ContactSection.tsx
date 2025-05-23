
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Mail, Phone, MapPin } from "lucide-react";

const ContactSection = () => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This would be connected to a form submission API in a real implementation
    console.log("Form submitted:", formState);
    alert("Thank you for your message! Our team will contact you shortly.");
    setFormState({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            Get in <span className="text-gradient">Touch</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions about CareFlow Vision? Our team is here to help you implement the perfect solution for your practice.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <div className="glass-effect rounded-2xl p-8 shadow-xl animate-slide-up">
            <h3 className="text-2xl font-bold mb-6">Send us a message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input 
                  name="name"
                  placeholder="Your Name" 
                  value={formState.name}
                  onChange={handleChange}
                  required
                  className="bg-white/50 border-white/20"
                />
              </div>
              <div>
                <Input 
                  name="email"
                  type="email" 
                  placeholder="Your Email" 
                  value={formState.email}
                  onChange={handleChange}
                  required
                  className="bg-white/50 border-white/20"
                />
              </div>
              <div>
                <Textarea 
                  name="message"
                  placeholder="Your Message" 
                  value={formState.message}
                  onChange={handleChange}
                  required
                  className="bg-white/50 border-white/20 min-h-[120px]"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full medical-gradient text-white hover:opacity-90 transition-all"
              >
                Send Message
                <MessageCircle className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div className="animate-slide-up">
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="medical-gradient p-3 rounded-xl mr-4">
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium">Email Us</p>
                    <p className="text-blue-600">contact@careflowvision.com</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="medical-gradient p-3 rounded-xl mr-4">
                    <Phone className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium">Call Us</p>
                    <p className="text-blue-600">+1 (800) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="medical-gradient p-3 rounded-xl mr-4">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium">Visit Us</p>
                    <p className="text-blue-600">123 Healthcare Avenue, San Francisco, CA 94107</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-12 bg-white rounded-2xl p-8 shadow-lg animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <h3 className="text-xl font-bold mb-4">Frequently Asked Questions</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-gray-900">Is CareFlow Vision HIPAA compliant?</p>
                  <p className="text-gray-600 text-sm">Yes, our platform is fully HIPAA compliant with end-to-end encryption and secure data storage.</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Can I integrate with my existing EHR system?</p>
                  <p className="text-gray-600 text-sm">CareFlow Vision offers integrations with most major EHR systems including Epic, Cerner, and Allscripts.</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Do you offer a trial period?</p>
                  <p className="text-gray-600 text-sm">Yes, we offer a 14-day free trial with full access to all features.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
