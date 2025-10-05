
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Upload, FileText, X, Loader2 } from 'lucide-react';
import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { speakersAPI } from '@/services/api';

const SpeakerForm = ({ speaker, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({ name: '', position: '' });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfFileName, setPdfFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (speaker) {
      setFormData({ 
        name: speaker.name || '', 
        position: speaker.position || '' 
      });
      setPhotoPreview(speaker.photo_url || null);
      setPdfFileName(speaker.pdf_filename || '');
    } else {
      setFormData({ name: '', position: '' });
      setPhotoPreview(null);
      setPhotoFile(null);
      setPdfFile(null);
      setPdfFileName('');
    }
    setError('');
  }, [speaker]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Validate image file
        speakersAPI.validateImageFile(file);
        
        setPhotoFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhotoPreview(reader.result);
        };
        reader.readAsDataURL(file);
        setError('');
      } catch (err) {
        setError(err.message);
        setPhotoFile(null);
        setPhotoPreview(speaker?.photo_url || null);
      }
    }
  };

  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Validate PDF file
        speakersAPI.validatePdfFile(file);
        
        setPdfFile(file);
        setPdfFileName(file.name);
        setError('');
      } catch (err) {
        setError(err.message);
        setPdfFile(null);
        setPdfFileName(speaker?.pdf_filename || '');
      }
    }
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(speaker?.photo_url || null);
  };

  const handleRemovePdf = () => {
    setPdfFile(null);
    setPdfFileName(speaker?.pdf_filename || '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('กรุณาระบุชื่อผู้บรรยาย');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const submitData = {
        name: formData.name.trim(),
        position: formData.position.trim(),
        photoFile: photoFile,
        pdfFile: pdfFile
      };

      await onSubmit(submitData);
    } catch (err) {
      setError(err.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Photo Upload Section */}
      <div className="flex items-start space-x-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src={photoPreview} />
          <AvatarFallback className="bg-gray-200">
            <User className="h-12 w-12 text-gray-400" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Label htmlFor="photo">รูปภาพผู้บรรยาย</Label>
          <div className="mt-2 space-y-2">
            <div className="relative">
              <Button type="button" variant="outline" size="sm" className="relative">
                <Upload className="w-4 h-4 mr-2" />
                {photoFile ? 'เปลี่ยนรูป' : 'อัปโหลดรูป'}
              </Button>
              <Input 
                id="photo" 
                type="file" 
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp" 
                onChange={handlePhotoChange} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              />
            </div>
            {(photoFile || photoPreview) && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {photoFile ? `ไฟล์ใหม่: ${photoFile.name}` : 'รูปปัจจุบัน'}
                </span>
                {photoFile && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleRemovePhoto}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
            <p className="text-xs text-gray-500">
              รองรับไฟล์: JPEG, PNG, GIF, WebP (สูงสุด 10MB)
            </p>
          </div>
        </div>
      </div>

      {/* Name Input */}
      <div>
        <Label htmlFor="name">ชื่อ-นามสกุล *</Label>
        <Input 
          id="name" 
          name="name" 
          value={formData.name} 
          onChange={handleChange} 
          placeholder="กรอกชื่อ-นามสกุลผู้บรรยาย"
          required 
        />
      </div>

      {/* Position Input */}
      <div>
        <Label htmlFor="position">ตำแหน่ง/วิชาชีพ</Label>
        <Input 
          id="position" 
          name="position" 
          value={formData.position} 
          onChange={handleChange} 
          placeholder="เช่น อาจารย์ประจำคณะ, หัวหน้าภาควิชา, นักวิจัย"
        />
      </div>

      {/* PDF Upload Section */}
      <div>
        <Label htmlFor="pdf">เอกสารประกอบ (PDF)</Label>
        <div className="mt-2 space-y-2">
          <div className="relative">
            <Button type="button" variant="outline" size="sm">
              <FileText className="w-4 h-4 mr-2" />
              {pdfFile ? 'เปลี่ยนไฟล์ PDF' : 'อัปโหลด PDF'}
            </Button>
            <Input 
              id="pdf" 
              type="file" 
              accept="application/pdf" 
              onChange={handlePdfChange} 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
            />
          </div>
          {(pdfFile || pdfFileName) && (
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {pdfFile ? `ไฟล์ใหม่: ${pdfFile.name}` : pdfFileName}
              </span>
              {pdfFile && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleRemovePdf}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
          <p className="text-xs text-gray-500">
            รองรับไฟล์ PDF เท่านั้น (สูงสุด 10MB)
          </p>
        </div>
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            ยกเลิก
          </Button>
        </DialogClose>
        <Button 
          type="submit" 
          className="bg-violet-600 hover:bg-violet-700 text-white"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              กำลังบันทึก...
            </>
          ) : (
            speaker ? 'บันทึกการแก้ไข' : 'เพิ่มผู้บรรยาย'
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default SpeakerForm;
