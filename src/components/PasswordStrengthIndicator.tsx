
import { validatePassword } from '@/utils/passwordValidation';

interface PasswordStrengthIndicatorProps {
  password: string;
  showErrors?: boolean;
}

const PasswordStrengthIndicator = ({ password, showErrors = true }: PasswordStrengthIndicatorProps) => {
  const validation = validatePassword(password);

  const getStrengthColor = () => {
    switch (validation.strength) {
      case 'weak': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'strong': return 'bg-green-500';
    }
  };

  const getStrengthWidth = () => {
    return `${(validation.score / 5) * 100}%`;
  };

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600 dark:text-gray-400">Password strength:</span>
        <span className={`text-sm font-medium ${
          validation.strength === 'weak' ? 'text-red-600' :
          validation.strength === 'medium' ? 'text-yellow-600' : 'text-green-600'
        }`}>
          {validation.strength.charAt(0).toUpperCase() + validation.strength.slice(1)}
        </span>
      </div>
      
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
          style={{ width: getStrengthWidth() }}
        />
      </div>

      {showErrors && validation.errors.length > 0 && (
        <div className="space-y-1">
          {validation.errors.map((error, index) => (
            <p key={index} className="text-xs text-red-600 dark:text-red-400">
              • {error}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;
