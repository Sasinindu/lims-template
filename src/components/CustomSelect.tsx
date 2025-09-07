import React, { useState, useRef, useEffect } from 'react';
import Label from './Label';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  error?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  error,
  options,
  value,
  onChange,
  placeholder = "Select an option",
  label,
  disabled = false,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full px-3 py-2 text-left bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600/50'} 
          rounded-lg shadow-sm shadow-black/5 dark:shadow-black/20 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 
          transition-all duration-300 flex items-center justify-between min-h-[36px] text-sm
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-md hover:shadow-black/10 dark:hover:shadow-black/30'}
          ${isOpen ? 'ring-2 ring-primary-500/50 border-primary-500 shadow-md shadow-primary-500/10 dark:shadow-primary-500/20' : ''}
        `}
      >
        <div className="flex items-center space-x-3">
          {selectedOption ? (
            <span className="text-gray-900 dark:text-white text-sm">
              {selectedOption.label}
            </span>
          ) : (
            <span className="text-gray-500 dark:text-gray-400 text-sm">{placeholder}</span>
          )}
        </div>
        
        <ChevronDown 
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleOptionClick(option.value)}
              className={`
                w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 flex items-center justify-between
                ${value === option.value ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'text-gray-900 dark:text-white'}
              `}
            >
              <span className="text-sm">
                {option.label}
              </span>
              
              {value === option.value && (
                <div className="flex-shrink-0">
                  <Check className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}
      
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</p>
      )}
    </div>
  );
};

export default CustomSelect;
