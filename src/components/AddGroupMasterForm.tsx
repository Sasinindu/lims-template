import React, { useState, useEffect } from 'react';
import { Users, Package, TestTube, DollarSign } from 'lucide-react';
import CustomSelect from './CustomSelect';
import Label from './Label';
import Input from './Input';

interface AddGroupMasterFormProps {
  onSave: (data: any) => void;
  onCancel: () => void;
  isEditing?: boolean;
  initialData?: any;
  isViewMode?: boolean;
}

const AddGroupMasterForm: React.FC<AddGroupMasterFormProps> = ({
  onSave,
  onCancel,
  isEditing = false,
  initialData,
  isViewMode = false
}) => {
  const [formData, setFormData] = useState({
    customer: initialData?.customer || null,
    commodityCategory: initialData?.commodityCategory || null,
    commoditySubCategory: initialData?.commoditySubCategory || null,
    commodity: initialData?.commodity || null,
    testParameter: initialData?.testParameter || null,
    price: initialData?.price || '',
    status: initialData?.status || 'Active'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Mock data for dropdowns
  const customers = [
    { value: 'C001', label: 'ABC Corporation' },
    { value: 'C002', label: 'XYZ Industries' },
    { value: 'C003', label: 'Ministry of Health' },
    { value: 'C004', label: 'University of Science' },
    { value: 'C005', label: 'Old Company Ltd' }
  ];

  const commodityCategories = [
    { value: 'CC001', label: 'Food Products' },
    { value: 'CC002', label: 'Chemical Products' },
    { value: 'CC003', label: 'Pharmaceutical' },
    { value: 'CC004', label: 'Environmental Samples' },
    { value: 'CC005', label: 'Industrial Materials' }
  ];

  // Mock data for cascading dropdowns
  const commoditySubCategories: Record<string, any[]> = {
    'CC001': [
      { value: 'CSC001', label: 'Dairy Products' },
      { value: 'CSC004', label: 'Beverages' },
      { value: 'CSC006', label: 'Meat Products' },
      { value: 'CSC007', label: 'Fruits & Vegetables' }
    ],
    'CC002': [
      { value: 'CSC002', label: 'Industrial Chemicals' },
      { value: 'CSC005', label: 'Cleaning Agents' },
      { value: 'CSC008', label: 'Laboratory Reagents' }
    ],
    'CC003': [
      { value: 'CSC003', label: 'Tablets' },
      { value: 'CSC009', label: 'Capsules' },
      { value: 'CSC010', label: 'Liquid Medicines' }
    ],
    'CC004': [
      { value: 'CSC011', label: 'Water Samples' },
      { value: 'CSC012', label: 'Soil Samples' },
      { value: 'CSC013', label: 'Air Quality' }
    ],
    'CC005': [
      { value: 'CSC014', label: 'Metals & Alloys' },
      { value: 'CSC015', label: 'Plastics & Polymers' },
      { value: 'CSC016', label: 'Textiles' }
    ]
  };

  const commodities: Record<string, any[]> = {
    'CSC001': [
      { value: 'COM001', label: 'Milk Powder' },
      { value: 'COM017', label: 'Cheese' },
      { value: 'COM018', label: 'Yogurt' }
    ],
    'CSC002': [
      { value: 'COM002', label: 'Sodium Hydroxide' },
      { value: 'COM019', label: 'Hydrochloric Acid' },
      { value: 'COM020', label: 'Sulfuric Acid' }
    ],
    'CSC003': [
      { value: 'COM003', label: 'Paracetamol Tablets' },
      { value: 'COM021', label: 'Aspirin Tablets' },
      { value: 'COM022', label: 'Antibiotic Tablets' }
    ],
    'CSC004': [
      { value: 'COM004', label: 'Fruit Juice' },
      { value: 'COM023', label: 'Soft Drinks' },
      { value: 'COM024', label: 'Energy Drinks' }
    ],
    'CSC005': [
      { value: 'COM005', label: 'Detergent Powder' },
      { value: 'COM025', label: 'Liquid Soap' },
      { value: 'COM026', label: 'Disinfectant' }
    ]
  };

  const testParameters = [
    { value: 'TP001', label: 'Microbiological Testing' },
    { value: 'TP002', label: 'Chemical Analysis' },
    { value: 'TP003', label: 'Drug Potency Test' },
    { value: 'TP004', label: 'Nutritional Analysis' },
    { value: 'TP005', label: 'Quality Control Test' },
    { value: 'TP006', label: 'Heavy Metals Detection' },
    { value: 'TP007', label: 'Pesticide Residue Test' },
    { value: 'TP008', label: 'pH & Acidity Test' },
    { value: 'TP009', label: 'Moisture Content Analysis' },
    { value: 'TP010', label: 'Contamination Screening' }
  ];

  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' }
  ];

  // Get available sub categories based on selected category
  const getAvailableSubCategories = () => {
    if (!formData.commodityCategory) return [];
    return commoditySubCategories[formData.commodityCategory.id] || [];
  };

  // Get available commodities based on selected sub category
  const getAvailableCommodities = () => {
    if (!formData.commoditySubCategory) return [];
    return commodities[formData.commoditySubCategory.id] || [];
  };

  // Reset cascading fields when parent changes
  useEffect(() => {
    if (formData.commodityCategory && initialData?.commodityCategory?.id !== formData.commodityCategory.id) {
      setFormData(prev => ({
        ...prev,
        commoditySubCategory: null,
        commodity: null
      }));
    }
  }, [formData.commodityCategory]);

  useEffect(() => {
    if (formData.commoditySubCategory && initialData?.commoditySubCategory?.id !== formData.commoditySubCategory.id) {
      setFormData(prev => ({
        ...prev,
        commodity: null
      }));
    }
  }, [formData.commoditySubCategory]);

  const handleInputChange = (field: string, value: any) => {
    if (field === 'customer') {
      const customerData = customers.find(c => c.value === value);
      setFormData(prev => ({ ...prev, customer: { id: value, name: customerData?.label || '' } }));
    } else if (field === 'commodityCategory') {
      const categoryData = commodityCategories.find(c => c.value === value);
      setFormData(prev => ({ 
        ...prev, 
        commodityCategory: { id: value, name: categoryData?.label || '' },
        commoditySubCategory: null,
        commodity: null
      }));
    } else if (field === 'commoditySubCategory') {
      const subCategoryData = getAvailableSubCategories().find(c => c.value === value);
      setFormData(prev => ({ 
        ...prev, 
        commoditySubCategory: { id: value, name: subCategoryData?.label || '' },
        commodity: null
      }));
    } else if (field === 'commodity') {
      const commodityData = getAvailableCommodities().find(c => c.value === value);
      setFormData(prev => ({ ...prev, commodity: { id: value, name: commodityData?.label || '' } }));
    } else if (field === 'testParameter') {
      const testParameterData = testParameters.find(t => t.value === value);
      setFormData(prev => ({ ...prev, testParameter: { id: value, name: testParameterData?.label || '' } }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customer) {
      newErrors.customer = 'Customer is required';
    }
    if (!formData.commodityCategory) {
      newErrors.commodityCategory = 'Commodity category is required';
    }
    if (!formData.commoditySubCategory) {
      newErrors.commoditySubCategory = 'Commodity sub category is required';
    }
    if (!formData.commodity) {
      newErrors.commodity = 'Commodity is required';
    }
    if (!formData.testParameter) {
      newErrors.testParameter = 'Test parameter is required';
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }
    if (!formData.status) {
      newErrors.status = 'Status is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isViewMode) return;
    
    if (validateForm()) {
      onSave({
        ...formData,
        price: parseFloat(formData.price)
      });
    }
  };

  return (
    <form id="group-master-form" onSubmit={handleSubmit} className="space-y-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Customer */}
          <div>
            <Label htmlFor="customer" required>Customer</Label>
            <CustomSelect
              value={formData.customer?.id || ''}
              onChange={(value) => handleInputChange('customer', value)}
              options={customers}
              placeholder="Select Customer"
              error={errors.customer}
              disabled={isViewMode}
            />
          </div>

          {/* Commodity Category */}
          <div>
            <Label htmlFor="commodityCategory" required>Commodity Category</Label>
            <CustomSelect
              value={formData.commodityCategory?.id || ''}
              onChange={(value) => handleInputChange('commodityCategory', value)}
              options={commodityCategories}
              placeholder="Select Commodity Category"
              error={errors.commodityCategory}
              disabled={isViewMode}
            />
          </div>

          {/* Commodity Sub Category */}
          <div>
            <Label htmlFor="commoditySubCategory" required>Commodity Sub Category</Label>
            <CustomSelect
              value={formData.commoditySubCategory?.id || ''}
              onChange={(value) => handleInputChange('commoditySubCategory', value)}
              options={getAvailableSubCategories()}
              placeholder="Select Commodity Sub Category"
              error={errors.commoditySubCategory}
              disabled={isViewMode || !formData.commodityCategory}
            />
          </div>

          {/* Commodity */}
          <div>
            <Label htmlFor="commodity" required>Commodity</Label>
            <CustomSelect
              value={formData.commodity?.id || ''}
              onChange={(value) => handleInputChange('commodity', value)}
              options={getAvailableCommodities()}
              placeholder="Select Commodity"
              error={errors.commodity}
              disabled={isViewMode || !formData.commoditySubCategory}
            />
          </div>

          {/* Test Parameter */}
          <div>
            <Label htmlFor="testParameter" required>Test Parameter</Label>
            <CustomSelect
              value={formData.testParameter?.id || ''}
              onChange={(value) => handleInputChange('testParameter', value)}
              options={testParameters}
              placeholder="Select Test Parameter"
              error={errors.testParameter}
              disabled={isViewMode}
            />
          </div>

        {/* Price */}
        <div>
          <Input
            label="Price (Rs.)"
            required
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={(e) => handleInputChange('price', e.target.value)}
            placeholder="Enter price in Rs."
            error={errors.price}
            disabled={isViewMode}
          />
        </div>

        {/* Status */}
        <div>
          <Label htmlFor="status" required>Status</Label>
          <CustomSelect
            value={formData.status}
            onChange={(value) => handleInputChange('status', value)}
            options={statusOptions}
            placeholder="Select Status"
            error={errors.status}
            disabled={isViewMode}
          />
        </div>
      </div>
    </form>
  );
};

export default AddGroupMasterForm; 