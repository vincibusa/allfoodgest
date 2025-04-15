import React, { SelectHTMLAttributes, forwardRef } from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { FieldError } from 'react-hook-form';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: FieldError | undefined;
  options: SelectOption[];
  hint?: string;
  emptyOptionLabel?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, hint, emptyOptionLabel = 'Seleziona...', ...props }, ref) => {
    return (
      <div>
        {label && (
          <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <div className="relative rounded-md shadow-sm">
          <select
            ref={ref}
            className={`block w-full rounded-md py-2.5 pl-3 pr-10 sm:text-sm appearance-none ${
              error
                ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 text-gray-900 focus:border-teal-500 focus:ring-teal-500'
            }`}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={`${props.id}-error`}
            {...props}
          >
            <option value="" className="text-gray-500">{emptyOptionLabel}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value} className="text-gray-900">
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            {error ? (
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
            ) : (
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
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

// Aggiungi uno stile globale per assicurare che il testo della select appaia correttamente
// Questo è necessario perché i browser applicano stili diversi alle option
// Nota: questo sarà applicato a tutte le select nell'applicazione
if (typeof window !== 'undefined') {
  // Esegui solo nel browser
  const style = document.createElement('style');
  style.innerHTML = `
    select option {
      color: #111827 !important; /* text-gray-900 */
    }
    select option:first-child {
      color: #6B7280 !important; /* text-gray-500 */
    }
  `;
  document.head.appendChild(style);
}

Select.displayName = 'Select'; 