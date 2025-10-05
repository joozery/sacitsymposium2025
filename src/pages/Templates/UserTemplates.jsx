import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { FileText, Eye, Download, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import CertificateGenerator from './CertificateGenerator';

const CERTIFICATE_TEMPLATES_STORAGE_KEY = 'certificate_templates_editable_v1';

const UserTemplates = () => {
  const { toast } = useToast();
  const [certificateTemplates, setCertificateTemplates] = useState([]);
  const [showGenerator, setShowGenerator] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    const savedCertificateTemplates = localStorage.getItem(CERTIFICATE_TEMPLATES_STORAGE_KEY);
    if (savedCertificateTemplates) {
      setCertificateTemplates(JSON.parse(savedCertificateTemplates));
    }
  }, []);

  const handleGenerateCertificate = (template) => {
    setSelectedTemplate(template);
    setShowGenerator(true);
  };

  const handleCertificateGenerated = (certificate) => {
    // Save generated certificate to user's certificates
    const userCertificates = JSON.parse(localStorage.getItem('user_certificates') || '[]');
    userCertificates.push(certificate);
    localStorage.setItem('user_certificates', JSON.stringify(userCertificates));
    
    setShowGenerator(false);
    setSelectedTemplate(null);
    
    toast({
      title: "สร้างใบประกาศสำเร็จ!",
      description: "ใบประกาศถูกบันทึกในหน้า Account แล้ว"
    });
  };

  return (
    <>
      <Helmet><title>ใบประกาศนียบัตร - ระบบจัดการ SACIT</title></Helmet>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">ใบประกาศนียบัตร</h1>
            <p className="text-gray-600 mt-1">เลือกเทมเพลตเพื่อสร้างใบประกาศนียบัตรของคุณ</p>
          </div>
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button variant="outline" size="sm" onClick={() => handleGenerateCertificate(template)}>
                      <Users className="w-4 h-4 mr-2" /> สร้างใบประกาศ
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
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleGenerateCertificate(template)} title="สร้างใบประกาศ"><Users className="w-4 h-4 text-gray-500 hover:text-green-600" /></Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {certificateTemplates.length === 0 && (
          <div className="text-center py-12 text-gray-500 bg-white rounded-xl shadow-lg">
            <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-lg">ยังไม่มีเทมเพลตใบประกาศ</p>
            <p className="text-sm mt-1">แอดมินจะสร้างเทมเพลตให้เร็วๆนี้</p>
          </div>
        )}
      </div>

      {/* Certificate Generator */}
      {showGenerator && selectedTemplate && (
        <CertificateGenerator
          template={selectedTemplate}
          onGenerate={handleCertificateGenerated}
          onPreview={(data) => {
            console.log('Preview certificate data:', data);
          }}
          onClose={() => {
            setShowGenerator(false);
            setSelectedTemplate(null);
          }}
        />
      )}
    </>
  );
};

export default UserTemplates; 