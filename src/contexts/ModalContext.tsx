import React, { createContext, useContext, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalContextType {
  isOpen: boolean;
  openModal: (content: ReactNode, options?: ModalOptions) => void;
  closeModal: () => void;
  updateModal: (content: ReactNode, options?: ModalOptions) => void;
}

interface ModalOptions {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  closable?: boolean;
  backdrop?: boolean;
  backdropClosable?: boolean;
  className?: string;
  overlayClassName?: string;
  showCloseButton?: boolean;
  animation?: boolean;
  zIndex?: number;
}

interface ModalState {
  isOpen: boolean;
  content: ReactNode;
  options: ModalOptions;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    content: null,
    options: {}
  });

  const openModal = (content: ReactNode, options: ModalOptions = {}) => {
    setModal({
      isOpen: true,
      content,
      options: {
        size: 'md',
        closable: true,
        backdrop: true,
        backdropClosable: true,
        showCloseButton: true,
        animation: true,
        zIndex: 9999,
        ...options
      }
    });
  };

  const closeModal = () => {
    setModal(prev => ({ ...prev, isOpen: false }));
  };

  const updateModal = (content: ReactNode, options: ModalOptions = {}) => {
    setModal(prev => ({
      ...prev,
      content,
      options: { ...prev.options, ...options }
    }));
  };

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm':
        return 'max-w-sm';
      case 'md':
        return 'max-w-md';
      case 'lg':
        return 'max-w-lg';
      case 'xl':
        return 'max-w-xl';
      case '2xl':
        return 'max-w-2xl';
      case '3xl':
        return 'max-w-3xl';
      case 'full':
        return 'max-w-full h-full';
      default:
        return 'max-w-md';
    }
  };

  const handleBackdropClick = () => {
    if (modal.options.backdropClosable) {
      closeModal();
    }
  };

  const handleEscapeKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && modal.options.closable) {
      closeModal();
    }
  };

  React.useEffect(() => {
    if (modal.isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [modal.isOpen, modal.options.closable]);

  const contextValue: ModalContextType = {
    isOpen: modal.isOpen,
    openModal,
    closeModal,
    updateModal
  };

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      
      {/* Modal Portal */}
      <AnimatePresence>
        {modal.isOpen && (
          <div 
            className={`fixed inset-0 flex items-center justify-center ${modal.options.overlayClassName || ''}`}
            style={{ zIndex: modal.options.zIndex }}
          >
            {/* Backdrop */}
            {modal.options.backdrop && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={handleBackdropClick}
              />
            )}

            {/* Modal Content */}
            <motion.div
              initial={modal.options.animation ? { opacity: 0, scale: 0.9, y: 20 } : {}}
              animate={modal.options.animation ? { opacity: 1, scale: 1, y: 0 } : {}}
              exit={modal.options.animation ? { opacity: 0, scale: 0.9, y: 20 } : {}}
              transition={modal.options.animation ? { 
                type: "spring", 
                damping: 25, 
                stiffness: 300,
                duration: 0.3 
              } : {}}
              className={`relative w-full mx-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden ${getSizeClasses(modal.options.size || 'md')} ${modal.options.className || ''}`}
            >
              {/* Close Button */}
              {modal.options.showCloseButton && modal.options.closable && (
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              )}

              {/* Modal Body */}
              <div className="relative">
                {modal.content}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ModalContext.Provider>
  );
};

export default ModalProvider; 