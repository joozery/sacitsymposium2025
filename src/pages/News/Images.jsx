import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import mediaService from '@/services/mediaService';
import { formatThaiDate } from '@/lib/utils';
import gallery01 from '/src/assets/gallery/01.jpg';
import gallery02 from '/src/assets/gallery/02.jpg';
import gallery03 from '/src/assets/gallery/03.jpg';

const Images = () => {
  const navigate = useNavigate();
  
  // Add CSS animation
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .animate-fade-in-up {
        animation: fadeInUp 0.6s ease-out forwards;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  
  const [activeCategory, setActiveCategory] = useState('all');
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Handle folder click to navigate to detail page
  const handleFolderClick = (folder) => {
    console.log('📁 Navigating to folder detail:', folder);
    navigate(`/folder/${folder.id}`);
  };
  
  // ดึงโฟลเดอร์จาก API
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('📁 Fetching folders for Images page...');
        const response = await mediaService.getAllMedia({
          type: 'folder',
          status: 'published'
        });
        
        if (response.success && response.data) {
          console.log('✅ Folders loaded:', response.data.length);
          setFolders(response.data);
        } else {
          throw new Error('Failed to fetch folders');
        }
      } catch (err) {
        console.error('❌ Error fetching folders:', err);
        setError(err.message);
        setFolders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFolders();
  }, []);



  const categories = [
    { id: 'all', name: 'ทั้งหมด' },
    { id: 'events', name: 'งานกิจกรรม' },
    { id: 'artworks', name: 'ผลงานศิลปะ' },
    { id: 'workshops', name: 'เวิร์คช็อป' }
  ];

  // แปลงข้อมูลโฟลเดอร์จาก API ให้ตรงกับรูปแบบ UI
  const imageItems = folders.map((folder, index) => ({
    id: folder.id,
    title: folder.name || `โฟลเดอร์ SACIT Symposium`,
    category: folder.event === 'sacit2025' ? 'events' : 'artworks',
    date: folder.date ? formatThaiDate(folder.date) : 'ไม่ระบุวันที่',
    image: folder.cover_image_url || gallery01, // ใช้ cover_image_url หรือ fallback
    featured: index === 0,
    isFolder: true, // เพิ่ม flag ว่าเป็นโฟลเดอร์
    itemsCount: folder.items_count || 0 // จำนวนรูปในโฟลเดอร์
  }));

  // Fallback data เมื่อไม่มีข้อมูลจาก API
  const fallbackItems = [
    {
      id: 1,
      title: 'ภาพงาน SACIT Symposium 2025',
      category: 'events',
      date: '15 มกราคม 2568',
      image: gallery01,
      featured: true
    },
    {
      id: 2,
      title: 'ผลงานศิลปหัตถกรรมไทย',
      category: 'artworks',
      date: '10 มกราคม 2568',
      image: gallery02
    },
    {
      id: 3,
      title: 'เวิร์คช็อปการทำครั่ง',
      category: 'workshops',
      date: '5 มกราคม 2568',
      image: gallery03
    }
  ];

  // ใช้ API data หรือ fallback
  const displayItems = imageItems.length > 0 ? imageItems : fallbackItems;
  
  const filteredItems = activeCategory === 'all' 
    ? displayItems 
    : displayItems.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative mt-20">
        {/* Top Banner */}
        <div className="w-full py-16" style={{
          background: 'linear-gradient(90deg, #BFB4EE 0%, #B3FFD1 100%)'
        }}>
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-center" style={{
              color: '#533192',
              fontFamily: 'Prompt',
              fontSize: '48px',
              fontStyle: 'normal',
              fontWeight: '700',
              lineHeight: 'normal'
            }}>
              สื่อและข่าวสาร
            </h1>
          </div>
        </div>

        {/* Sub Navigation Bar */}
        <div className="w-full py-4" style={{
          background: 'var(--gra-2, linear-gradient(90deg, #533193 0%, #BFB4EE 100%))'
        }}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-center gap-8">
              <Link to="/news" className="flex items-center gap-2 cursor-pointer">
                <span className="text-lg text-white">✦</span>
                <span className="font-medium" style={{
                  background: 'var(--gra-1, linear-gradient(90deg, #BFB4EE 0%, #B3FFD1 100%))',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: 'Prompt'
                }}>ข่าวสาร</span>
              </Link>
              <Link to="/exhibition" className="cursor-pointer">
                <span style={{
                  background: 'var(--gra-1, linear-gradient(90deg, #BFB4EE 0%, #B3FFD1 100%))',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: 'Prompt'
                }}>นิทรรศการ</span>
              </Link>
              <Link to="/creative-works" className="cursor-pointer">
                <span style={{
                  background: 'var(--gra-1, linear-gradient(90deg, #BFB4EE 0%, #B3FFD1 100%))',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: 'Prompt'
                }}>ผลงานสร้างสรรค์</span>
              </Link>
              <Link to="/images" className="cursor-pointer">
                <span style={{
                  background: 'var(--gra-1, linear-gradient(90deg, #BFB4EE 0%, #B3FFD1 100%))',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: 'Prompt'
                }}>ภาพ</span>
              </Link>
              <Link to="/videos" className="cursor-pointer">
                <span style={{
                  background: 'var(--gra-1, linear-gradient(90deg, #BFB4EE 0%, #B3FFD1 100%))',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: 'Prompt'
                }}>วิดีโอ</span>
              </Link>
              <Link to="/proceeding" className="cursor-pointer">
                <span style={{
                  background: 'var(--gra-1, linear-gradient(90deg, #BFB4EE 0%, #B3FFD1 100%))',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: 'Prompt'
                }}>Proceeding</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Dark Purple Bar */}
        <div className="w-full h-2" style={{
          background: '#533193'
        }}></div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Page Title */}
        <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center" style={{
          fontFamily: 'Prompt'
        }}>ภาพ</h2>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <span className="ml-3 text-gray-600">กำลังโหลดภาพ...</span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <div className="text-red-500 mb-2">⚠️ เกิดข้อผิดพลาดในการโหลดข้อมูล</div>
            <div className="text-gray-500">แสดงข้อมูลตัวอย่างแทน</div>
          </div>
        )}

        {/* Images Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 justify-items-center">
          {filteredItems.map((item, index) => (
            <div 
              key={item.id} 
              className="relative rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 animate-fade-in-up cursor-pointer" 
              style={{
                width: '100%',
                maxWidth: '350px',
                height: '450px',
                flexShrink: 0,
                animationDelay: `${index * 0.1}s`
              }}
              onClick={() => handleFolderClick(item)}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback เมื่อรูปจาก API โหลดไม่ได้
                    const fallbackImages = [gallery01, gallery02, gallery03];
                    e.target.src = fallbackImages[index % fallbackImages.length];
                  }}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-purple-900/80"></div>
              </div>
              
              {/* Content Overlay */}
              <div className="relative h-full flex flex-col justify-end p-6">
                {/* Content Section - All content at bottom */}
                <div className="space-y-4">
                  {/* Tags */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs border border-white/60 text-white px-3 py-1 rounded-full" style={{
                      fontFamily: 'Prompt'
                    }}>
                      {item.isFolder ? 'โฟลเดอร์ภาพ' : 'สื่อและเอกสารนำเสนอ'}
                    </span>
                    <span className="text-xs border border-white/60 text-white px-3 py-1 rounded-full" style={{
                      fontFamily: 'Prompt'
                    }}>
                      {categories.find(cat => cat.id === item.category)?.name}
                    </span>
                    {item.isFolder && (
                      <span className="text-xs bg-white/20 text-white px-3 py-1 rounded-full" style={{
                        fontFamily: 'Prompt'
                      }}>
                        📸 {item.itemsCount} รูป
                      </span>
                    )}
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-bold text-white line-clamp-2" style={{
                    fontFamily: 'Prompt'
                  }}>
                    {item.title}
                  </h3>
                  
                  {/* Arrow Button */}
                  <div className="flex justify-end">
                    <button className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors">
                      <div className="w-0 h-0 border-l-[8px] border-l-white border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1"></div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Images; 