import React from 'react';
import { AlertTriangle, Trash2, User, Building2, FlaskConical, Package, FileText } from 'lucide-react';
import { useModal } from '../contexts/ModalContext';

interface ConfirmationModalContentProps {
  title: string;
  message: string;
  type?: 'delete' | 'warning' | 'danger';
  itemType?: 'customer' | 'site' | 'chemical' | 'instrument' | 'order' | 'test' | 'generic';
  itemName?: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}

const ConfirmationModalContent: React.FC<ConfirmationModalContentProps> = ({
  title,
  message,
  type = 'delete',
  itemType = 'generic',
  itemName,
  onConfirm,
  confirmText,
  cancelText = 'Cancel',
  loading = false
}) => {
  const { closeModal } = useModal();

  const getIcon = () => {
    switch (itemType) {
      case 'customer':
        return <User className="w-8 h-8" />;
      case 'site':
        return <Building2 className="w-8 h-8" />;
      case 'chemical':
        return <FlaskConical className="w-8 h-8" />;
      case 'instrument':
        return <Package className="w-8 h-8" />;
      case 'order':
        return <FileText className="w-8 h-8" />;
      default:
        return <Trash2 className="w-8 h-8" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'danger':
        return {
          bg: 'bg-red-50 dark:bg-red-900/10',
          iconBg: 'bg-red-100 dark:bg-red-900/20',
          iconColor: 'text-red-600 dark:text-red-400',
          button: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
          border: 'border-red-200 dark:border-red-800'
        };
      case 'warning':
        return {
          bg: 'bg-orange-50 dark:bg-orange-900/10',
          iconBg: 'bg-orange-100 dark:bg-orange-900/20',
          iconColor: 'text-orange-600 dark:text-orange-400',
          button: 'bg-orange-600 hover:bg-orange-700 focus:ring-orange-500',
          border: 'border-orange-200 dark:border-orange-800'
        };
      default:
        return {
          bg: 'bg-red-20 dark:bg-red-900/10',
          iconBg: 'bg-red-100 dark:bg-red-900/20',
          iconColor: 'text-red-600 dark:text-red-400',
          button: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
          border: 'border-red-200 dark:border-red-800'
        };
    }
  };

  const colors = getColors();

  const getDefaultConfirmText = () => {
    switch (type) {
      case 'danger':
        return 'Delete Permanently';
      case 'warning':
        return 'Continue';
      default:
        return 'Delete';
    }
  };

  const handleConfirm = () => {
    onConfirm();
    closeModal();
  };

  const handleCancel = () => {
    closeModal();
  };

  return (
    <div className={`${colors.bg} ${colors.border} border-t border-l border-r rounded-t-2xl`}>
      {/* Header */}
      <div className="relative p-6 pb-4">
        {/* Icon and title */}
        <div className="flex items-start space-x-4">
          <div className={`p-3 ${colors.iconBg} rounded-xl`}>
            <div className={colors.iconColor}>
              {getIcon()}
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            
            {itemName && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">
                {itemName}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-6">
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          {message}
        </p>

        {/* Warning text for delete actions */}
        {type === 'delete' && (
          <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-red-700 dark:text-red-300">
                This action cannot be undone. The item will be permanently removed.
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg transition-all duration-200 disabled:opacity-50"
          >
            {cancelText}
          </button>
          
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className={`flex items-center px-4 py-2 text-sm font-medium text-white ${colors.button} rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                {type === 'delete' && <Trash2 className="w-4 h-4 mr-2" />}
                {confirmText || getDefaultConfirmText()}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModalContent; 