import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Download, Eye, Calendar, MapPin, User, Image as ImageIcon, FileText } from 'lucide-react';

// Import images from Lacquer Legacy folder
import lacquerImage1 from '/src/assets/Lacquer Legacy/1.png';
import lacquerImage2 from '/src/assets/Lacquer Legacy/2.png';
import lacquerImage3 from '/src/assets/Lacquer Legacy/3.png';
import lacquerImage4 from '/src/assets/Lacquer Legacy/4.png';
import lacquerImage5 from '/src/assets/Lacquer Legacy/5.png';

const MainExhibitionLacquerLegacy = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

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

  // Import images from Lacquer Legacy folder
  const lacquerLegacyImages = [
    {
      id: 1,
      title: 'เครื่องเขินลายหางนกยูง',
      description: 'ผลงานเครื่องเขินที่ใช้ลักษณะการเขียนลวดลายโดยใช้รูปแบบการเขียนลายหางในรูปแบบของลายสันป่าตองต้นแหน เชียงใหม่',
      image: lacquerImage1,
      category: 'เครื่องเขิน',
      technique: 'ลายหางนกยูง'
    },
    {
      id: 2,
      title: 'กล่องเครื่องรักลายดอกไม้',
      description: 'กล่องเครื่องรักที่ประดับด้วยลายดอกไม้แบบไทยประยุกต์ ใช้สีธรรมชาติจากดินและพืช',
      image: lacquerImage2,
      category: 'เครื่องรักลาย',
      technique: 'ลายดอกไม้ไทย'
    },
    {
      id: 3,
      title: 'ถาดเครื่องเขินสมัยใหม่',
      description: 'ถาดเครื่องเขินที่ผสมผสานเทคนิคดั้งเดิมกับดีไซน์สมัยใหม่',
      image: lacquerImage3,
      category: 'เครื่องเขิน',
      technique: 'สมัยใหม่'
    },
    {
      id: 4,
      title: 'ชุดเครื่องรักทองคำเปลว',
      description: 'ชุดเครื่องรักที่ประดับด้วยทองคำเปลวตามแบบโบราณ',
      image: lacquerImage4,
      category: 'เครื่องรักทอง',
      technique: 'ทองคำเปลว'
    },
    {
      id: 5,
      title: 'กล่องเครื่องเขินลายนกยูง',
      description: 'กล่องเครื่องเขินที่วาดลายนกยูงด้วยเทคนิคการเขียนสีแบบโบราณ',
      image: lacquerImage5,
      category: 'เครื่องเขินลาย',
      technique: 'ลายนกยูงโบราณ'
    }
  ];

  const openLightbox = (image) => {
    setSelectedImage(image);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setSelectedImage(null);
  };

  const handleReadPDF = () => {
    // PDF URL - เปลี่ยนเป็น URL จริงที่ผู้ใช้ให้มา
    const pdfUrl = 'https://sacsitsymposium.s3.ap-southeast-1.amazonaws.com/Creative+work/%E0%B8%A3%E0%B8%B1%E0%B8%81%E0%B9%83%E0%B8%AB%E0%B8%8D%E0%B9%88+%E0%B9%84%E0%B8%A1%E0%B9%89%E0%B8%81%E0%B8%A5%E0%B8%B8%E0%B9%88%E0%B8%A1%E0%B8%8A%E0%B8%99%E0%B8%B4%E0%B8%94%E0%B8%A3%E0%B8%B1%E0%B8%81%E0%B9%83%E0%B8%AB%E0%B8%8D%E0%B9%88+%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B9%81%E0%B8%99%E0%B8%A7%E0%B8%97%E0%B8%B2%E0%B8%87%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%AAj%E0%B8%87%E0%B9%80%E0%B8%AA%E0%B8%A3%E0%B8%B4%E0%B8%A1+%E0%B8%9E%E0%B8%B1%E0%B8%92%E0%B8%99%E0%B8%B2+%E0%B8%95%E0%B9%88%E0%B8%AD%E0%B8%A2%E0%B8%AD%E0%B8%94.pdf';
    
    // เปิด PDF ในแท็บใหม่
    window.open(pdfUrl, '_blank');
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
              fontWeight: '800',
              lineHeight: 'normal',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              Main Exhibition
            </h1>
          </div>
        </div>

        {/* Sub Navigation Bar */}
        <div className="w-full py-4" style={{
          background: 'var(--gra-2, linear-gradient(90deg, #533193 0%, #BFB4EE 100%))'
        }}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-center gap-8">
              <Link to="/creative-works/lacquer-legacy" className="flex items-center gap-2 cursor-pointer">
                <span className="text-lg text-white">✦</span>
                <span className="font-medium" style={{
                  color: 'rgb(83, 49, 146)',
                  fontFamily: 'Prompt'
                }}>Main Exhibition</span>
              </Link>
              <Link to="/creative-works/works" className="cursor-pointer">
                <span style={{
                  background: 'var(--gra-1, linear-gradient(90deg, #BFB4EE 0%, #B3FFD1 100%))',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: 'Prompt'
                }}>ผลงาน</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Dark Purple Bar */}
        <div className="w-full h-2" style={{
          background: 'var(--gra-2, linear-gradient(90deg, #533193 0%, #BFB4EE 100%))'
        }}></div>
      </div>

      {/* Content Section */}
      <div className="w-full">
        {/* Image Gallery */}
        <div className="space-y-0">
          {lacquerLegacyImages.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="w-full cursor-pointer"
              onClick={() => openLightbox(item)}
            >
              {/* Image Only */}
              <div className="relative w-full">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    e.target.style.backgroundColor = '#f3f4f6';
                    e.target.style.display = 'flex';
                    e.target.style.alignItems = 'center';
                    e.target.style.justifyContent = 'center';
                    e.target.innerHTML = '<span style="color: #6b7280;">Image not found</span>';
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* PDF Button Section - Moved to bottom */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-center">
          <motion.button
            onClick={handleReadPDF}
            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            style={{ fontFamily: 'Prompt' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FileText className="w-6 h-6" />
            <span className="text-lg font-semibold">อ่าน PDF</span>
          </motion.button>
        </div>
      </div>

      {/* Lightbox */}
      {isLightboxOpen && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <img
              src={selectedImage.image}
              alt={selectedImage.title}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Prompt' }}>
                {selectedImage.title}
              </h3>
              <p className="text-sm opacity-90" style={{ fontFamily: 'Prompt' }}>
                {selectedImage.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainExhibitionLacquerLegacy; 