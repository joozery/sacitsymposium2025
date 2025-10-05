import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Plus, Search, UploadCloud, BookOpen, Edit, Trash2, QrCode, Download, Eye, FileText, Filter, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import QRCode from 'qrcode.react';

const EBOOKS_STORAGE_KEY = 'ebooks_v1';

const initialEbooks = [
  { 
    id: 1, 
    title: 'นวัตกรรมผ้าไทยสู่สากล', 
    author: 'ดร. สมศรี มีชัย', 
    coverUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649414?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80', 
    pdfFile: null, 
    pdfUrl: '#', 
    status: 'published', 
    uploadDate: '2025-06-01',
    category: 'research',
    description: 'หนังสือที่รวบรวมความรู้และเทคนิคการพัฒนาผ้าไทยให้ทันสมัยและเข้าถึงตลาดสากล',
    views: 1250,
    downloads: 890
  },
  { 
    id: 2, 
    title: 'คู่มือการตลาดดิจิทัลสำหรับสินค้าหัตถกรรม', 
    author: 'คุณวิชัย พัฒนา', 
    coverUrl: 'https://images.unsplash.com/photo-1557862921-37829c790f19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80', 
    pdfFile: null, 
    pdfUrl: '#', 
    status: 'published', 
    uploadDate: '2025-05-20',
    category: 'guide',
    description: 'คู่มือฉบับสมบูรณ์สำหรับผู้ประกอบการหัตถกรรมที่ต้องการขยายตลาดผ่านช่องทางดิจิทัล',
    views: 980,
    downloads: 650
  },
  { 
    id: 3, 
    title: 'เทคนิคการถ่ายภาพผลิตภัณฑ์ (ฉบับร่าง)', 
    author: 'Admin', 
    coverUrl: 'https://images.unsplash.com/photo-1526656011313-441ed2b42e75?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80', 
    pdfFile: null, 
    pdfUrl: null, 
    status: 'draft', 
    uploadDate: '2025-06-10',
    category: 'tutorial',
    description: 'คู่มือเทคนิคการถ่ายภาพผลิตภัณฑ์หัตถกรรมให้สวยงามและน่าสนใจ',
    views: 450,
    downloads: 0
  },
  { 
    id: 4, 
    title: 'ประวัติศาสตร์ศิลปหัตถกรรมไทย', 
    author: 'ดร. วัฒนธรรม ไทยแท้', 
    coverUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80', 
    pdfFile: null, 
    pdfUrl: '#', 
    status: 'published', 
    uploadDate: '2025-05-15',
    category: 'history',
    description: 'หนังสือที่รวบรวมประวัติศาสตร์และวิวัฒนาการของศิลปหัตถกรรมไทยตั้งแต่สมัยโบราณจนถึงปัจจุบัน',
    views: 2100,
    downloads: 1500
  }
];

const categories = [
  { id: 'all', name: 'ทั้งหมด' },
  { id: 'research', name: 'งานวิจัย' },
  { id: 'guide', name: 'คู่มือ' },
  { id: 'tutorial', name: 'บทเรียน' },
  { id: 'history', name: 'ประวัติศาสตร์' },
  { id: 'creative', name: 'ผลงานสร้างสรรค์' }
];

const EbookForm = ({ ebook, onSubmit, onCancel }) => {
  // Add custom scrollbar styles
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .scrollbar-thin::-webkit-scrollbar {
        width: 6px;
      }
      .scrollbar-thin::-webkit-scrollbar-track {
        background: #f3e8ff;
        border-radius: 3px;
      }
      .scrollbar-thin::-webkit-scrollbar-thumb {
        background: #c4b5fd;
        border-radius: 3px;
      }
      .scrollbar-thin::-webkit-scrollbar-thumb:hover {
        background: #a78bfa;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  const [formData, setFormData] = useState({ title: '', author: '', description: '', category: 'research' });
  const [coverPreview, setCoverPreview] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfFileName, setPdfFileName] = useState('');

  useEffect(() => {
    if (ebook) {
      setFormData({ 
        title: ebook.title, 
        author: ebook.author, 
        description: ebook.description || '',
        category: ebook.category || 'research'
      });
      setCoverPreview(ebook.coverUrl);
      setPdfFileName(ebook.pdfUrl ? 'มีไฟล์ PDF อยู่แล้ว' : '');
    } else {
      setFormData({ title: '', author: '', description: '', category: 'research' });
      setCoverPreview(null);
      setPdfFile(null);
      setPdfFileName('');
    }
  }, [ebook]);

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setCoverPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPdfFile(file);
      setPdfFileName(file.name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ 
      ...formData, 
      coverUrl: coverPreview, 
      pdfFile, 
      pdfUrl: pdfFile ? URL.createObjectURL(pdfFile) : (ebook?.pdfUrl || '#') 
    });
  };

  return (
    <form onSubmit={handleSubmit} className="h-full flex flex-col">
      <div className="flex-1 space-y-6 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-violet-300 scrollbar-track-violet-100">
      <div>
        <Label htmlFor="cover">หน้าปก E-Book</Label>
        <div className="mt-1 flex justify-center items-center w-full h-40 rounded-md border-2 border-dashed border-gray-300 p-2">
          {coverPreview ? <img src={coverPreview} alt="Cover preview" className="h-full object-contain"/> : <UploadCloud className="w-10 h-10 text-gray-400" />}
        </div>
        <Input id="cover" type="file" accept="image/*" onChange={handleCoverChange} className="mt-2" />
      </div>
      <div>
        <Label htmlFor="pdf">ไฟล์ E-Book (PDF)</Label>
        <div className="mt-1 flex items-center space-x-2">
          <Input id="pdf" type="file" accept=".pdf" onChange={handlePdfChange} className="flex-grow"/>
        </div>
        {pdfFileName && <p className="text-sm text-gray-500 mt-1">ไฟล์ที่เลือก: {pdfFileName}</p>}
      </div>
      <div>
        <Label htmlFor="title">ชื่อเรื่อง</Label>
        <Input id="title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
      </div>
      <div>
        <Label htmlFor="author">ผู้แต่ง</Label>
        <Input id="author" value={formData.author} onChange={(e) => setFormData({...formData, author: e.target.value})} required />
      </div>
      <div>
        <Label htmlFor="category">หมวดหมู่</Label>
        <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
          <SelectTrigger>
            <SelectValue placeholder="เลือกหมวดหมู่" />
          </SelectTrigger>
          <SelectContent>
            {categories.filter(cat => cat.id !== 'all').map(category => (
              <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="description">คำอธิบาย</Label>
        <textarea 
          id="description" 
          value={formData.description} 
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          rows={3}
        />
      </div>
      </div>
      <DialogFooter className="mt-6 pt-4 border-t border-gray-200 flex-shrink-0">
        <DialogClose asChild><Button type="button" variant="outline" onClick={onCancel}>ยกเลิก</Button></DialogClose>
        <Button type="submit" className="bg-violet-600 hover:bg-violet-700 text-white">{ebook ? 'บันทึก' : 'อัปโหลด'}</Button>
      </DialogFooter>
    </form>
  );
};

const EbooksPage = () => {
  const { toast } = useToast();
  const [ebooks, setEbooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [editingEbook, setEditingEbook] = useState(null);
  const [deletingEbook, setDeletingEbook] = useState(null);
  const [qrEbook, setQrEbook] = useState(null);

  useEffect(() => {
    const savedEbooks = localStorage.getItem(EBOOKS_STORAGE_KEY);
    setEbooks(savedEbooks ? JSON.parse(savedEbooks) : initialEbooks);
  }, []);

  const saveEbooks = (updatedEbooks) => {
    setEbooks(updatedEbooks);
    localStorage.setItem(EBOOKS_STORAGE_KEY, JSON.stringify(updatedEbooks));
  };

  const handleFormSubmit = (data) => {
    if (editingEbook) {
      const updated = ebooks.map(e => e.id === editingEbook.id ? { ...e, ...data, uploadDate: e.uploadDate } : e);
      saveEbooks(updated);
      toast({ title: "แก้ไข E-Book สำเร็จ!" });
    } else {
      const newEbook = { 
        ...data, 
        id: Date.now(), 
        status: 'published', 
        uploadDate: new Date().toISOString().slice(0,10),
        views: 0,
        downloads: 0
      };
      saveEbooks([...ebooks, newEbook]);
      toast({ title: "อัปโหลด E-Book ใหม่สำเร็จ!" });
    }
    setIsFormOpen(false);
    setEditingEbook(null);
  };
  
  const confirmDelete = () => {
    if(deletingEbook) {
      saveEbooks(ebooks.filter(e => e.id !== deletingEbook.id));
      toast({ title: "ลบ E-Book สำเร็จ!", variant: "destructive" });
      setDeletingEbook(null);
    }
  };

  const downloadQRCode = () => {
    if (!qrEbook) return;
    const canvas = document.getElementById(`qr-code-${qrEbook.id}`);
    const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${qrEbook.title}-qrcode.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    toast({ title: "ดาวน์โหลด QR Code สำเร็จ!" });
  };
  
  const filteredEbooks = ebooks.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         e.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (e.description && e.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = activeCategory === 'all' || e.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Helmet><title>จัดการ E-Book - SACIT</title></Helmet>
      <div className="space-y-6 admin-panel" data-admin="true">
        {/* Header Section */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">E-Book</h1>
            <p className="text-gray-600 mt-1">จัดการผลงาน E-Book และเอกสารดิจิทัล</p>
          </div>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen} modal={false}>
            <DialogTrigger asChild>
              <Button className="add-button-gradient" onClick={() => setEditingEbook(null)}>
                <Plus className="w-5 h-5 mr-2" />เพิ่ม E-Book
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col border-2 border-violet-200 bg-white shadow-2xl p-6">
              <DialogHeader className="flex-shrink-0">
                <DialogTitle>{editingEbook ? 'แก้ไข E-Book' : 'เพิ่ม E-Book ใหม่'}</DialogTitle>
                <DialogDescription>กรอกข้อมูลและอัปโหลดไฟล์ให้ครบถ้วน</DialogDescription>
              </DialogHeader>
              <div className="flex-1 overflow-hidden">
                <EbookForm ebook={editingEbook} onSubmit={handleFormSubmit} onCancel={() => setIsFormOpen(false)} />
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                type="text" 
                placeholder="ค้นหาชื่อเรื่อง, ผู้แต่ง, หรือคำอธิบาย..." 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
                className="pl-10" 
              />
            </div>
            <div className="flex gap-2">
              <Select value={activeCategory} onValueChange={setActiveCategory}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="หมวดหมู่" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex border rounded-md">
                <Button 
                  variant={viewMode === 'grid' ? 'default' : 'ghost'} 
                  size="icon" 
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button 
                  variant={viewMode === 'list' ? 'default' : 'ghost'} 
                  size="icon" 
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* E-Books Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredEbooks.map((ebook, index) => (
                <motion.div 
                  key={ebook.id} 
                  layout 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 flex flex-col"
                >
                  <div className="relative w-full h-56 bg-gray-200">
                    <img src={ebook.coverUrl} alt={ebook.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs border border-white/60 text-white px-2 py-1 rounded-full">
                          {categories.find(cat => cat.id === ebook.category)?.name}
                        </span>
                        {ebook.status === 'draft' && (
                          <span className="text-xs bg-yellow-500 text-white px-2 py-1 rounded-full">ฉบับร่าง</span>
                        )}
                      </div>
                      <h3 className="font-bold text-lg text-white leading-tight line-clamp-2">{ebook.title}</h3>
                      <p className="text-sm text-gray-200">{ebook.author}</p>
                    </div>
                  </div>
                  <div className="p-4 flex-grow flex flex-col justify-between">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 line-clamp-2">{ebook.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>อัปโหลด: {ebook.uploadDate}</span>
                        <div className="flex items-center gap-4">
                          <span>👁️ {ebook.views}</span>
                          <span>📥 {ebook.downloads}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-end space-x-1 mt-3">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast({description: '🚧 ฟีเจอร์ยังไม่พร้อมใช้งาน'})} title="ดูตัวอย่าง">
                        <Eye className="w-4 h-4 text-gray-500 hover:text-blue-600" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setQrEbook(ebook); setIsQrModalOpen(true); }} title="แสดง QR Code">
                        <QrCode className="w-4 h-4 text-gray-500 hover:text-green-600" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingEbook(ebook); setIsFormOpen(true); }} title="แก้ไข">
                        <Edit className="w-4 h-4 text-gray-500 hover:text-violet-600" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDeletingEbook(ebook)} title="ลบ">
                        <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-600" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {filteredEbooks.map((ebook, index) => (
                <motion.div 
                  key={ebook.id} 
                  layout 
                  initial={{ opacity: 0, x: -20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex gap-6">
                    <img src={ebook.coverUrl} alt={ebook.title} className="w-24 h-32 object-cover rounded-lg flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs border border-violet-200 text-violet-600 px-2 py-1 rounded-full">
                              {categories.find(cat => cat.id === ebook.category)?.name}
                            </span>
                            {ebook.status === 'draft' && (
                              <span className="text-xs bg-yellow-500 text-white px-2 py-1 rounded-full">ฉบับร่าง</span>
                            )}
                          </div>
                          <h3 className="text-xl font-bold text-gray-800 mb-1">{ebook.title}</h3>
                          <p className="text-gray-600 mb-2">โดย {ebook.author}</p>
                          <p className="text-gray-600 text-sm mb-3">{ebook.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>อัปโหลด: {ebook.uploadDate}</span>
                            <span>👁️ {ebook.views} ครั้ง</span>
                            <span>📥 {ebook.downloads} ครั้ง</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast({description: '🚧 ฟีเจอร์ยังไม่พร้อมใช้งาน'})} title="ดูตัวอย่าง">
                            <Eye className="w-4 h-4 text-gray-500 hover:text-blue-600" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setQrEbook(ebook); setIsQrModalOpen(true); }} title="แสดง QR Code">
                            <QrCode className="w-4 h-4 text-gray-500 hover:text-green-600" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingEbook(ebook); setIsFormOpen(true); }} title="แก้ไข">
                            <Edit className="w-4 h-4 text-gray-500 hover:text-violet-600" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDeletingEbook(ebook)} title="ลบ">
                            <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-600" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Empty State */}
        {filteredEbooks.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="col-span-full text-center py-12 text-gray-500 bg-white rounded-xl shadow-lg"
          >
            <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-lg">ไม่พบ E-Book</p>
            <p className="text-sm mt-1">ลองเพิ่ม E-Book แรกของคุณได้เลย!</p>
          </motion.div>
        )}
      </div>

      {/* QR Code Modal */}
      <Dialog open={isQrModalOpen} onOpenChange={setIsQrModalOpen}>
        <DialogContent className="sm:max-w-xs">
          <DialogHeader>
            <DialogTitle>QR Code สำหรับ "{qrEbook?.title}"</DialogTitle>
            <DialogDescription>สแกนเพื่ออ่าน E-Book</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-4">
            <QRCode id={`qr-code-${qrEbook?.id}`} value={qrEbook?.pdfUrl || window.location.href} size={200} level="H" />
            <Button onClick={downloadQRCode} className="mt-4 w-full">
              <Download className="w-4 h-4 mr-2" />
              ดาวน์โหลด QR Code
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingEbook} onOpenChange={(open) => !open && setDeletingEbook(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการลบ</AlertDialogTitle>
            <AlertDialogDescription>คุณแน่ใจหรือไม่ว่าต้องการลบ "{deletingEbook?.title}"?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingEbook(null)}>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">ลบ</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EbooksPage;