import React from 'react';
import { Link } from 'react-router-dom';
import cover5 from '/src/assets/cover5.jpg';

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

  const categories = [
    {
      id: 'lacquerware',
      title: '01 เครื่องรัก เครื่องเขิน',
      subtitle: 'Lacquerware, Gilded Lacquerware',
      description: 'ผลงานศิลปะเครื่องรัก เครื่องเขิน ที่แสดงถึงภูมิปัญญาและเทคนิคการทำเครื่องรักแบบดั้งเดิม',
      image: cover5,
      count: 12,
      path: '/creative-works/lacquerware'
    },
    {
      id: 'handicrafts',
      title: '02 งานหัตถศิลป์และประณีตศิลป์',
      subtitle: 'Handicrafts and Fine Arts',
      description: 'ผลงานหัตถศิลป์และประณีตศิลป์ที่เน้นความประณีตและความงามทางศิลปะ',
      image: cover5,
      count: 8,
      path: '/creative-works/handicrafts'
    },
    {
      id: 'applied',
      title: '03 งานหัตถกรรมเชิงประยุกต์',
      subtitle: 'Applied Handicrafts',
      description: 'ผลงานหัตถกรรมที่นำมาประยุกต์ใช้ในชีวิตประจำวันและอุตสาหกรรม',
      image: cover5,
      count: 15,
      path: '/creative-works/applied'
    },
    {
      id: 'local',
      title: '04 งานหัตถกรรมพื้นถิ่น และอื่น ๆ',
      subtitle: 'Local Handicrafts and Others',
      description: 'ผลงานหัตถกรรมพื้นถิ่นและผลงานสร้างสรรค์อื่นๆ ที่แสดงถึงวัฒนธรรมท้องถิ่น',
      image: cover5,
      count: 20,
      path: '/creative-works/local'
    },
    {
      id: 'partners',
      title: '05 Collaborative Partners',
      subtitle: 'พันธมิตรทางวิชาการ',
      description: 'มหาวิทยาลัยและสถาบันการศึกษาที่ร่วมกันจัดนิทรรศการผลงานสร้างสรรค์',
      image: cover5,
      count: 3,
      path: '/creative-works/partners'
    }
  ];

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
              color: 'rgb(83, 49, 146)',
              fontFamily: 'Prompt',
              fontSize: '48px',
              fontStyle: 'normal',
              fontWeight: '800',
              lineHeight: 'normal',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              ผลงานสร้างสรรค์
            </h1>
          </div>
        </div>

        {/* Sub Navigation Bar */}
        <div className="w-full py-4" style={{
          background: 'var(--gra-2, linear-gradient(90deg, #533193 0%, #BFB4EE 100%))'
        }}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-center gap-8">
              <Link to="/news" className="cursor-pointer">
                <span style={{
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
              <Link to="/creative-works" className="flex items-center gap-2 cursor-pointer">
                <span className="text-lg text-white">✦</span>
                <span className="font-medium" style={{
                  color: 'rgb(83, 49, 146)',
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
        {/* Creative Works Grid */}
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
            {categories.map((category, index) => (
              <Link 
                key={category.id} 
                to={category.path}
                className="relative rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 animate-fade-in-up block" 
                style={{
                  width: '100%',
                  maxWidth: '500px',
                  height: '300px',
                  flexShrink: 0,
                  animationDelay: `${index * 0.1}s`
                }}
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img 
                    src={category.image} 
                    alt={category.title}
                    className="w-full h-full object-cover"
                    style={{
                      objectFit: 'cover',
                      objectPosition: 'center'
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
                    <div className="flex items-center gap-2">
                      <span className="text-xs border border-white/60 text-white px-3 py-1 rounded-full" style={{
                        fontFamily: 'Prompt'
                      }}>
                        ผลงานสร้างสรรค์
                      </span>
                      <span className="text-xs border border-white/60 text-white px-3 py-1 rounded-full" style={{
                        fontFamily: 'Prompt'
                      }}>
                        {category.count} ผลงาน
                      </span>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-2xl font-bold text-white line-clamp-2" style={{
                      fontFamily: 'Prompt',
                      textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                      fontWeight: '800'
                    }}>
                      {category.title}
                    </h3>
                    
                    {/* Subtitle */}
                    <p className="text-white text-lg font-medium" style={{
                      fontFamily: 'Prompt',
                      textShadow: '0 1px 2px rgba(0,0,0,0.4)',
                      fontWeight: '600'
                    }}>
                      {category.subtitle}
                    </p>
                    
                    {/* Description */}
                    <p className="text-white text-sm line-clamp-2" style={{
                      fontFamily: 'Prompt',
                      textShadow: '0 1px 2px rgba(0,0,0,0.4)',
                      fontWeight: '500'
                    }}>
                      {category.description}
                    </p>
                    
                    {/* Arrow Button */}
                    <div className="flex items-center justify-end">
                      <button className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors">
                        <div className="w-0 h-0 border-l-[8px] border-l-white border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1"></div>
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>


      </div>
    </div>
  );
};

export default CreativeWorks; 