import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Image, AlertCircle, CheckCircle, Loader, Bug } from 'lucide-react';
import Tesseract from 'tesseract.js';
import toast from 'react-hot-toast';
import { LabReport } from '../../shared/types';
import { reportService } from '../services/reportService';
import { useAuth } from '../contexts/AuthContext';

interface FileUploadProps {
  onReportUploaded: (report: LabReport) => void;
}

export default function FileUpload({ onReportUploaded }: FileUploadProps) {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<'idle' | 'ocr' | 'processing' | 'complete'>('idle');
  const [debugInfo, setDebugInfo] = useState<string>('');

  const processFile = async (file: File) => {
    if (!user) {
      toast.error('Please log in to upload reports');
      return;
    }

    setUploading(true);
    setCurrentStep('ocr');
    setOcrProgress(0);
    setDebugInfo('');

    try {
      let ocrText = '';

      // Handle different file types
      if (file.type.startsWith('image/')) {
        console.log('=== STARTING OCR PROCESSING ===');
        console.log('Processing image file:', file.name);
        console.log('File size:', file.size, 'bytes');
        
        setDebugInfo('Starting OCR processing...');
        
        const result = await Tesseract.recognize(
          file,
          'eng',
          {
            logger: m => {
              console.log('Tesseract log:', m);
              if (m.status === 'recognizing text') {
                const progress = Math.round(m.progress * 100);
                setOcrProgress(progress);
                setDebugInfo(`OCR Progress: ${progress}%`);
              }
            }
          }
        );
        
        ocrText = result.data.text;
        console.log('=== OCR COMPLETED ===');
        console.log('Raw OCR Result:', JSON.stringify(ocrText));
        console.log('OCR Text Length:', ocrText.length);
        console.log('OCR Confidence:', result.data.confidence);
        
        setDebugInfo(`OCR completed. Text length: ${ocrText.length} chars`);
        
      } else if (file.type === 'application/pdf') {
        // For PDF files, provide a sample text for demonstration
        console.log('=== PROCESSING PDF FILE ===');
        setDebugInfo('Processing PDF file...');
        setOcrProgress(50);
        
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Sample lab report text for PDF demonstration
        ocrText = `
          COMPREHENSIVE METABOLIC PANEL
          Patient: John Doe
          Date: ${new Date().toLocaleDateString()}
          
          BLOOD COUNT
          Hemoglobin: 14.2 g/dL (Normal: 12.0-15.5)
          Hematocrit: 42.1% (Normal: 36-44)
          White Blood Cells: 7.2 K/µL (Normal: 4.5-11.0)
          Platelets: 285 K/µL (Normal: 150-400)
          
          METABOLIC PANEL
          Glucose: 98 mg/dL (Normal: 70-100)
          Creatinine: 0.9 mg/dL (Normal: 0.6-1.2)
          BUN: 15 mg/dL (Normal: 7-20)
          
          LIPID PROFILE
          Total Cholesterol: 195 mg/dL (Normal: <200)
          HDL Cholesterol: 52 mg/dL (Normal: >40)
          LDL Cholesterol: 118 mg/dL (Normal: <100)
          Triglycerides: 125 mg/dL (Normal: <150)
          
          LIVER FUNCTION
          ALT: 28 U/L (Normal: 7-56)
          AST: 24 U/L (Normal: 10-40)
          
          THYROID
          TSH: 2.1 mIU/L (Normal: 0.4-4.0)
        `;
        
        setOcrProgress(100);
        setDebugInfo('PDF processed successfully');
        
      } else {
        toast.error('Please upload a PDF or image file (JPG, PNG)');
        setCurrentStep('idle');
        setUploading(false);
        return;
      }

      if (!ocrText || ocrText.trim().length < 3) {
        console.error('OCR failed or returned empty text');
        setDebugInfo('OCR failed - no text extracted');
        toast.error('Could not extract text from the file. Please ensure the image is clear and contains readable text.');
        setCurrentStep('idle');
        setUploading(false);
        return;
      }

      setCurrentStep('processing');
      setDebugInfo('Processing health parameters...');

      // Upload to service
      const { report, error } = await reportService.uploadReport(file, ocrText, user._id);

      if (error) {
        throw new Error(error);
      }

      if (report) {
        setCurrentStep('complete');
        setDebugInfo(`Success! Found ${report.parameters.length} parameters`);
        toast.success(`Lab report processed successfully! Found ${report.parameters.length} health parameters.`);
        onReportUploaded(report);
        
        // Reset after a delay
        setTimeout(() => {
          setCurrentStep('idle');
          setOcrProgress(0);
          setDebugInfo('');
        }, 3000);
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      setDebugInfo(`Error: ${error.message}`);
      toast.error(error.message || 'Failed to process lab report');
      setCurrentStep('idle');
      setOcrProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      console.log('File dropped:', file.name, file.type, file.size);
      processFile(file);
    }
  }, [user]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    disabled: uploading
  });

  const getStepIcon = () => {
    switch (currentStep) {
      case 'ocr':
        return <Loader className="h-8 w-8 text-blue-600 animate-spin" />;
      case 'processing':
        return <Upload className="h-8 w-8 text-blue-600 animate-pulse" />;
      case 'complete':
        return <CheckCircle className="h-8 w-8 text-green-600" />;
      default:
        return isDragActive ? 
          <Upload className="h-12 w-12 text-blue-600" /> : 
          <FileText className="h-12 w-12 text-gray-400" />;
    }
  };

  const getStepMessage = () => {
    switch (currentStep) {
      case 'ocr':
        return `Extracting text from file... ${ocrProgress}%`;
      case 'processing':
        return 'Analyzing health parameters...';
      case 'complete':
        return 'Analysis complete!';
      default:
        return isDragActive ? 
          'Drop your lab report here' : 
          'Drag & drop your lab report here, or click to select';
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
          isDragActive 
            ? 'border-blue-500 bg-blue-50' 
            : uploading 
            ? 'border-gray-300 bg-gray-50 cursor-not-allowed' 
            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
        }`}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-4">
          {getStepIcon()}
          
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-900">
              {getStepMessage()}
            </p>
            
            {!uploading && (
              <>
                <p className="text-sm text-gray-600">
                  Supports PDF, JPEG, PNG files up to 10MB
                </p>
                <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Image className="h-4 w-4" />
                    <span>JPG, PNG (OCR)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FileText className="h-4 w-4" />
                    <span>PDF (Sample Data)</span>
                  </div>
                </div>
              </>
            )}

            {/* Debug Info */}
            {debugInfo && (
              <div className="mt-2 p-2 bg-gray-100 rounded text-xs text-gray-600 font-mono">
                <div className="flex items-center space-x-1">
                  <Bug className="h-3 w-3" />
                  <span>{debugInfo}</span>
                </div>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {currentStep === 'ocr' && (
            <div className="w-full max-w-xs">
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${ocrProgress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="space-y-2">
            <h3 className="font-medium text-blue-900">Upload Tips for Best Results</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>Images (JPG/PNG):</strong> Uses OCR to extract actual text from your lab report</li>
              <li>• <strong>PDF files:</strong> Shows sample lab data for demonstration</li>
              <li>• Ensure images are clear, well-lit, and parameter values are visible</li>
              <li>• Avoid blurry or skewed images for best OCR accuracy</li>
              <li>• Try writing "Hemoglobin : 69" on paper and take a clear photo to test OCR</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Test Example */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div className="space-y-2">
            <h3 className="font-medium text-green-900">Test Examples</h3>
            <div className="text-sm text-green-700 space-y-2">
              <p><strong>For OCR Testing (Images):</strong></p>
              <code className="block bg-white px-3 py-2 rounded text-green-800 font-mono text-xs">
                Hemoglobin : 69<br />
                Glucose : 95<br />
                Cholesterol : 220<br />
                HDL : 45
              </code>
              <p><strong>For PDF Testing:</strong> Upload any PDF file to see sample lab data</p>
            </div>
          </div>
        </div>
      </div>

      {/* Supported Parameters */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="font-medium text-gray-900 mb-3">Supported Health Parameters</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
          <div>
            <strong>Blood Count:</strong>
            <ul className="mt-1 space-y-0.5">
              <li>• Hemoglobin</li>
              <li>• Hematocrit</li>
              <li>• WBC, RBC</li>
              <li>• Platelets</li>
            </ul>
          </div>
          <div>
            <strong>Metabolic:</strong>
            <ul className="mt-1 space-y-0.5">
              <li>• Glucose</li>
              <li>• Creatinine</li>
              <li>• BUN</li>
            </ul>
          </div>
          <div>
            <strong>Lipid Profile:</strong>
            <ul className="mt-1 space-y-0.5">
              <li>• Cholesterol</li>
              <li>• HDL, LDL</li>
              <li>• Triglycerides</li>
            </ul>
          </div>
          <div>
            <strong>Other:</strong>
            <ul className="mt-1 space-y-0.5">
              <li>• Liver enzymes</li>
              <li>• Thyroid (TSH)</li>
              <li>• Vitamins</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}