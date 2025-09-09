import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';
import Label from './Label';

interface ReturnOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (remark: string) => void;
  orderId?: string;
  loading?: boolean;
}

const ReturnOrderModal: React.FC<ReturnOrderModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  orderId,
  loading = false
}) => {
  const [remark, setRemark] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!remark.trim()) {
      setError('Please provide a reason for return');
      return;
    }

    onConfirm(remark.trim());
  };

  const handleClose = () => {
    setRemark('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg mr-3">
                <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Return Order
              </h3>
            </div>
            <button
              onClick={handleClose}
              disabled={loading}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {orderId 
                ? `Are you sure you want to return order "${orderId}"? Please provide a reason for return.`
                : 'Are you sure you want to return this order? Please provide a reason for return.'
              }
            </p>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <Label htmlFor="returnRemark" required>
                  Reason for Return
                </Label>
                <textarea
                  id="returnRemark"
                  value={remark}
                  onChange={(e) => {
                    setRemark(e.target.value);
                    if (error) setError('');
                  }}
                  className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                    error 
                      ? 'border-orange-300 dark:border-orange-600' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  rows={4}
                  placeholder="Enter reason for return..."
                  required
                  disabled={loading}
                />
                {error && (
                  <p className="text-orange-600 dark:text-orange-400 text-sm mt-1">{error}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3">
                <motion.button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200 disabled:opacity-50"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={!remark.trim() || loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg transition-colors duration-200"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Returning...
                    </>
                  ) : (
                    <>
                      <X className="w-4 h-4 mr-2" />
                      Return Order
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ReturnOrderModal;
