import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Palette, Eye, Download, Edit3, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { certificateService } from '@/services/certificateService';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CertificateForm from './CertificateForm';
import CertificateTable from './CertificateTable';
import CertificateDesignerModal from './CertificateDesignerModal';
import CertificatePreviewModal from './CertificatePreviewModal';

const initialCertificates = [
  {
    id: 1,
    name: 'SACIT Symposium 2025 Day1',
    type: 'คนเข้าร่วมงาน',
    eventDate: '2025-08-08',
    status: 'published',
    qrLink: 'https://example.com/qr1',
    backgroundUrl: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
    width: 800,
    height: 600,
    backgroundColor: '#FFFFFF',
    elements: [
      {
        id: 'title',
        type: 'text',
        content: 'ใบประกาศนียบัตร',
        x: 400,
        y: 100,
        fontSize: 48,
        fontFamily: 'PromptP-Bold',
        color: '#533193',
        alignment: 'center',
        fontWeight: 'bold',
        fontStyle: 'normal',
        textDecoration: 'none',
        opacity: 1,
        rotation: 0,
        zIndex: 1
      },
      {
        id: 'recipientName',
        type: 'placeholder',
        content: '{{recipientName}}',
        x: 400,
        y: 250,
        fontSize: 36,
        fontFamily: 'PromptP-Regular',
        color: '#2D3748',
        alignment: 'center',
        fontWeight: 'normal',
        fontStyle: 'normal',
        textDecoration: 'none',
        opacity: 1,
        rotation: 0,
        zIndex: 2,
        placeholder: 'ชื่อผู้รับ'
      },
      {
        id: 'eventName',
        type: 'text',
        content: 'SACIT Symposium 2025',
        x: 400,
        y: 350,
        fontSize: 24,
        fontFamily: 'PromptP-Regular',
        color: '#4A5568',
        alignment: 'center',
        fontWeight: 'normal',
        fontStyle: 'normal',
        textDecoration: 'none',
        opacity: 1,
        rotation: 0,
        zIndex: 3
      },
      {
        id: 'date',
        type: 'placeholder',
        content: '{{date}}',
        x: 400,
        y: 400,
        fontSize: 18,
        fontFamily: 'PromptP-Regular',
        color: '#718096',
        alignment: 'center',
        fontWeight: 'normal',
        fontStyle: 'normal',
        textDecoration: 'none',
        opacity: 1,
        rotation: 0,
        zIndex: 4,
        placeholder: 'วันที่'
      }
    ]
  },
  {
    id: 2,
    name: 'SACIT Workshop Series',
    type: 'คนเข้าร่วมงานและนำเสนอผลงานวิจัย/บทความวิชาการ ที่มีความยาวมากเป็นพิเศษ เพื่อทดสอบการแสดงผลสองบรรทัด',
    eventDate: '2025-07-15',
    status: 'published',
    qrLink: 'https://example.com/qr2',
    backgroundUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
    width: 800,
    height: 600,
    backgroundColor: '#FFFFFF',
    elements: [
      {
        id: 'title',
        type: 'text',
        content: 'ใบประกาศนียบัตร',
        x: 400,
        y: 100,
        fontSize: 48,
        fontFamily: 'PromptP-Bold',
        color: '#533193',
        alignment: 'center',
        fontWeight: 'bold',
        fontStyle: 'normal',
        textDecoration: 'none',
        opacity: 1,
        rotation: 0,
        zIndex: 1
      },
      {
        id: 'recipientName',
        type: 'placeholder',
        content: '{{recipientName}}',
        x: 400,
        y: 250,
        fontSize: 36,
        fontFamily: 'PromptP-Regular',
        color: '#2D3748',
        alignment: 'center',
        fontWeight: 'normal',
        fontStyle: 'normal',
        textDecoration: 'none',
        opacity: 1,
        rotation: 0,
        zIndex: 2,
        placeholder: 'ชื่อผู้รับ'
      },
      {
        id: 'eventName',
        type: 'text',
        content: 'SACIT Workshop Series',
        x: 400,
        y: 350,
        fontSize: 24,
        fontFamily: 'PromptP-Regular',
        color: '#4A5568',
        alignment: 'center',
        fontWeight: 'normal',
        fontStyle: 'normal',
        textDecoration: 'none',
        opacity: 1,
        rotation: 0,
        zIndex: 3
      },
      {
        id: 'date',
        type: 'placeholder',
        content: '{{date}}',
        x: 400,
        y: 400,
        fontSize: 18,
        fontFamily: 'PromptP-Regular',
        color: '#718096',
        alignment: 'center',
        fontWeight: 'normal',
        fontStyle: 'normal',
        textDecoration: 'none',
        opacity: 1,
        rotation: 0,
        zIndex: 4,
        placeholder: 'วันที่'
      }
    ]
  },
  {
    id: 3,
    name: 'Annual SACIT Conference',
    type: 'คนเข้าร่วมงานและนำเสนอผลงานวิจัย/บทความวิชาการ',
    eventDate: '2025-09-20',
    status: 'draft',
    qrLink: 'https://example.com/qr3',
    backgroundUrl: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
    width: 800,
    height: 600,
    backgroundColor: '#FFFFFF',
    elements: [
      {
        id: 'title',
        type: 'text',
        content: 'ใบประกาศนียบัตร',
        x: 400,
        y: 100,
        fontSize: 48,
        fontFamily: 'PromptP-Bold',
        color: '#533193',
        alignment: 'center',
        fontWeight: 'bold',
        fontStyle: 'normal',
        textDecoration: 'none',
        opacity: 1,
        rotation: 0,
        zIndex: 1
      },
      {
        id: 'recipientName',
        type: 'placeholder',
        content: '{{recipientName}}',
        x: 400,
        y: 250,
        fontSize: 36,
        fontFamily: 'PromptP-Regular',
        color: '#2D3748',
        alignment: 'center',
        fontWeight: 'normal',
        fontStyle: 'normal',
        textDecoration: 'none',
        opacity: 1,
        rotation: 0,
        zIndex: 2,
        placeholder: 'ชื่อผู้รับ'
      },
      {
        id: 'eventName',
        type: 'text',
        content: 'Annual SACIT Conference',
        x: 400,
        y: 350,
        fontSize: 24,
        fontFamily: 'PromptP-Regular',
        color: '#4A5568',
        alignment: 'center',
        fontWeight: 'normal',
        fontStyle: 'normal',
        textDecoration: 'none',
        opacity: 1,
        rotation: 0,
        zIndex: 3
      },
      {
        id: 'date',
        type: 'placeholder',
        content: '{{date}}',
        x: 400,
        y: 400,
        fontSize: 18,
        fontFamily: 'PromptP-Regular',
        color: '#718096',
        alignment: 'center',
        fontWeight: 'normal',
        fontStyle: 'normal',
        textDecoration: 'none',
        opacity: 1,
        rotation: 0,
        zIndex: 4,
        placeholder: 'วันที่'
      }
    ]
  }
];

const CERTIFICATES_STORAGE_KEY = 'certificates_v7'; // Updated key for new structure

const CertificatesPage = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDesignerOpen, setIsDesignerOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState(null);
  const [designingCertificate, setDesigningCertificate] = useState(null);
  const [previewCertificate, setPreviewCertificate] = useState(null);
  const [deletingCertificate, setDeletingCertificate] = useState(null);

  // Load certificates from API
  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    try {
      setLoading(true);
      const response = await certificateService.getTemplates();
      
      if (response.success) {
        setCertificates(response.data);
      } else {
        throw new Error(response.message || 'Failed to load certificates');
      }
    } catch (error) {
      console.error('Error loading certificates:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลใบประกาศได้",
        variant: "destructive",
      });
      
      // Fallback to localStorage if API fails
      const savedCertificates = localStorage.getItem(CERTIFICATES_STORAGE_KEY);
      if (savedCertificates) {
        setCertificates(JSON.parse(savedCertificates));
      } else {
        setCertificates(initialCertificates);
      }
    } finally {
      setLoading(false);
    }
  };

  const saveCertificates = (updatedCertificates) => {
    setCertificates(updatedCertificates);
    localStorage.setItem(CERTIFICATES_STORAGE_KEY, JSON.stringify(updatedCertificates));
  };

  const handleAddCertificate = () => {
    setEditingCertificate(null);
    setIsFormOpen(true);
  };

  const handleEditCertificate = (certificate) => {
    setEditingCertificate(certificate);
    setIsFormOpen(true);
  };

  const handleDesignCertificate = (certificate) => {
    setDesigningCertificate(certificate);
    setIsDesignerOpen(true);
  };

  const handlePreviewCertificate = (certificate) => {
    setPreviewCertificate(certificate);
    setIsPreviewOpen(true);
  };

  const handleDeleteCertificate = (certificate) => {
    setDeletingCertificate(certificate);
  };

  const confirmDelete = async () => {
    if (deletingCertificate) {
      try {
        const response = await certificateService.deleteTemplate(deletingCertificate.id);
        
        if (response.success) {
          const updatedCertificates = certificates.filter(c => c.id !== deletingCertificate.id);
          setCertificates(updatedCertificates);
          toast({ 
            title: "ลบสำเร็จ!", 
            description: `ใบประกาศ "${deletingCertificate.name}" ถูกลบแล้ว`, 
            variant: "destructive" 
          });
        } else {
          throw new Error(response.message || 'Failed to delete certificate');
        }
      } catch (error) {
        console.error('Error deleting certificate:', error);
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถลบใบประกาศได้",
          variant: "destructive",
        });
      } finally {
        setDeletingCertificate(null);
      }
    }
  };
  
  const handleFormSubmit = (formData) => {
    if (editingCertificate) {
      const updatedCertificates = certificates.map(c => 
        c.id === editingCertificate.id ? { ...editingCertificate, ...formData } : c
      );
      saveCertificates(updatedCertificates);
      toast({ title: "แก้ไขสำเร็จ!", description: `ใบประกาศ "${formData.name}" ได้รับการอัปเดตแล้ว` });
    } else {
      const newCertificate = { 
        ...formData, 
        id: Date.now(), 
        qrLink: `https://example.com/qr${Date.now()}`,
        width: 800,
        height: 600,
        backgroundColor: '#FFFFFF',
        elements: [
          {
            id: 'title',
            type: 'text',
            content: 'ใบประกาศนียบัตร',
            x: 400,
            y: 100,
            fontSize: 48,
            fontFamily: 'PromptP-Bold',
            color: '#533193',
            alignment: 'center',
            fontWeight: 'bold',
            fontStyle: 'normal',
            textDecoration: 'none',
            opacity: 1,
            rotation: 0,
            zIndex: 1
          },
          {
            id: 'recipientName',
            type: 'placeholder',
            content: '{{recipientName}}',
            x: 400,
            y: 250,
            fontSize: 36,
            fontFamily: 'PromptP-Regular',
            color: '#2D3748',
            alignment: 'center',
            fontWeight: 'normal',
            fontStyle: 'normal',
            textDecoration: 'none',
            opacity: 1,
            rotation: 0,
            zIndex: 2,
            placeholder: 'ชื่อผู้รับ'
          },
          {
            id: 'eventName',
            type: 'text',
            content: formData.name || 'ชื่อกิจกรรม',
            x: 400,
            y: 350,
            fontSize: 24,
            fontFamily: 'PromptP-Regular',
            color: '#4A5568',
            alignment: 'center',
            fontWeight: 'normal',
            fontStyle: 'normal',
            textDecoration: 'none',
            opacity: 1,
            rotation: 0,
            zIndex: 3
          },
          {
            id: 'date',
            type: 'placeholder',
            content: '{{date}}',
            x: 400,
            y: 400,
            fontSize: 18,
            fontFamily: 'PromptP-Regular',
            color: '#718096',
            alignment: 'center',
            fontWeight: 'normal',
            fontStyle: 'normal',
            textDecoration: 'none',
            opacity: 1,
            rotation: 0,
            zIndex: 4,
            placeholder: 'วันที่'
          }
        ]
      };
      setCertificates([newCertificate, ...certificates]);
      toast({ title: "เพิ่มสำเร็จ!", description: `ใบประกาศ "${newCertificate.name}" ถูกเพิ่มแล้ว` });
    }
    setIsFormOpen(false);
    setEditingCertificate(null);
  };

  const handleDesignerSave = (designData) => {
    const updatedCertificates = certificates.map(c => 
      c.id === designingCertificate.id ? { ...c, ...designData } : c
    );
    saveCertificates(updatedCertificates);
    toast({ title: "บันทึกการออกแบบสำเร็จ!", description: `ใบประกาศ "${designData.name}" ได้รับการอัปเดตแล้ว` });
    setIsDesignerOpen(false);
    setDesigningCertificate(null);
  };

  const handleDesignerPreview = (previewData) => {
    setPreviewCertificate(previewData);
    setIsPreviewOpen(true);
  };

  const handleFeatureClick = (feature, idOrName, certificateNameIfOpenForm = '') => {
    let description = '🚧 ฟีเจอร์นี้ยังไม่ได้พัฒนา—แต่ไม่ต้องกังวล! ฟังชั้นจะใช้งานได้ในเร็วๆนี้  🚀';
    if (feature === 'openForm') {
        description = `🚧 ฟีเจอร์เปิดฟอร์มสำหรับงาน ID: ${idOrName} ("${certificateNameIfOpenForm}") ยังไม่ได้พัฒนา—แต่ไม่ต้องกังวล! ฟังชั้นจะใช้งานได้ในเร็วๆนี้  🚀`;
    } else if (feature === 'view') {
        description = `🚧 ฟีเจอร์ดูตัวอย่าง "${idOrName}" ยังไม่ได้พัฒนา—แต่ไม่ต้องกังวล! ฟังชั้นจะใช้งานได้ในเร็วๆนี้  🚀`;
    } else if (feature === 'downloadQr') {
        description = `🚧 ฟีเจอร์ดาวน์โหลด QR Code สำหรับ "${idOrName}" ยังไม่ได้พัฒนา—แต่ไม่ต้องกังวล! ฟังชั้นจะใช้งานได้ในเร็วๆนี้  🚀`;
    } else if (feature === 'pagination') {
        description = '🚧 ฟีเจอร์แบ่งหน้ายังไม่ได้พัฒนา—แต่ไม่ต้องกังวล! ฟังชั้นจะใช้งานได้ในเร็วๆนี้  🚀';
    }
    
    toast({ description });
  };

  const filteredCertificates = certificates.filter(cert => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch = cert.name.toLowerCase().includes(searchTermLower) ||
                         cert.type.toLowerCase().includes(searchTermLower);
    const matchesTab = activeTab === 'all' || cert.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const tabs = [
    { id: 'all', label: 'ทั้งหมด' },
    { id: 'published', label: 'เผยแพร่แล้ว' },
    { id: 'draft', label: 'แบบร่าง' },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">ใบประกาศนียบัตร</h1>
        <div className="flex gap-2">
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button 
                className="add-button-gradient w-full sm:w-auto"
                onClick={handleAddCertificate}
              >
                <Plus className="w-5 h-5 mr-2" />
                เพิ่มใบประกาศนียบัตร
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle className="text-xl">{editingCertificate ? 'แก้ไขใบประกาศนียบัตร' : 'เพิ่มใบประกาศนียบัตรใหม่'}</DialogTitle>
                <DialogDescription>
                  {editingCertificate ? 'แก้ไขรายละเอียดใบประกาศนียบัตรด้านล่าง' : 'กรอกรายละเอียดเพื่อสร้างใบประกาศนียบัตรใหม่'}
                </DialogDescription>
              </DialogHeader>
              <CertificateForm 
                certificate={editingCertificate} 
                onSubmit={handleFormSubmit}
                onCancel={() => {
                  setIsFormOpen(false);
                  setEditingCertificate(null);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white p-4 sm:p-6 rounded-xl shadow-lg"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="ค้นหาชื่อ หรือ ประเภท..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 w-full bg-gray-50 border-gray-300 focus:border-violet-500 text-sm"
              />
            </div>
            <div className="flex items-center">
               <Select value={activeTab} onValueChange={setActiveTab}>
                <SelectTrigger className="w-full sm:w-[180px] bg-gray-50 border-gray-300 text-sm">
                  <SelectValue placeholder="ตัวกรองสถานะ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  <SelectItem value="published">เผยแพร่แล้ว</SelectItem>
                  <SelectItem value="draft">แบบร่าง</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-2 sm:space-x-4 overflow-x-auto" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 flex-shrink-0
                    ${activeTab === tab.id
                      ? 'border-violet-600 text-violet-700'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  {tab.label} ({tab.id === 'all' ? certificates.length : certificates.filter(c => c.status === tab.id).length})
                </button>
              ))}
            </nav>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <AlertDialog>
          <CertificateTable 
            certificates={filteredCertificates}
            onEdit={handleEditCertificate}
            onDelete={handleDeleteCertificate}
            onDesign={handleDesignCertificate}
            onPreview={handlePreviewCertificate}
            onFeatureClick={handleFeatureClick}
          />
        
          {deletingCertificate && (
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>ยืนยันการลบ</AlertDialogTitle>
                <AlertDialogDescription>
                  คุณแน่ใจหรือไม่ว่าต้องการลบใบประกาศ "{deletingCertificate?.name}"? การกระทำนี้ไม่สามารถย้อนกลับได้
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setDeletingCertificate(null)}>ยกเลิก</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">ลบ</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          )}
        </AlertDialog>
        
        <div className="px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-sm text-gray-600 text-center sm:text-left">
            แสดง {filteredCertificates.length} จาก {certificates.length} รายการ
          </p>
          <div className="flex items-center justify-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => handleFeatureClick('pagination')}>
              ก่อนหน้า
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleFeatureClick('pagination')}>
              ถัดไป
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Certificate Designer Modal */}
      <CertificateDesignerModal
        certificate={designingCertificate}
        isOpen={isDesignerOpen}
        onClose={() => {
          setIsDesignerOpen(false);
          setDesigningCertificate(null);
        }}
        onSave={handleDesignerSave}
        onPreview={handleDesignerPreview}
      />

      {/* Certificate Preview Modal */}
      <CertificatePreviewModal
        certificate={previewCertificate}
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false);
          setPreviewCertificate(null);
        }}
      />
    </div>
  );
};

export default CertificatesPage;