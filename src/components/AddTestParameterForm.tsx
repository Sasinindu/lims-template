import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, FlaskConical, DollarSign, Microscope, Plus } from 'lucide-react';
import CustomSelect from './CustomSelect';
import Label from './Label';
import Input from './Input';
import SimpleTable from './SimpleTable';

interface AddTestParameterFormProps {
  onSave: (testParameter: any) => void;
  onCancel: () => void;
  isEditing?: boolean;
  initialData?: any;
}

const AddTestParameterForm: React.FC<AddTestParameterFormProps> = ({
  onSave,
  onCancel,
  isEditing = false,
  initialData = null
}) => {
  const [formData, setFormData] = useState({
    testType: initialData?.testType || initialData?.testName || '',
    protocol: initialData?.protocol || '',
    analytes: initialData?.analytes || [],
    reference: initialData?.reference || '',
    chemicals: initialData?.chemicals || [],
    costGroups: initialData?.costGroups || [],
    instruments: initialData?.instruments || [],
    status: initialData?.status || 'Active',
    ...(initialData || {})
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newChemical, setNewChemical] = useState({ name: '', quantity: '', unit: '' });
  const [newCostGroup, setNewCostGroup] = useState({ group: '', price: '' });
  const [newAnalyte, setNewAnalyte] = useState('');
  const [newInstrument, setNewInstrument] = useState('');

  // Mock data for dropdowns
  const testTypeOptions = [
    { value: 'Blood Chemistry Panel', label: 'Blood Chemistry Panel' },
    { value: 'Microbiology Culture', label: 'Microbiology Culture' },
    { value: 'Immunology Test', label: 'Immunology Test' },
    { value: 'Hematology Test', label: 'Hematology Test' },
    { value: 'Pathology Test', label: 'Pathology Test' }
  ];

  const chemicalOptions = [
    { value: 'EDTA', label: 'EDTA' },
    { value: 'Sodium Citrate', label: 'Sodium Citrate' },
    { value: 'Agar', label: 'Agar' },
    { value: 'Antibiotic Discs', label: 'Antibiotic Discs' },
    { value: 'ELISA Buffer', label: 'ELISA Buffer' },
    { value: 'Substrate', label: 'Substrate' },
    { value: 'PBS', label: 'PBS' },
    { value: 'Formalin', label: 'Formalin' }
  ];

  const unitOptions = [
    { value: 'mL', label: 'mL (Milliliters)' },
    { value: 'l', label: 'L (Liters)' },
    { value: 'g', label: 'g (Grams)' },
    { value: 'kg', label: 'kg (Kilograms)' },
    { value: 'mg', label: 'mg (Milligrams)' },
    { value: 'μg', label: 'μg (Micrograms)' },
    { value: 'μL', label: 'μL (Microliters)' },
    { value: 'discs', label: 'discs' },
    { value: 'tubes', label: 'tubes' },
    { value: 'plates', label: 'plates' }
  ];

  // Auto-select unit based on chemical
  const getDefaultUnitForChemical = (chemicalName: string) => {
    const unitMap: Record<string, string> = {
      'EDTA': 'mL',
      'Sodium Citrate': 'mL',
      'ELISA Buffer': 'mL',
      'Substrate': 'mL',
      'PBS': 'mL',
      'Formalin': 'mL',
      'Agar': 'g',
      'Antibiotic Discs': 'discs'
    };
    return unitMap[chemicalName] || 'mL';
  };

  const customerGroupOptions = [
    { value: 'Standard', label: 'Standard' },
    { value: 'Premium', label: 'Premium' },
    { value: 'VIP', label: 'VIP' },
    { value: 'Government', label: 'Government' },
    { value: 'Research', label: 'Research' }
  ];

  const instrumentOptions = [
    { value: 'Hematology Analyzer', label: 'Hematology Analyzer' },
    { value: 'Centrifuge', label: 'Centrifuge' },
    { value: 'Incubator', label: 'Incubator' },
    { value: 'Microscope', label: 'Microscope' },
    { value: 'ELISA Reader', label: 'ELISA Reader' },
    { value: 'Plate Washer', label: 'Plate Washer' },
    { value: 'PCR Machine', label: 'PCR Machine' },
    { value: 'Spectrophotometer', label: 'Spectrophotometer' }
  ];

  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
    { value: 'Pending', label: 'Pending' }
  ];

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleChemicalChange = (value: string) => {
    const defaultUnit = getDefaultUnitForChemical(value);
    setNewChemical(prev => ({ 
      ...prev, 
      name: value, 
      unit: defaultUnit 
    }));
  };

  const handleAddAnalyte = () => {
    if (newAnalyte.trim()) {
      setFormData(prev => ({
        ...prev,
        analytes: [...prev.analytes, newAnalyte.trim()]
      }));
      setNewAnalyte('');
    }
  };

  const handleRemoveAnalyte = (index: number) => {
    setFormData(prev => ({
      ...prev,
      analytes: prev.analytes.filter((_: any, i: number) => i !== index)
    }));
  };

  const handleAddInstrument = () => {
    if (newInstrument.trim()) {
      setFormData(prev => ({
        ...prev,
        instruments: [...prev.instruments, newInstrument.trim()]
      }));
      setNewInstrument('');
    }
  };

  const handleRemoveInstrument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      instruments: prev.instruments.filter((_: any, i: number) => i !== index)
    }));
  };

  const handleAddChemical = () => {
    if (newChemical.name && newChemical.quantity && newChemical.unit) {
      setFormData(prev => ({
        ...prev,
        chemicals: [...prev.chemicals, { ...newChemical }]
      }));
      setNewChemical({ name: '', quantity: '', unit: '' });
    }
  };

  const handleRemoveChemical = (index: number) => {
    setFormData(prev => ({
      ...prev,
      chemicals: prev.chemicals.filter((_: any, i: number) => i !== index)
    }));
  };

  const handleAddCostGroup = () => {
    if (newCostGroup.group && newCostGroup.price) {
      setFormData(prev => ({
        ...prev,
        costGroups: [...prev.costGroups, { ...newCostGroup, price: parseFloat(newCostGroup.price) }]
      }));
      setNewCostGroup({ group: '', price: '' });
    }
  };

  const handleRemoveCostGroup = (index: number) => {
    setFormData(prev => ({
      ...prev,
      costGroups: prev.costGroups.filter((_: any, i: number) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.testType) {
      newErrors.testType = 'Test type is required';
    }
    if (!formData.protocol.trim()) {
      newErrors.protocol = 'Protocol is required';
    }
    if (formData.analytes.length === 0) {
      newErrors.analytes = 'At least one analyte is required';
    }
    if (!formData.reference.trim()) {
      newErrors.reference = 'Reference is required';
    }
    if (formData.chemicals.length === 0) {
      newErrors.chemicals = 'At least one chemical is required';
    }
    if (formData.costGroups.length === 0) {
      newErrors.costGroups = 'At least one cost group is required';
    }
    if (formData.instruments.length === 0) {
      newErrors.instruments = 'At least one instrument is required';
    }
    if (!formData.status) {
      newErrors.status = 'Status is required';
    }

    // setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const testParameterData = {
        ...formData,
        testName: formData.testType, // Keep testName for backward compatibility
        id: isEditing ? formData.id : `TP${String(Date.now()).slice(-3)}`
      };
      onSave(testParameterData);
    }
  };

  // Table column definitions
  const analyteColumns = [
    { key: 'name', title: 'Analyte Name' }
  ];

  const instrumentColumns = [
    { key: 'name', title: 'Instrument Name' }
  ];

  const chemicalColumns = [
    { key: 'name', title: 'Chemical Name' },
    { 
      key: 'quantity', 
      title: 'Quantity',
      render: (value: string, record: any) => `${value} ${record.unit}`
    }
  ];

  const costGroupColumns = [
    { key: 'group', title: 'Customer Group' },
    { 
      key: 'price', 
      title: 'Price',
      render: (value: number) => `$${value}`
    }
  ];

  return (
    <form id="test-parameter-form" onSubmit={handleSubmit} className="space-y-8 p-6">
      {/* General Test Information */}
      <div className="space-y-6">
        <h3 className="flex items-center text-lg font-semibold text-gray-900 dark:text-white">
          <Settings className="w-5 h-5 mr-2 text-primary-600" />
          General Test Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Test Type */}
          <div className="space-y-2">
            <Label htmlFor="testType" required>
              Test Type
            </Label>
            <CustomSelect
              value={formData.testType}
              onChange={(value) => handleInputChange('testType', value)}
              options={testTypeOptions}
              placeholder="Select test type"
              error={errors.testType}
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status" required>
              Status
            </Label>
            <CustomSelect
              value={formData.status}
              onChange={(value) => handleInputChange('status', value)}
              options={statusOptions}
              placeholder="Select Status"
              error={errors.status}
            />
          </div>

          {/* Protocol */}
          <div className="md:col-span-2">
            <Input
              label="Protocol"
              required
              value={formData.protocol}
              onChange={(e) => handleInputChange('protocol', e.target.value)}
              placeholder="Enter protocol"
              error={errors.protocol}
            />
          </div>

          {/* Analytes */}
          <div className="md:col-span-2">
            <div className="space-y-4">
              <div className="flex items-end space-x-4">
                <div className="flex-1">
                  <Label htmlFor="analyte" required>
                    Analytes
                  </Label>
                  <Input
                    value={newAnalyte}
                    onChange={(e) => setNewAnalyte(e.target.value)}
                    placeholder="Enter analyte name"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddAnalyte();
                      }
                    }}
                  />
                </div>
                <motion.button
                  type="button"
                  onClick={handleAddAnalyte}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors duration-200"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </motion.button>
              </div>

              {/* Analytes Table */}
              <SimpleTable
                columns={analyteColumns}
                data={formData.analytes.map((analyte: string) => ({ name: analyte }))}
                onRemove={handleRemoveAnalyte}
                emptyMessage="No analytes added yet"
              />
              {errors.analytes && (
                <p className="text-red-600 dark:text-red-400 text-sm">{errors.analytes}</p>
              )}
            </div>
          </div>

          {/* Reference */}
          <div className="md:col-span-2">
            <Input
              label="Reference"
              required
              value={formData.reference}
              onChange={(e) => handleInputChange('reference', e.target.value)}
              placeholder="Enter reference"
              error={errors.reference}
            />
          </div>
        </div>
      </div>

      {/* Required Chemicals */}
      <div className="space-y-6">
        <h3 className="flex items-center text-lg font-semibold text-gray-900 dark:text-white">
          <FlaskConical className="w-5 h-5 mr-2 text-primary-600" />
          Required Chemicals
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-end space-x-4">
            <div className="flex-1">
              <Label htmlFor="chemical">Chemical</Label>
              <CustomSelect
                value={newChemical.name}
                onChange={handleChemicalChange}
                options={chemicalOptions}
                placeholder="Chemical"
              />
            </div>
            {newChemical.name && (
              <div className="flex-1">
                <Label htmlFor="unit">Unit</Label>
                <CustomSelect
                  value={newChemical.unit}
                  onChange={() => {}} // Disabled - no onChange handler
                  options={unitOptions}
                  placeholder="Unit"
                  disabled={true}
                />
              </div>
            )}
            <div className="flex-1">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                type="number"
                min="0"
                step="0.1"
                value={newChemical.quantity}
                onChange={(e) => setNewChemical(prev => ({ ...prev, quantity: e.target.value }))}
                placeholder="Enter quantity"
              />
            </div>
            <motion.button
              type="button"
              onClick={handleAddChemical}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add
            </motion.button>
          </div>

          {/* Chemicals Table */}
          <SimpleTable
            columns={chemicalColumns}
            data={formData.chemicals}
            onRemove={handleRemoveChemical}
            emptyMessage="No chemicals added yet"
          />
          {errors.chemicals && (
            <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.chemicals}</p>
          )}
        </div>
      </div>

      {/* Cost by Groups */}
      <div className="space-y-6">
        <h3 className="flex items-center text-lg font-semibold text-gray-900 dark:text-white">
          <DollarSign className="w-5 h-5 mr-2 text-primary-600" />
          Cost by Groups
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-end space-x-4">
            <div className="flex-1">
              <Label htmlFor="customerGroup">Customer Group</Label>
              <CustomSelect
                value={newCostGroup.group}
                onChange={(value) => setNewCostGroup(prev => ({ ...prev, group: value }))}
                options={customerGroupOptions}
                placeholder="Customer Group"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="price">Price</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={newCostGroup.price}
                onChange={(e) => setNewCostGroup(prev => ({ ...prev, price: e.target.value }))}
                placeholder="Enter price"
              />
            </div>
            <motion.button
              type="button"
              onClick={handleAddCostGroup}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add
            </motion.button>
          </div>

          {/* Cost Groups Table */}
          <SimpleTable
            columns={costGroupColumns}
            data={formData.costGroups}
            onRemove={handleRemoveCostGroup}
            emptyMessage="No cost groups added yet"
          />
          {errors.costGroups && (
            <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.costGroups}</p>
          )}
        </div>
      </div>

      {/* Instruments */}
      <div className="space-y-6">
        <h3 className="flex items-center text-lg font-semibold text-gray-900 dark:text-white">
          <Microscope className="w-5 h-5 mr-2 text-primary-600" />
          Instruments
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-end space-x-4">
            <div className="flex-1">
              <Label htmlFor="instrument" required>
                Instruments
              </Label>
              <Input
                value={newInstrument}
                onChange={(e) => setNewInstrument(e.target.value)}
                placeholder="Enter instrument name"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddInstrument();
                  }
                }}
              />
            </div>
            <motion.button
              type="button"
              onClick={handleAddInstrument}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add
            </motion.button>
          </div>

          {/* Instruments Table */}
          <SimpleTable
            columns={instrumentColumns}
            data={formData.instruments.map((instrument: string) => ({ name: instrument }))}
            onRemove={handleRemoveInstrument}
            emptyMessage="No instruments added yet"
          />
          {errors.instruments && (
            <p className="text-red-600 dark:text-red-400 text-sm">{errors.instruments}</p>
          )}
        </div>
      </div>
    </form>
  );
};

export default AddTestParameterForm;
