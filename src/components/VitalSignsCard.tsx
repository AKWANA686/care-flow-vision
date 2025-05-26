
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatTemperature } from '@/utils/timeUtils';

interface VitalSignsCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'stable';
  status: 'normal' | 'borderline' | 'critical';
  normalRange?: string;
  isTemperature?: boolean;
}

const VitalSignsCard = ({ 
  title, 
  value, 
  unit, 
  icon, 
  trend = 'stable', 
  status, 
  normalRange,
  isTemperature = false 
}: VitalSignsCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300';
      case 'borderline':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-300';
      case 'critical':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300';
      default:
        return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
    }
  };

  const displayValue = isTemperature && typeof value === 'number' 
    ? formatTemperature(value).replace('°C', '') 
    : value;

  const displayUnit = isTemperature ? '°C' : unit;

  return (
    <Card className={`${getStatusColor(status)} transition-all duration-300 hover:shadow-lg`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {icon}
            <span>{title}</span>
          </div>
          {getTrendIcon()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-bold">{displayValue}</span>
            <span className="text-sm font-medium">{displayUnit}</span>
          </div>
          
          {normalRange && (
            <div className="text-xs opacity-70">
              Normal: {normalRange}
            </div>
          )}
          
          <Badge 
            variant="secondary" 
            className={`text-xs ${
              status === 'normal' 
                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300' 
                : status === 'borderline'
                ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300'
                : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300'
            }`}
          >
            {status === 'normal' ? 'Normal' : status === 'borderline' ? 'Borderline' : 'Critical'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default VitalSignsCard;
