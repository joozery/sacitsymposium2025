import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, QrCode } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const CheckInPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast({
        title: "กรุณากรอกข้อมูล",
        description: "กรุณาใส่ชื่อ อีเมล หรือรหัสผู้เข้าร่วม",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);

    try {
      // จำลองการค้นหา
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "พบข้อมูลผู้เข้าร่วม",
        description: "กำลังดำเนินการเช็คอินให้คุณ...",
      });
      
      // จำลองการเช็คอิน
      setTimeout(() => {
        toast({
          title: "เช็คอินสำเร็จ!",
          description: `ยินดีต้อนรับเข้าสู่งาน SACIT Symposium 2025`,
        });
        setSearchTerm('');
      }, 2000);

    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถดำเนินการเช็คอินได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-green-400">
      {/* Header */}
      <div className="bg-purple-700 py-8">
        <div className="text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-sm mb-2">✱ SACIT</div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Symposium</h1>
            <h2 className="text-xl md:text-2xl mb-2">ลึงค์รายละเอียด</h2>
            <p className="text-sm opacity-90">SACIT Symposium 2025</p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4"
        >
          {/* Check-in Form */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">ค้นหาชื่อของคุณ</h3>
            <p className="text-gray-600 text-sm">กรอกชื่อ, อีเมล, เบอร์โทร หรือรหัสผู้เข้าร่วม</p>
          </div>

          {/* Search Input */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="ค้นหาชื่อ, อีเมล, หรือรหัสผู้เข้าร่วม..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10 py-3 text-lg border-2 border-gray-200 focus:border-purple-500 rounded-xl"
                disabled={isSearching}
              />
            </div>
          </div>

          {/* Search Button */}
          <Button
            onClick={handleSearch}
            disabled={isSearching}
            className="w-full py-3 text-lg bg-purple-600 hover:bg-purple-700 text-white rounded-xl mb-8 transition-all duration-200"
          >
            {isSearching ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                กำลังค้นหา...
              </div>
            ) : (
              'เช็คอิน'
            )}
          </Button>

          {/* QR Code Placeholder */}
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-gray-100 rounded-lg">
              <QrCode size={80} className="text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 mt-2">ใช้ QR Code สำหรับ SACIT Symposium 2025</p>
            <p className="text-xs text-gray-400">กรุณาสแกนรหัสเพื่อข้อมูลเติมลำเองเช็คอิน</p>
          </div>

          {/* Check-in Steps */}
          <div className="border-t pt-6">
            <h4 className="text-lg font-semibold text-blue-600 mb-4">ขั้นตอนการเช็คอิน:</h4>
            <ol className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="inline-block w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-bold mr-3 mt-0.5 flex items-center justify-center">1</span>
                <span>ค้นหาชื่อของคุณในระบบ</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-bold mr-3 mt-0.5 flex items-center justify-center">2</span>
                <span>กดปุ่ม "เช็คอิน" เพื่อดำเนินการเช็คอิน</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-bold mr-3 mt-0.5 flex items-center justify-center">3</span>
                <span>รอเจ้าหน้าที่ตรวจสอบและอนุมัติ</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-bold mr-3 mt-0.5 flex items-center justify-center">4</span>
                <span>เข้าร่วมงานได้ทันทีเมื่อได้รับการอนุมัติ</span>
              </li>
            </ol>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="text-center py-4">
        <p className="text-white text-sm opacity-75">
          จัดทำโดยทีมงานพัฒนาระบบ กรุณาติดต่อเจ้าหน้าที่หากพบปัญหา
        </p>
      </div>
    </div>
  );
};

export default CheckInPage; 