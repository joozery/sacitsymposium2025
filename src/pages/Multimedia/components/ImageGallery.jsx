
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Download, Share2, ZoomIn, ZoomOut, RotateCw, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ImageGallery = ({ images, currentIndex, isOpen, onClose, onIndexChange }) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setZoom(1);
      setRotation(0);
      setShowInfo(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        case '+':
        case '=':
          handleZoomIn();
          break;
        case '-':
          handleZoomOut();
          break;
        case 'r':
        case 'R':
          handleRotate();
          break;
        case 'i':
        case 'I':
          setShowInfo(!showInfo);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, zoom, rotation, showInfo]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      onIndexChange(currentIndex - 1);
      setZoom(1);
      setRotation(0);
    }
  };

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      onIndexChange(currentIndex + 1);
      setZoom(1);
      setRotation(0);
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = images[currentIndex];
    link.download = `image-${currentIndex + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen || !images.length) return null;

  const currentImage = images[currentIndex];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative max-w-[95vw] max-h-[95vh] flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <img-replace 
            src={currentImage} 
            alt={`Gallery image ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain transition-transform duration-300"
            style={{ 
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              cursor: zoom > 1 ? 'grab' : 'default'
            }}
          />
        </motion.div>

        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-[201]">
          <div className="flex items-center gap-2">
            <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm">
              {currentIndex + 1} / {images.length}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="bg-black/60 backdrop-blur-sm text-white hover:bg-black/80"
              onClick={() => setShowInfo(!showInfo)}
            >
              <Info className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="bg-black/60 backdrop-blur-sm text-white hover:bg-black/80"
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
            >
              <ZoomOut className="w-5 h-5" />
            </Button>
            <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm min-w-[60px] text-center">
              {Math.round(zoom * 100)}%
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="bg-black/60 backdrop-blur-sm text-white hover:bg-black/80"
              onClick={handleZoomIn}
              disabled={zoom >= 3}
            >
              <ZoomIn className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="bg-black/60 backdrop-blur-sm text-white hover:bg-black/80"
              onClick={handleRotate}
            >
              <RotateCw className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="bg-black/60 backdrop-blur-sm text-white hover:bg-black/80"
              onClick={handleDownload}
            >
              <Download className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="bg-black/60 backdrop-blur-sm text-white hover:bg-black/80"
            >
              <Share2 className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="bg-black/60 backdrop-blur-sm text-white hover:bg-black/80"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {showInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-4 text-white z-[201]"
          >
            <h3 className="font-semibold text-lg mb-2">รูปภาพที่ {currentIndex + 1}</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-300">ขนาด:</span> 1920 x 1080 px
              </div>
              <div>
                <span className="text-gray-300">ประเภท:</span> JPEG
              </div>
              <div>
                <span className="text-gray-300">วันที่ถ่าย:</span> 8 สิงหาคม 2025
              </div>
              <div>
                <span className="text-gray-300">ขนาดไฟล์:</span> 2.4 MB
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-400">
              <strong>คีย์บอร์ดช็อตคัต:</strong> ← → (เลื่อนภาพ) | + - (ซูม) | R (หมุน) | I (ข้อมูล) | ESC (ปิด)
            </div>
          </motion.div>
        )}

        {currentIndex > 0 && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-sm text-white hover:bg-black/80 w-12 h-12 z-[201]"
            onClick={handlePrevious}
          >
            <ChevronLeft className="w-8 h-8" />
          </Button>
        )}

        {currentIndex < images.length - 1 && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-sm text-white hover:bg-black/80 w-12 h-12 z-[201]"
            onClick={handleNext}
          >
            <ChevronRight className="w-8 h-8" />
          </Button>
        )}

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-[201]">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              onClick={() => {
                onIndexChange(index);
                setZoom(1);
                setRotation(0);
              }}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageGallery;