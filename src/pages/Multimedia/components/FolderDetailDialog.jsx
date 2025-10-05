
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { X, Eye, Download, Share2, Grid3X3, List, Loader2, Upload, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import mediaService from '@/services/mediaService';
import { formatThaiDateTime } from '@/lib/utils';

const FolderDetailDialog = ({ isOpen, onOpenChange, folder, onImageClick }) => {
  const [viewMode, setViewMode] = useState('grid');
  const [folderImages, setFolderImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  // Fetch folder images when dialog opens
  useEffect(() => {
    const fetchFolderImages = async () => {
      if (!isOpen || !folder?.id) return;

      setLoading(true);
      setError(null);
      
      try {
        console.log('🔍 Fetching images for folder:', folder.id);
        const result = await mediaService.getFolderImages(folder.id);
        
        // Extract image URLs from the API response (UPDATED for folder_images table)
        const imageUrls = result.images
          .filter(img => img.image_url) // folder_images table uses image_url field
          .map(img => ({
            id: img.id,
            url: img.image_url, // Use image_url from folder_images table
            name: img.name,
            date: img.upload_date || img.date,
            subtitle: img.subtitle,
            description: img.description
          }));
        
        setFolderImages(imageUrls);
        console.log('✅ Loaded folder images:', imageUrls.length);
      } catch (err) {
        console.error('❌ Failed to fetch folder images:', err);
        setError(err.message);
        // Fallback to empty array
        setFolderImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFolderImages();
  }, [isOpen, folder?.id]);

  // Handle file upload to folder
  const handleFileUpload = async (files) => {
    if (!files || files.length === 0 || !folder?.id) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      console.log('📁 Uploading files to folder:', folder.id);
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      const result = await mediaService.uploadFilesToFolder(folder.id, Array.from(files));
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      console.log('✅ Upload successful:', result.summary);
      
      toast({
        title: "อัปโหลดสำเร็จ",
        description: `อัปโหลด ${result.summary.totalUploaded} ไฟล์ บันทึก ${result.summary.totalSaved} ไฟล์ลง database`,
      });

      // Refresh folder images
      const refreshResult = await mediaService.getFolderImages(folder.id);
      const imageUrls = refreshResult.images
        .filter(img => img.image_url)
        .map(img => ({
          id: img.id,
          url: img.image_url,
          name: img.name,
          date: img.upload_date || img.date,
          subtitle: img.subtitle,
          description: img.description
        }));
      setFolderImages(imageUrls);

    } catch (error) {
      console.error('❌ Upload failed:', error);
      toast({
        title: "อัปโหลดไม่สำเร็จ",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Handle delete image from folder
  const handleDeleteImage = async (imageId) => {
    if (!folder?.id || !imageId) return;

    try {
      console.log('🗑️ Deleting image from folder:', { folderId: folder.id, imageId });
      
      await mediaService.deleteImageFromFolder(folder.id, imageId);
      
      toast({
        title: "ลบรูปภาพสำเร็จ",
        description: "รูปภาพถูกลบออกจากโฟลเดอร์แล้ว",
      });

      // Remove image from local state
      setFolderImages(prev => prev.filter(img => img.id !== imageId));

    } catch (error) {
      console.error('❌ Delete failed:', error);
      toast({
        title: "ลบรูปภาพไม่สำเร็จ",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (!folder) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-800">{folder.name}</DialogTitle>
              <DialogDescription className="text-gray-600 mt-1">
                {folder.subtitle} • {folderImages.length} รายการ • {folder.event}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              {/* Upload Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    {uploadProgress}%
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    อัปโหลด
                  </>
                )}
              </Button>
              
              {/* View Mode Buttons */}
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
            />
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
              <span className="ml-2 text-gray-600">กำลังโหลดรูปภาพ...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">❌ เกิดข้อผิดพลาด: {error}</p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setError(null);
                  // Re-trigger the useEffect by toggling loading
                  setLoading(true);
                  setTimeout(() => setLoading(false), 100);
                }}
              >
                ลองใหม่
              </Button>
            </div>
          ) : folderImages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">ไม่พบรูปภาพในโฟลเดอร์นี้</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              <AnimatePresence>
                {folderImages.map((image, index) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="relative aspect-square group cursor-pointer rounded-lg overflow-hidden bg-gray-100"
                    onClick={() => onImageClick(image.url, folderImages.map(img => img.url), index)}
                  >
                    <img 
                      src={image.url} 
                      alt={image.name || `${folder.name} - รูปที่ ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400"><span>🖼️</span></div>';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                      <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    
                    {/* Delete button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteImage(image.id);
                      }}
                      className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    
                    <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                      {index + 1}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="space-y-3">
              {folderImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                  className="flex items-center gap-4 p-3 rounded-lg border border-gray-200 hover:border-violet-300 hover:bg-violet-50/50 transition-all duration-200 cursor-pointer group"
                  onClick={() => onImageClick(image.url, folderImages.map(img => img.url), index)}
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img 
                      src={image.url} 
                      alt={image.name || `${folder.name} - รูปที่ ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 group-hover:text-violet-700 transition-colors">
                      {image.name || `รูปภาพที่ ${index + 1}`}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {image.subtitle || `จาก ${folder.event}`} • {image.date ? formatThaiDateTime(image.date) : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteImage(image.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t pt-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            แสดง {folderImages.length} รายการจากทั้งหมด {folder.itemsCount || folderImages.length} รายการ
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              ดาวน์โหลดทั้งหมด
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              แชร์โฟลเดอร์
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FolderDetailDialog;