
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogFooter, DialogClose } from "@/components/ui/dialog";

const AgendaForm = ({ item, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    time: '',
    title: '',
    speaker: '',
    type: 'talk',
  });

  useEffect(() => {
    if (item) {
      setFormData(item);
    } else {
      setFormData({ time: '', title: '', speaker: '', type: 'talk' });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, type: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="time">เวลา (เช่น 09:00 - 10:00)</Label>
        <Input id="time" name="time" value={formData.time} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="title">หัวข้อ / กิจกรรม</Label>
        <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="speaker">ผู้บรรยาย (ถ้ามี)</Label>
        <Input id="speaker" name="speaker" value={formData.speaker} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="type">ประเภท</Label>
        <select 
          name="type" 
          value={formData.type} 
          onChange={(e) => handleSelectChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="talk">การบรรยาย/เสวนา</option>
          <option value="break">พัก</option>
          <option value="other">อื่นๆ</option>
        </select>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" onClick={onCancel}>ยกเลิก</Button>
        </DialogClose>
        <Button type="submit" className="bg-violet-600 hover:bg-violet-700 text-white">
          {item ? 'บันทึก' : 'เพิ่มรายการ'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default AgendaForm;
