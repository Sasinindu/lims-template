import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Microscope, 
  FileText,
  Save,
  X,
  Hash,
  Tag,
  Upload,
  File,
  Trash2,
  Eye,
  Download,
  AlertCircle,
  CheckCircle2,
  Paperclip,
  Plus
} from 'lucide-react';
import CustomSelect from './CustomSelect';
import Label from './Label';
import Input from './Input';

interface DocumentFile {
  id: string;
  name: string;
  type: string;
  size: number;
  file?: File;
  url?: string;
  category: 'manual' | 'calibration' | 'specification' | 'warranty' | 'other';
  uploadedAt: string;
  uploadedBy: string;
  isUploading?: boolean;
  uploadProgress?: number;
}

interface AddInstrumentFormProps {
  onSave: (instrument: any) => void;
  onCancel: () => void;
  isEditing?: boolean;
  initialData?: any;
  isViewMode?: boolean;
}

const AddInstrumentForm: React.FC<AddInstrumentFormProps> = ({
  onSave,
  onCancel,
  isEditing = false,
  initialData = null,
  isViewMode = false
}) => {
  const [formData, setFormData] = useState({
    instrumentName: initialData?.instrumentName || '',
    instrumentCategory: initialData?.instrumentCategory || '',
    serialNumber: initialData?.serialNumber || '',
    status: initialData?.status || '',
    purchasedDate: initialData?.purchasedDate || '',
    calibrationCycle: initialData?.calibrationCycle || '',
    ...(initialData || {})
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [documents, setDocuments] = useState<DocumentFile[]>(initialData?.documents || []);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const calibrationCycleOptions = [
    { value: 'Monthly', label: 'Monthly' },
    { value: 'Quarterly', label: 'Quarterly' },
    { value: 'Semi-Annually', label: 'Semi-Annually' },
    { value: 'Annually', label: 'Annually' },
    { value: 'Bi-Annually', label: 'Bi-Annually' }
  ];

  const documentCategoryOptions = [
    { value: 'manual', label: 'User Manual' },
    { value: 'calibration', label: 'Calibration Certificate' },
    { value: 'specification', label: 'Technical Specification' },
    { value: 'warranty', label: 'Warranty Information' },
    { value: 'other', label: 'Other Documents' }
  ];

  // Allowed file types and size limits
  const allowedFileTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/png',
    'image/gif',
    'text/plain'
  ];
  
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <FileText className="w-5 h-5 text-red-500" />;
    if (fileType.includes('image')) return <File className="w-5 h-5 text-blue-500" />;
    if (fileType.includes('document') || fileType.includes('word')) return <FileText className="w-5 h-5 text-blue-600" />;
    if (fileType.includes('sheet') || fileType.includes('excel')) return <FileText className="w-5 h-5 text-green-600" />;
    return <File className="w-5 h-5 text-gray-500" />;
  };

  const validateFile = (file: File): string | null => {
    if (!allowedFileTypes.includes(file.type)) {
      return `File type ${file.type} is not allowed. Please upload PDF, Word, Excel, or image files.`;
    }
    if (file.size > maxFileSize) {
      return `File size ${formatFileSize(file.size)} exceeds maximum allowed size of ${formatFileSize(maxFileSize)}.`;
    }
    return null;
  };

  const simulateFileUpload = (documentId: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        setDocuments(prev => 
          prev.map(doc => 
            doc.id === documentId 
              ? { ...doc, uploadProgress: Math.min(progress, 100) }
              : doc
          )
        );
        
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setDocuments(prev => 
              prev.map(doc => 
                doc.id === documentId 
                  ? { 
                      ...doc, 
                      isUploading: false, 
                      uploadProgress: undefined,
                      url: `https://documents.lims.example.com/${documentId}/${doc.name}`
                    }
                  : doc
              )
            );
            resolve(`Document uploaded successfully: ${documentId}`);
          }, 500);
        }
      }, 200);
    });
  };

  const handleFileSelect = async (files: FileList, category: string = 'other') => {
    if (isViewMode) return;

    const validFiles: File[] = [];
    const errors: string[] = [];

    Array.from(files).forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      // In a real app, you'd show these errors to the user
      console.error('File validation errors:', errors);
      return;
    }

    // Create document objects for valid files
    const newDocuments: DocumentFile[] = validFiles.map(file => ({
      id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      type: file.type,
      size: file.size,
      file,
      category: category as any,
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'Current User', // In real app, get from auth context
      isUploading: true,
      uploadProgress: 0
    }));

    setDocuments(prev => [...prev, ...newDocuments]);

    // Start uploads
    newDocuments.forEach(doc => {
      simulateFileUpload(doc.id).catch(error => {
        console.error('Upload failed:', error);
        setDocuments(prev => prev.filter(d => d.id !== doc.id));
      });
    });
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files);
      e.target.value = ''; // Reset input
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleRemoveDocument = (documentId: string) => {
    if (isViewMode) return;
    setDocuments(prev => prev.filter(doc => doc.id !== documentId));
  };

  const handleViewDocument = (document: DocumentFile) => {
    if (document.url) {
      window.open(document.url, '_blank');
    } else if (document.file) {
      // Create blob URL for preview
      const url = URL.createObjectURL(document.file);
      window.open(url, '_blank');
    }
  };

  const handleDownloadDocument = (doc: DocumentFile) => {
    if (doc.url) {
      const link = window.document.createElement('a');
      link.href = doc.url;
      link.download = doc.name;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
    } else if (doc.file) {
      // Create blob URL for download
      const url = URL.createObjectURL(doc.file);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = doc.name;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const getCategoryLabel = (category: string): string => {
    const option = documentCategoryOptions.find(opt => opt.value === category);
    return option?.label || category;
  };

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'manual':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'calibration':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'specification':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'warranty':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
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
    if (!formData.purchasedDate.trim()) {
      newErrors.purchasedDate = 'Purchased date is required';
    }
    if (!formData.calibrationCycle) {
      newErrors.calibrationCycle = 'Calibration cycle is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isViewMode && validateForm()) {
      const instrumentData = {
        ...formData,
        documents: documents,
        id: isEditing ? formData.id : `I${String(Date.now()).slice(-3)}`
      };
      onSave(instrumentData);
    }
  };

  return (
    <form id="instrument-form" onSubmit={handleSubmit} className="space-y-6 p-6">
      {/* Basic Information */}
      <div className="space-y-6">
        {/* Row 1: Instrument Name (required), Instrument Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Instrument Name"
            required
            value={formData.instrumentName}
            onChange={(e) => handleInputChange('instrumentName', e.target.value)}
            placeholder="Enter instrument name"
            error={errors.instrumentName}
            disabled={isViewMode}
          />

          <CustomSelect
            label="Instrument Category"
            value={formData.instrumentCategory}
            onChange={(value) => handleInputChange('instrumentCategory', value)}
            options={categoryOptions}
            placeholder="Select instrument category"
            error={errors.instrumentCategory}
            disabled={isViewMode}
          />
        </div>

        {/* Row 2: Serial Number (required), Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Serial Number"
            required
            value={formData.serialNumber}
            onChange={(e) => handleInputChange('serialNumber', e.target.value)}
            placeholder="Enter serial number"
            error={errors.serialNumber}
            disabled={isViewMode}
          />

          <CustomSelect
            label="Status"
            value={formData.status}
            onChange={(value) => handleInputChange('status', value)}
            options={statusOptions}
            placeholder="Select status"
            error={errors.status}
            disabled={isViewMode}
          />
        </div>

        {/* Row 3: Purchased Date (required), Calibration Cycle (required) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Purchased Date"
            required
            type="date"
            value={formData.purchasedDate}
            onChange={(e) => handleInputChange('purchasedDate', e.target.value)}
            error={errors.purchasedDate}
            disabled={isViewMode}
          />

          <CustomSelect
            label="Calibration Cycle"
            value={formData.calibrationCycle}
            onChange={(value) => handleInputChange('calibrationCycle', value)}
            options={calibrationCycleOptions}
            placeholder="Select calibration cycle"
            error={errors.calibrationCycle}
            disabled={isViewMode}
          />
        </div>
      </div>

      {/* Document Management Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Paperclip className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Document Attachments
            </h3>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {documents.length} {documents.length === 1 ? 'document' : 'documents'}
          </span>
        </div>

        {!isViewMode && (
          <>
            {/* File Upload Area */}
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors duration-200 ${
                isDragOver
                  ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/10'
                  : 'border-gray-300 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-600'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.txt"
                onChange={handleFileInputChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="p-4 bg-primary-100 dark:bg-primary-900/20 rounded-full">
                    <Upload className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                  </div>
                </div>
                
                <div>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {isDragOver ? 'Drop files here' : 'Upload Documents'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Drag and drop files here, or{' '}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      browse files
                    </button>
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                    Supported: PDF, Word, Excel, Images • Max size: {formatFileSize(maxFileSize)}
                  </p>
                </div>
              </div>
            </div>

           
          </>
        )}

        {/* Documents List */}
        {documents.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Attached Documents ({documents.length})
            </h4>
            
            <AnimatePresence>
              {documents.map((doc) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      {getFileIcon(doc.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {doc.name}
                        </p>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(doc.category)}`}>
                          {getCategoryLabel(doc.category)}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatFileSize(doc.size)}
                        </p>
                        <span className="text-xs text-gray-400">•</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>
                        {doc.uploadedBy && (
                          <>
                            <span className="text-xs text-gray-400">•</span>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              by {doc.uploadedBy}
                            </p>
                          </>
                        )}
                      </div>

                      {/* Upload Progress */}
                      {doc.isUploading && (
                        <div className="mt-2">
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                              <div
                                className="bg-primary-600 h-1.5 rounded-full transition-all duration-300"
                                style={{ width: `${doc.uploadProgress || 0}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {Math.round(doc.uploadProgress || 0)}%
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2 ml-4">
                    {!doc.isUploading && (
                      <>
                        <motion.button
                          type="button"
                          onClick={() => handleViewDocument(doc)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-1.5 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
                          title="View Document"
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                        
                        <motion.button
                          type="button"
                          onClick={() => handleDownloadDocument(doc)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-1.5 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors duration-200"
                          title="Download Document"
                        >
                          <Download className="w-4 h-4" />
                        </motion.button>
                      </>
                    )}
                    
                    {!isViewMode && (
                      <motion.button
                        type="button"
                        onClick={() => handleRemoveDocument(doc.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-1.5 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                        title="Remove Document"
                        disabled={doc.isUploading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        
      </div>
    </form>
  );
};

export default AddInstrumentForm;
