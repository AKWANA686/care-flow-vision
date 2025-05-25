
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SendMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SendMessageModal = ({ isOpen, onClose }: SendMessageModalProps) => {
  const [selectedPatient, setSelectedPatient] = useState('');
  const [messageType, setMessageType] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const patients = [
    { id: 'P-001234', name: 'Sarah Johnson' },
    { id: 'P-001235', name: 'Michael Chen' },
    { id: 'P-001236', name: 'Emma Davis' },
    { id: 'P-001237', name: 'John Smith' },
  ];

  const messageTypes = [
    'Test results notification',
    'Appointment reminder',
    'Medication instructions',
    'Follow-up instructions',
    'General health advice',
    'Treatment plan update'
  ];

  const handleSendMessage = async () => {
    if (!selectedPatient || !messageType || !message.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('medical_records')
        .insert({
          patient_id: selectedPatient,
          title: `Doctor Message: ${messageType}`,
          description: `Message from doctor: ${message}`,
          diagnosis: 'DOCTOR_MESSAGE'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Message sent to patient successfully!"
      });
      
      setSelectedPatient('');
      setMessageType('');
      setMessage('');
      onClose();
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedPatient('');
    setMessageType('');
    setMessage('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" />
            Send Message to Patient
          </DialogTitle>
          <DialogDescription>
            Send a secure message to your patient. They will receive it in their patient portal.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="patient">Select Patient</Label>
            <Select value={selectedPatient} onValueChange={setSelectedPatient}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a patient" />
              </SelectTrigger>
              <SelectContent>
                {patients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      {patient.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="messageType">Message Type</Label>
            <Select value={messageType} onValueChange={setMessageType}>
              <SelectTrigger>
                <SelectValue placeholder="Select message type" />
              </SelectTrigger>
              <SelectContent>
                {messageTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message to the patient..."
              rows={4}
              required
            />
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSendMessage} disabled={isLoading} className="flex-1">
            {isLoading ? 'Sending...' : 'Send Message'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SendMessageModal;
