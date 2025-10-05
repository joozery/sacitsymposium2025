import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Palette, Upload, FileText, X, Loader2, User } from 'lucide-react';
import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const WorkForm = ({ work, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({ 
    name: '', 
    owner_name: '', 
    description: '', 
    category: '', 
    technique: ''
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfFileName, setPdfFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (work) {
      setFormData({ 
        name: work.name || '', 
        owner_name: work.owner_name || '', 
        description: work.description || '', 
        category: work.category || '', 
        technique: work.technique || ''
      });
      setPhotoPreview(work.photo_url || null);
      setPdfFileName(work.pdf_filename || '');
    } else {
      setFormData({ 
        name: '', 
        owner_name: '', 
        description: '', 
        category: '', 
        technique: ''
      });
      setPhotoPreview(null);
      setPhotoFile(null);
      setPdfFile(null);
      setPdfFileName('');
    }
    setError('');
  }, [work]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError('รูปภาพต้องเป็นไฟล์ JPEG, PNG, GIF หรือ WebP เท่านั้น');
        return;
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('รูปภาพต้องมีขนาดไม่เกิน 10MB');
        return;
      }

      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (file.type !== 'application/pdf') {
        setError('ต้องเป็นไฟล์ PDF เท่านั้น');
        return;
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('ไฟล์ PDF ต้องมีขนาดไม่เกิน 10MB');
        return;
      }

      setPdfFile(file);
      setPdfFileName(file.name);
      setError('');
    }
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (work?.photo_url) {
      // If editing and has existing photo, we'll need to handle this in the backend
      setPhotoPreview(null);
    }
  };

  const removePdf = () => {
    setPdfFile(null);
    setPdfFileName('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('กรุณาระบุชื่อผลงานสร้างสรรค์');
      return;
    }

    if (!formData.owner_name.trim()) {
      setError('กรุณาระบุชื่อเจ้าของผลงาน');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const submitData = { ...formData };
      
      if (photoFile) {
        submitData.photo = photoFile;
      }
      
      if (pdfFile) {
        submitData.pdf = pdfFile;
      }

      await onSubmit(submitData);
    } catch (err) {
      setError(err.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = [
    { value: '01 เครื่องรัก เครื่องเขิน', label: '01 เครื่องรัก เครื่องเขิน' },
    { value: '02 งานหัตถศิลป์และประณีตศิลป์', label: '02 งานหัตถศิลป์และประณีตศิลป์' },
    { value: '03 งานหัตถกรรมเชิงประยุกต์', label: '03 งานหัตถกรรมเชิงประยุกต์' },
    { value: '04 งานหัตถกรรมพื้นถิ่น และอื่น ๆ', label: '04 งานหัตถกรรมพื้นถิ่น และอื่น ๆ' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Basic Information */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">ชื่อผลงานสร้างสรรค์ *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="ชื่อผลงานสร้างสรรค์"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="owner_name">ชื่อ-นามสกุล *</Label>
          <Input
            id="owner_name"
            name="owner_name"
            value={formData.owner_name}
            onChange={handleChange}
            placeholder="ชื่อ-นามสกุล"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">หมวดหมู่</Label>
          <Select value={formData.category} onValueChange={(value) => handleSelectChange('category', value)}>
            <SelectTrigger>
              <SelectValue placeholder="เลือกหมวดหมู่" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="technique">เทคนิคที่ใช้</Label>
          <Input
            id="technique"
            name="technique"
            value={formData.technique}
            onChange={handleChange}
            placeholder="เทคนิคที่ใช้"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">รายละเอียดผลงาน</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="รายละเอียดผลงานสร้างสรรค์..."
          rows={4}
        />
      </div>


      {/* Photo Upload */}
      <div className="space-y-4">
        <Label>รูปภาพนิทรรศการ</Label>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="w-20 h-20">
              <AvatarImage src={photoPreview} alt="Work preview" />
              <AvatarFallback>
                <Palette className="w-8 h-8" />
              </AvatarFallback>
            </Avatar>
            {photoPreview && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 w-6 h-6 p-0"
                onClick={removePhoto}
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
          <div className="flex-1">
            <Input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
              id="photo-upload"
            />
            <Label htmlFor="photo-upload" className="cursor-pointer">
              <div className="flex items-center gap-2 p-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                <Upload className="w-4 h-4" />
                <span>อัปโหลดรูปภาพ</span>
              </div>
            </Label>
            <p className="text-sm text-gray-500 mt-1">
              รองรับ JPEG, PNG, GIF, WebP ขนาดไม่เกิน 10MB
            </p>
          </div>
        </div>
      </div>

      {/* PDF Upload */}
      <div className="space-y-4">
        <Label>เอกสารประกอบ (PDF)</Label>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 p-3 border rounded-lg bg-gray-50">
            <FileText className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-600">
              {pdfFileName || 'ยังไม่มีไฟล์ PDF'}
            </span>
            {pdfFileName && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={removePdf}
                className="h-6 w-6 p-0"
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
          <div className="flex-1">
            <Input
              type="file"
              accept=".pdf"
              onChange={handlePdfChange}
              className="hidden"
              id="pdf-upload"
            />
            <Label htmlFor="pdf-upload" className="cursor-pointer">
              <div className="flex items-center gap-2 p-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                <Upload className="w-4 h-4" />
                <span>อัปโหลด PDF</span>
              </div>
            </Label>
            <p className="text-sm text-gray-500 mt-1">
              รองรับไฟล์ PDF ขนาดไม่เกิน 10MB
            </p>
          </div>
        </div>
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" onClick={onCancel}>
            ยกเลิก
          </Button>
        </DialogClose>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {work ? 'อัปเดต' : 'เพิ่ม'}ผลงาน
        </Button>
      </DialogFooter>
    </form>
  );
};

export default WorkForm; 