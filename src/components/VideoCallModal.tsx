
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Video, User, Clock, Phone, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VideoCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  userType: 'doctor' | 'patient';
}

const VideoCallModal = ({ isOpen, onClose, userType }: VideoCallModalProps) => {
  const [selectedContact, setSelectedContact] = useState('');
  const [callType, setCallType] = useState('video');
  const [scheduledTime, setScheduledTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const contacts = userType === 'doctor' ? [
    { id: 'P-001234', name: 'Sarah Johnson', status: 'online' },
    { id: 'P-001235', name: 'Michael Chen', status: 'offline' },
    { id: 'P-001236', name: 'Emma Davis', status: 'online' },
  ] : [
    { id: 'D-001', name: 'Dr. Sarah Johnson', specialization: 'Cardiology' },
    { id: 'D-002', name: 'Dr. Michael Chen', specialization: 'Internal Medicine' },
  ];

  const handleStartCall = async () => {
    if (!selectedContact) {
      toast({
        title: "Error",
        description: "Please select a contact",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate call initiation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Call Initiated",
        description: `${callType === 'video' ? 'Video' : 'Voice'} call started successfully!`
      });
      
      // In a real implementation, this would integrate with a video calling service
      // like Twilio Video, Agora, or WebRTC
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start call. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleScheduleCall = async () => {
    if (!selectedContact || !scheduledTime) {
      toast({
        title: "Error",
        description: "Please select a contact and time",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate scheduling
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Call Scheduled",
        description: `${callType === 'video' ? 'Video' : 'Voice'} call scheduled successfully!`
      });
      
      setSelectedContact('');
      setCallType('video');
      setScheduledTime('');
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule call. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Video className="w-5 h-5 mr-2" />
            Video/Voice Call
          </DialogTitle>
          <DialogDescription>
            Start an instant call or schedule one for later
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="contact">Select Contact</Label>
            <Select value={selectedContact} onValueChange={setSelectedContact}>
              <SelectTrigger>
                <SelectValue placeholder={`Choose a ${userType === 'doctor' ? 'patient' : 'doctor'}`} />
              </SelectTrigger>
              <SelectContent>
                {contacts.map((contact) => (
                  <SelectItem key={contact.id} value={contact.id}>
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      <div>
                        <span>{contact.name}</span>
                        {userType === 'doctor' && 'status' in contact && (
                          <span className={`ml-2 text-xs ${contact.status === 'online' ? 'text-green-600' : 'text-gray-500'}`}>
                            ({contact.status})
                          </span>
                        )}
                        {userType === 'patient' && 'specialization' in contact && (
                          <span className="ml-2 text-xs text-gray-500">
                            ({contact.specialization})
                          </span>
                        )}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="callType">Call Type</Label>
            <Select value={callType} onValueChange={setCallType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="video">
                  <div className="flex items-center">
                    <Video className="w-4 h-4 mr-2" />
                    Video Call
                  </div>
                </SelectItem>
                <SelectItem value="voice">
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    Voice Call
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="scheduledTime">Schedule for Later (Optional)</Label>
            <Input
              id="scheduledTime"
              type="datetime-local"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          {scheduledTime ? (
            <Button onClick={handleScheduleCall} disabled={isLoading} className="flex-1">
              <Calendar className="w-4 h-4 mr-2" />
              {isLoading ? 'Scheduling...' : 'Schedule Call'}
            </Button>
          ) : (
            <Button onClick={handleStartCall} disabled={isLoading} className="flex-1">
              {callType === 'video' ? <Video className="w-4 h-4 mr-2" /> : <Phone className="w-4 h-4 mr-2" />}
              {isLoading ? 'Starting...' : 'Start Call'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoCallModal;
