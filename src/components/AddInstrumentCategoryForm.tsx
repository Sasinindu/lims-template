import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  FileText,
  Save,
  X
} from 'lucide-react';
import CustomSelect from './CustomSelect';
import Label from './Label';
import Input from './Input';

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
          <Input
            label="Category Name"
            required
            value={formData.categoryName}
            onChange={(e) => handleInputChange('categoryName', e.target.value)}
            placeholder="Enter category name"
            error={errors.categoryName}
          />

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status" required>
              Status
            </Label>
            <CustomSelect
              value={formData.status}
              onChange={(value) => handleInputChange('status', value)}
              options={statusOptions}
              placeholder="Select status"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Description
            </Label>
            <div className="relative">
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-300 dark:border-gray-600/50 rounded-lg shadow-sm shadow-black/5 dark:shadow-black/20 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm resize-none"
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
