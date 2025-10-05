import { useState, useEffect } from 'react';
import mediaService from '@/services/mediaService';

const useGallery = (limit = 10) => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🖼️ Fetching gallery images for homepage...');
        
        // ดึงรูปภาพทั้งหมดจาก API (รวม folder ที่มีภาพ)
        const response = await mediaService.getAllMedia({
          status: 'published', // เฉพาะที่เผยแพร่แล้ว
          limit: limit * 3 // ดึงเพิ่มเผื่อมีรูปที่ไม่มี URL
        });

        if (response.success && response.data) {
          console.log('📁 Found folders:', response.data.length);
          
          // ดึงรูปจากแต่ละโฟลเดอร์
          const allImages = [];
          
          for (const folder of response.data) {
            if (folder.type === 'folder') {
              try {
                console.log(`🔍 Fetching images from folder: ${folder.name}`);
                const folderResponse = await mediaService.getFolderImages(folder.id);
                
                if (folderResponse.images && folderResponse.images.length > 0) {
                  // เพิ่มรูปจากโฟลเดอร์นี้
                  const folderImages = folderResponse.images
                    .filter(img => img.image_url)
                    // เอาทุกรูปจากโฟลเดอร์ (ไม่จำกัด 5 รูป)
                    .map(img => ({
                      id: `folder-${folder.id}-img-${img.id}`,
                      url: img.image_url,
                      name: img.name || folder.name,
                      subtitle: folder.subtitle,
                      event: folder.event,
                      date: img.upload_date || folder.date,
                      folderId: folder.id,
                      folderName: folder.name
                    }));
                  
                  allImages.push(...folderImages);
                  console.log(`✅ Added ${folderImages.length} images from ${folder.name}`);
                  console.log('📊 Current total images:', allImages.length);
                }
              } catch (err) {
                console.warn(`⚠️ Failed to fetch images from folder ${folder.id}:`, err);
              }
            } else if (folder.cover_image_url || folder.thumbnail_url) {
              // สำหรับไฟล์เดี่ยวที่มี cover image
              allImages.push({
                id: folder.id,
                url: folder.cover_image_url || folder.thumbnail_url,
                name: folder.name,
                subtitle: folder.subtitle,
                event: folder.event,
                date: folder.date
              });
            }
          }

          // จำกัดจำนวนและสับเปลี่ยน
          console.log('🔄 Before processing - Total images collected:', allImages.length);
          console.log('🎯 Limit requested:', limit);
          
          const finalImages = allImages
            .sort(() => Math.random() - 0.5) // สุ่มลำดับ
            .slice(0, limit);

          console.log('✅ Final gallery images to display:', finalImages.length);
          console.log('📋 Final images:', finalImages.map(img => ({ id: img.id, name: img.name })));
          setGalleryImages(finalImages);
        } else {
          throw new Error('Failed to fetch gallery images');
        }
      } catch (err) {
        console.error('❌ Error fetching gallery images:', err);
        setError(err.message);
        setGalleryImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryImages();
  }, [limit]);

  return { galleryImages, loading, error };
};

export default useGallery;