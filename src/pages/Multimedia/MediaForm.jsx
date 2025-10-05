import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { UploadCloud, X, Palette, Image as ImageIcon, Check, Loader2 } from 'lucide-react';
import { useMediaForm, useMediaFilters } from '@/hooks/useMedia';
import mediaService from '@/services/mediaService';

const defaultColors = [
  { name: 'ม่วงอ่อน', value: '#A855F7' },
  { name: 'ฟ้า', value: '#3B82F6' },
  { name: 'เขียว', value: '#10B981' },
  { name: 'เหลือง', value: '#F59E0B' },
  { name: 'ส้ม', value: '#F97316' },
  { name: 'แดง', value: '#EF4444' },
  { name: 'ชมพู', value: '#EC4899' },
  { name: 'เทา', value: '#6B7280' },
];

const MediaForm = ({ mediaItem, onSubmit, onCancel }) => {
  // API hooks
  const { 
    loading, 
    error, 
    uploadProgress,
    createMedia, 
    updateMedia, 
    uploadFile, 
    uploadMultipleFiles,
    setError 
  } = useMediaForm();
  
  const { events, keywords: popularKeywords } = useMediaFilters();

  const [formData, setFormData] = useState({
    name: '',
    subtitle: '',
    content: '',
    type: 'image',
    event: '',
    date: '',
    coverImage: null,
    coverImageUrl: '',
    themeColor: defaultColors[0].value,
    keywords: [],
    additionalMedia: [], 
    status: 'draft',
    itemsCount: undefined,
  });

  const [keywordInput, setKeywordInput] = useState('');
  const [coverPreview, setCoverPreview] = useState(null);
  const [additionalMediaPreviews, setAdditionalMediaPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState(''); // NEW: For folder upload
  const [folderImages, setFolderImages] = useState([]); // Store actual folder images with IDs for deletion

  useEffect(() => {
    const loadMediaItem = async () => {
      if (mediaItem) {
        console.log('🔄 MediaForm received mediaItem:', mediaItem);
        console.log('🔄 mediaItem.type:', mediaItem.type);
        console.log('🔄 mediaItem.id:', mediaItem.id);
        
        setFormData({
          name: mediaItem.name || '',
          subtitle: mediaItem.subtitle || '',
          content: mediaItem.content || '',
          type: mediaItem.type || 'image',
          event: mediaItem.event || '',
          date: mediaItem.date || '',
          coverImage: null,
          coverImageUrl: mediaItem.cover_image_url || mediaItem.thumbnail_url || mediaItem.coverImageUrl || mediaItem.thumbnailUrl || '',
          themeColor: mediaItem.theme_color || mediaItem.themeColor || defaultColors[0].value,
          keywords: mediaItem.keywords || [],
          additionalMedia: [], 
          status: mediaItem.status || 'draft',
          itemsCount: mediaItem.type === 'folder' ? (mediaItem.items_count || mediaItem.itemsCount || 0) : undefined,
        });
        setCoverPreview(mediaItem.cover_image_url || mediaItem.thumbnail_url || mediaItem.coverImageUrl || mediaItem.thumbnailUrl || null);
        
        // For folders, load images from folder_images table
        if (mediaItem.type === 'folder' && mediaItem.id) {
          try {
            console.log('📁 Loading folder images for editing:', mediaItem.id);
            const folderResponse = await mediaService.getFolderImages(mediaItem.id);
            console.log('📁 Folder response:', folderResponse);
            console.log('📁 Response type:', typeof folderResponse);
            console.log('📁 Response keys:', Object.keys(folderResponse || {}));
            
            // Extract images array from the response
            const folderImagesData = folderResponse?.images || [];
            
            console.log('📁 Extracted folderImagesData:', folderImagesData);
            console.log('📁 folderImagesData length:', folderImagesData?.length);
            
            if (folderImagesData && folderImagesData.length > 0) {
              const imageUrls = folderImagesData.map(img => {
                console.log('📸 Processing image:', img.name, img.image_url);
                return img.image_url;
              }).filter(url => {
                const isValid = url && url.length > 0;
                console.log('🔍 Image URL valid:', isValid, url);
                return isValid;
              });
              
              console.log('🖼️ Found folder images:', imageUrls.length, imageUrls);
              setFolderImages(folderImagesData); // Store full image data with IDs
              setAdditionalMediaPreviews(imageUrls);
            } else {
              console.log('📁 No images found in folder');
              setFolderImages([]);
              setAdditionalMediaPreviews([]);
            }
          } catch (error) {
            console.error('❌ Error loading folder images:', error);
            setFolderImages([]);
            // Fallback to additional_media_urls if folder images fail
            setAdditionalMediaPreviews(mediaItem.additional_media_urls || mediaItem.additionalMediaUrls || []);
          }
        } else {
          console.log('📁 Not a folder or no ID - skipping folder image loading');
          console.log('📁 Type check:', mediaItem.type === 'folder');
          console.log('📁 ID check:', !!mediaItem.id);
          // For non-folder items, use additional_media_urls
          setFolderImages([]);
          setAdditionalMediaPreviews(mediaItem.additional_media_urls || mediaItem.additionalMediaUrls || []);
        }
      } else {
        // Reset form for new item
        setFormData({
          name: '',
          subtitle: '',
          content: '',
          type: 'image',
          event: '',
          date: '',
          coverImage: null,
          coverImageUrl: '',
          themeColor: defaultColors[0].value,
          keywords: [],
          additionalMedia: [],
          status: 'draft',
          itemsCount: undefined,
        });
        setCoverPreview(null);
        setKeywordInput('');
        setAdditionalMediaPreviews([]);
        setFolderImages([]);
      }
    };

    loadMediaItem();
  }, [mediaItem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ 
      ...prev, 
      [name]: value,
      itemsCount: value === 'folder' ? (prev.itemsCount || 0) : undefined 
    }));
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    processCoverImage(file);
  };

  const processCoverImage = (file) => {
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
        return;
      }
      
      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('ขนาดไฟล์ต้องไม่เกิน 10MB');
        return;
      }
      
      setFormData((prev) => ({ ...prev, coverImage: file, coverImageUrl: '' }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const handleCoverDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleCoverDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleCoverDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleCoverDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processCoverImage(files[0]); // Only take the first file for cover image
    }
  };
  
  const handleAdditionalMediaChange = (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
  };

  const processFiles = (files) => {
    if (files.length > 0) {
      // Validate file count limit
      const maxFiles = 100; // Maximum 100 files
      if (files.length > maxFiles) {
        setError(`จำนวนไฟล์เกินขีดจำกัด (${files.length} ไฟล์). สามารถอัปโหลดได้สูงสุด ${maxFiles} ไฟล์ต่อครั้ง`);
        return;
      }
      
      // Validate file sizes
      const maxSize = 10 * 1024 * 1024; // 10MB per file
      const oversizedFiles = files.filter(file => file.size > maxSize);
      
      if (oversizedFiles.length > 0) {
        // Show detailed error with file sizes and suggestions
        const oversizedDetails = oversizedFiles.map(f => 
          `${f.name} (${(f.size / 1024 / 1024).toFixed(2)}MB)`
        ).join(', ');
        
        setError(`ไฟล์บางไฟล์ใหญ่เกินไป: ${oversizedDetails}. ขนาดไฟล์ต้องไม่เกิน 10MB ต่อไฟล์. กรุณาลดขนาดไฟล์หรือเลือกไฟล์อื่น`);
        return;
      }
      
      // Check total size limit (increased for large batches)
      const totalSize = files.reduce((sum, file) => sum + file.size, 0);
      const maxTotalSize = 500 * 1024 * 1024; // 500MB total (increased from 50MB)
      
      if (totalSize > maxTotalSize) {
        setError(`ขนาดไฟล์รวมใหญ่เกินไป (${Math.round(totalSize / 1024 / 1024)}MB). ขนาดรวมต้องไม่เกิน 500MB`);
        return;
      }
      
      // Check existing files + new files
      const currentFiles = formData.additionalMedia || [];
      const totalFilesCount = currentFiles.length + files.length;
      
      if (totalFilesCount > maxFiles) {
        setError(`จำนวนไฟล์รวมเกินขีดจำกัด (${totalFilesCount} ไฟล์). สามารถอัปโหลดได้สูงสุด ${maxFiles} ไฟล์`);
        return;
      }
      
      setFormData((prev) => ({ ...prev, additionalMedia: [...prev.additionalMedia, ...files] }));
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setAdditionalMediaPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  // Helper function to compress image
  const compressImage = (file, maxWidth = 1920, quality = 0.8) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(resolve, 'image/jpeg', quality);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const removeAdditionalMedia = async (index) => {
    // Check if this is a folder image that needs to be deleted from database
    if (formData.type === 'folder' && folderImages.length > 0 && index < folderImages.length) {
      const imageToDelete = folderImages[index];
      if (imageToDelete && imageToDelete.id) {
        try {
          console.log('🗑️ Deleting folder image:', imageToDelete.id);
          await mediaService.deleteImageFromFolder(formData.id || mediaItem?.id, imageToDelete.id);
          console.log('✅ Folder image deleted successfully');
          
          // Remove from folderImages array
          setFolderImages(prev => prev.filter((_, i) => i !== index));
        } catch (error) {
          console.error('❌ Error deleting folder image:', error);
          setError('ไม่สามารถลบรูปภาพได้ กรุณาลองใหม่อีกครั้ง');
          return; // Don't remove from preview if deletion failed
        }
      }
    }

    // Remove from form data and previews
    setFormData(prev => ({
      ...prev,
      additionalMedia: prev.additionalMedia.filter((_, i) => i !== index)
    }));
    setAdditionalMediaPreviews(prev => prev.filter((_, i) => i !== index));
  };


  const handleKeywordAdd = () => {
    if (keywordInput.trim() && formData.keywords.length < 5 && !formData.keywords.includes(keywordInput.trim())) {
      setFormData((prev) => ({ ...prev, keywords: [...prev.keywords, keywordInput.trim()] }));
      setKeywordInput('');
    }
  };

  const handleKeywordRemove = (keywordToRemove) => {
    setFormData((prev) => ({ ...prev, keywords: prev.keywords.filter(kw => kw !== keywordToRemove) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    console.log('🚀 FORM SUBMIT STARTED - NEW VERSION 2.0');

    try {
      let coverImageUrl = formData.coverImageUrl;
      let additionalMediaUrls = [];

      // Upload cover image if new file is selected
      if (formData.coverImage) {
        console.log('📤 Uploading cover image...');
        const uploadResult = await uploadFile(formData.coverImage);
        console.log('📤 Upload result:', uploadResult);
        
        if (!uploadResult || !uploadResult.fileUrl) {
          throw new Error('Upload failed: Invalid response from server');
        }
        
        coverImageUrl = uploadResult.fileUrl;
      }

      // Upload additional media files
      if (formData.additionalMedia && formData.additionalMedia.length > 0) {
        console.log('📤 Uploading additional media files...');
        
        // For existing folders, use the new folder upload endpoint
        if (formData.type === 'folder' && (formData.id || mediaItem?.id)) {
          const folderId = formData.id || mediaItem?.id;
          console.log('📁 Using folder upload for existing folder:', folderId);
          
          const uploadResults = await mediaService.uploadFilesToFolder(folderId, formData.additionalMedia);
          console.log('📁 Folder upload results:', uploadResults);
          
          if (!uploadResults || !uploadResults.success) {
            throw new Error('Folder upload failed: ' + (uploadResults?.error || 'Unknown error'));
          }
          
        } else {
          // Upload additional files for all types including folders
          console.log('🔍 DEBUG - About to upload files:', formData.additionalMedia.length);
          const multipleUploadResults = await uploadMultipleFiles(formData.additionalMedia);
          console.log('📤 Multiple upload results:', multipleUploadResults);
          
          if (!multipleUploadResults || !Array.isArray(multipleUploadResults)) {
            console.error('❌ Multiple upload failed - Invalid response:', multipleUploadResults);
            throw new Error('Multiple upload failed: Invalid response from server');
          }
          
          console.log('🔍 DEBUG - Processing upload results, count:', multipleUploadResults.length);
          additionalMediaUrls = multipleUploadResults.map((result, index) => {
            console.log(`🔍 DEBUG - Processing result ${index + 1}:`, result);
            if (!result || !result.fileUrl) {
              throw new Error(`Upload failed for file ${index + 1}: Invalid response`);
            }
            return result.fileUrl;
          });
          console.log('🔍 DEBUG - Final additionalMediaUrls after mapping:', additionalMediaUrls);
        }
      }

      // Debug: Check additionalMediaUrls before sending
      console.log('🔍 DEBUG - additionalMediaUrls before sending:', additionalMediaUrls);
      console.log('🔍 DEBUG - additionalMediaUrls length:', additionalMediaUrls.length);
      
      // Prepare data for API
      const mediaData = {
        name: formData.name,
        subtitle: formData.subtitle,
        content: formData.content,
        type: formData.type,
        event: formData.event,
        date: formData.date,
        cover_image_url: coverImageUrl,
        theme_color: formData.themeColor,
        keywords: formData.keywords,
        additional_media_urls: additionalMediaUrls,
        status: formData.status,
        items_count: formData.type === 'folder' ? parseInt(formData.itemsCount) || 0 : null,
      };
      
      console.log('🔍 DEBUG - Final mediaData:', mediaData);

      let result;
      if (mediaItem) {
        // Update existing media
        result = await updateMedia(mediaItem.id, mediaData);
        console.log('✅ Media updated successfully:', result.name);
      } else {
        // Create new media
        result = await createMedia(mediaData);
        console.log('✅ Media created successfully:', result.name);
        
        // For new folders with additional media, upload files after creation
        if (formData.type === 'folder' && formData.additionalMedia && formData.additionalMedia.length > 0) {
          console.log('📁 Uploading files to newly created folder:', result.id);
          
          try {
            const uploadResults = await mediaService.uploadFilesToFolder(result.id, formData.additionalMedia);
            console.log('📁 New folder upload results:', uploadResults);
            
            if (!uploadResults || !uploadResults.success) {
              console.warn('⚠️ Folder created but file upload failed:', uploadResults?.error);
              // Don't throw error - folder is created, just warn about upload
            }
          } catch (uploadError) {
            console.warn('⚠️ Folder created but file upload failed:', uploadError);
            // Don't throw error - folder is created successfully
          }
        }
      }

      // Call parent onSubmit with result
      if (onSubmit) {
        onSubmit(result);
      }

    } catch (err) {
      console.error('❌ Error submitting media form:', err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-2 max-h-[75vh] overflow-y-auto pr-2">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-red-600 text-sm">❌ {error}</p>
        </div>
      )}
      
      {/* Upload Progress */}
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <p className="text-blue-600 text-sm mb-2">📤 กำลังอัปโหลดไฟล์... {uploadProgress}%</p>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}
      
      {/* Upload Success */}
      {uploadProgress === 100 && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3">
          <div className="flex items-center">
            <div className="animate-bounce mr-2">✅</div>
            <p className="text-green-600 text-sm">อัปโหลดสำเร็จ! กำลังบันทึกข้อมูล...</p>
          </div>
        </div>
      )}
      <div>
        <Label htmlFor="coverImage" className="text-gray-700 font-medium">หน้าปก</Label>
        <div 
          className="mt-2 flex justify-center items-center w-full h-48 rounded-lg border-2 border-dashed border-gray-300 hover:border-violet-500 transition-colors bg-gray-50 relative group"
          onDragOver={handleCoverDragOver}
          onDragEnter={handleCoverDragEnter}
          onDragLeave={handleCoverDragLeave}
          onDrop={handleCoverDrop}
        >
          {coverPreview ? (
            <div className="relative h-full w-full">
              <img 
                src={coverPreview} 
                alt="Preview" 
                className="h-full w-full object-cover rounded-md" 
              />
              {/* Upload Progress Overlay */}
              {(isSubmitting || loading) && uploadProgress > 0 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md">
                  <div className="text-center text-white">
                    <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-2"></div>
                    <p className="text-sm">อัปโหลด {uploadProgress}%</p>
                  </div>
                </div>
              )}
              {/* Remove Button */}
              <button
                type="button"
                onClick={() => {
                  setFormData(prev => ({ ...prev, coverImage: null, coverImageUrl: '' }));
                  setCoverPreview(null);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="text-center">
              <UploadCloud className="mx-auto h-10 w-10 text-gray-400 group-hover:text-violet-500" />
              <p className="mt-1 text-sm text-gray-600 group-hover:text-violet-600">ลากไฟล์มาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์</p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF ขนาดไม่เกิน 10MB</p>
            </div>
          )}
          <Input 
            id="coverImage" 
            name="coverImage" 
            type="file" 
            onChange={handleCoverImageChange} 
            accept="image/*" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
        {/* File Info */}
        {formData.coverImage && (
          <div className="mt-2 p-2 bg-gray-50 rounded-md">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-700">📁 {formData.coverImage.name}</span>
              <span className="text-gray-500">{(formData.coverImage.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>
            <div className="flex items-center mt-1">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              <span className="text-xs text-green-600">พร้อมอัปโหลด</span>
            </div>
          </div>
        )}
        {formData.coverImageUrl && !formData.coverImage && (
           <p className="text-xs text-gray-500 mt-1">ใช้ภาพเดิม: {formData.coverImageUrl.substring(0,40)}...</p>
        )}
      </div>

      <div>
        <Label htmlFor="themeColor" className="text-gray-700 font-medium">ธีมสี</Label>
        <div className="mt-2 flex flex-wrap gap-2">
          {defaultColors.map(color => (
            <Button
              key={color.value}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleSelectChange('themeColor', color.value)}
              className={`h-8 w-8 p-0 rounded-full border-2 ${formData.themeColor === color.value ? 'ring-2 ring-offset-1 ring-violet-500 border-violet-500' : 'border-gray-300'}`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            >
              {formData.themeColor === color.value && <Check className="h-4 w-4 text-white mix-blend-difference" />}
            </Button>
          ))}
          <div className="relative h-8 w-8">
            <input 
              type="color" 
              value={formData.themeColor} 
              onChange={(e) => handleSelectChange('themeColor', e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div 
              className="h-full w-full rounded-full border-2 border-gray-300 flex items-center justify-center"
              style={{ backgroundColor: formData.themeColor }}
            >
              <Palette className="h-4 w-4 text-white mix-blend-difference" />
            </div>
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="name" className="text-gray-700 font-medium">ชื่อ</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="เช่น ภาพบรรยากาศงาน..." required className="mt-1"/>
      </div>
      <div>
        <Label htmlFor="subtitle" className="text-gray-700 font-medium">หัวข้อย่อย</Label>
        <Input id="subtitle" name="subtitle" value={formData.subtitle} onChange={handleChange} placeholder="คำอธิบายสั้นๆ เพิ่มเติม" className="mt-1"/>
      </div>
      <div>
        <Label htmlFor="content" className="text-gray-700 font-medium">เนื้อหา</Label>
        <Textarea id="content" name="content" value={formData.content} onChange={handleChange} placeholder="รายละเอียดเนื้อหา (ถ้ามี)" className="mt-1 min-h-[100px]"/>
      </div>
      
      <div>
        <Label htmlFor="keywords" className="text-gray-700 font-medium">คำสำคัญ (Keyword)</Label>
        <div className="mt-1 flex">
          <Input 
            id="keywordInput" 
            value={keywordInput} 
            onChange={(e) => setKeywordInput(e.target.value)} 
            placeholder="เพิ่มคำสำคัญ (ไม่เกิน 5 คำ)" 
            className="rounded-r-none"
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleKeywordAdd();}}}
          />
          <Button type="button" onClick={handleKeywordAdd} className="rounded-l-none bg-violet-600 hover:bg-violet-700 text-white">เพิ่ม</Button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {formData.keywords.map(kw => (
            <span key={kw} className="flex items-center bg-violet-100 text-violet-700 text-xs font-medium px-2.5 py-1 rounded-full">
              {kw}
              <Button type="button" variant="ghost" size="icon" onClick={() => handleKeywordRemove(kw)} className="ml-1.5 h-4 w-4 p-0 text-violet-500 hover:text-violet-700">
                <X className="h-3 w-3" />
              </Button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="additionalMedia" className="text-gray-700 font-medium">สื่อหรือภาพประกอบ</Label>
        <div 
          className="mt-2 flex justify-center items-center w-full min-h-[6rem] p-2 rounded-lg border-2 border-dashed border-gray-300 hover:border-violet-500 transition-colors bg-gray-50 relative group"
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {additionalMediaPreviews.length === 0 ? (
            <div className="text-center">
              <ImageIcon className="mx-auto h-8 w-8 text-gray-400 group-hover:text-violet-500" />
              <p className="mt-1 text-xs text-gray-600 group-hover:text-violet-600">ลากไฟล์มาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์</p>
              <p className="text-xs text-gray-500 mt-1">รองรับ: รูปภาพ, วิดีโอ (สูงสุด 100 ไฟล์, 10MB ต่อไฟล์, 500MB รวม)</p>
              <p className="text-xs text-orange-600 mt-1">💡 หากไฟล์ใหญ่เกิน 10MB กรุณาลดขนาดไฟล์ก่อนอัปโหลด</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* File Count Info */}
              <div className="text-center text-sm text-gray-600">
                <p>📁 ไฟล์ที่เลือก: {additionalMediaPreviews.length} ไฟล์</p>
                <p className="text-xs text-gray-500">สามารถเพิ่มได้อีก {Math.max(0, 100 - additionalMediaPreviews.length)} ไฟล์</p>
              </div>
              
              {/* Grid of Files */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 max-h-64 overflow-y-auto">
                {additionalMediaPreviews.map((previewUrl, index) => (
                  <div key={index} className="relative aspect-square group/item">
                    <img 
                      src={previewUrl} 
                      alt={`Preview ${index + 1}`} 
                      className="h-full w-full object-cover rounded-md border border-gray-200" 
                    />
                    {/* Upload Progress for Individual Files */}
                    {(isSubmitting || loading) && uploadProgress > 0 && (
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-md">
                        <div className="text-center text-white">
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mx-auto mb-1"></div>
                          <p className="text-xs">อัปโหลด...</p>
                        </div>
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-5 w-5 p-0 opacity-0 group-hover/item:opacity-100 transition-opacity"
                      onClick={() => removeAdditionalMedia(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    {/* File Number Badge */}
                    <div className="absolute bottom-1 left-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                      {index + 1}
                    </div>
                  </div>
                ))}
                {/* Add More Button */}
                {additionalMediaPreviews.length < 100 && (
                  <div 
                    className="aspect-square flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md hover:border-violet-500 transition-colors cursor-pointer"
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="text-center">
                      <UploadCloud className="mx-auto h-6 w-6 text-gray-400" />
                      <p className="text-xs text-gray-500 mt-1">เพิ่ม</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          <Input 
            id="additionalMedia" 
            name="additionalMedia" 
            type="file" 
            onChange={handleAdditionalMediaChange} 
            accept="image/*,video/*" 
            multiple
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type" className="text-gray-700 font-medium">ประเภทสื่อ</Label>
          <Select name="type" value={formData.type} onValueChange={(value) => handleSelectChange('type', value)}>
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="เลือกประเภทสื่อ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="image">รูปภาพ</SelectItem>
              <SelectItem value="video">วิดีโอ</SelectItem>
              <SelectItem value="folder">โฟลเดอร์/อัลบั้ม</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {formData.type === 'folder' && (
          <div>
            <Label htmlFor="itemsCount" className="text-gray-700 font-medium">จำนวนรายการในโฟลเดอร์</Label>
            <Input id="itemsCount" name="itemsCount" type="number" value={formData.itemsCount || ''} onChange={handleChange} placeholder="0" className="mt-1"/>
          </div>
        )}
        <div>
          <Label htmlFor="event" className="text-gray-700 font-medium">ชื่องานอีเว้นท์ที่เกี่ยวข้อง</Label>
          <Input id="event" name="event" value={formData.event} onChange={handleChange} placeholder="เช่น SACIT Symposium 2025" required className="mt-1"/>
        </div>
        <div>
          <Label htmlFor="date" className="text-gray-700 font-medium">วันที่เผยแพร่/วันที่งาน</Label>
          <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required className="mt-1"/>
        </div>
        <div>
          <Label htmlFor="status" className="text-gray-700 font-medium">สถานะ</Label>
          <Select name="status" value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="เลือกสถานะ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">บันทึกแบบร่าง</SelectItem>
              <SelectItem value="published">เผยแพร่ภาพและวิดีโอ</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <DialogFooter className="pt-4">
        <DialogClose asChild>
          <Button type="button" variant="outline" onClick={onCancel}>ยกเลิก</Button>
        </DialogClose>
        <Button 
          type="submit" 
          disabled={isSubmitting || loading}
          className="bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-50"
        >
          {isSubmitting || loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {uploadProgress > 0 ? `อัปโหลด ${uploadProgress}%` : 'กำลังบันทึก...'}
            </>
          ) : (
            mediaItem ? 'บันทึกการเปลี่ยนแปลง' : (formData.status === 'draft' ? 'บันทึกแบบร่าง' : 'เผยแพร่ภาพและวิดีโอ')
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default MediaForm;