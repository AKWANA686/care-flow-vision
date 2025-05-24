
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RequestRecordsModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
}

const RequestRecordsModal = ({ isOpen, onClose, patientId }: RequestRecordsModalProps) => {
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const recordTypes = [
    { id: 'lab_results', label: 'Lab Results' },
    { id: 'imaging', label: 'X-rays/MRI/CT Scans' },
    { id: 'prescriptions', label: 'Prescription History' },
    { id: 'visit_notes', label: 'Doctor Visit Notes' },
    { id: 'vaccination', label: 'Vaccination Records' },
    { id: 'allergies', label: 'Allergy Information' }
  ];

  const handleRecordToggle = (recordId: string, checked: boolean) => {
    if (checked) {
      setSelectedRecords([...selectedRecords, recordId]);
    } else {
      setSelectedRecords(selectedRecords.filter(id => id !== recordId));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedRecords.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one record type",
        variant: "destructive"
      });
      return;
    }

    if (!patientId) {
      toast({
        title: "Error", 
        description: "Patient ID is missing. Please log in again.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Submitting record request with:', {
        patientId,
        selectedRecords,
        message: message || 'No additional message'
      });

      // Store the record request as a medical record with clear identifiers
      const recordRequestData = {
        patient_id: patientId,
        title: `Record Request: ${selectedRecords.map(id => 
          recordTypes.find(type => type.id === id)?.label || id
        ).join(', ')}`,
        description: `Patient requested the following records: ${selectedRecords.map(id => 
          recordTypes.find(type => type.id === id)?.label || id
        ).join(', ')}${message ? `. Additional message: ${message}` : ''}`,
        diagnosis: 'RECORD_REQUEST'
      };

      console.log('Inserting record request data:', recordRequestData);

      const { data, error } = await supabase
        .from('medical_records')
        .insert(recordRequestData)
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Record request submitted successfully:', data);

      toast({
        title: "Success",
        description: "Record request submitted successfully! You'll receive your records within 3-5 business days."
      });
      
      // Reset form and close modal
      setSelectedRecords([]);
      setMessage('');
      onClose();
      
    } catch (error) {
      console.error('Error requesting records:', error);
      
      // More specific error handling
      let errorMessage = "Failed to submit record request. Please try again.";
      
      if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = `Error: ${error.message}`;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedRecords([]);
    setMessage('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Request Medical Records</DialogTitle>
          <DialogDescription>
            Select the types of medical records you'd like to request. Records will be processed within 3-5 business days.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-base font-medium">Record Types</Label>
            <div className="space-y-3 mt-2">
              {recordTypes.map((record) => (
                <div key={record.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={record.id}
                    checked={selectedRecords.includes(record.id)}
                    onCheckedChange={(checked) => handleRecordToggle(record.id, checked as boolean)}
                  />
                  <Label htmlFor={record.id} className="text-sm font-normal">
                    {record.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="message">Additional Information (Optional)</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Any specific information about the records you need..."
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || selectedRecords.length === 0} className="flex-1">
              {isLoading ? 'Submitting...' : 'Submit Request'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RequestRecordsModal;
