import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Microscope, 
  FileText,
  Save,
  X,
  Hash,
  Tag
} from 'lucide-react';
import CustomSelect from './CustomSelect';
import Label from './Label';
import Input from './Input';

interface AddInstrumentFormProps {
  onSave: (instrument: any) => void;
  onCancel: () => void;
  isEditing?: boolean;
  initialData?: any;
}

const AddInstrumentForm: React.FC<AddInstrumentFormProps> = ({
  onSave,
  onCancel,
  isEditing = false,
  initialData = null
}) => {
  const [formData, setFormData] = useState({
    instrumentName: initialData?.instrumentName || '',
    instrumentCategory: initialData?.instrumentCategory || '',
    serialNumber: initialData?.serialNumber || '',
    status: initialData?.status || '',
    ...(initialData || {})
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categoryOptions = [
    { value: 'Analytical Instruments', label: 'Analytical Instruments' },
    { value: 'Measurement Equipment', label: 'Measurement Equipment' },
    { value: 'Sample Preparation', label: 'Sample Preparation' },
    { value: 'Environmental Monitoring', label: 'Environmental Monitoring' },
    { value: 'Safety Equipment', label: 'Safety Equipment' }
  ];

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

    if (!formData.instrumentName.trim()) {
      newErrors.instrumentName = 'Instrument name is required';
    }
    if (!formData.instrumentCategory) {
      newErrors.instrumentCategory = 'Instrument category is required';
    }
    if (!formData.serialNumber.trim()) {
      newErrors.serialNumber = 'Serial number is required';
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
      const instrumentData = {
        ...formData,
        id: isEditing ? formData.id : `I${String(Date.now()).slice(-3)}`
      };
      onSave(instrumentData);
    }
  };

  return (
    <form id="instrument-form" onSubmit={handleSubmit} className="space-y-6 p-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <div className="space-y-4">
          {/* Instrument Name */}
          <Input
            label="Instrument Name"
            required
            value={formData.instrumentName}
            onChange={(e) => handleInputChange('instrumentName', e.target.value)}
            placeholder="Enter instrument name"
            error={errors.instrumentName}
          />

          {/* Instrument Category */}
          <div className="space-y-2">
           
            <CustomSelect
              label="Instrument Category"
              value={formData.instrumentCategory}
              onChange={(value) => handleInputChange('instrumentCategory', value)}
              options={categoryOptions}
              placeholder="Select instrument category"
            />
          </div>

          {/* Serial Number */}
          <Input
            label="Serial Number"
            required
            value={formData.serialNumber}
            onChange={(e) => handleInputChange('serialNumber', e.target.value)}
            placeholder="Enter serial number"
            error={errors.serialNumber}
          />

          {/* Status */}
          <div className="space-y-2">
          
            <CustomSelect
              label="Status"
              value={formData.status}
              onChange={(value) => handleInputChange('status', value)}
              options={statusOptions}
              placeholder="Select status"
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddInstrumentForm;
