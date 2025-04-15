import React, { TextareaHTMLAttributes, forwardRef } from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { FieldError } from 'react-hook-form';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: FieldError | undefined;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, hint, rows = 5, ...props }, ref) => {
    return (
      <div>
        {label && (
          <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <div className="relative rounded-md shadow-sm">
          <textarea
            ref={ref}
            rows={rows}
            className={`block w-full rounded-md py-2.5 px-3 sm:text-sm text-black ${
              error
                ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 text-gray-900 focus:border-teal-500 focus:ring-teal-500'
            }`}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={`${props.id}-error`}
            {...props}
          />
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

Textarea.displayName = 'Textarea'; 