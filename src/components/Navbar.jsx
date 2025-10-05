import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Search, Menu, X, User, Settings, LogOut, FileText, Award, HelpCircle, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import authService from '@/services/authService';
import logoWhite from '@/assets/logow.svg';
import symposiumText from '@/assets/symposiam.svg';

const Navbar = ({ 
  variant = 'default', // 'default', 'simple', 'transparent'
  showAuthButtons = true,
  showNavigation = true,
  showIcons = true,
  className = '',
  onFeatureClick = () => console.log("Feature not implemented yet.")
}) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isLoggedIn = authService.isAuthenticated();
  const user = authService.getCurrentUser();

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Close mobile menu when clicking outside
  const handleOutsideClick = (e) => {
    if (mobileMenuOpen && !e.target.closest('.mobile-menu-container')) {
      setMobileMenuOpen(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [mobileMenuOpen]);

  // Simple navbar - just colored bar
  if (variant === 'simple') {
    return <div className={`w-full h-20 bg-[#533193] shadow-md ${className}`} />;
  }

  // Transparent navbar - no background
  const bgClass = variant === 'transparent' 
    ? 'bg-transparent' 
    : 'bg-[#533193]';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 ${bgClass} shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] h-[100px] mobile-menu-container ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1280px] flex items-center justify-between h-full relative">
        {/* Logo */}
        <Link to="/" className="flex items-start py-4 flex-shrink-0">
          <div className="flex flex-col">
            <div className="flex items-center justify-end w-full">
              <img src={logoWhite} alt="SACIT" className="h-6 w-auto" />
            </div>
            <div className="flex items-center justify-start w-full">
              <img src={symposiumText} alt="Symposium" className="h-7 w-auto" />
            </div>
          </div>
        </Link>
        
        {/* Center Navigation - Desktop Only */}
        {showNavigation && (
          <div className="hidden md:flex items-center gap-8 flex-shrink-0">
            <Link to="/about" className="relative group">
              <span className="text-white font-medium transition-all duration-300 group-hover:text-purple-200">About Us</span>
              {/* Hover dots */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 flex gap-1">
                <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </Link>
            <Link to="/news" className="text-white font-medium ml-8 relative group transition-all duration-300 hover:text-purple-200">
              News/Update
              {/* Hover dots */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 flex gap-1">
                <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </Link>
          </div>
        )}
        
        {/* Center - Empty space when no navigation */}
        {!showNavigation && <div className="flex-1 min-w-0"></div>}
        
        {/* Right Side */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* User Info with Dropdown - when logged in */}
          {isLoggedIn && (
            <>
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 hover:bg-white/10 rounded-lg px-3 py-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/20">
                    <div className="w-8 h-8 rounded-full bg-white/20 overflow-hidden border-2 border-white/30 flex-shrink-0">
                      <img 
                        src={user?.avatar || 'https://i.pravatar.cc/100?u=' + user?.email} 
                        alt="avatar" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="text-white hidden sm:block">
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-sm max-w-[120px] truncate" style={{ fontFamily: 'Prompt, sans-serif' }}>{user?.first_name} {user?.last_name}</span>
                        <ChevronDown className="w-3 h-3 text-white/70 flex-shrink-0" />
                      </div>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-64 z-[9999] bg-white border border-purple-200 shadow-2xl rounded-2xl overflow-hidden animate-in fade-in-0 zoom-in-95 backdrop-blur-sm" 
                  sideOffset={16}
                  alignOffset={-8}
                  avoidCollisions={true}
                  collisionPadding={20}
                  side="bottom"
                  sticky="always"
                  style={{ fontFamily: 'Prompt, sans-serif' }}
                >
                  {/* User Info Header */}
                  <div className="px-4 py-3 bg-gradient-to-r from-purple-50 to-purple-100 border-b border-purple-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-200 overflow-hidden border-2 border-purple-300">
                        <img 
                          src={user?.avatar || 'https://i.pravatar.cc/100?u=' + user?.email} 
                          alt="avatar" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{user?.first_name} {user?.last_name}</p>
                        <p className="text-xs text-gray-600">{user?.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <DropdownMenuItem 
                      onClick={() => navigate('/my-account')} 
                      className="flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-purple-50 transition-all duration-300 mx-2 rounded-xl group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center flex-shrink-0 group-hover:from-purple-200 group-hover:to-purple-300 transition-all duration-300">
                        <User className="w-4 h-4 text-purple-600" />
                      </div>
                      <span className="font-medium text-gray-700 text-sm group-hover:text-purple-700">โปรไฟล์</span>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem 
                      onClick={() => navigate('/my-account?tab=certificates')} 
                      className="flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-amber-50 transition-all duration-300 mx-2 rounded-xl group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center flex-shrink-0 group-hover:from-amber-200 group-hover:to-amber-300 transition-all duration-300">
                        <Award className="w-4 h-4 text-amber-600" />
                      </div>
                      <span className="font-medium text-gray-700 text-sm group-hover:text-amber-700">ใบประกาศนียบัตร</span>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem 
                      onClick={() => navigate('/my-account?tab=submissions')} 
                      className="flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-blue-50 transition-all duration-300 mx-2 rounded-xl group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0 group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300">
                        <FileText className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="font-medium text-gray-700 text-sm group-hover:text-blue-700">การส่งผลงาน</span>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem 
                      onClick={() => navigate('/my-account')} 
                      className="flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-green-50 transition-all duration-300 mx-2 rounded-xl group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center flex-shrink-0 group-hover:from-green-200 group-hover:to-green-300 transition-all duration-300">
                        <Settings className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="font-medium text-gray-700 text-sm group-hover:text-green-700">การตั้งค่า</span>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem 
                      onClick={() => window.open('https://symposium.sacit.or.th/help', '_blank')} 
                      className="flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-indigo-50 transition-all duration-300 mx-2 rounded-xl group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center flex-shrink-0 group-hover:from-indigo-200 group-hover:to-indigo-300 transition-all duration-300">
                        <HelpCircle className="w-4 h-4 text-indigo-600" />
                      </div>
                      <span className="font-medium text-gray-700 text-sm group-hover:text-indigo-700">ช่วยเหลือ</span>
                    </DropdownMenuItem>
                  </div>
                  
                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-4 my-3"></div>
                  
                  {/* Logout */}
                  <div className="py-2">
                    <DropdownMenuItem 
                      onClick={handleLogout} 
                      className="flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-red-50 transition-all duration-300 mx-2 rounded-xl text-red-600 hover:text-red-700 group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center flex-shrink-0 group-hover:from-red-200 group-hover:to-red-300 transition-all duration-300">
                        <LogOut className="w-4 h-4 text-red-600" />
                      </div>
                      <span className="font-medium text-sm group-hover:text-red-700">ออกจากระบบ</span>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Divider */}
              <div className="w-px h-6 bg-white/20 hidden sm:block flex-shrink-0"></div>
            </>
          )}
          
          {/* Auth Buttons - when not logged in */}
          {!isLoggedIn && showAuthButtons && (
            <div className="hidden md:flex items-center gap-4 flex-shrink-0">
              <Link to="/login">
                <Button 
                  variant="outline" 
                  className="bg-transparent border border-[#B3FFD1] text-white hover:bg-white/5 transition-all duration-300 rounded-[30px] w-[140px] py-2.5 text-sm font-custom-bold shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
                >
                  LOGIN
                </Button>
              </Link>
              <Link to="/register">
                <Button 
                  className="bg-gradient-to-r from-[#B3FFD1] to-[#BFB4EE] text-[#533193] hover:opacity-90 transition-all duration-300 rounded-[100px] w-[140px] py-2.5 text-sm font-custom-bold shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
                >
                  REGISTER
                </Button>
              </Link>
            </div>
          )}
          
          {/* Divider - when showing auth buttons */}
          {!isLoggedIn && showAuthButtons && (
            <div className="hidden md:block w-px h-6 bg-white/20 flex-shrink-0"></div>
          )}
          
          {/* Icons */}
          {showIcons && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-white/10 transition-all duration-300 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0"
                onClick={onFeatureClick}
              >
                <Search className="w-6 h-6" />
              </Button>
              {/* ปุ่ม hamburger menu */}
              <button className="p-2" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <rect x="4" y="6" width="16" height="2" rx="1" fill="white"/>
                  <rect x="4" y="11" width="16" height="2" rx="1" fill="white"/>
                  <rect x="4" y="16" width="16" height="2" rx="1" fill="white"/>
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && showNavigation && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="absolute top-full left-0 right-0 bg-[#533193] shadow-lg border-t border-white/10 md:hidden"
        >
          <div className="container mx-auto px-4 py-4 space-y-2">
            <Button 
              variant="ghost" 
              className="w-full text-left text-white hover:bg-white/10 transition-all duration-300 justify-start font-custom"
              onClick={() => {
                onFeatureClick();
                setMobileMenuOpen(false);
              }}
            >
              About Us
            </Button>
            <Link to="/news" onClick={() => setMobileMenuOpen(false)}>
              <Button 
                variant="ghost" 
                className="w-full text-left text-white hover:bg-white/10 transition-all duration-300 justify-start font-custom"
              >
                News/Update
              </Button>
            </Link>
            
            {/* Mobile Auth Buttons - when not logged in */}
            {!isLoggedIn && showAuthButtons && (
              <div className="border-t border-white/20 pt-2 mt-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button 
                    variant="outline" 
                    className="w-full bg-transparent border border-[#B3FFD1] text-white hover:bg-white/5 transition-all duration-300 rounded-[30px] py-2.5 text-sm font-custom-bold mb-2"
                  >
                    LOGIN
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button 
                    className="w-full bg-gradient-to-r from-[#B3FFD1] to-[#BFB4EE] text-[#533193] hover:opacity-90 transition-all duration-300 rounded-[100px] py-2.5 text-sm font-custom-bold"
                  >
                    REGISTER
                  </Button>
                </Link>
                </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Overlay Menu */}
      {menuOpen && (
  <div
    className="fixed inset-0 z-50 bg-[#533193] text-white overflow-y-auto max-h-screen font-prompt"
  >
    <button
      className="absolute top-6 right-8 text-3xl hover:text-[#B3FFD1] transition-colors duration-200"
      aria-label="Close menu"
      onClick={() => setMenuOpen(false)}
    >
      &times;
    </button>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 px-8 pt-24 pb-16 max-w-6xl mx-auto">
      {/* Column 1 */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold mb-4">About us</h3>
        <div className="font-semibold text-lg cursor-pointer hover:text-[#B3FFD1] transition">SACIT Symposium 2025 ▼</div>
        <div className="cursor-pointer hover:text-[#B3FFD1] transition">SACIT Symposium 2026</div>
        <div className="cursor-pointer hover:text-[#B3FFD1] transition">SACIT Symposium 2027</div>

        <h4 className="text-lg font-semibold mt-6">สื่อและข่าวสาร</h4>
        <Link to="/news" onClick={() => setMenuOpen(false)}>
          <div className="cursor-pointer hover:text-[#B3FFD1] transition">ข่าวสาร</div>
        </Link>
        <div className="cursor-pointer hover:text-[#B3FFD1] transition">กำหนดการ</div>
        <div className="cursor-pointer hover:text-[#B3FFD1] transition">วิทยากร</div>
        <div className="cursor-pointer hover:text-[#B3FFD1] transition">รายงานการประชุมวิชาการด้านงานศิลปหัตถกรรม</div>
        <div className="cursor-pointer hover:text-[#B3FFD1] transition">Proceeding</div>

        <h4 className="text-lg font-semibold mt-6">เนื้อหานิทรรศการ</h4>
        <div className="cursor-pointer hover:text-[#B3FFD1] transition">Main Exhibition: Lacquer Legacy</div>
        <Link to="/creative-works/partners" onClick={() => setMenuOpen(false)}>
          <div className="cursor-pointer hover:text-[#B3FFD1] transition">Creative Works Exhibition (Collaborative Partners)</div>
        </Link>
        <div className="cursor-pointer hover:text-[#B3FFD1] transition">Live Exhibition (Demonstrative Area)</div>
      </div>

      {/* Column 2 */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold mb-4">Register</h3>
        <div className="font-semibold text-lg">บรรยากาศภายในงาน</div>
        <div className="cursor-pointer hover:text-[#B3FFD1] transition">ภาพภายในงาน</div>
        <div className="cursor-pointer hover:text-[#B3FFD1] transition">วิดีโอภายในงาน</div>

        <h4 className="text-lg font-semibold mt-6">การนำเสนอผลงาน</h4>
        <div className="cursor-pointer hover:text-[#B3FFD1] transition">ผลงานวิจัย / บทความวิชาการ</div>
        <div className="cursor-pointer hover:text-[#B3FFD1] transition">ผลงานสร้างสรรค์</div>

        <h4 className="text-lg font-semibold mt-6">ค้นหา</h4>
        <div className="cursor-pointer hover:text-[#B3FFD1] transition">Contact</div>
      </div>
    </div>
  </div>
)}


    </header>
  );
};

export default Navbar; 