
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Heart, Activity, Thermometer, Droplets, AlertTriangle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface VitalReading {
  timestamp: string;
  heartRate: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  temperature: number;
  oxygenSaturation: number;
  priority?: 'high' | 'normal';
}

interface PatientInfo {
  name: string;
  priority: 'high' | 'normal';
  condition: string;
  lastReading?: string;
}

const chartConfig = {
  heartRate: {
    label: "Heart Rate",
    color: "hsl(var(--chart-1))",
  },
  bloodPressureSystolic: {
    label: "BP Systolic",
    color: "hsl(var(--chart-2))",
  },
  temperature: {
    label: "Temperature",
    color: "hsl(var(--chart-3))",
  },
  oxygenSaturation: {
    label: "O2 Saturation",
    color: "hsl(var(--chart-4))",
  },
};

const VitalSignsChart = () => {
  const [vitalData, setVitalData] = useState<VitalReading[]>([]);
  const [isLive, setIsLive] = useState(true);
  const [currentPatient, setCurrentPatient] = useState<PatientInfo>({
    name: 'Sarah Johnson',
    priority: 'high',
    condition: 'Post-Surgery Recovery',
    lastReading: ''
  });

  // Sample patients with different priorities
  const patients: PatientInfo[] = [
    { name: 'Sarah Johnson', priority: 'high', condition: 'Post-Surgery Recovery' },
    { name: 'Michael Chen', priority: 'normal', condition: 'Hypertension Management' },
    { name: 'Emma Davis', priority: 'high', condition: 'Cardiac Monitoring' },
    { name: 'John Smith', priority: 'normal', condition: 'Diabetes Follow-up' }
  ];

  // Generate realistic vital signs data based on priority
  const generateVitalReading = (priority: 'high' | 'normal' = 'normal'): VitalReading => {
    const now = new Date();
    
    // High priority patients might have more volatile readings
    const volatilityMultiplier = priority === 'high' ? 1.5 : 1;
    
    return {
      timestamp: now.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      heartRate: Math.floor(Math.random() * (20 * volatilityMultiplier)) + (priority === 'high' ? 75 : 70),
      bloodPressureSystolic: Math.floor(Math.random() * (30 * volatilityMultiplier)) + (priority === 'high' ? 115 : 110),
      bloodPressureDiastolic: Math.floor(Math.random() * (20 * volatilityMultiplier)) + (priority === 'high' ? 72 : 70),
      temperature: Math.round((Math.random() * (2 * volatilityMultiplier) + (priority === 'high' ? 98.0 : 97.5)) * 10) / 10,
      oxygenSaturation: Math.floor(Math.random() * (5 * volatilityMultiplier)) + (priority === 'high' ? 94 : 95),
      priority
    };
  };

  // Initialize with historical data based on priority
  useEffect(() => {
    const initialData: VitalReading[] = [];
    const now = new Date();
    const intervalHours = currentPatient.priority === 'high' ? 3 : 6;
    const dataPoints = 8; // Show last 8 readings
    
    // Generate historical data points
    for (let i = dataPoints - 1; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * intervalHours * 60 * 60 * 1000);
      const reading = generateVitalReading(currentPatient.priority);
      reading.timestamp = timestamp.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      initialData.push(reading);
    }
    
    setVitalData(initialData);
    setCurrentPatient(prev => ({
      ...prev,
      lastReading: initialData[initialData.length - 1]?.timestamp || ''
    }));
  }, [currentPatient.priority, currentPatient.name]);

  // Update vitals based on priority (3hrs for high priority, 6hrs for normal)
  useEffect(() => {
    if (!isLive) return;

    // For demo purposes: high priority updates every 5 seconds, normal every 10 seconds
    const updateInterval = currentPatient.priority === 'high' ? 5000 : 10000;

    const interval = setInterval(() => {
      const newReading = generateVitalReading(currentPatient.priority);
      setVitalData(prev => {
        const updated = [...prev, newReading];
        // Keep only the last 8 readings (24 hours)
        return updated.slice(-8);
      });
      
      setCurrentPatient(prev => ({
        ...prev,
        lastReading: newReading.timestamp
      }));
    }, updateInterval);

    return () => clearInterval(interval);
  }, [isLive, currentPatient.priority]);

  const currentVitals = vitalData[vitalData.length - 1];

  const getStatusColor = (priority: 'high' | 'normal') => {
    return priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800';
  };

  const getMonitoringInterval = (priority: 'high' | 'normal') => {
    return priority === 'high' ? '3 hours' : '6 hours';
  };

  return (
    <div className="space-y-6">
      {/* Patient Selection and Priority Status */}
      <Card className="glass-effect border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <select 
                value={currentPatient.name}
                onChange={(e) => {
                  const selected = patients.find(p => p.name === e.target.value);
                  if (selected) setCurrentPatient(selected);
                }}
                className="px-3 py-2 border rounded-lg bg-white"
              >
                {patients.map(patient => (
                  <option key={patient.name} value={patient.name}>
                    {patient.name}
                  </option>
                ))}
              </select>
              <div className="flex items-center space-x-2">
                {currentPatient.priority === 'high' ? (
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                ) : (
                  <Clock className="w-4 h-4 text-green-500" />
                )}
                <Badge className={getStatusColor(currentPatient.priority)}>
                  {currentPatient.priority === 'high' ? 'High Priority' : 'Normal Priority'}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{currentPatient.condition}</p>
              <p className="text-xs text-gray-500">
                Monitoring every {getMonitoringInterval(currentPatient.priority)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Vital Signs Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-effect border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Heart Rate</p>
                <p className="text-2xl font-bold text-red-600">
                  {currentVitals?.heartRate || '--'} <span className="text-sm">bpm</span>
                </p>
              </div>
              <Heart className="w-8 h-8 text-red-500" />
            </div>
            <div className="flex items-center mt-2">
              <div className={`w-2 h-2 rounded-full animate-pulse mr-2 ${
                currentPatient.priority === 'high' ? 'bg-red-400' : 'bg-green-400'
              }`} />
              <span className={`text-xs ${
                currentPatient.priority === 'high' ? 'text-red-600' : 'text-green-600'
              }`}>
                {currentPatient.priority === 'high' ? 'Critical Watch' : 'Normal'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Blood Pressure</p>
                <p className="text-2xl font-bold text-blue-600">
                  {currentVitals ? `${currentVitals.bloodPressureSystolic}/${currentVitals.bloodPressureDiastolic}` : '--/--'}
                </p>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
            <div className="flex items-center mt-2">
              <div className={`w-2 h-2 rounded-full animate-pulse mr-2 ${
                currentPatient.priority === 'high' ? 'bg-red-400' : 'bg-green-400'
              }`} />
              <span className={`text-xs ${
                currentPatient.priority === 'high' ? 'text-red-600' : 'text-green-600'
              }`}>
                {currentPatient.priority === 'high' ? 'Monitoring' : 'Optimal'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Temperature</p>
                <p className="text-2xl font-bold text-orange-600">
                  {currentVitals?.temperature || '--'}°F
                </p>
              </div>
              <Thermometer className="w-8 h-8 text-orange-500" />
            </div>
            <div className="flex items-center mt-2">
              <div className={`w-2 h-2 rounded-full animate-pulse mr-2 ${
                currentPatient.priority === 'high' ? 'bg-red-400' : 'bg-green-400'
              }`} />
              <span className={`text-xs ${
                currentPatient.priority === 'high' ? 'text-red-600' : 'text-green-600'
              }`}>
                {currentPatient.priority === 'high' ? 'Watch' : 'Normal'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">O2 Saturation</p>
                <p className="text-2xl font-bold text-purple-600">
                  {currentVitals?.oxygenSaturation || '--'}%
                </p>
              </div>
              <Droplets className="w-8 h-8 text-purple-500" />
            </div>
            <div className="flex items-center mt-2">
              <div className={`w-2 h-2 rounded-full animate-pulse mr-2 ${
                currentPatient.priority === 'high' ? 'bg-red-400' : 'bg-green-400'
              }`} />
              <span className={`text-xs ${
                currentPatient.priority === 'high' ? 'text-red-600' : 'text-green-600'
              }`}>
                {currentPatient.priority === 'high' ? 'Critical' : 'Excellent'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Chart */}
      <Card className="glass-effect border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Priority-Based Vital Signs Monitoring</CardTitle>
              <CardDescription>
                Updated every {getMonitoringInterval(currentPatient.priority)} • Patient: {currentPatient.name}
                {currentPatient.priority === 'high' && (
                  <span className="ml-2 text-red-600 font-medium">• HIGH PRIORITY MONITORING</span>
                )}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
              <span className="text-sm font-medium">{isLive ? 'Live' : 'Paused'}</span>
              <button
                onClick={() => setIsLive(!isLive)}
                className="ml-2 px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
              >
                {isLive ? 'Pause' : 'Resume'}
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={vitalData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="timestamp" 
                  tick={{ fontSize: 12 }}
                  tickMargin={10}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="heartRate"
                  stroke="var(--color-heartRate)"
                  strokeWidth={currentPatient.priority === 'high' ? 3 : 2}
                  dot={{ fill: "var(--color-heartRate)", strokeWidth: 2, r: currentPatient.priority === 'high' ? 5 : 4 }}
                  activeDot={{ r: currentPatient.priority === 'high' ? 7 : 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="bloodPressureSystolic"
                  stroke="var(--color-bloodPressureSystolic)"
                  strokeWidth={currentPatient.priority === 'high' ? 3 : 2}
                  dot={{ fill: "var(--color-bloodPressureSystolic)", strokeWidth: 2, r: currentPatient.priority === 'high' ? 5 : 4 }}
                  activeDot={{ r: currentPatient.priority === 'high' ? 7 : 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="oxygenSaturation"
                  stroke="var(--color-oxygenSaturation)"
                  strokeWidth={currentPatient.priority === 'high' ? 3 : 2}
                  dot={{ fill: "var(--color-oxygenSaturation)", strokeWidth: 2, r: currentPatient.priority === 'high' ? 5 : 4 }}
                  activeDot={{ r: currentPatient.priority === 'high' ? 7 : 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
          
          <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
              <span>Heart Rate (bpm)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
              <span>BP Systolic (mmHg)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-500 rounded mr-2"></div>
              <span>O2 Saturation (%)</span>
            </div>
            <div className="text-xs text-gray-500">
              Last updated: {currentPatient.lastReading || '--'}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VitalSignsChart;
