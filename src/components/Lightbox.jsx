import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const Lightbox = ({ imageUrl, onClose, onNext, onPrev, hasPrev, hasNext, currentIndex, totalImages, imageTitle, imageDescription }) => {
  console.log('🖼️ Lightbox render:', { imageUrl, currentIndex, totalImages, imageTitle });
  
  if (!imageUrl) {
    console.warn('⚠️ Lightbox: No imageUrl provided');
    return null;
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && hasPrev) {
        onPrev();
      } else if (e.key === 'ArrowRight' && hasNext) {
        onNext();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev, hasPrev, hasNext]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative max-w-4xl max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <img src={imageUrl} alt="Lightbox preview" className="rounded-lg shadow-2xl object-contain max-w-full max-h-full" />
          
          {/* Image counter - moved to top left */}
          <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm border border-white/20 backdrop-blur-sm">
            {(currentIndex || 0) + 1} / {totalImages || 1}
          </div>

          {/* Image info at bottom */}
          {(imageTitle || imageDescription) && (
            <div className="absolute bottom-4 left-4 right-4 bg-black/70 text-white p-4 rounded-lg border border-white/20 backdrop-blur-sm">
              {imageTitle && (
                <h3 className="text-lg font-semibold mb-1">{imageTitle}</h3>
              )}
              {imageDescription && (
                <p className="text-sm text-gray-200">{imageDescription}</p>
              )}
            </div>
          )}
        </motion.div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-3 hover:bg-black/70 transition-colors z-[101] border border-white/20"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        {hasPrev && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/50 rounded-full p-3 hover:bg-black/70 transition-colors z-[101] border border-white/20"
            aria-label="Previous image"
          >
            <ChevronLeft size={32} />
          </button>
        )}

        {hasNext && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/50 rounded-full p-3 hover:bg-black/70 transition-colors z-[101] border border-white/20"
            aria-label="Next image"
          >
            <ChevronRight size={32} />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default Lightbox;