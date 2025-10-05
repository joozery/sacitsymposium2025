import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Search, Filter, CheckCircle, XCircle, AlertCircle, Edit, Eye, FileText, Users, CalendarDays, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useToast } from '@/components/ui/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SubmissionDetailModal from './components/SubmissionDetailModal';
import ContactSubmitterModal from './components/ContactSubmitterModal';

const initialSubmissions = [
  { id: 1, title: 'การพัฒนาระบบ AI ตรวจจับความผิดปกติในโรงงาน', author: 'สมชาย ใจดี', email: 'somchai.j@example.com', type: 'ผลงานวิชาการ', submissionDate: '2025-05-10', status: 'pending', score: null, reviewer: 'อ.ดร.วิชัย ประเสริฐ', eventName: 'SACIT Conference 2025' },
  { id: 2, title: 'นวัตกรรมผ้าทอพื้นเมืองประยุกต์', author: 'สมหญิง รักไทย', email: 'somying.r@example.com', type: 'ผลงานสร้างสรรค์', submissionDate: '2025-05-12', status: 'reviewed', decision: 'accepted', score: 85, reviewer: 'คุณมานี มีศิลป์', eventName: 'SACIT Creative Awards' },
  { id: 3, title: 'ผลกระทบของโซเชียลมีเดียต่อเยาวชน', author: 'จอห์น โด', email: 'john.d@example.com', type: 'ผลงานวิชาการ', submissionDate: '2025-05-15', status: 'pending', score: null, reviewer: 'อ.ดร.สมศักดิ์ เก่งมาก', eventName: 'SACIT Conference 2025' },
  { id: 4, title: 'ประติมากรรมจากวัสดุรีไซเคิล', author: 'เจน สมิธ', email: 'jane.s@example.com', type: 'ผลงานสร้างสรรค์', submissionDate: '2025-05-18', status: 'reviewed', decision: 'rejected', score: 60, reviewer: 'คุณวิจิตร งามตา', eventName: 'SACIT Creative Awards' },
  { id: 5, title: 'การศึกษาเปรียบเทียบอัลกอริทึม Machine Learning', author: 'ปีเตอร์ ปาร์คเกอร์', email: 'peter.p@example.com', type: 'ผลงานวิชาการ', submissionDate: '2025-05-20', status: 'reviewed', decision: 'conditional_accept', score: 78, reviewer: 'อ.ดร.วิชัย ประเสริฐ', eventName: 'SACIT Conference 2025', conditions: 'โปรดแก้ไขบทคัดย่อและเพิ่มการอ้างอิงที่เกี่ยวข้องภายใน 7 วัน' },
];

const SUBMISSIONS_STORAGE_KEY = 'submissions_review_v1';

const SubmissionsReviewPage = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [decisionData, setDecisionData] = useState({ decision: '', score: '', comments: '', conditions: '' });

  useEffect(() => {
    const savedSubmissions = localStorage.getItem(SUBMISSIONS_STORAGE_KEY);
    if (savedSubmissions) {
      setSubmissions(JSON.parse(savedSubmissions));
    } else {
      setSubmissions(initialSubmissions);
      localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(initialSubmissions));
    }
  }, []);

  const saveSubmissions = (updatedSubmissions) => {
    setSubmissions(updatedSubmissions);
    localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(updatedSubmissions));
  };

  const handleOpenDecisionModal = (submission) => {
    setSelectedSubmission(submission);
    setDecisionData({ 
      decision: submission.decision || '', 
      score: submission.score || '', 
      comments: submission.comments || '',
      conditions: submission.conditions || ''
    });
    setIsDecisionModalOpen(true);
  };

  const handleDecisionSubmit = () => {
    if (!selectedSubmission || !decisionData.decision) {
      toast({ title: "ข้อมูลไม่ครบถ้วน", description: "กรุณาเลือกผลการตัดสิน", variant: "destructive" });
      return;
    }
    const updatedSubmissions = submissions.map(sub => 
      sub.id === selectedSubmission.id 
        ? { ...sub, ...decisionData, status: 'reviewed' } 
        : sub
    );
    saveSubmissions(updatedSubmissions);
    toast({ title: "บันทึกผลการตัดสินสำเร็จ", description: `ผลงาน "${selectedSubmission.title}" ได้รับการประเมินแล้ว` });
    setIsDecisionModalOpen(false);
    setSelectedSubmission(null);
  };

  const handleViewDetails = (submission) => {
    setSelectedSubmission(submission);
    setIsDetailModalOpen(true);
  };

  const handleDownloadFile = (submission) => {
    toast({
      title: "🚀 เริ่มดาวน์โหลดไฟล์",
      description: `กำลังดาวน์โหลดไฟล์สำหรับผลงาน "${submission.title}"`,
    });
  };

  const handleContactSubmitter = (submission) => {
    setSelectedSubmission(submission);
    setIsContactModalOpen(true);
  };

  const handleContactSubmit = () => {
    setIsContactModalOpen(false);
    toast({ title: "ส่งข้อความสำเร็จ!", description: `ข้อความของคุณถูกส่งไปยัง ${selectedSubmission?.author} แล้ว` });
  };

  const handleFeatureClick = (feature) => {
    toast({
      title: `🚧 ฟีเจอร์ "${feature}" ยังไม่ได้พัฒนา`,
      description: "แต่ไม่ต้องกังวล! ฟังชั้นจะใช้งานได้ในเร็วๆนี้  🚀",
    });
  };

  const filteredSubmissions = submissions.filter(sub => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch = sub.title.toLowerCase().includes(searchTermLower) ||
                         sub.author.toLowerCase().includes(searchTermLower) ||
                         sub.eventName.toLowerCase().includes(searchTermLower);
    const matchesTab = activeTab === 'all' || sub.type === activeTab;
    const matchesStatus = filterStatus === 'all' || 
                          (filterStatus === 'pending' && sub.status === 'pending') ||
                          (filterStatus === 'reviewed' && sub.status === 'reviewed');
    return matchesSearch && matchesTab && matchesStatus;
  });

  const tabs = [
    { id: 'all', label: 'ทั้งหมด' },
    { id: 'ผลงานวิชาการ', label: 'ผลงานวิชาการ' },
    { id: 'ผลงานสร้างสรรค์', label: 'ผลงานสร้างสรรค์' },
  ];

  const statusFilters = [
    { id: 'all', label: 'ทุกสถานะ' },
    { id: 'pending', label: 'รอการประเมิน' },
    { id: 'reviewed', label: 'ตรวจสอบแล้ว' },
  ];

  const getStatusBadge = (status, decision) => {
    if (status === 'pending') {
      return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><AlertCircle className="w-3 h-3 mr-1.5"/>รอการประเมิน</span>;
    }
    if (status === 'reviewed') {
      if (decision === 'accepted') return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1.5"/>ตอบรับ</span>;
      if (decision === 'rejected') return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1.5"/>ปฏิเสธ</span>;
      if (decision === 'conditional_accept') return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><AlertCircle className="w-3 h-3 mr-1.5"/>ตอบรับแบบมีเงื่อนไข</span>;
      return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">ตรวจสอบแล้ว</span>;
    }
    return null;
  };

  return (
    <>
      <Helmet>
        <title>ตรวจสอบผลงาน - ระบบจัดการ SACIT</title>
        <meta name="description" content="ประเมินและตัดสินผลงานวิชาการและผลงานสร้างสรรค์" />
      </Helmet>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-800">ตรวจสอบผลงาน</h1>
            <p className="text-gray-600 mt-1">ประเมินและตัดสินผลงานวิชาการและผลงานสร้างสรรค์</p>
          </div>
          <Button 
            className="add-button-gradient w-full sm:w-auto"
            onClick={() => handleFeatureClick('ประกาศผล')}
          >
            ประกาศผลการตัดสิน
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white p-4 sm:p-6 rounded-xl shadow-lg"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="ค้นหาชื่อผลงาน, ผู้ส่ง, ชื่องาน..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 w-full bg-gray-50 border-gray-300 focus:border-violet-500 text-sm"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full bg-gray-50 border-gray-300 text-sm">
                <SelectValue placeholder="ตัวกรองสถานะ" />
              </SelectTrigger>
              <SelectContent>
                {statusFilters.map(status => (
                  <SelectItem key={status.id} value={status.id}>{status.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mt-4 border-b border-gray-200">
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
                  {tab.label} ({tab.id === 'all' ? submissions.length : submissions.filter(s => s.type === tab.id).length})
                </button>
              ))}
            </nav>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr>
                  <th className="table-header-custom w-10"><input type="checkbox" className="form-checkbox rounded text-violet-600 focus:ring-violet-500" /></th>
                  <th className="table-header-custom">ชื่อผลงาน</th>
                  <th className="table-header-custom">ผู้ส่งผลงาน</th>
                  <th className="table-header-custom">ประเภท</th>
                  <th className="table-header-custom">วันที่ส่ง</th>
                  <th className="table-header-custom">สถานะ</th>
                  <th className="table-header-custom">ผู้ประเมิน</th>
                  <th className="table-header-custom text-center">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredSubmissions.map((sub) => (
                  <motion.tr 
                    key={sub.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="table-cell-custom"><input type="checkbox" className="form-checkbox rounded text-violet-600 focus:ring-violet-500" /></td>
                    <td className="table-cell-custom font-medium text-gray-800">
                      <div className="max-w-xs truncate" title={sub.title}>{sub.title}</div>
                      <div className="text-xs text-gray-500 flex items-center mt-0.5">
                        <CalendarDays className="w-3 h-3 mr-1 text-gray-400"/> {sub.eventName}
                      </div>
                    </td>
                    <td className="table-cell-custom">{sub.author}</td>
                    <td className="table-cell-custom">{sub.type}</td>
                    <td className="table-cell-custom">{sub.submissionDate}</td>
                    <td className="table-cell-custom">{getStatusBadge(sub.status, sub.decision)}</td>
                    <td className="table-cell-custom">{sub.reviewer || '-'}</td>
                    <td className="table-cell-custom text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-violet-600 hover:text-violet-800 data-[state=open]:bg-violet-50">
                            ประเมินผล
                            <ChevronDown className="w-4 h-4 ml-1" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleOpenDecisionModal(sub)}>
                            <Edit className="w-4 h-4 mr-2 text-blue-500"/>ตัดสินผลงาน
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleViewDetails(sub)}>
                            <Eye className="w-4 h-4 mr-2 text-gray-500"/>ดูรายละเอียด
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownloadFile(sub)}>
                            <FileText className="w-4 h-4 mr-2 text-green-500"/>ดาวน์โหลดไฟล์
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleContactSubmitter(sub)}>
                            <Users className="w-4 h-4 mr-2 text-purple-500"/>ติดต่อผู้ส่ง
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredSubmissions.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-lg">ไม่พบผลงานที่ตรงกับเงื่อนไข</p>
              <p className="text-sm">ลองปรับคำค้นหาหรือตัวกรองของคุณ</p>
            </div>
          )}
           <div className="px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-sm text-gray-600 text-center sm:text-left">
              แสดง {filteredSubmissions.length} จาก {submissions.length} รายการ
            </p>
            <div className="flex items-center justify-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => handleFeatureClick('pagination')}>ก่อนหน้า</Button>
              <Button variant="outline" size="sm" onClick={() => handleFeatureClick('pagination')}>ถัดไป</Button>
            </div>
          </div>
        </motion.div>

        <AlertDialog open={isDecisionModalOpen} onOpenChange={setIsDecisionModalOpen}>
          <AlertDialogContent className="sm:max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle>ตัดสินผลงาน: {selectedSubmission?.title}</AlertDialogTitle>
              <AlertDialogDescription>
                กรอกผลการประเมินและให้คะแนน (ถ้ามี)
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-4 py-2 max-h-[60vh] overflow-y-auto pr-2">
              <div>
                <Label htmlFor="decision" className="text-gray-700 font-medium">ผลการตัดสิน</Label>
                <Select 
                  value={decisionData.decision} 
                  onValueChange={(value) => setDecisionData(prev => ({...prev, decision: value}))}
                >
                  <SelectTrigger id="decision" className="w-full mt-1">
                    <SelectValue placeholder="เลือกผลการตัดสิน" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="accepted">ตอบรับ (Accepted)</SelectItem>
                    <SelectItem value="conditional_accept">ตอบรับแบบมีเงื่อนไข (Conditional Accept)</SelectItem>
                    <SelectItem value="rejected">ปฏิเสธ (Rejected)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {decisionData.decision === 'conditional_accept' && (
                <div>
                  <Label htmlFor="conditions" className="text-gray-700 font-medium">เงื่อนไขการตอบรับ</Label>
                  <Textarea 
                    id="conditions" 
                    placeholder="ระบุเงื่อนไขที่ผู้ส่งผลงานต้องแก้ไข..." 
                    value={decisionData.conditions}
                    onChange={(e) => setDecisionData(prev => ({...prev, conditions: e.target.value}))}
                    className="mt-1 min-h-[80px]"
                  />
                </div>
              )}
              <div>
                <Label htmlFor="score" className="text-gray-700 font-medium">คะแนน (ถ้ามี)</Label>
                <Input 
                  id="score" 
                  type="number" 
                  placeholder="0-100" 
                  value={decisionData.score}
                  onChange={(e) => setDecisionData(prev => ({...prev, score: e.target.value}))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="comments" className="text-gray-700 font-medium">ความคิดเห็นเพิ่มเติมถึงผู้ส่งผลงาน</Label>
                <Textarea 
                  id="comments" 
                  placeholder="ข้อเสนอแนะหรือความคิดเห็น..." 
                  value={decisionData.comments}
                  onChange={(e) => setDecisionData(prev => ({...prev, comments: e.target.value}))}
                  className="mt-1 min-h-[100px]"
                />
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsDecisionModalOpen(false)}>ยกเลิก</AlertDialogCancel>
              <AlertDialogAction onClick={handleDecisionSubmit} className="bg-violet-600 hover:bg-violet-700">บันทึกผล</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <SubmissionDetailModal 
          isOpen={isDetailModalOpen}
          onOpenChange={setIsDetailModalOpen}
          submission={selectedSubmission}
        />
        <ContactSubmitterModal
          isOpen={isContactModalOpen}
          onOpenChange={setIsContactModalOpen}
          submission={selectedSubmission}
          onSubmit={handleContactSubmit}
        />

      </div>
    </>
  );
};

export default SubmissionsReviewPage;