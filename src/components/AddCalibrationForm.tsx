import React, { useState, useEffect } from 'react';
import Label from './Label';
import Input from './Input';
import CustomSelect from './CustomSelect';

interface CalibrationData {
  calibrationDate: string;
  nextCalibrationDate: string;
  status: string;
  performedBy: string;
  notes: string;
}

interface AddCalibrationFormProps {
  onSave: (calibrationData: CalibrationData) => void;
  instrument?: any;
}

const AddCalibrationForm: React.FC<AddCalibrationFormProps> = ({
  onSave,
  instrument
}) => {
  const [formData, setFormData] = useState<CalibrationData>({
    calibrationDate: '',
    nextCalibrationDate: '',
    status: '',
    performedBy: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Partial<CalibrationData>>({});

  const statusOptions = [
    { value: 'Passed', label: 'Passed' },
    { value: 'Failed', label: 'Failed' },
    { value: 'Conditional', label: 'Conditional' },
    { value: 'Pending', label: 'Pending' }
  ];

  const handleInputChange = (field: keyof CalibrationData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const calculateNextCalibrationDate = (calibrationDate: string, cycle: string) => {
    if (!calibrationDate) return '';
    
    const date = new Date(calibrationDate);
    const nextDate = new Date(date);
    
    switch (cycle) {
      case 'Monthly':
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      case 'Quarterly':
        nextDate.setMonth(nextDate.getMonth() + 3);
        break;
      case 'Semi-Annually':
        nextDate.setMonth(nextDate.getMonth() + 6);
        break;
      case 'Annually':
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        break;
      case 'Bi-Annually':
        nextDate.setFullYear(nextDate.getFullYear() + 2);
        break;
      default:
        return '';
    }
    
    return nextDate.toISOString().split('T')[0];
  };

  useEffect(() => {
    if (formData.calibrationDate && instrument?.calibrationCycle) {
      const nextDate = calculateNextCalibrationDate(formData.calibrationDate, instrument.calibrationCycle);
      setFormData(prev => ({ ...prev, nextCalibrationDate: nextDate }));
    }
  }, [formData.calibrationDate, instrument?.calibrationCycle]);

  const validateForm = (): boolean => {
    const newErrors: Partial<CalibrationData> = {};

    if (!formData.calibrationDate.trim()) {
      newErrors.calibrationDate = 'Calibration date is required';
    }

    if (!formData.nextCalibrationDate.trim()) {
      newErrors.nextCalibrationDate = 'Next calibration date is required';
    }

    if (!formData.status.trim()) {
      newErrors.status = 'Status is required';
    }

    if (!formData.performedBy.trim()) {
      newErrors.performedBy = 'Performed by is required';
    }

    if (!formData.notes.trim()) {
      newErrors.notes = 'Notes are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <div className="p-6">
      {/* Instrument Info */}
      {instrument && (
        <div className="mb-6 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-100 dark:border-primary-800">
          <h3 className="text-sm font-semibold text-primary-700 dark:text-primary-300 mb-3">
            Instrument Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Instrument Name</p>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{instrument.instrumentName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Serial Number</p>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{instrument.serialNumber}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Category</p>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{instrument.instrumentCategory}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Calibration Cycle</p>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{instrument.calibrationCycle}</p>
            </div>
          </div>
        </div>
      )}

      <form id="calibration-form" onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Calibration Date */}
          <div>
            <Label htmlFor="calibrationDate" required>
              Calibration Date
            </Label>
            <Input
              id="calibrationDate"
              type="date"
              value={formData.calibrationDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('calibrationDate', e.target.value)}
              error={errors.calibrationDate}
              required
            />
          </div>

          {/* Next Calibration Date */}
          <div>
            <Label htmlFor="nextCalibrationDate" required>
              Next Calibration Date
            </Label>
            <Input
              id="nextCalibrationDate"
              type="date"
              value={formData.nextCalibrationDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('nextCalibrationDate', e.target.value)}
              error={errors.nextCalibrationDate}
              required
            />
          </div>

          {/* Status */}
          <div>
            <Label htmlFor="status" required>
              Status
            </Label>
            <CustomSelect
              value={formData.status}
              onChange={(value: string) => handleInputChange('status', value)}
              options={statusOptions}
              placeholder="Select status"
              error={errors.status}
            />
          </div>

          {/* Performed By */}
          <div>
            <Label htmlFor="performedBy" required>
              Performed By
            </Label>
            <Input
              id="performedBy"
              type="text"
              value={formData.performedBy}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('performedBy', e.target.value)}
              placeholder="Enter technician name"
              error={errors.performedBy}
              required
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <Label htmlFor="notes" required>
            Notes
          </Label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('notes', e.target.value)}
            placeholder="Enter calibration notes and observations..."
            rows={4}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white ${
              errors.notes ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            required
          />
          {errors.notes && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.notes}</p>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddCalibrationForm;
