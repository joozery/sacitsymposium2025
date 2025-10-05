import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import symposiam from '/src/assets/symposiam.png';
import logo from '/src/assets/logo.png';
import sacitvision from '/src/assets/sacitvision.webp';
import group107 from '/src/assets/Group107.jpg';
import logo1 from '/src/assets/logo1.png';
import vinyl from '/src/assets/Vinyl.png';

const CreativeWorks = () => {
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
    { id: 'art', name: 'ศิลปะ' },
    { id: 'design', name: 'การออกแบบ' },
    { id: 'craft', name: 'หัตถกรรม' },
    { id: 'digital', name: 'ดิจิทัล' }
  ];

  const creativeWorksItems = [
    {
      id: 1,
      title: 'Contemporary Thai Lacquer Art',
      excerpt: 'ผลงานศิลปะครั่งร่วมสมัยที่ผสมผสานเทคนิคดั้งเดิมกับแนวคิดสมัยใหม่',
      category: 'art',
      date: '20 มกราคม 2568',
      image: symposiam,
      featured: true
    },
    {
      id: 2,
      title: 'Digital Heritage Preservation',
      excerpt: 'โครงการอนุรักษ์มรดกทางวัฒนธรรมผ่านเทคโนโลยีดิจิทัล',
      category: 'digital',
      date: '18 มกราคม 2568',
      image: logo
    },
    {
      id: 3,
      title: 'Traditional Craft Innovation',
      excerpt: 'นวัตกรรมในงานหัตถกรรมไทยที่รักษาเอกลักษณ์ดั้งเดิม',
      category: 'craft',
      date: '15 มกราคม 2568',
      image: sacitvision
    },
    {
      id: 4,
      title: 'Modern Design with Thai Elements',
      excerpt: 'การออกแบบสมัยใหม่ที่นำองค์ประกอบไทยมาประยุกต์ใช้',
      category: 'design',
      date: '12 มกราคม 2568',
      image: group107
    },
    {
      id: 5,
      title: 'Interactive Art Installations',
      excerpt: 'งานศิลปะเชิงโต้ตอบที่เชื่อมโยงผู้ชมกับผลงานศิลปะ',
      category: 'art',
      date: '10 มกราคม 2568',
      image: logo1
    },
    {
      id: 6,
      title: 'Sustainable Craft Practices',
      excerpt: 'แนวทางปฏิบัติงานหัตถกรรมที่ยั่งยืนและเป็นมิตรต่อสิ่งแวดล้อม',
      category: 'craft',
      date: '8 มกราคม 2568',
      image: vinyl
    }
  ];

  const filteredItems = activeCategory === 'all' 
    ? creativeWorksItems 
    : creativeWorksItems.filter(item => item.category === activeCategory);

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
        }}>ผลงานสร้างสรรค์</h2>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-purple-50 border border-gray-200'
              }`}
              style={{
                fontFamily: 'Prompt'
              }}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Creative Works Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 justify-items-center">
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
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-purple-900/80"></div>
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
                      ผลงานสร้างสรรค์
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
                  
                  {/* Excerpt */}
                  <p className="text-white/90 text-sm line-clamp-3" style={{
                    fontFamily: 'Prompt'
                  }}>
                    {item.excerpt}
                  </p>
                  
                  {/* Date and Arrow Button */}
                  <div className="flex items-center justify-between">
                    <span className="text-white/80 text-sm" style={{
                      fontFamily: 'Prompt'
                    }}>
                      {item.date}
                    </span>
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

export default CreativeWorks; 