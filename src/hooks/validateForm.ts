import { useState } from 'react';

interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  customValidation?: (value: string) => boolean;
  errorMessage?: string;
}

interface FormValidation {
  [key: string]: FieldValidation;
}

interface ValidationResult {
  isValid: boolean;
  errors: { [key: string]: string };
}

export const useFormValidation = (validationRules: FormValidation) => {
  const [values, setValues] = useState<{ [key: string]: string }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    validateField(name, value);
  };

  const validateField = (fieldName: string, value: string) => {
    const rules = validationRules[fieldName];
    let error = '';
    if (rules) {
      if (rules.required && !value) {
        error = 'This field is required';
      } else if (rules.minLength && value.length < rules.minLength) {
        error = `Minimum length is ${rules.minLength}`;
      } else if (rules.maxLength && value.length > rules.maxLength) {
        error = `Maximum length is ${rules.maxLength}`;
      } else if (rules.pattern && !rules.pattern.test(value)) {
        error = 'Invalid format';
      } else if (rules.customValidation && !rules.customValidation(value)) {
        error = 'Custom validation failed';
      }
    }
    setErrors({ ...errors, [fieldName]: error });
  };

  const handleSubmit = () => {
    const validationResult = validateForm();
    if (validationResult.isValid) {
      // Submit form
    } else {
      // Handle form errors
    }
  };

  const validateForm = (): ValidationResult => {
    let isValid = true;
    const newErrors: { [key: string]: string } = {};
    Object.keys(validationRules).forEach(fieldName => {
      const value = values[fieldName] || '';
      validateField(fieldName, value);
      if (errors[fieldName]) {
        isValid = false;
        newErrors[fieldName] = errors[fieldName];
      }
    });
    return { isValid, errors: newErrors };
  };

  return { values, errors, handleChange, handleSubmit };
};
