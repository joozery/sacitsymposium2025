import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { User, Upload, FileText, Loader2, CheckCircle, AlertCircle, X } from 'lucide-react';
import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import SpeakersAPI from './speakersAPI';

const SpeakerForm = ({ speaker, onSubmit, onCancel, onSuccess }) => {
  // State สำหรับ form data
  const [formData, setFormData] = useState({ name: '' });
  
  // State สำหรับไฟล์
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfFileName, setPdfFileName] = useState('');
  
  // State สำหรับ UI
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // State สำหรับ validation
  const [nameError, setNameError] = useState('');
  const [photoError, setPhotoError] = useState('');
  const [pdfError, setPdfError] = useState('');

  // Initialize form data when speaker prop changes
  useEffect(() => {
    if (speaker) {
      setFormData({ name: speaker.name || '' });
      setPhotoPreview(speaker.photo_url || null);
      setPdfFileName(speaker.pdf_filename || '');
    } else {
      setFormData({ name: '' });
      setPhotoPreview(null);
      setPdfFileName('');
      setPhotoFile(null);
      setPdfFile(null);
    }
    
    // Clear messages
    setError('');
    setSuccess('');
    setNameError('');
    setPhotoError('');
    setPdfError('');
    setUploadProgress(0);
  }, [speaker]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear name error when user starts typing
    if (name === 'name' && nameError) {
      setNameError('');
    }
  };

  // Handle photo file selection
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    
    // Clear previous errors
    setPhotoError('');
    
    if (!file) return;

    try {
      // Validate image file
      SpeakersAPI.validateImageFile(file);
      
      setPhotoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
      
    } catch (error) {
      setPhotoError(error.message);
      // Clear file input
      e.target.value = '';
    }
  };

  // Handle PDF file selection
  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    
    // Clear previous errors
    setPdfError('');
    
    if (!file) return;

    try {
      // Validate PDF file
      SpeakersAPI.validatePdfFile(file);
      
      setPdfFile(file);
      setPdfFileName(file.name);
      
    } catch (error) {
      setPdfError(error.message);
      // Clear file input
      e.target.value = '';
    }
  };

  // Remove selected photo
  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(speaker?.photo_url || null);
    setPhotoError('');
    
    // Clear file input
    const photoInput = document.getElementById('photo');
    if (photoInput) photoInput.value = '';
  };

  // Remove selected PDF
  const removePdf = () => {
    setPdfFile(null);
    setPdfFileName(speaker?.pdf_filename || '');
    setPdfError('');
    
    // Clear file input
    const pdfInput = document.getElementById('pdf');
    if (pdfInput) pdfInput.value = '';
  };

  // Validate form
  const validateForm = () => {
    let isValid = true;
    
    // Validate name
    if (!formData.name.trim()) {
      setNameError('กรุณาระบุชื่อผู้บรรยาย');
      isValid = false;
    } else if (formData.name.trim().length < 2) {
      setNameError('ชื่อผู้บรรยายต้องมีอย่างน้อย 2 ตัวอักษร');
      isValid = false;
    }
    
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous messages
    setError('');
    setSuccess('');
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setUploadProgress(10);

    try {
      // Prepare data for API
      const speakerData = {
        name: formData.name.trim(),
        photoFile: photoFile,
        pdfFile: pdfFile,
      };

      setUploadProgress(30);

      let result;
      if (speaker && speaker.id) {
        // Update existing speaker
        result = await SpeakersAPI.update(speaker.id, speakerData);
        setSuccess('อัปเดตข้อมูลผู้บรรยายเรียบร้อยแล้ว');
      } else {
        // Create new speaker
        result = await SpeakersAPI.create(speakerData);
        setSuccess('เพิ่มผู้บรรยายเรียบร้อยแล้ว');
      }

      setUploadProgress(100);

      console.log('API Result:', result);

      // Call success callback
      if (onSuccess) {
        onSuccess(result.data);
      }

      // Call submit callback (for backward compatibility)
      if (onSubmit) {
        onSubmit(result.data);
      }

      // Reset form if creating new speaker
      if (!speaker) {
        setFormData({ name: '' });
        setPhotoFile(null);
        setPhotoPreview(null);
        setPdfFile(null);
        setPdfFileName('');
      }

    } catch (error) {
      console.error('Form submission error:', error);
      setError(error.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      setUploadProgress(0);
    } finally {
      setLoading(false);
      // Clear progress after delay
      setTimeout(() => setUploadProgress(0), 2000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Success Alert */}
      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">{success}</AlertDescription>
        </Alert>
      )}

      {/* Upload Progress */}
      {loading && uploadProgress > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>กำลังบันทึกข้อมูล...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

      <div className="flex items-start space-x-6">
        {/* Photo Section */}
        <div className="flex flex-col items-center space-y-3">
          <Avatar className="h-24 w-24">
            <AvatarImage src={photoPreview} />
            <AvatarFallback className="bg-gray-200">
              <User className="h-12 w-12 text-gray-400" />
            </AvatarFallback>
          </Avatar>
          
          <div className="space-y-2">
            <Label htmlFor="photo" className="text-sm font-medium">
              รูปโปรไฟล์
            </Label>
            
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  disabled={loading}
                  className="text-xs"
                >
                  <Upload className="w-3 h-3 mr-1" />
                  เลือกรูป
                </Button>
                <Input 
                  id="photo" 
                  type="file" 
                  accept="image/*" 
                  onChange={handlePhotoChange} 
                  disabled={loading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                />
              </div>
              
              {(photoFile || photoPreview) && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={removePhoto}
                  disabled={loading}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
            
            {photoFile && (
              <p className="text-xs text-green-600">
                ✓ {photoFile.name} ({SpeakersAPI.formatFileSize(photoFile.size)})
              </p>
            )}
            
            {photoError && (
              <p className="text-xs text-red-600">{photoError}</p>
            )}
          </div>
        </div>

        {/* Name Section */}
        <div className="flex-1 space-y-4">
          <div>
            <Label htmlFor="name" className="text-sm font-medium">
              ชื่อ-นามสกุล <span className="text-red-500">*</span>
            </Label>
            <Input 
              id="name" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              disabled={loading}
              placeholder="กรอกชื่อ-นามสกุลผู้บรรยาย"
              className={nameError ? "border-red-300 focus:border-red-500" : ""}
            />
            {nameError && (
              <p className="text-sm text-red-600 mt-1">{nameError}</p>
            )}
          </div>
        </div>
      </div>
      
      {/* PDF Section */}
      <div className="space-y-2">
        <Label htmlFor="pdf" className="text-sm font-medium">
          ไฟล์ PDF
        </Label>
        
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              className="w-full justify-start"
              disabled={loading}
            >
              <FileText className="w-4 h-4 mr-2" />
              {pdfFileName || 'เลือกไฟล์ PDF'}
            </Button>
            <Input 
              id="pdf" 
              type="file" 
              accept=".pdf" 
              onChange={handlePdfChange} 
              disabled={loading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
            />
          </div>
          
          {(pdfFile || pdfFileName) && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={removePdf}
              disabled={loading}
              className="text-red-500 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        
        {pdfFile && (
          <p className="text-sm text-green-600">
            ✓ {pdfFile.name} ({SpeakersAPI.formatFileSize(pdfFile.size)})
          </p>
        )}
        
        {pdfFileName && !pdfFile && (
          <p className="text-sm text-gray-500">
            ไฟล์ปัจจุบัน: {pdfFileName}
          </p>
        )}
        
        {pdfError && (
          <p className="text-sm text-red-600">{pdfError}</p>
        )}
      </div>
      
      {/* Footer Buttons */}
      <DialogFooter className="gap-2">
        <DialogClose asChild>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={loading}
          >
            ยกเลิก
          </Button>
        </DialogClose>
        
        <Button 
          type="submit" 
          className="bg-violet-600 hover:bg-violet-700 text-white"
          disabled={loading}
        >
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {loading 
            ? 'กำลังบันทึก...' 
            : (speaker ? 'บันทึกการแก้ไข' : 'เพิ่มผู้บรรยาย')
          }
        </Button>
      </DialogFooter>
    </form>
  );
};

export default SpeakerForm;