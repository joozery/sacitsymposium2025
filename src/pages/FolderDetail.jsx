import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Calendar, Eye, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import mediaService from '@/services/mediaService';
import { formatThaiDate } from '@/lib/utils';
import Lightbox from '@/components/Lightbox';
import Masonry from 'react-masonry-css';

const FolderDetail = () => {
  const { folderId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Masonry breakpoints configuration
  const breakpointColumnsObj = {
    default: 5,
    1024: 4,
    768: 3,
    640: 2,
    480: 2
  };

  // Add CSS for better masonry layout
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .my-masonry-grid {
        display: flex;
        margin-left: -8px; /* gutter size offset */
        width: auto;
      }
      
      .my-masonry-grid_column {
        padding-left: 8px; /* gutter size */
        background-clip: padding-box;
      }
      
      .my-masonry-grid_column > div {
        margin-bottom: 8px;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  
  const [folder, setFolder] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [lightboxImage, setLightboxImage] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    const fetchFolderDetail = async () => {
      if (!folderId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        console.log('🔍 Fetching folder detail for ID:', folderId);
        const result = await mediaService.getFolderImages(folderId);
        
        console.log('📁 Folder detail result:', result);
        console.log('📁 Folder info:', result?.folder);
        console.log('📁 Images count:', result?.images?.length);
        console.log('📁 First few images:', result?.images?.slice(0, 3));
        
        if (result && result.folder) {
          setFolder(result.folder);
          setImages(result.images || []);
          console.log('✅ Successfully set folder and images');
        } else {
          console.error('❌ Invalid result structure:', result);
          setError('ไม่พบข้อมูลโฟลเดอร์');
        }
      } catch (err) {
        console.error('❌ Error fetching folder detail:', err);
        setError(err.message);
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถโหลดข้อมูลโฟลเดอร์ได้",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFolderDetail();
  }, [folderId, toast]);

  const handleImageClick = (image, index) => {
    setLightboxImage(image.image_url);
    setLightboxIndex(index);
  };

  const handleLightboxClose = () => {
    setLightboxImage(null);
    setLightboxIndex(0);
  };

  const handleLightboxNext = () => {
    const nextIndex = (lightboxIndex + 1) % images.length;
    setLightboxIndex(nextIndex);
    setLightboxImage(images[nextIndex].image_url);
  };

  const handleLightboxPrev = () => {
    const prevIndex = lightboxIndex === 0 ? images.length - 1 : lightboxIndex - 1;
    setLightboxIndex(prevIndex);
    setLightboxImage(images[prevIndex].image_url);
  };

  console.log('🔄 FolderDetail render state:', { loading, error, folder: !!folder, imagesCount: images.length });

  if (loading) {
    console.log('⏳ Showing loading state');
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">เกิดข้อผิดพลาด: {error}</p>
          <Button onClick={() => navigate('/images')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            กลับไปหน้าภาพ
          </Button>
        </div>
      </div>
    );
  }

  if (!folder) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">ไม่พบโฟลเดอร์</p>
          <Button onClick={() => navigate('/images')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            กลับไปหน้าภาพ
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Same as Images page */}
      <div className="relative mt-20">
        {/* Top Banner */}
        <div className="w-full py-16" style={{
          background: 'linear-gradient(90deg, #BFB4EE 0%, #B3FFD1 100%)'
        }}>
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-center" style={{
              color: '#533192',
              fontFamily: 'Prompt',
              fontSize: '48px',
              fontStyle: 'normal',
              fontWeight: '700',
              lineHeight: 'normal'
            }}>
              สื่อและข่าวสาร
            </h1>
          </div>
        </div>

        {/* Sub Navigation Bar */}
        <div className="w-full py-4" style={{
          background: 'var(--gra-2, linear-gradient(90deg, #533193 0%, #BFB4EE 100%))'
        }}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-center gap-8">
              <Link to="/news" className="cursor-pointer">
                <span style={{
                  background: 'var(--gra-1, linear-gradient(90deg, #BFB4EE 0%, #B3FFD1 100%))',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: 'Prompt'
                }}>ข่าวสาร</span>
              </Link>
              <Link to="/exhibition" className="cursor-pointer">
                <span style={{
                  background: 'var(--gra-1, linear-gradient(90deg, #BFB4EE 0%, #B3FFD1 100%))',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: 'Prompt'
                }}>นิทรรศการ</span>
              </Link>
              <Link to="/creative-works" className="cursor-pointer">
                <span style={{
                  background: 'var(--gra-1, linear-gradient(90deg, #BFB4EE 0%, #B3FFD1 100%))',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: 'Prompt'
                }}>ผลงานสร้างสรรค์</span>
              </Link>
              <Link to="/images" className="flex items-center gap-2 cursor-pointer">
                <span className="text-lg text-white">✦</span>
                <span className="font-medium" style={{
                  background: 'var(--gra-1, linear-gradient(90deg, #BFB4EE 0%, #B3FFD1 100%))',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: 'Prompt'
                }}>ภาพ</span>
              </Link>
              <Link to="/videos" className="cursor-pointer">
                <span style={{
                  background: 'var(--gra-1, linear-gradient(90deg, #BFB4EE 0%, #B3FFD1 100%))',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: 'Prompt'
                }}>วิดีโอ</span>
              </Link>
              <Link to="/proceeding" className="cursor-pointer">
                <span style={{
                  background: 'var(--gra-1, linear-gradient(90deg, #BFB4EE 0%, #B3FFD1 100%))',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: 'Prompt'
                }}>Proceeding</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <Button
              onClick={() => navigate('/images')}
              variant="outline"
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              กลับ
            </Button>
            
            <div className="flex items-center gap-2 ml-auto">
              <Button
                onClick={() => setViewMode('grid')}
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => setViewMode('list')}
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-start gap-6">
              {folder.cover_image_url && (
                <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={folder.cover_image_url}
                    alt={folder.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {folder.name}
                </h1>
                
                {folder.subtitle && (
                  <p className="text-lg text-gray-600 mb-4">
                    {folder.subtitle}
                  </p>
                )}
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  {folder.date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatThaiDate(folder.date)}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{images.length} รูปภาพ</span>
                  </div>
                </div>
                
                {folder.keywords && folder.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {folder.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                      >
                        #{keyword}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Images Grid/List */}
        {images.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {viewMode === 'grid' ? (
              <Masonry
                breakpointCols={breakpointColumnsObj}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column"
              >
                {images.map((image, index) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="overflow-hidden cursor-pointer transition-all duration-300 group"
                    onClick={() => handleImageClick(image, index)}
                  >
                    <img
                      src={image.image_url}
                      alt={image.name}
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </motion.div>
                ))}
              </Masonry>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {images.map((image, index) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="aspect-[4/3] overflow-hidden rounded-lg shadow-md cursor-pointer hover:shadow-xl transition-all duration-300 group"
                    onClick={() => handleImageClick(image, index)}
                  >
                    <img
                      src={image.image_url}
                      alt={image.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center py-12"
          >
            <p className="text-gray-600 text-lg">ไม่มีภาพในโฟลเดอร์นี้</p>
          </motion.div>
        )}

        {/* Lightbox */}
        <AnimatePresence>
          {lightboxImage && (
            <Lightbox
              imageUrl={lightboxImage}
              onClose={handleLightboxClose}
              onNext={images.length > 1 ? handleLightboxNext : undefined}
              onPrev={images.length > 1 ? handleLightboxPrev : undefined}
              currentIndex={lightboxIndex}
              totalImages={images.length}
              imageTitle={images[lightboxIndex]?.name}
              imageDescription={images[lightboxIndex]?.subtitle}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FolderDetail;