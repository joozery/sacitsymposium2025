
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Plus, Search, Mic, User, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import SpeakerForm from './SpeakerForm';
import SpeakerCard from './SpeakerCard';
import useSpeakers from '@/hooks/useSpeakers';

const SpeakersPage = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSpeaker, setEditingSpeaker] = useState(null);
  const [deletingSpeaker, setDeletingSpeaker] = useState(null);

  // Use the custom hook for API integration
  const {
    speakers,
    loading,
    error,
    createSpeaker,
    updateSpeaker,
    deleteSpeaker,
    refresh,
    clearError
  } = useSpeakers({
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
      if (editingSpeaker) {
        await updateSpeaker(editingSpeaker.id, data);
        toast({ title: "แก้ไขข้อมูลผู้บรรยายสำเร็จ!" });
      } else {
        await createSpeaker(data);
        toast({ title: "เพิ่มผู้บรรยายใหม่สำเร็จ!" });
      }
      setIsFormOpen(false);
      setEditingSpeaker(null);
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  const confirmDelete = async () => {
    if (deletingSpeaker) {
      try {
        await deleteSpeaker(deletingSpeaker.id);
        toast({ title: "ลบผู้บรรยายสำเร็จ!" });
        setDeletingSpeaker(null);
      } catch (error) {
        toast({
          title: "เกิดข้อผิดพลาด",
          description: error.message,
          variant: "destructive"
        });
      }
    }
  };
  
  const filteredSpeakers = (speakers || []).filter((s) => {
    const candidateName = (s && (s.name ?? s.fullName ?? s.fullname ?? s.title ?? ''));
    const name = typeof candidateName === 'string' ? candidateName : String(candidateName || '');
    return name.toLowerCase().includes((searchTerm || '').toLowerCase());
  });

  return (
    <>
      <Helmet><title>จัดการผู้บรรยาย - ระบบจัดการ SACIT</title></Helmet>
      <div className="space-y-6 admin-panel" data-admin="true">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">ผู้บรรยาย</h1>
            <p className="text-gray-600 mt-1">จัดการข้อมูลผู้บรรยายสำหรับงาน Symposium</p>
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
                <Button className="add-button-gradient" onClick={() => setEditingSpeaker(null)}>
                  <Plus className="w-5 h-5 mr-2" />เพิ่มผู้บรรยาย
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingSpeaker ? 'แก้ไขข้อมูลผู้บรรยาย' : 'เพิ่มผู้บรรยายใหม่'}</DialogTitle>
                  <DialogDescription>กรอกข้อมูลผู้บรรยายให้ครบถ้วน</DialogDescription>
                </DialogHeader>
                <SpeakerForm speaker={editingSpeaker} onSubmit={handleFormSubmit} onCancel={() => setIsFormOpen(false)} />
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
            <Input type="text" placeholder="ค้นหาชื่อผู้บรรยาย..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-violet-600 mb-4" />
            <p className="text-gray-600">กำลังโหลดข้อมูลผู้บรรยาย...</p>
          </div>
        )}

        {/* Speakers Grid */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredSpeakers.map(speaker => (
                <SpeakerCard 
                  key={speaker.id} 
                  speaker={speaker} 
                  onEdit={() => { setEditingSpeaker(speaker); setIsFormOpen(true); }}
                  onDelete={() => setDeletingSpeaker(speaker)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredSpeakers.length === 0 && !error && (
          <div className="text-center py-12 text-gray-500 bg-white rounded-xl shadow-lg">
            <Mic className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-lg">
              {searchTerm ? 'ไม่พบผู้บรรยายที่ค้นหา' : 'ไม่มีข้อมูลผู้บรรยาย'}
            </p>
            <p className="text-sm mt-1">
              {searchTerm ? 'ลองค้นหาด้วยคำอื่น' : 'เพิ่มข้อมูลผู้บรรยายคนแรกของคุณ!'}
            </p>
          </div>
        )}
      </div>

      <AlertDialog open={!!deletingSpeaker} onOpenChange={(open) => !open && setDeletingSpeaker(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการลบ</AlertDialogTitle>
            <AlertDialogDescription>คุณแน่ใจหรือไม่ว่าต้องการลบ "{deletingSpeaker?.name}" ออกจากรายชื่อผู้บรรยาย?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingSpeaker(null)}>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">ลบ</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SpeakersPage;
