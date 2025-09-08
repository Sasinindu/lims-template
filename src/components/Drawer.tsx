import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  position?: 'right' | 'left';
}

const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  position = 'right'
}) => {
  const sizeClasses = {
    sm: 'w-96',
    md: 'w-[500px]',
    lg: 'w-[600px]',
    xl: 'w-[800px]',
    '2xl': 'w-[1000px]',
    '3xl': 'w-[1200px]'
  };

  const positionClasses = {
    right: 'right-0',
    left: 'left-0'
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-50"
            style={{ 
              position: 'fixed', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0,
              marginTop: 0,
              margin: 0
            }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ 
              opacity: 0, 
              x: position === 'right' ? '100%' : '-100%' 
            }}
            animate={{ 
              opacity: 1, 
              x: 0 
            }}
            exit={{ 
              opacity: 0, 
              x: position === 'right' ? '100%' : '-100%' 
            }}
            transition={{ 
              type: 'spring', 
              damping: 25, 
              stiffness: 200 
            }}
            className={`fixed top-0 ${positionClasses[position]} h-full ${sizeClasses[size]} bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col`}
            style={{ 
              position: 'fixed', 
              top: 0, 
              marginTop: 0,
              margin: 0
            }}
          >
            {/* Header - Reduced size */}
            <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 bg-primary-100 dark:bg-gray-800">
              <h3 className=" font-semibold text-gray-700 dark:text-white">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {children}
            </div>

            {/* Footer - Reduced size, same color */}
            {footer && (
              <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700  ">
                {footer}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Drawer;
