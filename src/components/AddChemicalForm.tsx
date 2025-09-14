import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, Package, Hash } from 'lucide-react';
import CustomSelect from './CustomSelect';
import Label from './Label';
import Input from './Input';

interface AddChemicalFormProps {
  onSave: (chemical: any) => void;
  onCancel: () => void;
  isEditing?: boolean;
  initialData?: any;
  isViewMode?: boolean;
}

const AddChemicalForm: React.FC<AddChemicalFormProps> = ({
  onSave,
  onCancel,
  isEditing = false,
  initialData = null,
  isViewMode = false
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    unit: initialData?.unit || '',
    availability: initialData?.availability || '',
    volume: initialData?.volume || '',
    reorderQuantity: initialData?.reorderQuantity || '',
    status: initialData?.status || 'Active',
    ...(initialData || {})
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const unitOptions = [
    { value: 'mL', label: 'mL (Milliliters)' },
    { value: 'l', label: 'L (Liters)' },
    { value: 'g', label: 'g (Grams)' },
    { value: 'kg', label: 'kg (Kilograms)' },
    { value: 'unit', label: 'Unit' }
  ];

  const availabilityOptions = [
    { value: 'In Stock', label: 'In Stock' },
    { value: 'Low Stock', label: 'Low Stock' },
    { value: 'Out of Stock', label: 'Out of Stock' },
    { value: 'On Order', label: 'On Order' }
  ];

  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
    { value: 'Pending', label: 'Pending' }
  ];

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Chemical name is required';
    }
    if (!formData.unit) {
      newErrors.unit = 'Unit is required';
    }
    if (!formData.availability) {
      newErrors.availability = 'Availability is required';
    }
    if (!formData.volume || formData.volume <= 0) {
      newErrors.volume = 'Volume must be greater than 0';
    }
    if (!formData.reorderQuantity || formData.reorderQuantity <= 0) {
      newErrors.reorderQuantity = 'Reorder quantity must be greater than 0';
    }
    if (!formData.status) {
      newErrors.status = 'Status is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isViewMode && validateForm()) {
      const chemicalData = {
        ...formData,
        volume: parseFloat(formData.volume.toString()),
        reorderQuantity: parseFloat(formData.reorderQuantity.toString()),
        id: isEditing ? formData.id : `CH${String(Date.now()).slice(-3)}`
      };
      onSave(chemicalData);
    }
  };

  return (
    <form id="chemical-form" onSubmit={handleSubmit} className="space-y-6 p-6">
      {/* Chemical Information */}
      <div className="space-y-6">
  

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Chemical Name */}
          <div className="md:col-span-2">
            <Input
              label="Chemical Name"
              required
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter chemical name"
              error={errors.name}
              disabled={isViewMode}
            />
          </div>

          {/* Unit */}
          <div className="space-y-2">

            <CustomSelect
              label="Unit of Measure"
              value={formData.unit}
              onChange={(value) => handleInputChange('unit', value)}
              options={unitOptions}
              placeholder="Select unit"
              error={errors.unit}
              disabled={isViewMode}
            />
          </div>

          {/* Availability */}
          <div className="space-y-2">
            <CustomSelect
              label="Availability"
              value={formData.availability}
              onChange={(value) => handleInputChange('availability', value)}
              options={availabilityOptions}
              placeholder="Select availability"
              error={errors.availability}
              disabled={isViewMode}
            />
          </div>

          {/* Volume */}
          <Input
            label="Volume"
            required
            type="number"
            min="0"
            step="0.1"
            value={formData.volume}
            onChange={(e) => handleInputChange('volume', e.target.value)}
            placeholder="Enter volume"
            error={errors.volume}
            disabled={isViewMode}
          />

          {/* Reorder Quantity */}
          <Input
            label="Reorder Quantity"
            required
            type="number"
            min="0"
            step="0.1"
            value={formData.reorderQuantity}
            onChange={(e) => handleInputChange('reorderQuantity', e.target.value)}
            placeholder="Enter reorder quantity"
            error={errors.reorderQuantity}
            disabled={isViewMode}
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
              error={errors.status}
              disabled={isViewMode}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddChemicalForm;
