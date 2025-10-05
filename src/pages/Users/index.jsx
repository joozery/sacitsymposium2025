import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Plus, Search, Edit, Trash2, MoreVertical, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import UserForm from './UserForm';

const USERS_STORAGE_KEY = 'users_v1';

const initialUsers = [
  { id: 1, name: 'Admin User', email: 'admin@sacit.or.th', role: 'ผู้ดูแลระบบ', status: 'active', lastLogin: '2025-06-20 10:30' },
  { id: 2, name: 'สมชาย ใจดี', email: 'somchai.j@example.com', role: 'เจ้าหน้าที่', status: 'active', lastLogin: '2025-06-19 15:00' },
  { id: 3, name: 'สมหญิง รักไทย', email: 'somying.r@example.com', role: 'เจ้าหน้าที่', status: 'inactive', lastLogin: '2025-05-10 09:00' },
];

const UsersPage = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);

  useEffect(() => {
    const savedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    setUsers(savedUsers ? JSON.parse(savedUsers) : initialUsers);
  }, []);

  const saveUsers = (updatedUsers) => {
    setUsers(updatedUsers);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
  };
  
  const handleFormSubmit = (data) => {
    if (editingUser) {
      const updated = users.map(u => u.id === editingUser.id ? { ...u, ...data } : u);
      saveUsers(updated);
      toast({ title: "แก้ไขผู้ใช้สำเร็จ!" });
    } else {
      const newUser = { ...data, id: Date.now(), status: 'active', lastLogin: 'ยังไม่เคยเข้าสู่ระบบ' };
      saveUsers([...users, newUser]);
      toast({ title: "เพิ่มผู้ใช้ใหม่สำเร็จ!" });
    }
    setIsFormOpen(false);
    setEditingUser(null);
  };
  
  const confirmDelete = () => {
    if(deletingUser) {
      saveUsers(users.filter(u => u.id !== deletingUser.id));
      toast({ title: "ลบผู้ใช้สำเร็จ!", variant: "destructive" });
      setDeletingUser(null);
    }
  };
  
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    if (status === 'active') {
      return <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</div>;
    }
    return <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Inactive</div>;
  };

  return (
    <>
      <Helmet><title>จัดการผู้ใช้งาน - ระบบจัดการ SACIT</title></Helmet>
      <div className="space-y-6 admin-panel" data-admin="true">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">ผู้ใช้งาน</h1>
            <p className="text-gray-600 mt-1">จัดการบัญชีผู้ใช้งานและสิทธิ์การเข้าถึง</p>
          </div>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button className="add-button-gradient" onClick={() => setEditingUser(null)}>
                <Plus className="w-5 h-5 mr-2" />เพิ่มผู้ใช้งาน
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingUser ? 'แก้ไขผู้ใช้งาน' : 'เพิ่มผู้ใช้งานใหม่'}</DialogTitle>
                <DialogDescription>กรอกข้อมูลผู้ใช้งานและกำหนดสิทธิ์</DialogDescription>
              </DialogHeader>
              <UserForm user={editingUser} onSubmit={handleFormSubmit} onCancel={() => setIsFormOpen(false)} />
            </DialogContent>
          </Dialog>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-xl shadow-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input type="text" placeholder="ค้นหาชื่อ, อีเมล, หรือตำแหน่ง..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
          </div>
        </motion.div>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr>
                  <th className="table-header-custom">ชื่อ-นามสกุล</th>
                  <th className="table-header-custom">อีเมล</th>
                  <th className="table-header-custom">ตำแหน่ง</th>
                  <th className="table-header-custom">สถานะ</th>
                  <th className="table-header-custom">เข้าระบบล่าสุด</th>
                  <th className="table-header-custom text-center">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50/50">
                    <td className="table-cell-custom font-medium">{user.name}</td>
                    <td className="table-cell-custom">{user.email}</td>
                    <td className="table-cell-custom">{user.role}</td>
                    <td className="table-cell-custom">{getStatusBadge(user.status)}</td>
                    <td className="table-cell-custom">{user.lastLogin}</td>
                    <td className="table-cell-custom text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { setEditingUser(user); setIsFormOpen(true); }}>
                            <Edit className="w-4 h-4 mr-2" /> แก้ไข
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600 focus:text-red-600 focus:bg-red-50" onClick={() => setDeletingUser(user)}>
                            <Trash2 className="w-4 h-4 mr-2" /> ลบ
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
           {filteredUsers.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <UserIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-lg">ไม่พบผู้ใช้งาน</p>
            </div>
          )}
        </div>
      </div>
      
      <AlertDialog open={!!deletingUser} onOpenChange={(open) => !open && setDeletingUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการลบ</AlertDialogTitle>
            <AlertDialogDescription>
              คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้ "{deletingUser?.name}"? การกระทำนี้ไม่สามารถย้อนกลับได้
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingUser(null)}>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">ลบ</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UsersPage;