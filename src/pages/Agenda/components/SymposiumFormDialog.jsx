import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from '@/components/ui/use-toast';

const SymposiumFormDialog = ({ isOpen, onOpenChange, onSubmit, symposium }) => {
  const [name, setName] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (symposium) {
      setName(symposium.name);
    } else {
      setName('');
    }
  }, [symposium, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast({ title: "ชื่อ Symposium ว่างเปล่า", description: "กรุณากรอกชื่อสำหรับ Symposium", variant: "destructive" });
      return;
    }
    onSubmit(symposium ? { ...symposium, name } : { name });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{symposium ? 'แก้ไข Symposium' : 'สร้าง Symposium ใหม่'}</DialogTitle>
          <DialogDescription>
            {symposium ? 'แก้ไขชื่อของ Symposium นี้' : 'ตั้งชื่อสำหรับงาน Symposium ใหม่ของคุณ'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="pt-4">
          <div className="space-y-2">
            <Label htmlFor="symposium-name">ชื่อ Symposium</Label>
            <Input id="symposium-name" value={name} onChange={e => setName(e.target.value)} placeholder="เช่น SACIT Symposium 2025" />
          </div>
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>ยกเลิก</Button>
            <Button type="submit">{symposium ? 'บันทึกการแก้ไข' : 'สร้าง'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SymposiumFormDialog;