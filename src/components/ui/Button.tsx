import React, { ButtonHTMLAttributes, ReactNode } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  icon?: ReactNode;
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  className = '',
  icon,
  disabled,
  ...props
}: ButtonProps) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-teal-600 hover:bg-teal-700 focus:ring-teal-500 text-white border-transparent';
      case 'secondary':
        return 'bg-white hover:bg-gray-50 focus:ring-teal-500 text-gray-700 border-gray-300';
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white border-transparent';
      case 'success':
        return 'bg-green-600 hover:bg-green-700 focus:ring-green-500 text-white border-transparent';
      case 'outline':
        return 'bg-transparent hover:bg-gray-50 focus:ring-teal-500 text-teal-700 border-teal-300';
      default:
        return 'bg-teal-600 hover:bg-teal-700 focus:ring-teal-500 text-white border-transparent';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'py-1.5 px-3 text-xs';
      case 'md':
        return 'py-2 px-4 text-sm';
      case 'lg':
        return 'py-2.5 px-5 text-base';
      default:
        return 'py-2 px-4 text-sm';
    }
  };

  const getWidthClass = () => (fullWidth ? 'w-full' : '');

  const isDisabled = isLoading || disabled;

  return (
    <button
      className={`inline-flex justify-center items-center rounded-md border font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${getVariantClasses()} ${getSizeClasses()} ${getWidthClass()} ${
        isDisabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
      disabled={isDisabled}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Caricamento...
        </>
      ) : (
        <>
          {icon && <span className="-ml-0.5 mr-1.5">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}; 