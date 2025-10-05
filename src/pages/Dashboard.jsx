import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  FileText, 
  TrendingUp, 
  Calendar,
  BarChart3,
  PieChart,
  User,
  Mail,
  Phone,
  Building,
  GraduationCap,
  FileText as FileTextIcon,
  Award,
  Download,
  Edit
} from 'lucide-react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

// Simple Chart Components
const BarChart = ({ data, title }) => {
  const maxValue = Math.max(...data.map(item => item.value));
  
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-gray-700">{title}</h4>
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className="w-16 text-xs text-gray-600 truncate">{item.label}</div>
            <div className="flex-1 bg-gray-200 rounded-full h-3 relative">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                {item.value}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PieChartComponent = ({ data, title }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercentage = 0;
  
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-gray-700">{title}</h4>
      <div className="flex items-center justify-center">
        <div className="relative w-32 h-32">
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const startAngle = cumulativePercentage * 3.6;
              const endAngle = (cumulativePercentage + percentage) * 3.6;
              cumulativePercentage += percentage;
              
              const x1 = 50 + 35 * Math.cos((startAngle * Math.PI) / 180);
              const y1 = 50 + 35 * Math.sin((startAngle * Math.PI) / 180);
              const x2 = 50 + 35 * Math.cos((endAngle * Math.PI) / 180);
              const y2 = 50 + 35 * Math.sin((endAngle * Math.PI) / 180);
              
              const largeArcFlag = percentage > 50 ? 1 : 0;
              const pathData = [
                `M 50 50`,
                `L ${x1} ${y1}`,
                `A 35 35 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                'Z'
              ].join(' ');
              
              return (
                <path
                  key={index}
                  d={pathData}
                  fill={item.color}
                  stroke="white"
                  strokeWidth="0.5"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-800">{total}</div>
              <div className="text-xs text-gray-600">ทั้งหมด</div>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-1">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-gray-600">{item.label}</span>
            <span className="text-xs font-medium text-gray-800 ml-auto">
              {item.value} ({((item.value / total) * 100).toFixed(1)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const handleFeatureClick = (feature) => {
    toast({
      title: `🚧 ${feature}`,
      description: "ฟังก์ชันนี้อยู่ระหว่างการพัฒนา จะเปิดให้ใช้งานในเร็วๆ นี้ 🚀",
    });
  };

  // Sample data for metrics
  const metrics = [
    { 
      id: 1, 
      title: 'ผู้ลงทะเบียน', 
      value: '1,247', 
      change: '+12%', 
      icon: Users,
      description: 'เพิ่มขึ้นจากเดือนที่แล้ว',
      color: 'bg-gradient-to-r from-blue-500 to-blue-600'
    },
    { 
      id: 2, 
      title: 'ผลงานที่ส่ง', 
      value: '89', 
      change: '+8%', 
      icon: FileText,
      description: 'งานวิจัยและสร้างสรรค์',
      color: 'bg-gradient-to-r from-green-500 to-green-600'
    },
    { 
      id: 3, 
      title: 'อัตราการเข้าร่วม', 
      value: '94.2%', 
      change: '+2.1%', 
      icon: TrendingUp,
      description: 'สูงกว่าเป้าหมาย',
      color: 'bg-gradient-to-r from-purple-500 to-purple-600'
    },
    { 
      id: 4, 
      title: 'กิจกรรมทั้งหมด', 
      value: '24', 
      change: 'ตามแผน', 
      icon: Calendar,
      description: 'กิจกรรมในงาน Symposium',
      color: 'bg-gradient-to-r from-orange-500 to-orange-600'
    }
  ];

  // Sample data for charts
  const registrationData = [
    { label: 'ม.ค.', value: 120 },
    { label: 'ก.พ.', value: 180 },
    { label: 'มี.ค.', value: 250 },
    { label: 'เม.ย.', value: 320 },
    { label: 'พ.ค.', value: 280 },
    { label: 'มิ.ย.', value: 350 }
  ];

  const workTypeData = [
    { label: 'งานวิจัย', value: 45, color: '#3B82F6' },
    { label: 'งานสร้างสรรค์', value: 32, color: '#10B981' },
    { label: 'งานศิลปะ', value: 28, color: '#F59E0B' },
    { label: 'งานหัตถกรรม', value: 15, color: '#EF4444' },
    { label: 'อื่นๆ', value: 8, color: '#8B5CF6' }
  ];

  // Sample data for recent activities
  const recentActivities = [
    {
      id: 1,
      title: 'ผู้เข้าร่วมใหม่ลงทะเบียน',
      description: 'Dr. สมชาย ลงทะเบียนเข้าร่วมงาน',
      time: '5 นาทีที่แล้ว',
      icon: Users,
      type: 'registration'
    },
    {
      id: 2,
      title: 'งานวิจัยใหม่ถูกส่ง',
      description: 'งานวิจัยเรื่อง "AI in Healthcare"',
      time: '30 นาทีที่แล้ว',
      icon: FileText,
      type: 'submission'
    },
    {
      id: 3,
      title: 'ใบประกาศนียบัตรถูกออก',
      description: 'ออกใบประกาศให้ผู้เข้าร่วม 15 คน',
      time: '1 ชั่วโมงที่แล้ว',
      icon: Award,
      type: 'certificate'
    },
    {
      id: 4,
      title: 'สื่อมัลติมีเดียใหม่',
      description: 'อัพโหลดภาพถ่ายงาน Symposium',
      time: '2 ชั่วโมงที่แล้ว',
      icon: FileTextIcon,
      type: 'media'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 admin-panel" data-admin="true">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl p-8 text-white"
      >
        <h1 className="text-3xl font-bold mb-2">ยินดีต้อนรับสู่ Dashboard</h1>
        <p className="text-violet-100 text-lg">จัดการงาน SACIT Symposium 2025 อย่างมีประสิทธิภาพ</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button 
            variant="secondary" 
            className="bg-white/20 text-white border-white/30 hover:bg-white/30"
            onClick={() => handleFeatureClick('ดูรายงานสรุป')}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            ดูรายงานสรุป
          </Button>
          <Button 
            variant="secondary" 
            className="bg-white/20 text-white border-white/30 hover:bg-white/30"
            onClick={() => handleFeatureClick('ส่งออกข้อมูล')}
          >
            <Download className="w-4 h-4 mr-2" />
            ส่งออกข้อมูล
          </Button>
        </div>
      </motion.div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`${metric.color} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow duration-300`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <metric.icon className="w-6 h-6" />
              </div>
              <div className="text-right">
                <div className="text-sm opacity-90">{metric.change}</div>
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold">{metric.value}</h3>
              <p className="text-sm opacity-90">{metric.title}</p>
              <p className="text-xs opacity-75">{metric.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">การลงทะเบียนรายเดือน</h3>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => handleFeatureClick('ดูรายละเอียดแผนภูมิ')}
            >
              <BarChart3 className="w-5 h-5 text-gray-500" />
            </Button>
          </div>
          <div className="h-64 p-2 overflow-hidden">
            <BarChart data={registrationData} title="จำนวนผู้ลงทะเบียนรายเดือน" />
          </div>
        </motion.div>

        {/* Chart 2 */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">สัดส่วนประเภทผลงาน</h3>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => handleFeatureClick('ดูรายละเอียดแผนภูมิ')}
            >
              <PieChart className="w-5 h-5 text-gray-500" />
            </Button>
          </div>
          <div className="h-64 p-2 overflow-hidden">
            <PieChartComponent data={workTypeData} title="สัดส่วนประเภทผลงาน" />
          </div>
        </motion.div>
      </div>

      {/* Recent Activities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white rounded-xl p-6 shadow-lg"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">กิจกรรมล่าสุด</h3>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleFeatureClick('ดูกิจกรรมทั้งหมด')}
          >
            ดูทั้งหมด
          </Button>
        </div>
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <div className={`p-2 rounded-lg ${
                activity.type === 'registration' ? 'bg-blue-100 text-blue-600' :
                activity.type === 'submission' ? 'bg-green-100 text-green-600' :
                activity.type === 'certificate' ? 'bg-purple-100 text-purple-600' :
                'bg-orange-100 text-orange-600'
              }`}>
                <activity.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate">{activity.title}</h4>
                <p className="text-gray-600 text-sm">{activity.description}</p>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-1" />
                {activity.time}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;