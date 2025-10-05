import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Edit, 
  Trash2, 
  Palette, 
  User, 
  FileText, 
  ExternalLink,
  Calendar,
  Hash
} from 'lucide-react';

const WorkCard = ({ work, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-200">
        <CardContent className="p-0">
          {/* Image Section */}
          <div className="relative h-48 overflow-hidden">
            <Avatar className="w-full h-full rounded-none">
              <AvatarImage 
                src={work.photo_url} 
                alt={work.name}
                className="object-cover"
              />
              <AvatarFallback className="bg-gradient-to-br from-purple-100 to-pink-100">
                <Palette className="w-8 h-8 text-purple-600" />
              </AvatarFallback>
            </Avatar>
            
            {/* Status Badge */}
            <div className="absolute top-2 right-2">
              <Badge variant={work.status === 'active' ? 'default' : 'secondary'}>
                {work.status === 'active' ? 'แสดงผล' : 'ไม่แสดง'}
              </Badge>
            </div>

            {/* PDF Indicator */}
            {work.pdf_url && (
              <div className="absolute top-2 left-2">
                <Badge variant="outline" className="bg-white/90 text-gray-800">
                  <FileText className="w-3 h-3 mr-1" />
                  PDF
                </Badge>
              </div>
            )}

            {/* Display Order */}
            {work.display_order > 0 && (
              <div className="absolute bottom-2 left-2">
                <Badge variant="outline" className="bg-black/70 text-white border-white/30">
                  <Hash className="w-3 h-3 mr-1" />
                  {work.display_order}
                </Badge>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="p-4 space-y-3">
            {/* Title */}
            <div>
              <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">
                {work.name}
              </h3>
              <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                <User className="w-3 h-3" />
                <span className="line-clamp-1">{work.owner_name}</span>
              </div>
            </div>

            {/* Category & Technique */}
            <div className="space-y-2">
              {work.category && (
                <Badge variant="secondary" className="text-xs">
                  {work.category}
                </Badge>
              )}
              {work.technique && (
                <div className="text-xs text-gray-600">
                  <span className="font-medium">เทคนิค:</span> {work.technique}
                </div>
              )}
            </div>

            {/* Description */}
            {work.description && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {work.description}
              </p>
            )}

            {/* Date */}
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Calendar className="w-3 h-3" />
              <span>สร้างเมื่อ {formatDate(work.created_at)}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
                className="flex-1"
              >
                <Edit className="w-3 h-3 mr-1" />
                แก้ไข
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={onDelete}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>

            {/* PDF Link */}
            {work.pdf_url && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = work.pdf_url;
                  link.target = '_blank';
                  link.rel = 'noopener noreferrer';
                  link.click();
                }}
              >
                <FileText className="w-3 h-3 mr-1" />
                ดูเอกสาร
                <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WorkCard; 