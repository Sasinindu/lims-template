import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  FileText,
  Save,
  X
} from 'lucide-react';
import CustomSelect from './CustomSelect';

interface AddInstrumentCategoryFormProps {
  onSave: (category: any) => void;
  onCancel: () => void;
  isEditing?: boolean;
  initialData?: any;
}

const AddInstrumentCategoryForm: React.FC<AddInstrumentCategoryFormProps> = ({
  onSave,
  onCancel,
  isEditing = false,
  initialData = null
}) => {
  const [formData, setFormData] = useState({
    categoryName: initialData?.categoryName || '',
    status: initialData?.status || '',
    description: initialData?.description || '',
    ...(initialData || {})
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.categoryName.trim()) {
      newErrors.categoryName = 'Category name is required';
    }
    if (!formData.status) {
      newErrors.status = 'Status is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const categoryData = {
        ...formData,
        id: isEditing ? formData.id : `IC${String(Date.now()).slice(-3)}`
      };
      onSave(categoryData);
    }
  };

  return (
    <form id="category-form" onSubmit={handleSubmit} className="space-y-6 p-6">
      {/* Basic Information */}
      <div className="space-y-4">

        
        <div className="space-y-4">
          {/* Category Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Category Name *
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.categoryName}
                onChange={(e) => handleInputChange('categoryName', e.target.value)}
                className={`input-field-sm  ${errors.categoryName ? 'border-red-500 focus:border-red-500' : ''}`}
                placeholder="Enter category name"
              />
            </div>
            {errors.categoryName && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.categoryName}</p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Status *
            </label>
            <CustomSelect
              value={formData.status}
              onChange={(value) => handleInputChange('status', value)}
              options={statusOptions}
              placeholder="Select status"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <div className="relative">
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="input-field-sm resize-none"
                placeholder="Enter category description"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddInstrumentCategoryForm;
