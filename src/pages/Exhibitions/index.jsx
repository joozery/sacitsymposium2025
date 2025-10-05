import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Plus, Search, Image as ImageIcon, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ExhibitionForm from './ExhibitionForm';
import ExhibitionCard from './ExhibitionCard';
import useExhibitions from '@/hooks/useExhibitions';

const ExhibitionsPage = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExhibition, setEditingExhibition] = useState(null);
  const [deletingExhibition, setDeletingExhibition] = useState(null);

  // Use the custom hook for API integration
  const {
    exhibitions,
    loading,
    error,
    createExhibition,
    updateExhibition,
    deleteExhibition,
    refresh,
    clearError
  } = useExhibitions({
    onError: (err) => {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: err.message,
        variant: "destructive"
      });
    }
  });

  const handleFormSubmit = async (data) => {
    try {
      if (editingExhibition) {
        await updateExhibition(editingExhibition.id, data);
        toast({ title: "แก้ไขข้อมูลนิทรรศการสำเร็จ!" });
      } else {
        await createExhibition(data);
        toast({ title: "เพิ่มนิทรรศการใหม่สำเร็จ!" });
      }
      setIsFormOpen(false);
      setEditingExhibition(null);
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  const confirmDelete = async () => {
    if (deletingExhibition) {
      try {
        await deleteExhibition(deletingExhibition.id);
        toast({ title: "ลบนิทรรศการสำเร็จ!" });
        setDeletingExhibition(null);
      } catch (error) {
        toast({
          title: "เกิดข้อผิดพลาด",
          description: error.message,
          variant: "destructive"
        });
      }
    }
  };
  
  const filteredExhibitions = exhibitions.filter(e =>
    e.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Helmet><title>จัดการนิทรรศการ - ระบบจัดการ SACIT</title></Helmet>
      <div className="space-y-6 admin-panel" data-admin="true">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Live Exhibition (Demonstrative Area)</h1>
            <p className="text-gray-600 mt-1">จัดการข้อมูลนิทรรศการและพื้นที่สาธิตสำหรับงาน Symposium</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={refresh}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              รีเฟรช
            </Button>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button className="add-button-gradient" onClick={() => setEditingExhibition(null)}>
                  <Plus className="w-5 h-5 mr-2" />เพิ่มนิทรรศการ
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingExhibition ? 'แก้ไขข้อมูลนิทรรศการ' : 'เพิ่มนิทรรศการใหม่'}</DialogTitle>
                  <DialogDescription>กรอกข้อมูลนิทรรศการให้ครบถ้วน สามารถอัปโหลดรูปภาพหน้าปกและไฟล์ PDF ได้</DialogDescription>
                </DialogHeader>
                <ExhibitionForm exhibition={editingExhibition} onSubmit={handleFormSubmit} onCancel={() => setIsFormOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex justify-between items-center">
              <span>{error}</span>
              <Button variant="outline" size="sm" onClick={clearError}>
                ปิด
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-xl shadow-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input type="text" placeholder="ค้นหาชื่อนิทรรศการ หรือรายละเอียด..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-violet-600 mb-4" />
            <p className="text-gray-600">กำลังโหลดข้อมูลนิทรรศการ...</p>
          </div>
        )}

        {/* Exhibitions Grid */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredExhibitions.map(exhibition => (
                <ExhibitionCard 
                  key={exhibition.id} 
                  exhibition={exhibition} 
                  onEdit={() => { setEditingExhibition(exhibition); setIsFormOpen(true); }}
                  onDelete={() => setDeletingExhibition(exhibition)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredExhibitions.length === 0 && !error && (
          <div className="text-center py-12 text-gray-500 bg-white rounded-xl shadow-lg">
            <ImageIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-lg">
              {searchTerm ? 'ไม่พบนิทรรศการที่ค้นหา' : 'ไม่มีข้อมูลนิทรรศการ'}
            </p>
            <p className="text-sm mt-1">
              {searchTerm ? 'ลองค้นหาด้วยคำอื่น' : 'เพิ่มข้อมูลนิทรรศการแรกของคุณ!'}
            </p>
          </div>
        )}
      </div>

      <AlertDialog open={!!deletingExhibition} onOpenChange={(open) => !open && setDeletingExhibition(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการลบ</AlertDialogTitle>
            <AlertDialogDescription>คุณแน่ใจหรือไม่ว่าต้องการลบ "{deletingExhibition?.name}" ออกจากรายการนิทรรศการ?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingExhibition(null)}>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">ลบ</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ExhibitionsPage;