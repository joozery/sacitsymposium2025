import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { User, Lock, Bell, Palette, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const { toast } = useToast();

  const handleSave = (section) => {
    toast({
      title: 'บันทึกการตั้งค่าแล้ว',
      description: `การตั้งค่าในส่วน ${section} ได้รับการบันทึก (ตัวอย่าง)`,
    });
  };

  const tabs = [
    { id: 'general', label: 'ทั่วไป', icon: User },
    { id: 'security', label: 'ความปลอดภัย', icon: Lock },
    { id: 'notifications', label: 'การแจ้งเตือน', icon: Bell },
    { id: 'appearance', label: 'ลักษณะที่ปรากฏ', icon: Palette },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h3 className="text-lg font-medium">ข้อมูลส่วนตัว</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">ชื่อ</Label>
                <Input id="name" defaultValue="Admin" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="surname">นามสกุล</Label>
                <Input id="surname" defaultValue="User" className="mt-1" />
              </div>
            </div>
            <div>
              <Label htmlFor="email">อีเมล</Label>
              <Input id="email" type="email" defaultValue="admin@sacit.or.th" className="mt-1" />
            </div>
            <Button onClick={() => handleSave('ข้อมูลส่วนตัว')}><Save className="w-4 h-4 mr-2" />บันทึก</Button>
          </motion.div>
        );
      case 'security':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h3 className="text-lg font-medium">เปลี่ยนรหัสผ่าน</h3>
            <div>
              <Label htmlFor="current-password">รหัสผ่านปัจจุบัน</Label>
              <Input id="current-password" type="password" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="new-password">รหัสผ่านใหม่</Label>
              <Input id="new-password" type="password" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="confirm-password">ยืนยันรหัสผ่านใหม่</Label>
              <Input id="confirm-password" type="password" className="mt-1" />
            </div>
            <Button onClick={() => handleSave('ความปลอดภัย')}><Save className="w-4 h-4 mr-2" />เปลี่ยนรหัสผ่าน</Button>
          </motion.div>
        );
      case 'notifications':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h3 className="text-lg font-medium">การตั้งค่าการแจ้งเตือน</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">การแจ้งเตือนทางอีเมล</p>
                  <p className="text-sm text-gray-500">รับการแจ้งเตือนสำคัญทางอีเมล</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"/>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">การแจ้งเตือนในแอป</p>
                  <p className="text-sm text-gray-500">แสดงการแจ้งเตือนผ่านไอคอนกระดิ่ง</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"/>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">สรุปรายงานรายสัปดาห์</p>
                  <p className="text-sm text-gray-500">ส่งสรุปกิจกรรมรายสัปดาห์ทางอีเมล</p>
                </div>
                <input type="checkbox" className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"/>
              </div>
            </div>
            <Button onClick={() => handleSave('การแจ้งเตือน')}><Save className="w-4 h-4 mr-2" />บันทึก</Button>
          </motion.div>
        );
      case 'appearance':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h3 className="text-lg font-medium">ธีม</h3>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                    <div className="w-full h-24 bg-gray-100 border-2 border-violet-500 rounded-lg flex items-center justify-center font-semibold text-violet-600">สว่าง</div>
                    <p className="text-sm mt-2">Light (Default)</p>
                </div>
                <div className="text-center opacity-50 cursor-not-allowed">
                    <div className="w-full h-24 bg-gray-800 border-2 border-gray-600 rounded-lg flex items-center justify-center font-semibold text-gray-300">มืด</div>
                    <p className="text-sm mt-2">Dark (Coming soon)</p>
                </div>
             </div>
            <Button onClick={() => handleSave('ลักษณะที่ปรากฏ')}><Save className="w-4 h-4 mr-2" />บันทึก</Button>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>ตั้งค่า - ระบบจัดการ SACIT</title>
      </Helmet>
      <div className="space-y-6 admin-panel" data-admin="true">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-gray-800">ตั้งค่า</h1>
          <p className="text-gray-600 mt-1">จัดการข้อมูลส่วนตัวและความปลอดภัยของบัญชี</p>
        </motion.div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
          <aside className="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full group rounded-md px-3 py-2 flex items-center text-sm font-medium ${
                    activeTab === tab.id
                      ? 'bg-violet-50 text-violet-700'
                      : 'text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className={`w-5 h-5 mr-3 ${activeTab === tab.id ? 'text-violet-500' : 'text-gray-400 group-hover:text-gray-500'}`} />
                  <span className="truncate">{tab.label}</span>
                </button>
              ))}
            </nav>
          </aside>

          <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
                {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;