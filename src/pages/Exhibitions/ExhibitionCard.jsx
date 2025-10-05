import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { User, Edit, Trash2, Download } from 'lucide-react';

const ExhibitionCard = ({ exhibition, onEdit, onDelete }) => {
  const handleDownloadPdf = () => {
    if (exhibition.pdf_url) {
      const link = document.createElement('a');
      link.href = exhibition.pdf_url;
      link.download = exhibition.pdf_filename || `${exhibition.name}_document.pdf`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 flex flex-col border border-gray-100"
    >
      {/* Full-width image header - increased height */}
      <div className="relative h-64 bg-gradient-to-br from-amber-50 to-orange-100">
        {exhibition.image_url ? (
          <img 
            src={exhibition.image_url} 
            alt={exhibition.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-100 to-orange-200">
            <User className="h-24 w-24 text-amber-600" />
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      </div>

      {/* Content Section */}
      <div className="relative px-6 pb-6">
        {/* Name and Position */}
        <div className="text-center mb-4 mt-4">
          <h3 className="text-2xl font-bold text-gray-800">{exhibition.name}</h3>
          {exhibition.position && (
            <p className="text-sm text-gray-600 mt-1">{exhibition.position}</p>
          )}
        </div>

        {/* Title */}
        {exhibition.title && (
          <div className="text-center mb-4">
            <p className="text-sm text-gray-700 font-medium">
              {exhibition.title}
            </p>
          </div>
        )}

        {/* Description */}
        {exhibition.description && (
          <div className="text-center mb-4">
            <p className="text-sm text-gray-600 leading-relaxed">
              {exhibition.description}
            </p>
          </div>
        )}

        {/* PDF Download */}
        {exhibition.pdf_url && (
          <div className="mb-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDownloadPdf}
              className="w-full text-amber-600 border-amber-200 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              ดาวน์โหลดเอกสาร
            </Button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-center space-x-3 pt-4 border-t border-gray-100">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onEdit}
            className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-colors"
          >
            <Edit className="w-4 h-4 mr-2" /> 
            แก้ไข
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-colors" 
            onClick={onDelete}
          >
            <Trash2 className="w-4 h-4 mr-2" /> 
            ลบ
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ExhibitionCard;