
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart, Activity, Thermometer, Droplets, AlertTriangle, Plus, Users, Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MonitoringData {
  id: string;
  patient_id: string;
  patient_name: string;
  data_type: string;
  value: any;
  unit: string;
  recorded_at: string;
  is_critical: boolean;
}

interface Patient {
  user_id: string;
  full_name: string;
  last_reading?: string;
}

const RealTimeMonitoringDashboard = () => {
  const [monitoringData, setMonitoringData] = useState<MonitoringData[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedDataType, setSelectedDataType] = useState('');
  const [connectedDevices, setConnectedDevices] = useState(0);
  const [criticalAlerts, setCriticalAlerts] = useState(0);
  const [isAddingData, setIsAddingData] = useState(false);
  const [newDataValue, setNewDataValue] = useState('');
  const [newDataType, setNewDataType] = useState('');
  const { toast } = useToast();

  const dataTypes = [
    { value: 'heart_rate', label: 'Heart Rate', unit: 'bpm', icon: Heart, color: '#ef4444' },
    { value: 'blood_pressure', label: 'Blood Pressure', unit: 'mmHg', icon: Activity, color: '#3b82f6' },
    { value: 'temperature', label: 'Temperature', unit: '°F', icon: Thermometer, color: '#f97316' },
    { value: 'oxygen_saturation', label: 'O2 Saturation', unit: '%', icon: Droplets, color: '#8b5cf6' },
    { value: 'blood_glucose', label: 'Blood Glucose', unit: 'mg/dL', icon: Activity, color: '#10b981' },
    { value: 'weight', label: 'Weight', unit: 'kg', icon: Activity, color: '#6366f1' },
    { value: 'steps_count', label: 'Steps', unit: 'steps', icon: Activity, color: '#f59e0b' }
  ];

  useEffect(() => {
    fetchPatients();
    fetchMonitoringData();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('monitoring-data-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'patient_monitoring_data'
      }, (payload) => {
        console.log('Real-time monitoring data update:', payload);
        fetchMonitoringData();
        
        if (payload.eventType === 'INSERT' && payload.new.is_critical) {
          toast({
            title: "Critical Alert!",
            description: `Critical reading detected for patient`,
            variant: "destructive"
          });
        }
      })
      .subscribe();

    // Update connection count and critical alerts
    const interval = setInterval(() => {
      updateDashboardStats();
    }, 5000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [selectedPatient, selectedDataType]);

  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('user_id, full_name')
        .order('full_name');

      if (error) throw error;
      setPatients(data || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const fetchMonitoringData = async () => {
    try {
      const { data, error } = await supabase.rpc('get_patient_monitoring_data', {
        p_patient_id: selectedPatient || null,
        p_data_type: selectedDataType || null,
        p_hours_back: 24
      });

      if (error) throw error;
      setMonitoringData(data || []);
      
      // Count critical alerts
      const critical = data?.filter(item => item.is_critical).length || 0;
      setCriticalAlerts(critical);
    } catch (error) {
      console.error('Error fetching monitoring data:', error);
    }
  };

  const updateDashboardStats = async () => {
    try {
      const { data, error } = await supabase
        .from('socket_connections')
        .select('id')
        .eq('is_active', true);

      if (error) throw error;
      setConnectedDevices(data?.length || 0);
    } catch (error) {
      console.error('Error updating stats:', error);
    }
  };

  const addMonitoringData = async () => {
    if (!selectedPatient || !newDataType || !newDataValue) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsAddingData(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const dataTypeInfo = dataTypes.find(dt => dt.value === newDataType);
      let parsedValue;
      
      // Parse value based on data type
      if (newDataType === 'blood_pressure') {
        const [systolic, diastolic] = newDataValue.split('/').map(v => parseInt(v));
        parsedValue = { systolic, diastolic };
      } else {
        parsedValue = { value: parseFloat(newDataValue) };
      }

      // Determine if reading is critical (simplified logic)
      const isCritical = checkIfCritical(newDataType, parsedValue);

      const { error } = await supabase
        .from('patient_monitoring_data')
        .insert({
          patient_id: selectedPatient,
          doctor_id: user.id,
          data_type: newDataType,
          value: parsedValue,
          unit: dataTypeInfo?.unit || '',
          is_critical: isCritical
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Monitoring data added successfully"
      });

      setNewDataValue('');
      setNewDataType('');
      fetchMonitoringData();
    } catch (error) {
      console.error('Error adding monitoring data:', error);
      toast({
        title: "Error",
        description: "Failed to add monitoring data",
        variant: "destructive"
      });
    } finally {
      setIsAddingData(false);
    }
  };

  const checkIfCritical = (dataType: string, value: any): boolean => {
    switch (dataType) {
      case 'heart_rate':
        return value.value < 60 || value.value > 100;
      case 'blood_pressure':
        return value.systolic > 140 || value.diastolic > 90;
      case 'temperature':
        return value.value < 97 || value.value > 99;
      case 'oxygen_saturation':
        return value.value < 95;
      default:
        return false;
    }
  };

  const formatChartData = () => {
    if (!selectedDataType) return [];
    
    return monitoringData
      .filter(item => item.data_type === selectedDataType)
      .slice(-20) // Last 20 readings
      .map(item => ({
        time: new Date(item.recorded_at).toLocaleTimeString(),
        value: typeof item.value === 'object' && item.value.value ? item.value.value : 
               typeof item.value === 'object' && item.value.systolic ? item.value.systolic :
               item.value,
        isCritical: item.is_critical
      }));
  };

  const getLatestReadings = () => {
    const latest = new Map();
    monitoringData.forEach(item => {
      if (item.patient_id === selectedPatient) {
        if (!latest.has(item.data_type) || 
            new Date(item.recorded_at) > new Date(latest.get(item.data_type).recorded_at)) {
          latest.set(item.data_type, item);
        }
      }
    });
    return Array.from(latest.values());
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Connected Devices</p>
                <p className="text-3xl font-bold text-green-600">{connectedDevices}</p>
              </div>
              <Zap className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Patients</p>
                <p className="text-3xl font-bold text-blue-600">{patients.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Critical Alerts</p>
                <p className="text-3xl font-bold text-red-600">{criticalAlerts}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Real-Time Patient Monitoring</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <Label>Select Patient</Label>
              <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                <SelectTrigger>
                  <SelectValue placeholder="All patients" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Patients</SelectItem>
                  {patients.map((patient) => (
                    <SelectItem key={patient.user_id} value={patient.user_id}>
                      {patient.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Data Type</Label>
              <Select value={selectedDataType} onValueChange={setSelectedDataType}>
                <SelectTrigger>
                  <SelectValue placeholder="All data types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  {dataTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                onClick={fetchMonitoringData}
                className="w-full"
              >
                Refresh Data
              </Button>
            </div>
          </div>

          {/* Add New Data */}
          {selectedPatient && (
            <div className="border rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold mb-3">Add New Reading</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <Label>Data Type</Label>
                  <Select value={newDataType} onValueChange={setNewDataType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {dataTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Value</Label>
                  <Input
                    value={newDataValue}
                    onChange={(e) => setNewDataValue(e.target.value)}
                    placeholder={newDataType === 'blood_pressure' ? '120/80' : 'Enter value'}
                  />
                </div>

                <div className="md:col-span-2 flex items-end">
                  <Button 
                    onClick={addMonitoringData}
                    disabled={isAddingData}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Reading
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chart Visualization */}
      {selectedDataType && (
        <Card>
          <CardHeader>
            <CardTitle>
              {dataTypes.find(dt => dt.value === selectedDataType)?.label} Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formatChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke={dataTypes.find(dt => dt.value === selectedDataType)?.color || '#3b82f6'}
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Latest Readings */}
      {selectedPatient && (
        <Card>
          <CardHeader>
            <CardTitle>Latest Readings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getLatestReadings().map((reading) => {
                const dataType = dataTypes.find(dt => dt.value === reading.data_type);
                const Icon = dataType?.icon || Activity;
                
                return (
                  <Card key={reading.id} className={reading.is_critical ? 'border-red-500 bg-red-50' : ''}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Icon className="w-5 h-5" style={{ color: dataType?.color }} />
                          <div>
                            <p className="font-medium">{dataType?.label}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(reading.recorded_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">
                            {typeof reading.value === 'object' && reading.value.value ? reading.value.value :
                             typeof reading.value === 'object' && reading.value.systolic ? 
                             `${reading.value.systolic}/${reading.value.diastolic}` :
                             reading.value} {reading.unit}
                          </p>
                          {reading.is_critical && (
                            <Badge variant="destructive">Critical</Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RealTimeMonitoringDashboard;
