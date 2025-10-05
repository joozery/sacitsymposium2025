import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  Edit, 
  Trash2, 
  QrCode,
  Link as LinkIcon,
  Download,
  Image as ImageIcon,
  FileText as FileTextIcon,
  Send,
  Palette
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";

const CertificateTable = ({ 
  certificates, 
  onEdit, 
  onDelete, 
  onDesign,
  onPreview,
  onFeatureClick 
}) => {

  const getStatusBadge = (status) => {
    if (status === 'published') {
      return (
        <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 font-medium text-xs leading-tight">
          <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
          เผยแพร่แล้ว
        </div>
      );
    }
    return (
      <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 font-medium text-xs leading-tight">
        <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
        แบบร่าง
      </div>
    );
  };

  if (certificates.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <FileTextIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <p className="text-lg">ไม่พบข้อมูลใบประกาศนียบัตร</p>
        <p className="text-sm">ลองปรับคำค้นหาหรือตัวกรองของคุณ หรือเพิ่มใบประกาศใหม่</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px]">
        <thead>
          <tr>
            <th className="table-header-custom w-8 sm:w-12">
              <input type="checkbox" className="form-checkbox rounded text-violet-600 focus:ring-violet-500" />
            </th>
            <th className="table-header-custom w-12 sm:w-16">ลำดับ</th>
            <th className="table-header-custom w-24 sm:w-40">ภาพพื้นหลัง</th>
            <th className="table-header-custom">กิจกรรม</th>
            <th className="table-header-custom hidden md:table-cell w-48">ประเภท</th>
            <th className="table-header-custom">วันที่จัดงาน</th>
            <th className="table-header-custom">ฟอร์ม</th>
            <th className="table-header-custom">QR</th>
            <th className="table-header-custom">จัดการ</th>
            <th className="table-header-custom w-36">สถานะ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          <AnimatePresence>
            {certificates.map((certificate, index) => (
              <motion.tr
                key={certificate.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="hover:bg-gray-50/50 transition-colors duration-150"
              >
                <td className="table-cell-custom">
                  <input type="checkbox" className="form-checkbox rounded text-violet-600 focus:ring-violet-500" />
                </td>
                <td className="table-cell-custom table-cell-custom-light text-center">{index + 1}</td>
                <td className="table-cell-custom">
                  <div className="w-16 h-12 sm:w-24 sm:h-16 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                    {certificate.backgroundUrl ? (
                      <img 
                        src={certificate.backgroundUrl} 
                        alt={`ภาพพื้นหลัง ${certificate.name}`} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                    )}
                  </div>
                </td>
                <td className="table-cell-custom font-medium">
                  <div className="max-w-32 sm:max-w-xs truncate" title={certificate.name}>
                    {certificate.name}
                  </div>
                </td>
                <td className="table-cell-custom table-cell-custom-light hidden md:table-cell">
                  <div className="whitespace-normal break-words line-clamp-2 text-sm leading-relaxed" title={certificate.type}>
                    {certificate.type}
                  </div>
                </td>
                <td className="table-cell-custom table-cell-custom-light text-center">{certificate.eventDate}</td>
                <td className="table-cell-custom text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-blue-600 hover:text-blue-800 action-button w-8 h-8"
                    onClick={() => onFeatureClick('openForm', certificate.id, certificate.name)}
                    title="เปิดฟอร์มกรอกข้อมูล"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </td>
                <td className="table-cell-custom">
                  <div className="flex flex-col items-center space-y-1">
                    <div className="qr-code-bg p-1 sm:p-1.5 rounded-md inline-block">
                      <QrCode className="w-6 h-6 sm:w-8 sm:h-8 text-gray-700" />
                    </div>
                    <Button
                      variant="link"
                      size="sm"
                      className="text-xs text-violet-600 hover:text-violet-800 p-0 h-auto hidden sm:flex items-center"
                      onClick={() => onFeatureClick('downloadQr', certificate.name)}
                    >
                      <Download className="w-3 h-3 mr-1" /> ดาวน์โหลด
                    </Button>
                  </div>
                </td>
                <td className="table-cell-custom">
                  <div className="flex items-center justify-center space-x-0.5 sm:space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="icon-button icon-button-preview action-button w-7 h-7 sm:w-8 sm:h-8"
                      onClick={() => onPreview(certificate)}
                      title="ดูตัวอย่าง"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="icon-button icon-button-design action-button w-7 h-7 sm:w-8 sm:h-8"
                      onClick={() => onDesign(certificate)}
                      title="ออกแบบ"
                    >
                      <Palette className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="icon-button icon-button-edit action-button w-7 h-7 sm:w-8 sm:h-8"
                      onClick={() => onEdit(certificate)}
                      title="แก้ไข"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="icon-button icon-button-delete action-button w-7 h-7 sm:w-8 sm:h-8"
                        onClick={() => onDelete(certificate)}
                        title="ลบ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                  </div>
                </td>
                <td className="table-cell-custom text-center">
                  {getStatusBadge(certificate.status)}
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
};

export default CertificateTable;