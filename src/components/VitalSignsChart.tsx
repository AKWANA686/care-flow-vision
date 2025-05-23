import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Heart, Activity, Thermometer, Droplets } from 'lucide-react';

interface VitalReading {
  timestamp: string;
  heartRate: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  temperature: number;
  oxygenSaturation: number;
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

  // Generate realistic vital signs data
  const generateVitalReading = (): VitalReading => {
    const now = new Date();
    return {
      timestamp: now.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      heartRate: Math.floor(Math.random() * 20) + 70, // 70-90 bpm
      bloodPressureSystolic: Math.floor(Math.random() * 30) + 110, // 110-140 mmHg
      bloodPressureDiastolic: Math.floor(Math.random() * 20) + 70, // 70-90 mmHg
      temperature: Math.round((Math.random() * 2 + 97.5) * 10) / 10, // 97.5-99.5°F
      oxygenSaturation: Math.floor(Math.random() * 5) + 95, // 95-100%
    };
  };

  // Initialize with some historical data
  useEffect(() => {
    const initialData: VitalReading[] = [];
    const now = new Date();
    
    // Generate 8 data points (24 hours of 3-hour intervals)
    for (let i = 7; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 3 * 60 * 60 * 1000);
      initialData.push({
        timestamp: timestamp.toLocaleTimeString('en-US', { 
          hour12: false, 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        heartRate: Math.floor(Math.random() * 20) + 70,
        bloodPressureSystolic: Math.floor(Math.random() * 30) + 110,
        bloodPressureDiastolic: Math.floor(Math.random() * 20) + 70,
        temperature: Math.round((Math.random() * 2 + 97.5) * 10) / 10,
        oxygenSaturation: Math.floor(Math.random() * 5) + 95,
      });
    }
    
    setVitalData(initialData);
  }, []);

  // Update vitals every 3 hours (for demo purposes, updating every 10 seconds)
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const newReading = generateVitalReading();
      setVitalData(prev => {
        const updated = [...prev, newReading];
        // Keep only the last 8 readings (24 hours)
        return updated.slice(-8);
      });
    }, 10000); // 10 seconds for demo (in production would be 3 hours)

    return () => clearInterval(interval);
  }, [isLive]);

  const currentVitals = vitalData[vitalData.length - 1];

  return (
    <div className="space-y-6">
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
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2" />
              <span className="text-xs text-green-600">Normal</span>
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
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2" />
              <span className="text-xs text-green-600">Optimal</span>
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
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2" />
              <span className="text-xs text-green-600">Normal</span>
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
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2" />
              <span className="text-xs text-green-600">Excellent</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Chart */}
      <Card className="glass-effect border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Real-time Vital Signs Monitoring</CardTitle>
              <CardDescription>Updated every 3 hours • Patient: Sarah Johnson</CardDescription>
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
                  strokeWidth={2}
                  dot={{ fill: "var(--color-heartRate)", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="bloodPressureSystolic"
                  stroke="var(--color-bloodPressureSystolic)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-bloodPressureSystolic)", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="oxygenSaturation"
                  stroke="var(--color-oxygenSaturation)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-oxygenSaturation)", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
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
              Last updated: {currentVitals?.timestamp || '--'}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VitalSignsChart;
