import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

const DayFormDialog = ({ isOpen, onOpenChange, day, onSubmit }) => {
  const [formData, setFormData] = useState({ title: '', date: '' });

  useEffect(() => {
    if (day) {
      setFormData({ title: day.title, date: day.date });
    } else {
      setFormData({ title: '', date: '' });
    }
  }, [day, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date) {
      // Basic validation
      return;
    }
    onSubmit(day ? { ...day, ...formData } : formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{day ? 'แก้ไขวัน' : 'เพิ่มวันใหม่'}</DialogTitle>
          <DialogDescription>
            {day ? 'แก้ไขชื่อและวันที่ของวันในกำหนดการ' : 'เพิ่มวันใหม่สำหรับกำหนดการใน Symposium นี้'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div>
            <Label htmlFor="title">ชื่อวัน (เช่น Day 1, Workshop Day)</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="date">วันที่ (เช่น Monday, August 8)</Label>
            <Input id="date" name="date" value={formData.date} onChange={handleChange} required />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>ยกเลิก</Button>
            <Button type="submit">{day ? 'บันทึกการแก้ไข' : 'เพิ่มวัน'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DayFormDialog;