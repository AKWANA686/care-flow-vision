
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Phone, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CallPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CallPatientModal = ({ isOpen, onClose }: CallPatientModalProps) => {
  const [selectedPatient, setSelectedPatient] = useState('');
  const [callReason, setCallReason] = useState('');
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  const patients = [
    { id: 'P-001234', name: 'Sarah Johnson', phone: '(555) 123-4567' },
    { id: 'P-001235', name: 'Michael Chen', phone: '(555) 234-5678' },
    { id: 'P-001236', name: 'Emma Davis', phone: '(555) 345-6789' },
    { id: 'P-001237', name: 'John Smith', phone: '(555) 456-7890' },
  ];

  const callReasons = [
    'Follow-up consultation',
    'Test results discussion',
    'Medication review',
    'Appointment reminder',
    'Emergency check-in',
    'Treatment plan update'
  ];

  const handleCall = () => {
    const patient = patients.find(p => p.id === selectedPatient);
    if (!patient) {
      toast({
        title: "Error",
        description: "Please select a patient to call",
        variant: "destructive"
      });
      return;
    }

    if (!callReason) {
      toast({
        title: "Error",
        description: "Please select a reason for the call",
        variant: "destructive"
      });
      return;
    }

    // Initiate the call
    window.location.href = `tel:${patient.phone}`;
    
    toast({
      title: "Call Initiated",
      description: `Calling ${patient.name} at ${patient.phone}`
    });

    // Log the call (in a real app, this would be saved to the database)
    console.log('Call logged:', {
      patientId: selectedPatient,
      reason: callReason,
      notes,
      timestamp: new Date()
    });

    onClose();
  };

  const handleClose = () => {
    setSelectedPatient('');
    setCallReason('');
    setNotes('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Phone className="w-5 h-5 mr-2" />
            Call Patient
          </DialogTitle>
          <DialogDescription>
            Select a patient and reason for the call. The call will be logged for medical records.
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
                      {patient.name} - {patient.phone}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="reason">Call Reason</Label>
            <Select value={callReason} onValueChange={setCallReason}>
              <SelectTrigger>
                <SelectValue placeholder="Select reason for call" />
              </SelectTrigger>
              <SelectContent>
                {callReasons.map((reason) => (
                  <SelectItem key={reason} value={reason}>
                    {reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">Call Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about the call..."
              rows={3}
            />
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleCall} className="flex-1 bg-green-600 hover:bg-green-700">
            <Phone className="w-4 h-4 mr-2" />
            Call Now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CallPatientModal;
