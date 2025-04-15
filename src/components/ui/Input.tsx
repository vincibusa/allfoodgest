import React, { InputHTMLAttributes, forwardRef } from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { FieldError } from 'react-hook-form';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: FieldError | undefined;
  icon?: React.ReactNode;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, icon, hint, ...props }, ref) => {
    return (
      <div>
        {label && (
          <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <div className="relative rounded-md shadow-sm">
          {icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`block w-full rounded-md py-2.5 sm:text-sm ${
              error
                ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500 pr-10'
                : 'border-gray-300 text-gray-900 focus:border-teal-500 focus:ring-teal-500'
            } ${icon ? 'pl-10' : 'pl-3'}`}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={`${props.id}-error`}
            {...props}
          />
          {error && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
            </div>
          )}
        </div>
        {hint && !error && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
        {error && (
          <p className="mt-2 text-sm text-red-600" id={`${props.id}-error`}>
            {error.message}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input'; 