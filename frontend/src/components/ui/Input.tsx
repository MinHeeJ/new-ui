/**
 * COMPONENT: Input
 * shadcn/ui 기반 인풋 컴포넌트
 * 서브컴포넌트: Input, Label, FormField (label + input + error)
 */
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  icon?: React.ReactNode;
}

export function Input({ error, icon, className = '', ...props }: InputProps) {
  return (
    <div className="input-wrapper">
      {icon && <span className="input-icon">{icon}</span>}
      <input
        className={`input ${icon ? 'input-with-icon' : ''} ${error ? 'input-error' : ''} ${className}`}
        {...props}
      />
      {error && <span className="input-error-message">{error}</span>}
    </div>
  );
}

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  required?: boolean;
}

export function Label({ children, required, className = '', ...props }: LabelProps) {
  return (
    <label className={`label ${className}`} {...props}>
      {children}
      {required && <span className="label-required" aria-hidden="true">*</span>}
    </label>
  );
}

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  icon?: React.ReactNode;
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
}

export function FormField({ label, required, error, icon, inputProps }: FormFieldProps) {
  return (
    <div className="form-field">
      <Label required={required}>{label}</Label>
      <Input error={error} icon={icon} {...inputProps} />
    </div>
  );
}
