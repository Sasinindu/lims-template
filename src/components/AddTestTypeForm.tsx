import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TestTube, CheckCircle } from 'lucide-react';
import CustomSelect from './CustomSelect';
import Label from './Label';
import Input from './Input';

interface AddTestTypeFormProps {
  onSave: (testType: any) => void;
  onCancel: () => void;
  isEditing?: boolean;
  initialData?: any;
}

const AddTestTypeForm: React.FC<AddTestTypeFormProps> = ({
  onSave,
  onCancel,
  isEditing = false,
  initialData = null
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    status: initialData?.status || 'Active',
    ...(initialData || {})
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
    { value: 'Pending', label: 'Pending' }
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

    if (!formData.name.trim()) {
      newErrors.name = 'Test name is required';
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
      const testTypeData = {
        ...formData,
        id: isEditing ? formData.id : `TT${String(Date.now()).slice(-3)}`
      };
      onSave(testTypeData);
    }
  };

  return (
    <form id="test-type-form" onSubmit={handleSubmit} className="space-y-6 p-6">
      {/* Test Type Information */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          {/* Test Name */}
          <Input
            label="Test Name"
            required
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter test name"
            error={errors.name}
          />

          {/* Status */}
          <div className="space-y-2">
            <CustomSelect
              label="Status"
              value={formData.status}
              onChange={(value) => handleInputChange('status', value)}
              options={statusOptions}
              placeholder="Select status"
              error={errors.status}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddTestTypeForm;
