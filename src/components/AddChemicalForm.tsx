import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FlaskConical, 
  AlertTriangle, 
  Thermometer, 
  Calendar,
  Building2,
  FileText,
  Save,
  X,
  Droplets
} from 'lucide-react';
import CustomSelect from './CustomSelect';

interface AddChemicalFormProps {
  onSave: (chemical: any) => void;
  onCancel: () => void;
  isEditing?: boolean;
  initialData?: any;
}

const AddChemicalForm: React.FC<AddChemicalFormProps> = ({
  onSave,
  onCancel,
  isEditing = false,
  initialData = null
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    formula: initialData?.formula || '',
    category: initialData?.category || '',
    concentration: initialData?.concentration || '',
    hazardLevel: initialData?.hazardLevel || '',
    storageTemp: initialData?.storageTemp || '',
    expiryDate: initialData?.expiryDate || '',
    supplier: initialData?.supplier || '',
    description: initialData?.description || '',
    ...(initialData || {})
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    { value: 'Acid', label: 'Acid' },
    { value: 'Base', label: 'Base' },
    { value: 'Solvent', label: 'Solvent' },
    { value: 'Oxidizing Agent', label: 'Oxidizing Agent' },
    { value: 'Salt', label: 'Salt' },
    { value: 'Buffer', label: 'Buffer' },
    { value: 'Indicator', label: 'Indicator' },
    { value: 'Other', label: 'Other' }
  ];

  const hazardLevels = [
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' },
    { value: 'Extreme', label: 'Extreme' }
  ];

  const storageTemps = [
    { value: 'Room Temperature', label: 'Room Temperature' },
    { value: 'Cool Storage', label: 'Cool Storage (2-8°C)' },
    { value: 'Refrigerated', label: 'Refrigerated (0-4°C)' },
    { value: 'Frozen', label: 'Frozen (-20°C)' },
    { value: 'Deep Freeze', label: 'Deep Freeze (-80°C)' }
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
      newErrors.name = 'Chemical name is required';
    }
    if (!formData.formula.trim()) {
      newErrors.formula = 'Chemical formula is required';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    if (!formData.concentration.trim()) {
      newErrors.concentration = 'Concentration is required';
    }
    if (!formData.hazardLevel) {
      newErrors.hazardLevel = 'Hazard level is required';
    }
    if (!formData.storageTemp) {
      newErrors.storageTemp = 'Storage temperature is required';
    }
    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    }
    if (!formData.supplier.trim()) {
      newErrors.supplier = 'Supplier is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const chemicalData = {
        ...formData,
        id: isEditing ? formData.id : `CH${String(Date.now()).slice(-3)}`,
        status: 'Active'
      };
      onSave(chemicalData);
    }
  };

  return (
    <form id="chemical-form" onSubmit={handleSubmit} className="space-y-6 p-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
          <FlaskConical className="w-5 h-5 mr-2 text-primary-600" />
          Basic Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Chemical Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Chemical Name *
            </label>
            <div className="relative">
              <FlaskConical className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`input-field-sm pl-10 ${errors.name ? 'border-red-500 focus:border-red-500' : ''}`}
                placeholder="Enter chemical name"
              />
            </div>
            {errors.name && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.name}</p>
            )}
          </div>

          {/* Chemical Formula */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Chemical Formula *
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={formData.formula}
                onChange={(e) => handleInputChange('formula', e.target.value)}
                className={`input-field-sm pl-10 ${errors.formula ? 'border-red-500 focus:border-red-500' : ''}`}
                placeholder="e.g., NaOH, HCl"
              />
            </div>
            {errors.formula && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.formula}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Category *
            </label>
            <CustomSelect
              value={formData.category}
              onChange={(value) => handleInputChange('category', value)}
              options={categories}
              placeholder="Select category"
            />
          </div>

          {/* Concentration */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Concentration *
            </label>
            <div className="relative">
              <Droplets className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={formData.concentration}
                onChange={(e) => handleInputChange('concentration', e.target.value)}
                className={`input-field-sm pl-10 ${errors.concentration ? 'border-red-500 focus:border-red-500' : ''}`}
                placeholder="e.g., 99.5%, 1M, 0.1N"
              />
            </div>
            {errors.concentration && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.concentration}</p>
            )}
          </div>
        </div>
      </div>

      {/* Safety Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
          Safety Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Hazard Level */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Hazard Level *
            </label>
            <CustomSelect
              value={formData.hazardLevel}
              onChange={(value) => handleInputChange('hazardLevel', value)}
              options={hazardLevels}
              placeholder="Select hazard level"
            />
          </div>

          {/* Storage Temperature */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Storage Temperature *
            </label>
            <div className="relative">
              <Thermometer className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <CustomSelect
                value={formData.storageTemp}
                onChange={(value) => handleInputChange('storageTemp', value)}
                options={storageTemps}
                placeholder="Select storage temperature"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
          <Building2 className="w-5 h-5 mr-2 text-primary-600" />
          Additional Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Expiry Date */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Expiry Date *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                className={`input-field-sm pl-10 ${errors.expiryDate ? 'border-red-500 focus:border-red-500' : ''}`}
              />
            </div>
            {errors.expiryDate && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.expiryDate}</p>
            )}
          </div>

          {/* Supplier */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Supplier *
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={formData.supplier}
                onChange={(e) => handleInputChange('supplier', e.target.value)}
                className={`input-field-sm pl-10 ${errors.supplier ? 'border-red-500 focus:border-red-500' : ''}`}
                placeholder="Enter supplier name"
              />
            </div>
            {errors.supplier && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.supplier}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={3}
            className="input-field-sm resize-none"
            placeholder="Enter chemical description or notes"
          />
        </div>
      </div>
    </form>
  );
};

export default AddChemicalForm;
