import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { 
  Download,
  Eye,
  FileText,
  User,
  Calendar,
  Building,
  Mail
} from 'lucide-react';
import authService from '@/services/authService';

const CertificateGenerator = ({ 
  template, 
  onGenerate,
  onPreview,
  onClose 
}) => {
  const { toast } = useToast();
  const canvasRef = useRef(null);
  
  // Get current user data
  const currentUser = authService.getCurrentUser();
  
  const [certificateData, setCertificateData] = useState({
    recipientName: currentUser?.firstName && currentUser?.lastName 
      ? `${currentUser.firstName} ${currentUser.lastName}` 
      : currentUser?.first_name && currentUser?.last_name
      ? `${currentUser.first_name} ${currentUser.last_name}`
      : currentUser?.name || '',
    eventName: template?.elements?.find(el => el.id === 'eventName')?.content || 'SACIT Symposium 2025',
    date: new Date().toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    organization: currentUser?.organization || '',
    email: currentUser?.email || '',
    certificateNumber: `CERT-${Date.now().toString().slice(-6)}`,
    issuedDate: new Date().toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  });

  const [previewMode, setPreviewMode] = useState(false);
  const [generatedCertificate, setGeneratedCertificate] = useState(null);

  useEffect(() => {
    if (template) {
      generateCertificate();
    }
  }, [template, certificateData]);

  const generateCertificate = () => {
    const canvas = canvasRef.current;
    if (!canvas || !template) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    if (template.backgroundUrl) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        drawElements(ctx);
      };
      img.src = template.backgroundUrl;
    } else {
      // Default background
      ctx.fillStyle = '#F7FAFC';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawElements(ctx);
    }
  };

  const drawElements = (ctx) => {
    if (!template.elements) return;

    template.elements.forEach(element => {
      ctx.font = `${element.fontSize}px ${element.fontFamily}`;
      ctx.fillStyle = element.color;
      ctx.textAlign = element.alignment;
      ctx.textBaseline = 'middle';

      let content = element.content;
      
      // Replace placeholders with actual data
      if (element.type === 'placeholder') {
        switch (element.placeholder) {
          case 'ชื่อผู้รับ':
            content = certificateData.recipientName;
            break;
          case 'วันที่':
            content = certificateData.date;
            break;
          case 'eventName':
            content = certificateData.eventName;
            break;
          case 'organization':
            content = certificateData.organization;
            break;
          case 'email':
            content = certificateData.email;
            break;
          case 'certificateNumber':
            content = certificateData.certificateNumber;
            break;
          case 'issuedDate':
            content = certificateData.issuedDate;
            break;
          default:
            content = element.content;
        }
      }

      const x = element.alignment === 'center' ? element.x : 
                element.alignment === 'right' ? element.x - 50 : element.x + 50;

      ctx.fillText(content, x, element.y);
    });
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `certificate-${certificateData.recipientName.replace(/\s+/g, '-')}.png`;
    link.href = canvas.toDataURL();
    link.click();

    toast({
      title: "ดาวน์โหลดสำเร็จ!",
      description: "ใบประกาศถูกดาวน์โหลดแล้ว"
    });
  };

  const handleGeneratePDF = () => {
    // This would integrate with a PDF generation library like jsPDF
    toast({
      title: "กำลังพัฒนา",
      description: "ฟีเจอร์สร้าง PDF จะพร้อมใช้งานเร็วๆนี้"
    });
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const certificateDataUrl = canvas.toDataURL();
    const certificate = {
      id: Date.now(),
      templateId: template.id,
      recipientName: certificateData.recipientName,
      eventName: certificateData.eventName,
      date: certificateData.date,
      certificateNumber: certificateData.certificateNumber,
      imageData: certificateDataUrl,
      generatedAt: new Date().toISOString(),
      userId: currentUser?.id || currentUser?.email
    };

    onGenerate(certificate);
    toast({
      title: "สร้างใบประกาศสำเร็จ!",
      description: `ใบประกาศสำหรับ ${certificateData.recipientName} ถูกสร้างแล้ว`
    });
  };

  const handlePreview = () => {
    setPreviewMode(!previewMode);
    if (onPreview) {
      onPreview(certificateData);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">ใบประกาศนียบัตรของคุณ</DialogTitle>
          <DialogDescription>
            ตรวจสอบข้อมูลก่อนดาวน์โหลดใบประกาศนียบัตร
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Certificate Preview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">ตัวอย่างใบประกาศ</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreview}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {previewMode ? 'แก้ไข' : 'ดูตัวอย่าง'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                >
                  <Download className="w-4 h-4 mr-2" />
                  ดาวน์โหลด
                </Button>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden bg-white">
              <canvas
                ref={canvasRef}
                width={template?.width || 800}
                height={template?.height || 600}
                className="w-full h-auto"
                style={{ maxHeight: '500px' }}
              />
            </div>
          </div>

          {/* Right Panel - Data Form */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">ข้อมูลของคุณ</h3>
              
              <div className="space-y-4">
                <div>
                  <Label className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    ชื่อผู้รับ
                  </Label>
                  <Input
                    value={certificateData.recipientName}
                    onChange={(e) => setCertificateData(prev => ({ 
                      ...prev, 
                      recipientName: e.target.value 
                    }))}
                    className="mt-1"
                    placeholder="ชื่อ-นามสกุล"
                  />
                </div>

                <div>
                  <Label className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    ชื่อกิจกรรม
                  </Label>
                  <Input
                    value={certificateData.eventName}
                    onChange={(e) => setCertificateData(prev => ({ 
                      ...prev, 
                      eventName: e.target.value 
                    }))}
                    className="mt-1"
                    placeholder="ชื่อกิจกรรม"
                  />
                </div>

                <div>
                  <Label className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    วันที่จัดงาน
                  </Label>
                  <Input
                    value={certificateData.date}
                    onChange={(e) => setCertificateData(prev => ({ 
                      ...prev, 
                      date: e.target.value 
                    }))}
                    className="mt-1"
                    placeholder="วันที่"
                  />
                </div>

                <div>
                  <Label className="flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    หน่วยงาน/องค์กร
                  </Label>
                  <Input
                    value={certificateData.organization}
                    onChange={(e) => setCertificateData(prev => ({ 
                      ...prev, 
                      organization: e.target.value 
                    }))}
                    className="mt-1"
                    placeholder="ชื่อหน่วยงาน"
                  />
                </div>

                <div>
                  <Label className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    อีเมล
                  </Label>
                  <Input
                    value={certificateData.email}
                    onChange={(e) => setCertificateData(prev => ({ 
                      ...prev, 
                      email: e.target.value 
                    }))}
                    className="mt-1"
                    placeholder="อีเมล"
                    type="email"
                  />
                </div>

                <div>
                  <Label>เลขที่ใบประกาศ</Label>
                  <Input
                    value={certificateData.certificateNumber}
                    onChange={(e) => setCertificateData(prev => ({ 
                      ...prev, 
                      certificateNumber: e.target.value 
                    }))}
                    className="mt-1"
                    placeholder="เลขที่ใบประกาศ"
                  />
                </div>

                <div>
                  <Label>วันที่ออกใบประกาศ</Label>
                  <Input
                    value={certificateData.issuedDate}
                    onChange={(e) => setCertificateData(prev => ({ 
                      ...prev, 
                      issuedDate: e.target.value 
                    }))}
                    className="mt-1"
                    placeholder="วันที่ออกใบประกาศ"
                  />
                </div>
              </div>
            </div>

            {/* Template Info */}
            {template && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">ข้อมูลเทมเพลต</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium">ชื่อ:</span> {template.name}</p>
                  {template.description && (
                    <p><span className="font-medium">คำอธิบาย:</span> {template.description}</p>
                  )}
                  <p><span className="font-medium">ขนาด:</span> {template.width} x {template.height} px</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <DialogClose asChild>
            <Button variant="outline">ยกเลิก</Button>
          </DialogClose>
          <Button
            variant="outline"
            onClick={handleGeneratePDF}
          >
            สร้าง PDF
          </Button>
          <Button
            onClick={handleSave}
            className="bg-[#533193] hover:bg-[#4A2D7A]"
          >
            บันทึกใบประกาศ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CertificateGenerator; 