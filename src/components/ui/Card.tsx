import React, { ReactNode } from 'react';

export interface CardProps {
  children: ReactNode;
  title?: string | ReactNode;
  subtitle?: string | ReactNode;
  footer?: ReactNode;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
}

export const Card = ({
  children,
  title,
  subtitle,
  footer,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
}: CardProps) => {
  return (
    <div className={`bg-white overflow-hidden rounded-lg border border-gray-200 shadow-sm ${className}`}>
      {(title || subtitle) && (
        <div className={`px-4 py-5 sm:px-6 ${headerClassName}`}>
          {title && typeof title === 'string' ? (
            <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>
          ) : (
            title
          )}
          {subtitle && typeof subtitle === 'string' ? (
            <p className="mt-1 max-w-2xl text-sm text-gray-500">{subtitle}</p>
          ) : (
            subtitle
          )}
        </div>
      )}
      <div className={`px-4 py-5 sm:p-6 ${bodyClassName}`}>{children}</div>
      {footer && <div className={`px-4 py-4 sm:px-6 bg-gray-50 ${footerClassName}`}>{footer}</div>}
    </div>
  );
};

export const CardHeader = ({ className = '', children }: { className?: string; children: ReactNode }) => (
  <div className={`px-4 py-5 sm:px-6 ${className}`}>{children}</div>
);

export const CardBody = ({ className = '', children }: { className?: string; children: ReactNode }) => (
  <div className={`px-4 py-5 sm:p-6 ${className}`}>{children}</div>
);

export const CardFooter = ({ className = '', children }: { className?: string; children: ReactNode }) => (
  <div className={`px-4 py-4 sm:px-6 bg-gray-50 ${className}`}>{children}</div>
); 