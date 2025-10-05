import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Download, Eye, Play, Pause } from 'lucide-react';

const LiveExhibitionSlideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [autoPlayInterval, setAutoPlayInterval] = useState(null);

  const slides = [
    {
      id: 1,
      name: 'อรพรรณ หอมเทียน',
      role: 'ช่างสิบหมู่ งานประดับกระจก',
      description: 'ศิลปินผู้เชี่ยวชาญในการประดับกระจกตามแบบโบราณ ใช้เทคนิคการตัดกระจกและประดับด้วยทองคำเปลว',
      image: 'https://sacsitsymposium.s3.ap-southeast-1.amazonaws.com/Live%20Exhibition/1.%20%E0%B8%AD%E0%B8%A3%E0%B8%9E%E0%B8%A3%E0%B8%93%E0%B9%8C%20%E0%B8%AB%E0%B8%AD%E0%B8%A1%E0%B9%80%E0%B8%97%E0%B8%B5%E0%B8%A2%E0%B8%99/pic/1.jpg',
      pdfUrl: 'https://sacsitsymposium.s3.ap-southeast-1.amazonaws.com/Live%20Exhibition/1.%20%E0%B8%AD%E0%B8%A3%E0%B8%9E%E0%B8%A3%E0%B8%93%E0%B9%8C%20%E0%B8%AB%E0%B8%AD%E0%B8%A1%E0%B9%80%E0%B8%97%E0%B8%B5%E0%B8%A2%E0%B8%99/1.%20%E0%B8%AD%E0%B8%A3%E0%B8%9E%E0%B8%A3%E0%B8%93%E0%B9%8C%20%E0%B8%AB%E0%B8%AD%E0%B8%A1%E0%B9%80%E0%B8%97%E0%B8%B5%E0%B8%A2%E0%B8%99.pdf',
      technique: 'งานประดับกระจก',
      location: 'กรุงเทพมหานคร'
    },
    {
      id: 2,
      name: 'เกษมสันต์ ยอดสง่า',
      role: 'ช่างสิบหมู่ งานลงรักประดับมุก',
      description: 'ช่างฝีมือผู้เชี่ยวชาญในการลงรักและประดับมุก ใช้เทคนิคการประดับมุกแบบโบราณที่สืบทอดกันมา',
      image: 'https://sacsitsymposium.s3.ap-southeast-1.amazonaws.com/Live%20Exhibition/2.%20%E0%B9%80%E0%B8%81%E0%B8%A8%E0%B8%A1%E0%B8%AA%E0%B8%B1%E0%B8%99%E0%B8%95%E0%B9%8C%20%E0%B8%A2%E0%B8%AD%E0%B8%94%E0%B8%AA%E0%B8%87%E0%B8%B2/pic/1.jpg',
      pdfUrl: 'https://sacsitsymposium.s3.ap-southeast-1.amazonaws.com/Live%20Exhibition/2.%20%E0%B9%80%E0%B8%81%E0%B8%A8%E0%B8%A1%E0%B8%AA%E0%B8%B1%E0%B8%99%E0%B8%95%E0%B9%8C%20%E0%B8%A2%E0%B8%AD%E0%B8%94%E0%B8%AA%E0%B8%87%E0%B8%B2/2.%20%E0%B9%80%E0%B8%81%E0%B8%A8%E0%B8%A1%E0%B8%AA%E0%B8%B1%E0%B8%99%E0%B8%95%E0%B9%8C%20%E0%B8%A2%E0%B8%AD%E0%B8%94%E0%B8%AA%E0%B8%87%E0%B8%B2.pdf',
      technique: 'งานลงรักประดับมุก',
      location: 'เชียงใหม่'
    },
    {
      id: 3,
      name: 'อัจฉราภรณ์ กล่ำเกลื่อน',
      role: 'ทายาทช่างศิลปหัตถกรรม',
      description: 'ทายาทรุ่นใหม่ที่สืบทอดภูมิปัญญาช่างศิลปหัตถกรรมจากบรรพบุรุษ พัฒนาต่อยอดด้วยเทคนิคสมัยใหม่',
      image: 'https://sacsitsymposium.s3.ap-southeast-1.amazonaws.com/Live%20Exhibition/3.%20%E0%B8%AD%E0%B8%B1%E0%B8%88%E0%B8%89%E0%B8%A3%E0%B8%B2%E0%B8%A0%E0%B8%A3%E0%B8%93%E0%B9%8C%20%E0%B8%81%E0%B8%A5%E0%B9%88%E0%B8%A1%E0%B9%80%E0%B8%81%E0%B8%A5%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%99/pic/1.jpg',
      pdfUrl: 'https://sacsitsymposium.s3.ap-southeast-1.amazonaws.com/Live%20Exhibition/3.%20%E0%B8%AD%E0%B8%B1%E0%B8%88%E0%B8%89%E0%B8%A3%E0%B8%B2%E0%B8%A0%E0%B8%A3%E0%B8%93%E0%B9%8C%20%E0%B8%81%E0%B8%A5%E0%B9%88%E0%B8%A1%E0%B9%80%E0%B8%81%E0%B8%A5%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%99/3.%20%E0%B8%AD%E0%B8%B1%E0%B8%88%E0%B8%89%E0%B8%A3%E0%B8%B2%E0%B8%A0%E0%B8%A3%E0%B8%93%E0%B9%8C%20%E0%B8%81%E0%B8%A5%E0%B9%88%E0%B8%A1%E0%B9%80%E0%B8%81%E0%B8%A5%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%99.pdf',
      technique: 'ศิลปหัตถกรรม',
      location: 'นครราชสีมา'
    },
    {
      id: 4,
      name: 'ณรงค์เดช ดอกแก้ว',
      role: 'ช่างฝีมืองานศิลปหัตถกรรมล้านนา',
      description: 'ช่างฝีมือผู้เชี่ยวชาญงานศิลปหัตถกรรมล้านนา ใช้เทคนิคการสร้างสรรค์ที่สืบทอดจากบรรพบุรุษ',
      image: 'https://sacsitsymposium.s3.ap-southeast-1.amazonaws.com/Live%20Exhibition/4.%20%E0%B8%93%E0%B8%A3%E0%B8%87%E0%B9%80%E0%B8%94%E0%B8%8A%20%E0%B8%94%E0%B8%AD%E0%B8%81%E0%B9%81%E0%B8%81%E0%B9%89%E0%B8%A7/pic/1.jpg',
      pdfUrl: 'https://sacsitsymposium.s3.ap-southeast-1.amazonaws.com/Live%20Exhibition/4.%20%E0%B8%93%E0%B8%A3%E0%B8%87%E0%B9%80%E0%B8%94%E0%B8%8A%20%E0%B8%94%E0%B8%AD%E0%B8%81%E0%B9%81%E0%B8%81%E0%B9%89%E0%B8%A7/4.%20%E0%B8%93%E0%B8%A3%E0%B8%87%E0%B9%80%E0%B8%94%E0%B8%8A%20%E0%B8%94%E0%B8%AD%E0%B8%81%E0%B9%81%E0%B8%81%E0%B9%89%E0%B8%A7.pdf',
      technique: 'ศิลปหัตถกรรมล้านนา',
      location: 'เชียงใหม่'
    },
    {
      id: 5,
      name: 'วิษณุ ผดุงศิลป์',
      role: 'ครูศิลป์ของแผ่นดิน',
      description: 'ครูศิลป์ผู้ได้รับการยกย่องเป็นครูศิลป์ของแผ่นดิน ส่งต่อภูมิปัญญาและเทคนิคการสร้างสรรค์ให้กับรุ่นใหม่',
      image: 'https://sacsitsymposium.s3.ap-southeast-1.amazonaws.com/Live%20Exhibition/5.%20%E0%B8%A7%E0%B8%B4%E0%B8%A9%E0%B8%93%E0%B8%B8%20%E0%B8%9C%E0%B8%94%E0%B8%B8%E0%B8%87%E0%B8%A8%E0%B8%B4%E0%B8%A5%E0%B8%9E%E0%B9%8C/pic/1.jpg',
      pdfUrl: 'https://sacsitsymposium.s3.ap-southeast-1.amazonaws.com/Live%20Exhibition/5.%20%E0%B8%A7%E0%B8%B4%E0%B8%A9%E0%B8%93%E0%B8%B8%20%E0%B8%9C%E0%B8%94%E0%B8%B8%E0%B8%87%E0%B8%A8%E0%B8%B4%E0%B8%A5%E0%B8%9E%E0%B9%8C/5.%20%E0%B8%A7%E0%B8%B4%E0%B8%A9%E0%B8%93%E0%B8%B8%20%E0%B8%9C%E0%B8%94%E0%B8%B8%E0%B8%87%E0%B8%A8%E0%B8%B4%E0%B8%A5%E0%B8%9E%E0%B9%8C.pdf',
      technique: 'ครูศิลป์ของแผ่นดิน',
      location: 'กรุงเทพมหานคร'
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000); // Change slide every 5 seconds
      setAutoPlayInterval(interval);
    } else {
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        setAutoPlayInterval(null);
      }
    }

    return () => {
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
      }
    };
  }, [isPlaying, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const toggleAutoPlay = () => {
    setIsPlaying(!isPlaying);
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
              Live Exhibition (Demonstrative Area)
            </h1>
            <p className="text-center mt-4" style={{
              color: 'rgb(83, 49, 146)',
              fontFamily: 'Prompt',
              fontSize: '20px',
              fontStyle: 'normal',
              fontWeight: '400',
              lineHeight: 'normal'
            }}>
              นิทรรศการสด: พื้นที่สาธิตการทำงาน
            </p>
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
            <ChevronLeft className="w-4 h-4" />
            กลับไปยังผลงานสร้างสรรค์
          </Link>
        </div>

        {/* Exhibition Description */}
        <div className="mb-12 p-8 bg-white rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-gray-800" style={{ fontFamily: 'Prompt' }}>
            พื้นที่สาธิตการทำงาน
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-6" style={{ fontFamily: 'Prompt' }}>
            นิทรรศการสด "พื้นที่สาธิตการทำงาน" นำเสนอศิลปินและช่างฝีมือผู้เชี่ยวชาญ 
            ที่จะสาธิตเทคนิคการสร้างสรรค์งานศิลปหัตถกรรมแบบสดๆ ให้ผู้ชมได้สัมผัส 
            และเรียนรู้กระบวนการทำงานที่แท้จริง
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <h3 className="font-bold text-purple-800 mb-2" style={{ fontFamily: 'Prompt' }}>สาธิตสด</h3>
              <p className="text-sm text-gray-600" style={{ fontFamily: 'Prompt' }}>ชมการทำงานจริงจากศิลปิน</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h3 className="font-bold text-green-800 mb-2" style={{ fontFamily: 'Prompt' }}>เรียนรู้</h3>
              <p className="text-sm text-gray-600" style={{ fontFamily: 'Prompt' }}>เข้าใจเทคนิคและกระบวนการ</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h3 className="font-bold text-blue-800 mb-2" style={{ fontFamily: 'Prompt' }}>สัมผัส</h3>
              <p className="text-sm text-gray-600" style={{ fontFamily: 'Prompt' }}>ประสบการณ์ตรงจากช่างฝีมือ</p>
            </div>
          </div>
        </div>

        {/* Slideshow Container */}
        <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Slideshow */}
          <div className="relative h-96 md:h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 w-full max-w-6xl">
                  {/* Image */}
                  <div className="relative">
                    <img
                      src={slides[currentSlide].image}
                      alt={slides[currentSlide].name}
                      className="w-full h-80 md:h-96 object-cover rounded-xl shadow-lg"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-purple-600 text-white text-xs rounded-full" style={{ fontFamily: 'Prompt' }}>
                        {slides[currentSlide].technique}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col justify-center space-y-6">
                    <div>
                      <h3 className="text-3xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Prompt' }}>
                        {slides[currentSlide].name}
                      </h3>
                      <p className="text-xl text-purple-600 font-semibold mb-4" style={{ fontFamily: 'Prompt' }}>
                        {slides[currentSlide].role}
                      </p>
                    </div>

                    <p className="text-gray-600 leading-relaxed text-lg" style={{ fontFamily: 'Prompt' }}>
                      {slides[currentSlide].description}
                    </p>

                    <div className="flex items-center gap-4">
                      <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm" style={{ fontFamily: 'Prompt' }}>
                        📍 {slides[currentSlide].location}
                      </span>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={() => window.open(slides[currentSlide].image, '_blank')}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span style={{ fontFamily: 'Prompt' }}>ดูภาพ</span>
                      </button>
                      <a
                        href={slides[currentSlide].pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span style={{ fontFamily: 'Prompt' }}>คลิกเพื่อดูเอกสาร</span>
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
            <button
              onClick={prevSlide}
              className="p-3 bg-white bg-opacity-80 rounded-full shadow-lg hover:bg-opacity-100 transition-all"
            >
              <ChevronLeft className="w-6 h-6 text-purple-600" />
            </button>
          </div>

          <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
            <button
              onClick={nextSlide}
              className="p-3 bg-white bg-opacity-80 rounded-full shadow-lg hover:bg-opacity-100 transition-all"
            >
              <ChevronRight className="w-6 h-6 text-purple-600" />
            </button>
          </div>

          {/* Auto-play Control */}
          <div className="absolute top-4 left-4">
            <button
              onClick={toggleAutoPlay}
              className="p-3 bg-white bg-opacity-80 rounded-full shadow-lg hover:bg-opacity-100 transition-all"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-purple-600" />
              ) : (
                <Play className="w-5 h-5 text-purple-600" />
              )}
            </button>
          </div>

          {/* Slide Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="flex gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentSlide
                      ? 'bg-purple-600'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Slide Counter */}
          <div className="absolute bottom-4 right-4">
            <span className="px-3 py-1 bg-white bg-opacity-80 rounded-full text-sm font-medium" style={{ fontFamily: 'Prompt' }}>
              {currentSlide + 1} / {slides.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveExhibitionSlideshow; 