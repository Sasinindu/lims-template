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
import Label from './Label';
import Input from './Input';

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

  const categoryOptions = [
    { value: 'Acid', label: 'Acid' },
    { value: 'Base', label: 'Base' },
    { value: 'Solvent', label: 'Solvent' },
    { value: 'Reagent', label: 'Reagent' },
    { value: 'Buffer', label: 'Buffer' }
  ];

  const hazardLevelOptions = [
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' },
    { value: 'Extreme', label: 'Extreme' }
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
    if (!formData.expiryDate.trim()) {
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
        id: isEditing ? formData.id : `C${String(Date.now()).slice(-3)}`
      };
      onSave(chemicalData);
    }
  };

  return (
    <form id="chemical-form" onSubmit={handleSubmit} className="space-y-6 p-6">
      {/* Basic Information */}
      <div className="space-y-6">
        <h3 className="flex items-center text-lg font-semibold text-gray-900 dark:text-white">
          <FlaskConical className="w-5 h-5 mr-2 text-primary-600" />
          Basic Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Chemical Name */}
          <Input
            label="Chemical Name"
            required
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter chemical name"
            error={errors.name}
            icon={<FlaskConical className="w-4 h-4 text-gray-400" />}
          />

          {/* Chemical Formula */}
          <Input
            label="Chemical Formula"
            required
            value={formData.formula}
            onChange={(e) => handleInputChange('formula', e.target.value)}
            placeholder="Enter chemical formula"
            error={errors.formula}
            icon={<FileText className="w-4 h-4 text-gray-400" />}
          />

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" required>
              Category
            </Label>
            <CustomSelect
              value={formData.category}
              onChange={(value) => handleInputChange('category', value)}
              options={categoryOptions}
              placeholder="Select category"
              error={errors.category}
            />
          </div>

          {/* Concentration */}
          <Input
            label="Concentration"
            required
            value={formData.concentration}
            onChange={(e) => handleInputChange('concentration', e.target.value)}
            placeholder="Enter concentration"
            error={errors.concentration}
            icon={<Droplets className="w-4 h-4 text-gray-400" />}
          />

          {/* Hazard Level */}
          <div className="space-y-2">
            <Label htmlFor="hazardLevel" required>
              Hazard Level
            </Label>
            <CustomSelect
              value={formData.hazardLevel}
              onChange={(value) => handleInputChange('hazardLevel', value)}
              options={hazardLevelOptions}
              placeholder="Select hazard level"
              error={errors.hazardLevel}
            />
          </div>

          {/* Storage Temperature */}
          <Input
            label="Storage Temperature"
            value={formData.storageTemp}
            onChange={(e) => handleInputChange('storageTemp', e.target.value)}
            placeholder="Enter storage temperature"
            icon={<Thermometer className="w-4 h-4 text-gray-400" />}
          />
        </div>
      </div>

      {/* Additional Information */}
      <div className="space-y-6">
        <h3 className="flex items-center text-lg font-semibold text-gray-900 dark:text-white">
          <Building2 className="w-5 h-5 mr-2 text-primary-600" />
          Additional Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Expiry Date */}
          <Input
            label="Expiry Date"
            required
            type="date"
            value={formData.expiryDate}
            onChange={(e) => handleInputChange('expiryDate', e.target.value)}
            error={errors.expiryDate}
            icon={<Calendar className="w-4 h-4 text-gray-400" />}
          />

          {/* Supplier */}
          <Input
            label="Supplier"
            required
            value={formData.supplier}
            onChange={(e) => handleInputChange('supplier', e.target.value)}
            placeholder="Enter supplier name"
            error={errors.supplier}
            icon={<Building2 className="w-4 h-4 text-gray-400" />}
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
              placeholder="Enter chemical description"
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddChemicalForm;
