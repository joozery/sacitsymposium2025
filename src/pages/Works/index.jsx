import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Plus, Search, Palette, User, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import WorkForm from './WorkForm';
import WorkCard from './WorkCard';
import useWorks from '@/hooks/useWorks';

const WorksPage = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingWork, setEditingWork] = useState(null);
  const [deletingWork, setDeletingWork] = useState(null);

  // Use the custom hook for API integration
  const {
    works,
    loading,
    error,
    createWork,
    updateWork,
    deleteWork,
    fetchWorks,
    clearError
  } = useWorks({
    autoLoad: true,
    initialStatus: 'active'
  });

  // Debug: Log works data
  console.log('🔍 Works Data:', {
    works,
    loading,
    error,
    worksLength: works?.length
  });

  const handleFormSubmit = async (data) => {
    try {
      if (editingWork) {
        await updateWork(editingWork.id, data);
        toast({ title: "แก้ไขข้อมูลผลงานสร้างสรรค์สำเร็จ!" });
      } else {
        await createWork(data);
        toast({ title: "เพิ่มผลงานสร้างสรรค์ใหม่สำเร็จ!" });
      }
      setIsFormOpen(false);
      setEditingWork(null);
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  const confirmDelete = async () => {
    if (deletingWork) {
      try {
        await deleteWork(deletingWork.id);
        toast({ title: "ลบผลงานสร้างสรรค์สำเร็จ!" });
        setDeletingWork(null);
      } catch (error) {
        toast({
          title: "เกิดข้อผิดพลาด",
          description: error.message,
          variant: "destructive"
        });
      }
    }
  };
  
  const filteredWorks = works.filter(w =>
    w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.owner_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (w.category && w.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <>
      <Helmet><title>จัดการผลงานสร้างสรรค์ - ระบบจัดการ SACIT</title></Helmet>
      <div className="space-y-6 admin-panel" data-admin="true">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">ผลงานสร้างสรรค์ (Creative Works)</h1>
            <p className="text-gray-600 mt-1">จัดการข้อมูลผลงานสร้างสรรค์และพื้นที่สาธิตสำหรับงาน Symposium</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={fetchWorks}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              รีเฟรช
            </Button>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button className="add-button-gradient" onClick={() => setEditingWork(null)}>
                  <Plus className="w-5 h-5 mr-2" />เพิ่มผลงาน
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingWork ? 'แก้ไขข้อมูลผลงานสร้างสรรค์' : 'เพิ่มผลงานสร้างสรรค์ใหม่'}</DialogTitle>
                  <DialogDescription>กรอกข้อมูลผลงานสร้างสรรค์ให้ครบถ้วน สามารถอัปโหลดรูปภาพและไฟล์ PDF ได้</DialogDescription>
                </DialogHeader>
                <WorkForm work={editingWork} onSubmit={handleFormSubmit} onCancel={() => setIsFormOpen(false)} />
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
              <Button variant="outline" size="sm" onClick={() => clearError && clearError()}>
                ปิด
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-xl shadow-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              type="text" 
              placeholder="ค้นหาชื่อผลงาน, เจ้าของ, หรือหมวดหมู่..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
              className="pl-10" 
            />
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-violet-600 mb-4" />
            <p className="text-gray-600">กำลังโหลดข้อมูลผลงานสร้างสรรค์...</p>
          </div>
        )}

        {/* Works Grid */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredWorks.map(work => (
                <WorkCard 
                  key={work.id} 
                  work={work} 
                  onEdit={() => { setEditingWork(work); setIsFormOpen(true); }}
                  onDelete={() => setDeletingWork(work)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredWorks.length === 0 && !error && (
          <div className="text-center py-12 text-gray-500 bg-white rounded-xl shadow-lg">
            <Palette className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-lg">
              {searchTerm ? 'ไม่พบผลงานที่ค้นหา' : 'ไม่มีข้อมูลผลงานสร้างสรรค์'}
            </p>
            <p className="text-sm mt-1">
              {searchTerm ? 'ลองค้นหาด้วยคำอื่น' : 'เพิ่มข้อมูลผลงานสร้างสรรค์แรกของคุณ!'}
            </p>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deletingWork} onOpenChange={() => setDeletingWork(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>ยืนยันการลบ</AlertDialogTitle>
              <AlertDialogDescription>
                คุณต้องการลบผลงาน "{deletingWork?.name}" หรือไม่? 
                การดำเนินการนี้ไม่สามารถยกเลิกได้
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                ลบ
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
};

export default WorksPage; 