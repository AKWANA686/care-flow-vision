
// Utility functions for Kenya (EAT) timezone and temperature conversion

export const formatToEAT = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleString('en-KE', {
    timeZone: 'Africa/Nairobi',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

export const formatTimeEAT = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleTimeString('en-KE', {
    timeZone: 'Africa/Nairobi',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

export const getCurrentEATTime = (): Date => {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'Africa/Nairobi' }));
};

export const fahrenheitToCelsius = (fahrenheit: number): number => {
  return Math.round(((fahrenheit - 32) * 5/9) * 10) / 10;
};

export const formatTemperature = (fahrenheit: number): string => {
  const celsius = fahrenheitToCelsius(fahrenheit);
  return `${celsius}°C`;
};

// Kenya phone number validation
export const validateKenyanPhone = (phone: string): boolean => {
  const kenyanPhoneRegex = /^(\+254|254|0)?([71][0-9]{8})$/;
  return kenyanPhoneRegex.test(phone);
};

export const formatKenyanPhone = (phone: string): string => {
  // Remove any non-digits
  const cleaned = phone.replace(/\D/g, '');
  
  // Convert to +254 format
  if (cleaned.startsWith('254')) {
    return `+${cleaned}`;
  } else if (cleaned.startsWith('0')) {
    return `+254${cleaned.substring(1)}`;
  } else if (cleaned.length === 9) {
    return `+254${cleaned}`;
  }
  
  return phone; // Return original if can't format
};
