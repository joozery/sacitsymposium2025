import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CheckCircle, XCircle, AlertCircle, Star, User, Calendar, Tag, Award, FileText } from 'lucide-react';

const DetailItem = ({ icon: Icon, label, value, className = '' }) => (
  <div className="flex items-start">
    <Icon className={`w-4 h-4 text-gray-500 mt-1 mr-3 flex-shrink-0 ${className}`} />
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium text-gray-800">{value || '-'}</p>
    </div>
  </div>
);

const getStatusInfo = (status, decision) => {
    if (status === 'pending') {
      return { text: 'รอการประเมิน', icon: AlertCircle, color: 'text-yellow-600' };
    }
    if (status === 'reviewed') {
      if (decision === 'accepted') return { text: 'ตอบรับ', icon: CheckCircle, color: 'text-green-600' };
      if (decision === 'rejected') return { text: 'ปฏิเสธ', icon: XCircle, color: 'text-red-600' };
      if (decision === 'conditional_accept') return { text: 'ตอบรับแบบมีเงื่อนไข', icon: AlertCircle, color: 'text-blue-600' };
    }
    return { text: 'ตรวจสอบแล้ว (ไม่มีผลตัดสิน)', icon: CheckCircle, color: 'text-gray-600' };
};

const SubmissionDetailModal = ({ isOpen, onOpenChange, submission }) => {
  if (!submission) return null;

  const statusInfo = getStatusInfo(submission.status, submission.decision);
  const StatusIcon = statusInfo.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">{submission.title}</DialogTitle>
          <DialogDescription>
            รายละเอียดผลงานที่ส่งเข้าประกวด/นำเสนอ
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4 max-h-[70vh] overflow-y-auto pr-4">
          <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
            <h3 className="font-semibold text-lg mb-4 text-gray-700">ข้อมูลผลงาน</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <DetailItem icon={User} label="ผู้ส่งผลงาน" value={submission.author} />
              <DetailItem icon={Tag} label="ประเภทผลงาน" value={submission.type} />
              <DetailItem icon={Award} label="ชื่องาน" value={submission.eventName} />
              <DetailItem icon={Calendar} label="วันที่ส่ง" value={submission.submissionDate} />
            </div>
          </div>

          <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
            <h3 className="font-semibold text-lg mb-4 text-gray-700">ผลการประเมิน</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div className="flex items-start">
                <StatusIcon className={`w-4 h-4 ${statusInfo.color} mt-1 mr-3 flex-shrink-0`} />
                <div>
                  <p className="text-sm text-gray-500">สถานะ</p>
                  <p className={`font-bold ${statusInfo.color}`}>{statusInfo.text}</p>
                </div>
              </div>
              <DetailItem icon={Star} label="คะแนน" value={submission.score} />
              <DetailItem icon={User} label="ผู้ประเมิน" value={submission.reviewer} />
            </div>
            {submission.conditions && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 flex items-center"><FileText className="w-3 h-3 mr-2"/>เงื่อนไขการตอบรับ</p>
                <p className="font-medium text-blue-800 bg-blue-50 p-3 rounded-md mt-1 text-sm">{submission.conditions}</p>
              </div>
            )}
            {submission.comments && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 flex items-center"><FileText className="w-3 h-3 mr-2"/>ความคิดเห็นเพิ่มเติม</p>
                <p className="font-medium text-gray-800 bg-gray-100 p-3 rounded-md mt-1 text-sm">{submission.comments}</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubmissionDetailModal;