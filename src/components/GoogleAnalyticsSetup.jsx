import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { ExternalLink, Check, AlertCircle, Settings } from 'lucide-react';
import analytics from '@/services/analytics';

const GoogleAnalyticsSetup = () => {
  const [measurementId, setMeasurementId] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [currentId, setCurrentId] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Check if Analytics is already initialized
    setIsConnected(analytics.isWorking());
    setCurrentId(analytics.getMeasurementId());
    
    // Load saved ID from localStorage
    const savedId = localStorage.getItem('ga_measurement_id');
    if (savedId && savedId !== 'G-XXXXXXXXXX') {
      setMeasurementId(savedId);
      setCurrentId(savedId);
    }
  }, []);

  const handleConnect = () => {
    if (!measurementId || measurementId.trim() === '') {
      toast({
        title: "❌ กรุณากรอก Measurement ID",
        description: "โปรดกรอก Google Analytics Measurement ID (รูปแบบ: G-XXXXXXXXXX)",
        variant: "destructive"
      });
      return;
    }

    // Validate ID format
    if (!measurementId.match(/^G-[A-Z0-9]{10}$/)) {
      toast({
        title: "❌ รูปแบบ ID ไม่ถูกต้อง",
        description: "Measurement ID ต้องมีรูปแบบ G-XXXXXXXXXX (เช่น G-1234567890)",
        variant: "destructive"
      });
      return;
    }

    try {
      // Initialize Analytics with new ID
      analytics.updateMeasurementId(measurementId);
      
      // Save to localStorage
      localStorage.setItem('ga_measurement_id', measurementId);
      
      setIsConnected(true);
      setCurrentId(measurementId);
      
      toast({
        title: "✅ เชื่อมต่อ Google Analytics สำเร็จ!",
        description: `Measurement ID: ${measurementId} ถูกติดตั้งแล้ว`,
      });

      // Track setup event
      analytics.trackEvent('analytics_setup', 'setup', 'connected', null);
      
    } catch (error) {
      console.error('Analytics setup error:', error);
      toast({
        title: "❌ เกิดข้อผิดพลาด",
        description: "ไม่สามารถติดตั้ง Google Analytics ได้",
        variant: "destructive"
      });
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem('ga_measurement_id');
    setIsConnected(false);
    setCurrentId('');
    setMeasurementId('');
    
    toast({
      title: "🔌 ยกเลิกการเชื่อมต่อแล้ว",
      description: "Google Analytics ถูกยกเลิกการเชื่อมต่อ",
    });
  };

  const openGoogleAnalytics = () => {
    window.open('https://analytics.google.com/', '_blank', 'noopener,noreferrer');
  };

  const openSetupGuide = () => {
    window.open('https://support.google.com/analytics/answer/9304153', '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-xl shadow-lg"
    >
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-6 h-6 text-violet-500" />
        <h3 className="text-xl font-semibold text-gray-700">การตั้งค่า Google Analytics</h3>
      </div>

      {!isConnected ? (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800">วิธีการเชื่อมต่อ Google Analytics</h4>
                <ol className="text-sm text-blue-700 mt-2 space-y-1 list-decimal list-inside">
                  <li>ไปที่ <button onClick={openGoogleAnalytics} className="underline hover:text-blue-800">Google Analytics</button></li>
                  <li>สร้างบัญชีและ Property สำหรับเว็บไซต์ของคุณ</li>
                  <li>คัดลอก Measurement ID (รูปแบบ: G-XXXXXXXXXX)</li>
                  <li>นำมาใส่ในช่องด้านล่างและคลิก "เชื่อมต่อ"</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Google Analytics Measurement ID
            </label>
            <Input
              type="text"
              placeholder="G-XXXXXXXXXX"
              value={measurementId}
              onChange={(e) => setMeasurementId(e.target.value.toUpperCase())}
              className="font-mono"
            />
            <p className="text-xs text-gray-500">
              รูปแบบ: G-XXXXXXXXXX (เช่น G-1234567890)
            </p>
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={handleConnect}
              className="bg-violet-600 hover:bg-violet-700 text-white"
              disabled={!measurementId}
            >
              <Check className="w-4 h-4 mr-2" />
              เชื่อมต่อ Google Analytics
            </Button>
            <Button variant="outline" onClick={openSetupGuide}>
              <ExternalLink className="w-4 h-4 mr-2" />
              คู่มือการตั้งค่า
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-500" />
              <div>
                <h4 className="font-medium text-green-800">เชื่อมต่อ Google Analytics แล้ว</h4>
                <p className="text-sm text-green-700">Measurement ID: <code className="bg-green-100 px-2 py-1 rounded">{currentId}</code></p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={openGoogleAnalytics}>
              <ExternalLink className="w-4 h-4 mr-2" />
              เปิด Google Analytics
            </Button>
            <Button 
              variant="outline" 
              onClick={handleDisconnect}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              ยกเลิกการเชื่อมต่อ
            </Button>
          </div>

          <div className="text-sm text-gray-600">
            <p>✅ ระบบกำลังติดตามข้อมูลการเข้าชมเว็บไซต์</p>
            <p>✅ ข้อมูลจะปรากฏใน Google Analytics ภายใน 24-48 ชั่วโมง</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default GoogleAnalyticsSetup;
