
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Phone, MapPin, Clock } from 'lucide-react';

interface EmergencyContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EmergencyContactModal = ({ isOpen, onClose }: EmergencyContactModalProps) => {
  const emergencyContacts = [
    {
      name: "Emergency Services",
      phone: "911",
      description: "Life-threatening emergencies",
      available: "24/7"
    },
    {
      name: "Hospital Emergency Room",
      phone: "(555) 123-4567",
      description: "St. Mary's General Hospital",
      available: "24/7"
    },
    {
      name: "On-Call Doctor",
      phone: "(555) 987-6543",
      description: "After-hours medical consultation",
      available: "6 PM - 8 AM"
    },
    {
      name: "Poison Control",
      phone: "1-800-222-1222",
      description: "Poison emergencies and questions",
      available: "24/7"
    }
  ];

  const handleCall = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-red-600">Emergency Contacts</DialogTitle>
          <DialogDescription>
            Important emergency contact numbers. In case of a life-threatening emergency, call 911 immediately.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {emergencyContacts.map((contact, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-red-50 border-red-200">
              <div className="flex-1">
                <h4 className="font-semibold text-red-900">{contact.name}</h4>
                <p className="text-sm text-red-700">{contact.description}</p>
                <div className="flex items-center text-xs text-red-600 mt-1">
                  <Clock className="w-3 h-3 mr-1" />
                  Available: {contact.available}
                </div>
              </div>
              <Button
                onClick={() => handleCall(contact.phone)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Phone className="w-4 h-4 mr-2" />
                {contact.phone}
              </Button>
            </div>
          ))}
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
          <p className="text-sm text-yellow-800">
            <strong>Remember:</strong> For immediate life-threatening emergencies, always call 911 first.
            These contacts are for urgent medical questions and non-emergency situations.
          </p>
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmergencyContactModal;
