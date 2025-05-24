
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface DownloadReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
}

interface MedicalRecord {
  id: string;
  title: string;
  description: string;
  created_at: string;
  doctor_id: string;
}

const DownloadReportsModal = ({ isOpen, onClose, patientId }: DownloadReportsModalProps) => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchMedicalRecords();
    }
  }, [isOpen, patientId]);

  const fetchMedicalRecords = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('medical_records')
        .select('*')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error('Error fetching medical records:', error);
      toast({
        title: "Error",
        description: "Failed to load medical records",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (record: MedicalRecord) => {
    try {
      // Generate a simple text file with the medical record data
      const content = `
MEDICAL RECORD REPORT
=====================

Title: ${record.title}
Date: ${format(new Date(record.created_at), 'PPP')}
Doctor ID: ${record.doctor_id}

Description:
${record.description || 'No description available'}

Generated on: ${format(new Date(), 'PPP')}
      `.trim();

      const blob = new Blob([content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `medical-record-${record.title.replace(/\s+/g, '-').toLowerCase()}-${format(new Date(record.created_at), 'yyyy-MM-dd')}.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: "Report downloaded successfully!"
      });
    } catch (error) {
      console.error('Error downloading report:', error);
      toast({
        title: "Error",
        description: "Failed to download report",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Download Medical Reports</DialogTitle>
          <DialogDescription>
            Download your available medical records and reports.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <p>Loading medical records...</p>
            </div>
          ) : records.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No medical records available for download.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {records.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{record.title}</h4>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Calendar className="w-3 h-3 mr-1" />
                        {format(new Date(record.created_at), 'PPP')}
                      </div>
                      {record.description && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {record.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant="secondary" className="text-xs">
                      Available
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownload(record)}
                      className="flex items-center"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
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

export default DownloadReportsModal;
