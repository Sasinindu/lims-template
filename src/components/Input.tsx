import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  required?: boolean;
  error?: string;
  icon?: React.ReactNode;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  required = false,
  error,
  icon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className="space-y-2">
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
            {icon}
          </div>
        )}
        
        <input
          id={inputId}
          className={`
            w-full px-3 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm 
            border border-gray-300 dark:border-gray-600/50 rounded-lg 
            shadow-sm shadow-black/5 dark:shadow-black/20 
            focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 
            transition-all duration-300 text-gray-900 dark:text-white 
            placeholder-gray-500 dark:placeholder-gray-400 text-sm
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-red-500 focus:border-red-500' : ''}
            ${className}
          `.trim()}
          {...props}
        />
      </div>
      
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default Input;
