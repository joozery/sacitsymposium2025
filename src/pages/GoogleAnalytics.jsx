import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { BarChart, PieChart, Users, Download, ExternalLink, Search as SearchIcon, Calendar, MapPin, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import GoogleAnalyticsSetup from '@/components/GoogleAnalyticsSetup';
import analytics from '@/services/analytics';

const StatCard = ({ title, value, icon: Icon, change, changeType, bgColor = 'bg-white' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${bgColor} p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <Icon className="w-5 h-5 text-violet-500" />
      </div>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
      {change && (
        <p className={`text-xs mt-1 ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
          {change}
        </p>
      )}
    </motion.div>
  );
};

const ChartPlaceholder = ({ title, icon: Icon, description }) => {
  const { toast } = useToast();
  const handleChartClick = () => {
    toast({
      title: "🚧 ข้อมูลกราฟยังไม่พร้อมใช้งาน",
      description: "ส่วนนี้จะแสดงข้อมูลเมื่อเชื่อมต่อ Google Analytics สำเร็จแล้ว 🚀",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300"
      onClick={handleChartClick}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        <Icon className="w-6 h-6 text-violet-500" />
      </div>
      <div className="h-64 bg-gray-50 rounded-lg flex flex-col items-center justify-center text-center p-4">
        <Icon className="w-12 h-12 text-gray-400 mb-3" />
        <p className="text-gray-500">{description}</p>
        <p className="text-xs text-gray-400 mt-1">คลิกเพื่อดูรายละเอียด (เมื่อเชื่อมต่อข้อมูล)</p>
      </div>
    </motion.div>
  );
};

const KeywordSourceItem = ({ keyword, count, source }) => {
  return (
    <div className="flex items-center justify-between py-3 px-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200">
      <div>
        <p className="font-medium text-gray-700">{keyword}</p>
        <p className="text-xs text-gray-500">มาจาก: {source}</p>
      </div>
      <p className="text-sm font-semibold text-violet-600">{count} ครั้ง</p>
    </div>
  );
};

const GoogleAnalytics = () => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    // Check if Analytics is connected
    const checkConnection = () => {
      const connected = analytics.isWorking();
      setIsConnected(connected);
      
      if (connected) {
        // Load analytics data
        loadAnalyticsData();
      }
    };

    checkConnection();
    
    // Check every 5 seconds for connection changes
    const interval = setInterval(checkConnection, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadAnalyticsData = async () => {
    try {
      const data = await analytics.getAnalyticsData();
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error loading analytics data:', error);
    }
  };

  const handleConnectAnalytics = () => {
    toast({
      title: "กำลังเปลี่ยนเส้นทางไปยัง Google Analytics",
      description: "คุณจะถูกนำไปยังหน้าเว็บ Google Analytics เพื่อทำการเชื่อมต่อบัญชีของคุณ",
    });
    window.open('https://analytics.google.com/', '_blank', 'noopener,noreferrer');
  };

  const handleExportReport = () => {
     toast({
      title: "🚧 ส่งออกรายงาน",
      description: "ฟังก์ชันการส่งออกรายงานยังไม่ได้ถูกพัฒนา กรุณาแจ้งผู้พัฒนาหากต้องการใช้งานส่วนนี้ 🚀",
    });
  };

  const trafficSources = [
    { name: 'Google Search', value: '60%', color: 'bg-blue-500' },
    { name: 'Direct', value: '25%', color: 'bg-green-500' },
    { name: 'Social Media', value: '10%', color: 'bg-sky-500' },
    { name: 'Referrals', value: '5%', color: 'bg-yellow-500' },
  ];

  const topKeywords = [
    { keyword: 'ใบประกาศนียบัตร SACIT', count: 120, source: 'Google' },
    { keyword: 'กิจกรรม SACIT 2025', count: 95, source: 'Direct' },
    { keyword: 'ดาวน์โหลดเกียรติบัตร', count: 70, source: 'Google' },
    { keyword: 'งานประชุมวิชาการ SACIT', count: 50, source: 'Facebook' },
    { keyword: 'QR Code เกียรติบัตร', count: 30, source: 'Google' },
  ];

  return (
    <>
      <Helmet>
        <title>Google Analytics - ระบบจัดการ SACIT</title>
        <meta name="description" content="ภาพรวมสถิติการเข้าชมเว็บไซต์จาก Google Analytics" />
      </Helmet>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Google Analytics</h1>
            <p className="text-gray-600 mt-1">ภาพรวมสถิติการเข้าชมเว็บไซต์ และการดาวน์โหลด</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={handleExportReport}>
              <Download className="w-4 h-4 mr-2" />
              ส่งออกรายงาน
            </Button>
            <Button className="bg-violet-600 hover:bg-violet-700 text-white" onClick={handleConnectAnalytics}>
              <ExternalLink className="w-4 h-4 mr-2" />
              เชื่อมต่อ Google Analytics
            </Button>
          </div>
        </motion.div>

        {/* Google Analytics Setup Component */}
        <GoogleAnalyticsSetup />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="ผู้เข้าชมทั้งหมด" value="12,345" icon={Users} change="+15% vs last month" changeType="positive" />
          <StatCard title="การดาวน์โหลดทั้งหมด" value="5,678" icon={Download} change="+8% vs last month" changeType="positive" />
          <StatCard title="ผู้เข้าชมวันนี้" value="456" icon={Users} change="-2% vs yesterday" changeType="negative" />
          <StatCard title="ดาวน์โหลดวันนี้" value="89" icon={Download} change="+5% vs yesterday" changeType="positive" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ChartPlaceholder 
              title="ภาพรวมการเข้าชม (รายเดือน)" 
              icon={BarChart}
              description="กราฟแท่งแสดงจำนวนผู้เข้าชมรายเดือน"
            />
          </div>
          <ChartPlaceholder 
            title="แหล่งที่มาของผู้เข้าชม" 
            icon={PieChart}
            description="กราฟวงกลมแสดงสัดส่วนแหล่งที่มาของผู้เข้าชม"
          />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-lg"
        >
          <h3 className="text-xl font-semibold text-gray-700 mb-4">แหล่งที่มาของการเข้าชม (Traffic Sources)</h3>
          <div className="space-y-3">
            {trafficSources.map(source => (
              <div key={source.name}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-600">{source.name}</span>
                  <span className="text-sm font-medium text-gray-600">{source.value}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className={`${source.color} h-2.5 rounded-full`} style={{ width: source.value }}></div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-lg"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-700">คำค้นหา (Keywords) ที่นำผู้ใช้มายังเว็บ</h3>
            <div className="relative mt-3 sm:mt-0">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="ค้นหา Keyword..." 
                className="pl-10 pr-4 py-2 w-full sm:w-64 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-sm"
                onClick={() => toast({ title: "🚧 ฟังก์ชันค้นหา Keyword ยังไม่พร้อมใช้งาน"})}
              />
            </div>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
            {topKeywords.length > 0 ? topKeywords.map((item, index) => (
              <KeywordSourceItem key={index} keyword={item.keyword} count={item.count} source={item.source} />
            )) : (
              <p className="text-gray-500 text-center py-4">ยังไม่มีข้อมูลคำค้นหา</p>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <ChartPlaceholder 
            title="ข้อมูลประชากรผู้เข้าชม" 
            icon={Users}
            description="กราฟแสดงข้อมูลอายุ เพศ ของผู้เข้าชม"
          />
           <ChartPlaceholder 
            title="ตำแหน่งทางภูมิศาสตร์" 
            icon={MapPin}
            description="แผนที่แสดงตำแหน่งของผู้เข้าชมส่วนใหญ่"
          />
        </div>
      </div>
    </>
  );
};

export default GoogleAnalytics;