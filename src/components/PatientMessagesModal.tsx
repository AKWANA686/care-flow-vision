
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, User, Clock, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface PatientMessagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
}

interface Message {
  id: string;
  title: string;
  description: string;
  diagnosis: string;
  created_at: string;
  doctor_id: string | null;
}

const PatientMessagesModal = ({ isOpen, onClose, patientId }: PatientMessagesModalProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && patientId) {
      fetchMessages();
    }
  }, [isOpen, patientId]);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('medical_records')
        .select('*')
        .eq('patient_id', patientId)
        .in('diagnosis', ['DOCTOR_MESSAGE', 'REMINDER'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getMessageIcon = (diagnosis: string) => {
    return diagnosis === 'REMINDER' ? Clock : MessageSquare;
  };

  const getMessageColor = (diagnosis: string) => {
    return diagnosis === 'REMINDER' ? 'bg-orange-50 border-orange-200' : 'bg-blue-50 border-blue-200';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" />
            Messages & Reminders
          </DialogTitle>
          <DialogDescription>
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-1 text-red-500" />
              Confidential medical communications
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[400px] pr-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No messages or reminders yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => {
                const IconComponent = getMessageIcon(message.diagnosis);
                return (
                  <div
                    key={message.id}
                    className={`p-4 rounded-lg border ${getMessageColor(message.diagnosis)}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center">
                        <IconComponent className="w-4 h-4 mr-2" />
                        <h4 className="font-semibold text-sm">{message.title}</h4>
                      </div>
                      <Badge variant={message.diagnosis === 'REMINDER' ? 'default' : 'secondary'}>
                        {message.diagnosis === 'REMINDER' ? 'Reminder' : 'Message'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{message.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>
                        {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                      </span>
                      {message.doctor_id && (
                        <div className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          <span>From Doctor</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PatientMessagesModal;
