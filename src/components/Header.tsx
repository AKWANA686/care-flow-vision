
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Activity, Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed w-full top-0 z-50 glass-effect border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="medical-gradient p-2 rounded-xl">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">CareFlow Vision</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-primary transition-colors">Features</a>
            <a href="#dashboard" className="text-gray-600 hover:text-primary transition-colors">Dashboard</a>
            <a href="#pricing" className="text-gray-600 hover:text-primary transition-colors">Pricing</a>
            <a href="#contact" className="text-gray-600 hover:text-primary transition-colors">Contact</a>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" className="text-gray-600 hover:text-primary">
              Sign In
            </Button>
            <Button className="medical-gradient text-white hover:opacity-90 transition-opacity">
              Start Free Trial
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <a href="#features" className="block text-gray-600 hover:text-primary transition-colors">Features</a>
            <a href="#dashboard" className="block text-gray-600 hover:text-primary transition-colors">Dashboard</a>
            <a href="#pricing" className="block text-gray-600 hover:text-primary transition-colors">Pricing</a>
            <a href="#contact" className="block text-gray-600 hover:text-primary transition-colors">Contact</a>
            <div className="flex flex-col space-y-2 pt-4">
              <Button variant="ghost" className="text-gray-600 hover:text-primary">
                Sign In
              </Button>
              <Button className="medical-gradient text-white hover:opacity-90 transition-opacity">
                Start Free Trial
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
