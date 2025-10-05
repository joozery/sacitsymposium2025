import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const ContactSubmitterModal = ({ isOpen, onOpenChange, submission, onSubmit }) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSubject('');
      setMessage('');
    }
  }, [isOpen]);

  if (!submission) return null;

  const handleSubmit = () => {
    onSubmit({ subject, message });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ติดต่อ: {submission.author}</DialogTitle>
          <DialogDescription>
            ส่งข้อความถึงผู้ส่งผลงาน "{submission.title}"
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="recipient">ผู้รับ</Label>
            <Input id="recipient" value={submission.email} readOnly disabled className="mt-1" />
          </div>
          <div>
            <Label htmlFor="subject">หัวข้อ</Label>
            <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder={`เรื่อง: ผลการพิจารณาผลงาน "${submission.title}"`} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="message">ข้อความ</Label>
            <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder={`เรียน คุณ${submission.author}...`} className="min-h-[150px] mt-1" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>ยกเลิก</Button>
          <Button onClick={handleSubmit} className="bg-violet-600 hover:bg-violet-700">ส่งข้อความ</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContactSubmitterModal;