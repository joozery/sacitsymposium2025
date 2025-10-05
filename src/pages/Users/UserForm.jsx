import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogFooter, DialogClose } from "@/components/ui/dialog";

const UserForm = ({ user, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'เจ้าหน้าที่',
    status: 'active'
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'เจ้าหน้าที่',
        status: user.status || 'active'
      });
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'เจ้าหน้าที่',
        status: 'active'
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">ชื่อ-นามสกุล</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="email">อีเมล</Label>
        <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="role">ตำแหน่ง</Label>
        <Select name="role" value={formData.role} onValueChange={(value) => handleSelectChange('role', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ผู้ดูแลระบบ">ผู้ดูแลระบบ</SelectItem>
            <SelectItem value="เจ้าหน้าที่">เจ้าหน้าที่</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="status">สถานะ</Label>
        <Select name="status" value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
       {!user && (
          <div>
              <Label htmlFor="password">รหัสผ่าน</Label>
              <Input id="password" name="password" type="password" required />
              <p className="text-xs text-gray-500 mt-1">ระบบจะส่งรหัสผ่านให้ผู้ใช้ทางอีเมล (ฟังก์ชันตัวอย่าง)</p>
          </div>
      )}
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" onClick={onCancel}>ยกเลิก</Button>
        </DialogClose>
        <Button type="submit" className="bg-violet-600 hover:bg-violet-700 text-white">
          {user ? 'บันทึกการเปลี่ยนแปลง' : 'เพิ่มผู้ใช้งาน'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default UserForm;