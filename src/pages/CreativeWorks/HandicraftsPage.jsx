import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const HandicraftsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
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

  const works = [
    {
      id: 1,
      title: 'น.ส.อัจฉราภรณ์ กล่ำเกลื่อน',
      artist: 'อาจารย์ สมศักดิ์ ช่างทอง',
      organization: 'มหาวิทยาลัยศิลปากร',
      description: 'ผลงานเครื่องเงินแกะสลักลายไทยประยุกต์ ที่ผสมผสานเทคนิคดั้งเดิมกับการออกแบบสมัยใหม่',
      image: 'https://sacsitsymposium.s3.ap-southeast-1.amazonaws.com/Creative+work/%E0%B8%87%E0%B8%B2%E0%B8%99%E0%B8%AB%E0%B8%B1%E0%B8%95%E0%B8%96%E0%B8%A8%E0%B8%B4%E0%B8%A5%E0%B8%9B%E0%B9%8C%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%93%E0%B8%B5%E0%B8%95%E0%B8%A8%E0%B8%B4%E0%B8%A5%E0%B8%9B%E0%B9%8C/1.+%E0%B8%99.%E0%B8%AA.%E0%B8%AD%E0%B8%B1%E0%B8%88%E0%B8%89%E0%B8%A3%E0%B8%B2%E0%B8%A0%E0%B8%A3%E0%B8%93%E0%B9%8C+%E0%B8%81%E0%B8%A5%E0%B9%88%E0%B8%B3%E0%B9%80%E0%B8%81%E0%B8%A5%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%99/pic/4.jpg',
      pdfUrl: 'https://sacsitsymposium.s3.ap-southeast-1.amazonaws.com/Creative+work/%E0%B8%87%E0%B8%B2%E0%B8%99%E0%B8%AB%E0%B8%B1%E0%B8%95%E0%B8%96%E0%B8%A8%E0%B8%B4%E0%B8%A5%E0%B8%9B%E0%B9%8C%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%93%E0%B8%B5%E0%B8%95%E0%B8%A8%E0%B8%B4%E0%B8%A5%E0%B8%9B%E0%B9%8C/1.+%E0%B8%99.%E0%B8%AA.%E0%B8%AD%E0%B8%B1%E0%B8%88%E0%B8%89%E0%B8%A3%E0%B8%B2%E0%B8%A0%E0%B8%A3%E0%B8%93%E0%B9%8C+%E0%B8%81%E0%B8%A5%E0%B9%88%E0%B8%B3%E0%B9%80%E0%B8%81%E0%B8%A5%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%99/1.+%E0%B8%99.%E0%B8%AA.%E0%B8%AD%E0%B8%B1%E0%B8%88%E0%B8%89%E0%B8%A3%E0%B8%B2%E0%B8%A0%E0%B8%A3%E0%B8%93%E0%B9%8C+%E0%B8%81%E0%B8%A5%E0%B9%88%E0%B8%B3%E0%B9%80%E0%B8%81%E0%B8%A5%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%99+-+%E0%B8%87%E0%B8%B2%E0%B8%99%E0%B8%AB%E0%B8%B1%E0%B8%95%E0%B8%96%E0%B8%A8%E0%B8%B4%E0%B8%A5%E0%B8%9B%E0%B9%8C%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%93%E0%B8%B5%E0%B8%95%E0%B8%A8%E0%B8%B4%E0%B8%A5%E0%B8%9B%E0%B9%8C+-+%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1%E0%B8%A5%E0%B8%B6%E0%B8%81%E0%B8%A5%E0%B8%B1%E0%B8%9A+%E0%B8%8B%E0%B9%88%E0%B9%88%E0%B8%AD%E0%B8%99%E0%B9%80%E0%B8%A3%E0%B9%89%E0%B8%99.pdf',
      category: 'เครื่องเงิน',
      year: '2024',
      location: 'กรุงเทพมหานคร'
    },
    {
      id: 2,
      title: 'นายศุภชัย เสริมสุขเจริญชัย',
      artist: 'คุณ วิไล สีฟ้า',
      organization: 'ศูนย์ศิลปาชีพ',
      description: 'เครื่องปั้นดินเผาลายครามที่ใช้เทคนิคการเขียนสีแบบโบราณ ผสมผสานกับลวดลายไทยร่วมสมัย',
      image: 'https://sacsitsymposium.s3.ap-southeast-1.amazonaws.com/Creative+work/%E0%B8%87%E0%B8%B2%E0%B8%99%E0%B8%AB%E0%B8%B1%E0%B8%95%E0%B8%96%E0%B8%A8%E0%B8%B4%E0%B8%A5%E0%B8%9B%E0%B9%8C%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%93%E0%B8%B5%E0%B8%95%E0%B8%A8%E0%B8%B4%E0%B8%A5%E0%B8%9B%E0%B9%8C/2.+%E0%B8%99%E0%B8%B2%E0%B8%A2%E0%B8%A8%E0%B8%B8%E0%B8%A0%E0%B8%8A%E0%B8%B1%E0%B8%A2+%E0%B9%80%E0%B8%AA%E0%B8%A3%E0%B8%B4%E0%B8%A1%E0%B8%AA%E0%B8%B8%E0%B8%82%E0%B9%80%E0%B8%88%E0%B8%A3%E0%B8%B4%E0%B8%8D%E0%B8%8A%E0%B8%B1%E0%B8%A2/pic/4.jpg',
      pdfUrl: 'https://sacsitsymposium.s3.ap-southeast-1.amazonaws.com/Creative+work/%E0%B8%87%E0%B8%B2%E0%B8%99%E0%B8%AB%E0%B8%B1%E0%B8%95%E0%B8%96%E0%B8%A8%E0%B8%B4%E0%B8%A5%E0%B8%9B%E0%B9%8C%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%93%E0%B8%B5%E0%B8%95%E0%B8%A8%E0%B8%B4%E0%B8%A5%E0%B8%9B%E0%B9%8C/2.+%E0%B8%99%E0%B8%B2%E0%B8%A2%E0%B8%A8%E0%B8%B8%E0%B8%A0%E0%B8%8A%E0%B8%B1%E0%B8%A2+%E0%B9%80%E0%B8%AA%E0%B8%A3%E0%B8%B4%E0%B8%A1%E0%B8%AA%E0%B8%B8%E0%B8%82%E0%B9%80%E0%B8%88%E0%B8%A3%E0%B8%B4%E0%B8%8D%E0%B8%8A%E0%B8%B1%E0%B8%A2/2.+%E0%B8%99%E0%B8%B2%E0%B8%A2%E0%B8%A8%E0%B8%B8%E0%B8%A0%E0%B8%8A%E0%B8%B1%E0%B8%A2+%E0%B9%80%E0%B8%AA%E0%B8%A3%E0%B8%B4%E0%B8%A1%E0%B8%AA%E0%B8%B8%E0%B8%82%E0%B9%80%E0%B8%88%E0%B8%A3%E0%B8%B4%E0%B8%8D%E0%B8%8A%E0%B8%B1%E0%B8%A2.pdf',
      category: 'เครื่องปั้นดินเผา',
      year: '2024',
      location: 'เชียงใหม่'
    },
    {
      id: 3,
      title: 'นายพฤกษ์ ระย้า',
      artist: 'อาจารย์ มณี ทองใส',
      organization: 'มหาวิทยาลัยขอนแก่น',
      description: 'ผ้าไหมมัดหมี่ลวดลายประเพณีอีสาน ที่ผสมผสานสีสันและลวดลายแบบร่วมสมัย',
      image: 'https://sacsitsymposium.s3.ap-southeast-1.amazonaws.com/Creative+work/%E0%B8%87%E0%B8%B2%E0%B8%99%E0%B8%AB%E0%B8%B1%E0%B8%95%E0%B8%96%E0%B8%A8%E0%B8%B4%E0%B8%A5%E0%B8%9B%E0%B9%8C%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%93%E0%B8%B5%E0%B8%95%E0%B8%A8%E0%B8%B4%E0%B8%A5%E0%B8%9B%E0%B9%8C/3.+%E0%B8%99%E0%B8%B2%E0%B8%A2%E0%B8%9E%E0%B8%A4%E0%B8%81%E0%B8%A9%E0%B9%8C+%E0%B8%A3%E0%B8%B0%E0%B8%A2%E0%B9%89%E0%B8%B2/pic/4.jpg',
      pdfUrl: 'https://sacsitsymposium.s3.ap-southeast-1.amazonaws.com/Creative+work/%E0%B8%87%E0%B8%B2%E0%B8%99%E0%B8%AB%E0%B8%B1%E0%B8%95%E0%B8%96%E0%B8%A8%E0%B8%B4%E0%B8%A5%E0%B8%9B%E0%B9%8C%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%93%E0%B8%B5%E0%B8%95%E0%B8%A8%E0%B8%B4%E0%B8%A5%E0%B8%9B%E0%B9%8C/3.+%E0%B8%99%E0%B8%B2%E0%B8%A2%E0%B8%9E%E0%B8%A4%E0%B8%81%E0%B8%A9%E0%B9%8C+%E0%B8%A3%E0%B8%B0%E0%B8%A2%E0%B9%89%E0%B8%B2/3.+%E0%B8%99%E0%B8%B2%E0%B8%A2%E0%B8%9E%E0%B8%A4%E0%B8%81%E0%B8%A9%E0%B9%8C+%E0%B8%A3%E0%B8%B0%E0%B8%A2%E0%B9%89%E0%B8%B2.pdf',
      category: 'ผ้าทอ',
      year: '2024',
      location: 'ขอนแก่น'
    }
  ];

  // Pagination logic
  const totalPages = Math.ceil(works.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentWorks = works.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
              fontWeight: '700',
              lineHeight: 'normal'
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
        {/* Back Button */}
        <div className="mb-8">
          <Link 
            to="/creative-works"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors"
            style={{
              fontFamily: 'Prompt'
            }}
          >
            <span>←</span>
            กลับไปยังผลงานสร้างสรรค์
          </Link>
        </div>

        {/* Works Grid */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center" style={{
            fontFamily: 'Prompt'
          }}>งานหัตถศิลป์และประณีตศิลป์</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 justify-items-center">
            {currentWorks.map((work, index) => (
              <div 
                key={work.id} 
                className="relative rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 animate-fade-in-up cursor-pointer" 
                style={{
                  width: '100%',
                  maxWidth: '350px',
                  height: '450px',
                  flexShrink: 0,
                  animationDelay: `${index * 0.1}s`
                }}
                onClick={() => work.pdfUrl && work.pdfUrl !== '#' && window.open(work.pdfUrl, '_blank')}
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img 
                    src={work.image} 
                    alt={work.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-purple-900/80"></div>
                </div>
                
                {/* Content */}
                <div className="relative z-10 p-6 h-full flex flex-col justify-end">
                  {/* Content Section - All content at bottom */}
                  <div className="space-y-4">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      <span className="text-white text-xs font-bold px-3 py-1" style={{
                        fontFamily: 'Prompt',
                        borderRadius: '15px',
                        border: '1px solid #B3FFD1',
                        textShadow: '0 1px 2px rgba(0,0,0,0.6)'
                      }}>
                        หัตถศิลป์และประณีตศิลป์
                      </span>
                      <span className="text-white text-xs font-bold px-3 py-1" style={{
                        fontFamily: 'Prompt',
                        borderRadius: '15px',
                        border: '1px solid #B3FFD1',
                        textShadow: '0 1px 2px rgba(0,0,0,0.6)'
                      }}>
                        {work.category}
                      </span>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-xl font-bold text-white leading-tight" style={{
                      fontFamily: 'Prompt',
                      textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                    }}>
                      {work.title}
                    </h3>
                    
                    {/* Arrow Button */}
                    <div className="flex justify-end">
                      <div 
                        className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 group-hover:bg-white/30 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (work.pdfUrl && work.pdfUrl !== '#') {
                            window.open(work.pdfUrl, '_blank');
                          }
                        }}
                      >
                        <div className="w-0 h-0 border-l-[6px] border-l-white border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ml-0.5"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-12 gap-2">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
                style={{ fontFamily: 'Prompt' }}
              >
                ก่อนหน้า
              </button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  style={{ fontFamily: 'Prompt' }}
                >
                  {page}
                </button>
              ))}

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === totalPages
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
                style={{ fontFamily: 'Prompt' }}
              >
                ถัดไป
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HandicraftsPage;