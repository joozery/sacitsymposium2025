import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Download, FileText, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import analytics from '@/services/analytics';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const CertificatePreviewModal = ({ 
  certificate, 
  isOpen, 
  onClose 
}) => {
  const [previewData, setPreviewData] = useState({
    recipientName: 'นาย สมชาย ใจดี',
    date: '8 สิงหาคม 2568'
  });

  if (!isOpen || !certificate) return null;

  const renderPreview = () => {
    return (
      <div 
        className="relative bg-white shadow-lg mx-auto"
        style={{ 
          width: certificate.width,
          height: certificate.height,
          backgroundColor: certificate.backgroundColor,
          maxWidth: '100%',
          transform: 'scale(0.8)',
          transformOrigin: 'center top'
        }}
      >
        {/* Background Image */}
        {certificate.backgroundUrl && (
          <img 
            src={certificate.backgroundUrl} 
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Elements */}
        {certificate.elements?.map((element) => {
          let content = element.content;
          
          // Replace placeholders with preview data
          if (element.type === 'placeholder') {
            if (element.content.includes('{{recipientName}}')) {
              content = previewData.recipientName;
            } else if (element.content.includes('{{date}}')) {
              content = previewData.date;
            } else {
              content = element.placeholder || element.content;
            }
          }

          return (
            <div
              key={element.id}
              className="absolute"
              style={{
                left: element.x,
                top: element.y,
                fontSize: element.fontSize,
                fontFamily: element.fontFamily,
                color: element.color,
                textAlign: element.alignment,
                fontWeight: element.fontWeight,
                fontStyle: element.fontStyle,
                textDecoration: element.textDecoration,
                opacity: element.opacity,
                transform: `rotate(${element.rotation}deg)`,
                zIndex: element.zIndex,
                whiteSpace: 'nowrap'
              }}
            >
              {content}
            </div>
          );
        })}
      </div>
    );
  };

  const handleDownload = () => {
    // Track certificate download
    analytics.trackCertificateDownload(certificate.name);
    
    // TODO: Implement download functionality
    console.log('Download certificate:', certificate.name);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="text-xl font-bold flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              ตัวอย่างใบประกาศ: {certificate.name}
            </span>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleDownload} className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                ดาวน์โหลด
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Preview Controls */}
          <div className="w-80 border-r bg-gray-50 p-6 overflow-y-auto">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  ข้อมูลสำหรับตัวอย่าง
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label>ชื่อผู้รับใบประกาศ</Label>
                    <Input
                      value={previewData.recipientName}
                      onChange={(e) => setPreviewData({
                        ...previewData,
                        recipientName: e.target.value
                      })}
                      placeholder="ชื่อ-นามสกุล"
                    />
                  </div>
                  
                  <div>
                    <Label>วันที่</Label>
                    <Input
                      value={previewData.date}
                      onChange={(e) => setPreviewData({
                        ...previewData,
                        date: e.target.value
                      })}
                      placeholder="วันที่"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">รายละเอียดใบประกาศ</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>ชื่อ:</span>
                    <span className="font-medium">{certificate.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ประเภท:</span>
                    <span className="font-medium">{certificate.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>วันที่จัดงาน:</span>
                    <span className="font-medium">{certificate.eventDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>สถานะ:</span>
                    <span className={`font-medium ${
                      certificate.status === 'published' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {certificate.status === 'published' ? 'เผยแพร่แล้ว' : 'แบบร่าง'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>ขนาด:</span>
                    <span className="font-medium">{certificate.width} × {certificate.height}</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">คำแนะนำ</h3>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>• แก้ไขข้อมูลด้านบนเพื่อดูการเปลี่ยนแปลงในตัวอย่าง</p>
                  <p>• ใบประกาศจริงจะใช้ข้อมูลจากฐานข้อมูลผู้เข้าร่วม</p>
                  <p>• สามารถปรับแต่งการออกแบบได้ในหน้าออกแบบ</p>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Area */}
          <div className="flex-1 p-6 bg-gray-100 overflow-auto">
            <div className="flex justify-center items-start min-h-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {renderPreview()}
              </motion.div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CertificatePreviewModal;