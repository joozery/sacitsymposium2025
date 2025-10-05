import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Home, 
  Award, 
  BarChart3, 
  Settings, 
  Users, 
  FileText, 
  Bell, 
  Search, 
  Briefcase, 
  ChevronLeft, 
  ChevronRight, 
  TrendingUp, 
  Film, 
  Mail, 
  UserPlus, 
  CalendarCheck, 
  ClipboardCheck,
  BookOpen,
  CalendarDays,
  Mic,
  UserCheck,
  Palette,
  Upload,
  MessageSquare,
  LogOut,
  Eye
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/components/ui/use-toast';

import logo from '@/assets/logo.png';
import logoWhite from '@/assets/logow.svg';
import symposiumText from '@/assets/symposiam.svg';


const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const isAdminPage = location.pathname.toLowerCase().startsWith('/admin');

  const notifications = [
    { id: 1, icon: Mail, title: "New certificate request", time: "5 mins ago", description: "John Doe requested a certificate for 'Tech Conference 2025'."},
    { id: 2, icon: UserPlus, title: "User registration", time: "1 hour ago", description: "Jane Smith registered as a new user."},
    { id: 3, icon: CalendarCheck, title: "Event upcoming", time: "Tomorrow", description: "SACIT Symposium 2025 is scheduled for tomorrow."},
  ];

  const handleNotificationClick = (notification) => {
    toast({
      title: `การแจ้งเตือน: ${notification.title}`,
      description: "🚧 ฟังก์ชันการจัดการการแจ้งเตือนยังไม่ได้พัฒนา ฟังชั้นจะใช้งานได้ในเร็วๆนี้ 🚀",
    });
  };

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(false); 
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const menuItems = [
    { icon: Home, label: 'หน้าหลัก', path: '/admin/dashboard', description: 'ภาพรวมและสถิติ' },
    { icon: CalendarDays, label: 'Agenda', path: '/admin/agenda', description: 'จัดการกำหนดการ' },
    { icon: Mic, label: 'ผู้บรรยาย', path: '/admin/speakers', description: 'จัดการข้อมูลผู้บรรยาย' },
    { icon: Palette, label: 'ผลงานสร้างสรรค์', path: '/admin/works', description: 'จัดการผลงานสร้างสรรค์' },
    { icon: Eye, label: 'นิทรรศการ', path: '/admin/exhibitions', description: 'จัดการ Live Exhibition และพื้นที่สาธิต' },
    { icon: UserCheck, label: 'รายชื่อผู้เข้าร่วม', path: '/admin/attendees', description: 'เช็ครายชื่อผู้เข้าร่วมงาน' },
    { icon: TrendingUp, label: 'Google Analytics', path: '/admin/google-analytics', description: 'สถิติการเข้าชมเว็บ' },
    { icon: Award, label: 'ใบประกาศนียบัตร', path: '/admin/certificates', description: 'จัดการใบประกาศ' },
    { icon: Film, label: 'สื่อมัลติมีเดีย', path: '/admin/multimedia', description: 'จัดการวิดีโอและภาพถ่าย' },
    { icon: BookOpen, label: 'E-Book', path: '/admin/ebooks', description: 'จัดการผลงาน E-Book' },
    { icon: ClipboardCheck, label: 'ตรวจสอบผลงาน', path: '/admin/submissions-review', description: 'ประเมินและตัดสินผลงาน' },
    { icon: Users, label: 'ผู้ใช้งาน', path: '/admin/users', description: 'จัดการผู้ใช้งานระบบ' },
    { icon: FileText, label: 'เทมเพลต', path: '/admin/templates', description: 'จัดการเทมเพลตเอกสาร' },
    { icon: Settings, label: 'ตั้งค่า', path: '/admin/settings', description: 'ตั้งค่าระบบโดยรวม' }
  ];

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  const overlayVariants = {
    open: {
      opacity: 1,
      transition: { duration: 0.3 }
    },
    closed: {
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  const sidebarWidth = sidebarCollapsed ? 'w-20' : 'w-80';
  const mainMargin = isMobile ? '' : sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-80';
  
  if (!isAdminPage) {
    return <>{children}</>; // Render children directly for non-admin pages
  }

  const handleLogout = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      
      if (adminToken) {
        // เรียก API logout
        await fetch('/api/auth/admin-logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // ลบข้อมูลการเข้าสู่ระบบ
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      
      toast({
        title: "ออกจากระบบสำเร็จ",
        description: "ขอบคุณที่ใช้งานระบบจัดการ SACIT",
      });
      
      navigate('/admin-login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 admin-panel" data-admin="true">
      <AnimatePresence>
        {sidebarOpen && isMobile && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{
          x: isMobile ? (sidebarOpen ? 0 : "-100%") : 0,
          width: isMobile ? 320 : (sidebarCollapsed ? 80 : 320)
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
        className={`fixed left-0 top-0 h-full bg-white z-50 ${isMobile ? 'w-80' : sidebarWidth} shadow-xl border-r border-gray-200`}
      >
        <div className="flex flex-col h-full text-gray-700">
          <div className={`${sidebarCollapsed && !isMobile ? 'p-4' : 'p-6'} border-b border-gray-200 flex-shrink-0`}>
            <div className="flex items-center justify-between">
              <div className={`flex items-center ${sidebarCollapsed && !isMobile ? 'justify-center' : 'space-x-3'}`}>
                <div 
                  className="w-10 h-10 bg-[#533193] rounded-lg flex items-center justify-center flex-shrink-0 cursor-pointer hover:bg-[#6B46C1] transition-colors duration-200"
                  onClick={() => navigate('/')}
                  title="กลับสู่หน้าหลัก"
                >
                  <img src={logoWhite} alt="SACIT" className="w-6 h-6 object-contain filter brightness-0 invert" />
                </div>
                {(!sidebarCollapsed || isMobile) && (
                  <motion.div
                    initial={false}
                    animate={{ opacity: sidebarCollapsed && !isMobile ? 0 : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h1 className="text-xl font-bold text-gray-800">SACIT Admin</h1>
                    <p className="text-sm text-gray-500">ระบบจัดการข้อมูล</p>
                  </motion.div>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                {!isMobile && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-500 hover:bg-gray-100 w-8 h-8"
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  >
                    {sidebarCollapsed ? (
                      <ChevronRight className="w-4 h-4" />
                    ) : (
                      <ChevronLeft className="w-4 h-4" />
                    )}
                  </Button>
                )}
                
                {isMobile && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-500 hover:bg-gray-100"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          <nav className={`flex-1 ${sidebarCollapsed && !isMobile ? 'p-2' : 'p-4'} space-y-1.5 overflow-hidden hover:overflow-y-auto scrollbar-hide`} style={{ minHeight: 0 }}>
            <div className="space-y-1.5">
              {menuItems.map((item, index) => {
                const isActive = location.pathname === item.path || (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path));
                return (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={item.path}
                      className={`flex items-center ${
                        sidebarCollapsed && !isMobile 
                          ? 'justify-center p-3' 
                          : 'space-x-3 p-3'
                      } rounded-lg transition-all duration-200 group relative ${
                        isActive 
                          ? 'bg-violet-500 text-white shadow-md' 
                          : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'
                      }`}
                      onClick={() => isMobile && setSidebarOpen(false)}
                      title={sidebarCollapsed && !isMobile ? item.label : ''}
                    >
                      <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}`} />
                      
                      {(!sidebarCollapsed || isMobile) && (
                        <motion.div
                          className="flex-1 min-w-0"
                          initial={false}
                          animate={{ 
                            opacity: sidebarCollapsed && !isMobile ? 0 : 1,
                            width: sidebarCollapsed && !isMobile ? 0 : 'auto'
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className={`font-medium truncate ${isActive ? 'text-white' : 'text-gray-700 group-hover:text-gray-900'}`}>
                            {item.label}
                          </div>
                          {item.description && !sidebarCollapsed && (
                             <div className={`text-xs truncate ${isActive ? 'text-violet-100' : 'text-gray-500 group-hover:text-gray-600'}`}>
                              {item.description}
                            </div>
                          )}
                        </motion.div>
                      )}

                      {sidebarCollapsed && !isMobile && (
                        <div className="absolute left-full ml-3 px-3 py-2 bg-gray-800 text-white text-sm rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                          <div className="font-medium">{item.label}</div>
                          {item.description && <div className="text-xs text-gray-300">{item.description}</div>}
                          <div className="absolute top-1/2 -left-1.5 transform -translate-y-1/2 w-3 h-3 bg-gray-800 rotate-45"></div>
                        </div>
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </nav>

          <div className={`${sidebarCollapsed && !isMobile ? 'p-2' : 'p-4'} border-t border-gray-200 flex-shrink-0`}>
            <div className={`flex items-center ${
              sidebarCollapsed && !isMobile 
                ? 'justify-center p-2' 
                : 'space-x-3 p-3'
            } bg-gray-50 rounded-lg`}>
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-medium text-white">A</span>
              </div>
              {(!sidebarCollapsed || isMobile) && (
                <motion.div
                  className="flex-1 min-w-0"
                  initial={false}
                  animate={{ 
                    opacity: sidebarCollapsed && !isMobile ? 0 : 1,
                    width: sidebarCollapsed && !isMobile ? 0 : 'auto'
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="font-medium text-sm text-gray-800 truncate">Admin User</div>
                  <div className="text-xs text-gray-500 truncate">ผู้ดูแลระบบ</div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.aside>

      <div className={`transition-all duration-300 ${mainMargin}`}>
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/70 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3.5">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                className={`text-gray-600 hover:text-gray-800 hover:bg-gray-100 ${isMobile ? 'flex' : 'hidden lg:hidden'}`}
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              
              <div className="hidden sm:flex items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="ค้นหา..."
                    className="pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 focus:bg-white transition-all duration-300 w-48 lg:w-64 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="sm:hidden">
                <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-800 hover:bg-gray-100">
                  <Search className="w-5 h-5" />
                </Button>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative text-gray-600 hover:text-gray-800 hover:bg-gray-100">
                    <Bell className="w-5 h-5" />
                    {notifications.length > 0 && (
                       <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel className="font-semibold">การแจ้งเตือน</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <DropdownMenuItem key={notification.id} onClick={() => handleNotificationClick(notification)} className="flex items-start gap-3 p-3 cursor-pointer">
                        <notification.icon className="w-5 h-5 text-violet-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">{notification.title}</p>
                          <p className="text-xs text-gray-500">{notification.description}</p>
                          <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                        </div>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <DropdownMenuItem disabled className="text-center text-gray-500 py-4">
                      ไม่มีการแจ้งเตือนใหม่
                    </DropdownMenuItem>
                  )}
                   {notifications.length > 0 && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => toast({ title: "🚧 ดูการแจ้งเตือนทั้งหมด", description: "ฟังก์ชันนี้ยังไม่ได้พัฒนา"})}
                        className="justify-center text-violet-600 hover:text-violet-700 font-medium cursor-pointer"
                      >
                        ดูการแจ้งเตือนทั้งหมด
                      </DropdownMenuItem>
                    </>
                   )}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-sm">
                <span className="text-white text-sm font-medium">A</span>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Layout;