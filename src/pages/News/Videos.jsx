import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import gallery04 from '/src/assets/gallery/04.jpg';
import gallery05 from '/src/assets/gallery/05.jpg';
import gallery06 from '/src/assets/gallery/06.jpg';

const Videos = () => {
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

  const categories = [
    { id: 'all', name: 'ทั้งหมด' },
    { id: 'tutorials', name: 'การสอน' },
    { id: 'events', name: 'งานกิจกรรม' },
    { id: 'interviews', name: 'สัมภาษณ์' }
  ];

  const videoItems = [
    {
      id: 1,
      title: 'การทำครั่งแบบดั้งเดิม',
      category: 'tutorials',
      date: '15 มกราคม 2568',
      thumbnail: gallery04,
      duration: '15:30',
      featured: true
    },
    {
      id: 2,
      title: 'SACIT Symposium 2024 Highlights',
      category: 'events',
      date: '10 มกราคม 2568',
      thumbnail: gallery05,
      duration: '8:45'
    },
    {
      id: 3,
      title: 'สัมภาษณ์ศิลปินแห่งชาติ',
      category: 'interviews',
      date: '5 มกราคม 2568',
      thumbnail: gallery06,
      duration: '12:20'
    }
  ];

  const filteredItems = activeCategory === 'all' 
    ? videoItems 
    : videoItems.filter(item => item.category === activeCategory);

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
        }}>วิดีโอ</h2>



        {/* Videos Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 justify-items-center">
          {filteredItems.map((item, index) => (
            <div 
              key={item.id} 
              className="relative rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 animate-fade-in-up" 
              style={{
                width: '100%',
                maxWidth: '350px',
                height: '450px',
                flexShrink: 0,
                animationDelay: `${index * 0.1}s`
              }}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img 
                  src={item.thumbnail} 
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-purple-900/80"></div>
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                    <div className="w-0 h-0 border-l-[12px] border-l-purple-600 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1"></div>
                  </div>
                </div>
                {/* Duration Badge */}
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                  {item.duration}
                </div>
              </div>
              
              {/* Content Overlay */}
              <div className="relative h-full flex flex-col justify-end p-6">
                {/* Content Section - All content at bottom */}
                <div className="space-y-4">
                  {/* Tags */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs border border-white/60 text-white px-3 py-1 rounded-full" style={{
                      fontFamily: 'Prompt'
                    }}>
                      สื่อและเอกสารนำเสนอ
                    </span>
                    <span className="text-xs border border-white/60 text-white px-3 py-1 rounded-full" style={{
                      fontFamily: 'Prompt'
                    }}>
                      {categories.find(cat => cat.id === item.category)?.name}
                    </span>
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

export default Videos; 