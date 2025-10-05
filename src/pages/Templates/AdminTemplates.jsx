import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { UploadCloud, FileText, Eye, Edit, Trash2, Download, Plus, Settings, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { certificateService } from '@/services/certificateService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import Lightbox from '@/components/Lightbox';
import CertificateTemplateEditor from './CertificateTemplateEditor';

const initialCertificateTemplates = [
  {
    id: 'cert_1',
    name: 'ใบประกาศนียบัตร SACIT 2025',
    description: 'เทมเพลตใบประกาศนียบัตรสำหรับงาน SACIT Symposium 2025',
    type: 'certificate',
    width: 800,
    height: 600,
    backgroundUrl: '',
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
        alignment: 'center'
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
        alignment: 'center'
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
        placeholder: 'วันที่'
      }
    ],
    uploadDate: '2025-01-15'
  }
];

const AdminTemplates = () => {
  const { toast } = useToast();
  const [certificateTemplates, setCertificateTemplates] = useState([]);
  const [deletingTemplate, setDeletingTemplate] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editingCertificateTemplate, setEditingCertificateTemplate] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadCertificateTemplates = async () => {
    try {
      setLoading(true);
      const response = await certificateService.getTemplates();
      if (response.success) {
        setCertificateTemplates(response.data);
      }
    } catch (error) {
      console.error('Error loading certificate templates:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load templates from API instead of localStorage
    loadCertificateTemplates();
  }, []);


  // Certificate template functions
  const handleCreateCertificateTemplate = () => {
    setEditingCertificateTemplate(null);
    setShowEditor(true);
  };

  const handleEditCertificateTemplate = (template) => {
    setEditingCertificateTemplate(template);
    setShowEditor(true);
  };

  const handleSaveCertificateTemplate = async (templateData, backgroundImage = null) => {
    try {
      if (editingCertificateTemplate) {
        // Update existing template
        await certificateService.updateTemplate(editingCertificateTemplate.id, templateData, backgroundImage);
        toast({ title: "แก้ไขสำเร็จ!", description: `เทมเพลต "${templateData.name}" ได้รับการอัปเดตแล้ว` });
      } else {
        // Create new template  
        await certificateService.createTemplate(templateData, backgroundImage);
        toast({ title: "สร้างสำเร็จ!", description: `เทมเพลต "${templateData.name}" ถูกสร้างแล้ว` });
      }
      
      // Reload templates from API
      await loadCertificateTemplates();
      
      setShowEditor(false);
      setEditingCertificateTemplate(null);
    } catch (error) {
      console.error('Error saving template:', error);
      toast({ 
        title: "เกิดข้อผิดพลาด", 
        description: error.message || "ไม่สามารถบันทึกเทมเพลตได้",
        variant: "destructive"
      });
    }
  };

  const confirmDelete = async () => {
    if (deletingTemplate) {
      try {
        await certificateService.deleteTemplate(deletingTemplate.id);
        toast({ 
          title: "ลบสำเร็จ!", 
          description: `เทมเพลต "${deletingTemplate.name}" ถูกลบแล้ว`, 
          variant: "destructive" 
        });
        
        // Reload templates from API
        await loadCertificateTemplates();
        
        setDeletingTemplate(null);
      } catch (error) {
        console.error('Error deleting template:', error);
        toast({ 
          title: "เกิดข้อผิดพลาด", 
          description: error.message || "ไม่สามารถลบเทมเพลตได้",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <>
      <Helmet><title>จัดการเทมเพลตใบประกาศ - ระบบจัดการ SACIT</title></Helmet>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">จัดการเทมเพลตใบประกาศ</h1>
            <p className="text-gray-600 mt-1">สร้างและจัดการเทมเพลตสำหรับผู้ใช้งาน</p>
          </div>
          <Button 
            className="add-button-gradient"
            onClick={handleCreateCertificateTemplate}
          >
            <Plus className="w-5 h-5 mr-2" />
            สร้างเทมเพลตใหม่
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {certificateTemplates.map((template) => (
              <motion.div key={template.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 flex flex-col">
                <div className="relative w-full h-56 bg-gray-200">
                  <div className="w-full h-full bg-gradient-to-br from-[#533193] to-[#8B7DC3] flex items-center justify-center">
                    <div className="text-center text-white">
                      <FileText className="w-12 h-12 mx-auto mb-2" />
                      <p className="text-sm font-medium">{template.name}</p>
                      <p className="text-xs opacity-75">{template.description}</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditCertificateTemplate(template)}>
                      <Settings className="w-4 h-4 mr-2" /> แก้ไข
                    </Button>
                  </div>
                </div>
                <div className="p-4 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800 truncate">{template.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{template.description}</p>
                    <p className="text-xs text-gray-500">อัปโหลด: {template.uploadDate}</p>
                  </div>
                  <div className="flex items-center justify-end space-x-1 mt-3">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditCertificateTemplate(template)} title="แก้ไข"><Edit className="w-4 h-4 text-gray-500 hover:text-violet-600" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDeletingTemplate(template)} title="ลบ"><Trash2 className="w-4 h-4 text-gray-500 hover:text-red-600" /></Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {certificateTemplates.length === 0 && (
          <div className="text-center py-12 text-gray-500 bg-white rounded-xl shadow-lg">
            <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-lg">ไม่พบเทมเพลต</p>
            <p className="text-sm mt-1">สร้างเทมเพลตแรกของคุณได้เลย!</p>
          </div>
        )}
      </div>

      {/* Certificate Template Editor */}
      {showEditor && (
        <CertificateTemplateEditor
          template={editingCertificateTemplate}
          onSave={handleSaveCertificateTemplate}
          onCancel={() => {
            setShowEditor(false);
            setEditingCertificateTemplate(null);
          }}
          onPreview={(previewData) => {
            console.log('Preview:', previewData);
          }}
          onDelete={async (template) => {
            try {
              await certificateService.deleteTemplate(template.id);
              toast({ 
                title: "ลบสำเร็จ!", 
                description: `เทมเพลต "${template.name}" ถูกลบแล้ว`, 
                variant: "destructive" 
              });
              
              // Reload templates from API
              await loadCertificateTemplates();
              
              setShowEditor(false);
              setEditingCertificateTemplate(null);
            } catch (error) {
              console.error('Error deleting template:', error);
              toast({ 
                title: "เกิดข้อผิดพลาด", 
                description: error.message || "ไม่สามารถลบเทมเพลตได้",
                variant: "destructive"
              });
            }
          }}
        />
      )}

      <AlertDialog open={!!deletingTemplate} onOpenChange={(open) => !open && setDeletingTemplate(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการลบ</AlertDialogTitle>
            <AlertDialogDescription>
              คุณแน่ใจหรือไม่ว่าต้องการลบเทมเพลต "{deletingTemplate?.name}"? การกระทำนี้ไม่สามารถย้อนกลับได้
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingTemplate(null)}>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">ลบ</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AdminTemplates; 