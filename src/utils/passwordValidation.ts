
export interface PasswordValidation {
  isValid: boolean;
  strength: 'weak' | 'medium' | 'strong';
  errors: string[];
  score: number;
}

export const validatePassword = (password: string): PasswordValidation => {
  const errors: string[] = [];
  let score = 0;

  // Check minimum length
  if (password.length < 8) {
    errors.push('At least 8 characters required');
  } else {
    score += 1;
  }

  // Check for uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push('At least one uppercase letter required');
  } else {
    score += 1;
  }

  // Check for lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push('At least one lowercase letter required');
  } else {
    score += 1;
  }

  // Check for number
  if (!/\d/.test(password)) {
    errors.push('At least one number required');
  } else {
    score += 1;
  }

  // Check for special character
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('At least one special character (!@#$%^&*) required');
  } else {
    score += 1;
  }

  // Determine strength
  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  if (score >= 4) strength = 'medium';
  if (score === 5) strength = 'strong';

  return {
    isValid: errors.length === 0,
    strength,
    errors,
    score
  };
};
