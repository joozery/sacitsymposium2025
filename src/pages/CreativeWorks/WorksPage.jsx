import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { ArrowRight, Sparkles } from 'lucide-react';
import useWorks from '@/hooks/useWorks';
import { Link } from 'react-router-dom';

const WorksPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredCard, setHoveredCard] = useState(null);
  const worksPerPage = 8;

  // ใช้ Works API
  const { works: apiWorks, loading: worksLoading } = useWorks({ 
    autoLoad: true,
    initialStatus: 'active'
  });

  // คำนวณ pagination
  const totalPages = Math.ceil(apiWorks.length / worksPerPage);
  const startIndex = (currentPage - 1) * worksPerPage;
  const endIndex = startIndex + worksPerPage;
  const currentWorks = apiWorks.slice(startIndex, endIndex);

  const handleWorkClick = (work) => {
    if (work.pdf_url) {
      // เปิด PDF ในแท็บใหม่
      const link = document.createElement('a');
      link.href = work.pdf_url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.download = work.pdf_filename || `${work.name}_document.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // ถ้าไม่มี PDF ให้แสดง alert หรือ modal ข้อมูล
      console.log("Work details:", work);
      alert(`ข้อมูลผลงาน: ${work.name}\nเจ้าของ: ${work.owner_name}\nหมวดหมู่: ${work.category}\nเทคนิค: ${work.technique}`);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Generate pagination numbers
  const getPaginationNumbers = () => {
    const numbers = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        numbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 3; i++) {
          numbers.push(i);
        }
        numbers.push('...');
        numbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        numbers.push(1);
        numbers.push('...');
        for (let i = totalPages - 2; i <= totalPages; i++) {
          numbers.push(i);
        }
      } else {
        numbers.push(1);
        numbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          numbers.push(i);
        }
        numbers.push('...');
        numbers.push(totalPages);
      }
    }
    
    return numbers;
  };

  return (
    <>
      <Helmet>
        <title>ผลงานสร้างสรรค์ - SACIT Symposium</title>
        <meta name="description" content="ดูผลงานสร้างสรรค์ทั้งหมดในงาน SACIT Symposium 2025" />
      </Helmet>

      <div className="min-h-screen">
        {/* Hero Section */}
        <motion.div 
          className="w-full flex items-center justify-center relative"
          style={{
            width: '100%',
            height: '280px',
            flexShrink: 0,
            background: 'linear-gradient(90deg, #BFB4EE 0%, #B3FFD1 100%)',
          }}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1
            className="relative z-10"
            style={{
              fontFamily: 'AWConqueror Std Didot',
              fontWeight: 700,
              fontSize: '40px',
              lineHeight: 'normal',
              color: '#533193',
              textAlign: 'center',
              width: '100%',
              margin: 0,
              padding: 0,
              marginTop: '60px',
              fontStyle: 'normal'
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          >
            ผลงานสร้างสรรค์
          </motion.h1>
          
          {/* Floating sparkles */}
          <motion.div
            className="absolute top-10 right-10"
            animate={{ 
              rotate: 360,
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Sparkles className="w-6 h-6 text-white/60" />
          </motion.div>
          
          <motion.div
            className="absolute bottom-10 left-10"
            animate={{ 
              rotate: -360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Sparkles className="w-4 h-4 text-white/40" />
          </motion.div>
        </motion.div>
        
        {/* Sub Navigation Bar */}
        <div className="w-full py-4" style={{
          background: 'var(--gra-2, linear-gradient(90deg, #533193 0%, #BFB4EE 100%))'
        }}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-center gap-8">
              <Link to="/creative-works/lacquer-legacy" className="cursor-pointer">
                <span style={{
                  background: 'var(--gra-1, linear-gradient(90deg, #BFB4EE 0%, #B3FFD1 100%))',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: 'Prompt'
                }}>Main Exhibition</span>
              </Link>
              <Link to="/creative-works/works" className="flex items-center gap-2 cursor-pointer">
                <span className="text-lg text-white">✦</span>
                <span className="font-medium" style={{
                  color: 'rgb(83, 49, 146)',
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

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Loading State */}
          {worksLoading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
                <motion.div 
                  key={index} 
                  className="bg-white rounded-lg shadow-lg overflow-hidden"
                  style={{ height: '500px' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
                    <div className="text-gray-400">กำลังโหลด...</div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Works Grid */}
          <AnimatePresence mode="wait">
            {!worksLoading && (
              <motion.div 
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                {currentWorks.map((work, index) => (
                  <motion.div 
                    key={`${work.name}-${currentPage}-${index}`}
                    className="bg-white rounded-lg shadow-lg overflow-hidden relative cursor-pointer"
                    style={{ height: '500px' }}
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: index * 0.1,
                      ease: "easeOut"
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      y: -10,
                      transition: { duration: 0.3 }
                    }}
                    onHoverStart={() => setHoveredCard(index)}
                    onHoverEnd={() => setHoveredCard(null)}
                  >
                    {/* Image - Full Card */}
                    <div className="relative w-full h-full">
                      <motion.img 
                        src={work.photo_url || '/src/assets/gallery/01.jpg'} 
                        alt={`${work.name} - ${work.owner_name}`} 
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                        onError={(e) => {
                          e.target.style.backgroundColor = '#f3f4f6';
                          e.target.style.display = 'flex';
                          e.target.style.alignItems = 'center';
                          e.target.style.justifyContent = 'center';
                          e.target.innerHTML = '<span style="color: #6b7280;">Image not found</span>';
                        }}
                      />
                      
                      {/* Text Overlay */}
                      <motion.div 
                        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
                      >
                        <div>
                          {/* Category */}
                          <motion.p 
                            className="text-gray-300 text-sm mb-2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 + 0.4 }}
                          >
                            {work.category || 'หมวดหมู่ไม่ระบุ'}
                          </motion.p>
                          
                          {/* Name */}
                          <motion.h3 
                            className="text-xl font-bold text-white mb-2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 + 0.5 }}
                          >
                            {work.name}
                          </motion.h3>
                          
                          {/* Owner Name */}
                          <motion.p 
                            className="text-gray-300 text-sm mb-1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 + 0.6 }}
                          >
                            {work.owner_name}
                          </motion.p>
                          
                          {/* Technique */}
                          <motion.p 
                            className="text-gray-300 text-sm"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 + 0.7 }}
                          >
                            {work.technique || 'เทคนิคไม่ระบุ'}
                          </motion.p>
                        </div>
                        
                        {/* Navigation Button */}
                        <motion.div 
                          className="flex justify-end mt-4"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.1 + 0.8 }}
                        >
                          <motion.button
                            onClick={() => handleWorkClick(work)}
                            className="w-12 h-12 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center transition-colors duration-200 shadow-lg"
                            title={work.pdf_url ? `คลิกเพื่อดู ${work.pdf_filename || 'เอกสาร'}` : `ข้อมูลผลงาน: ${work.name}`}
                            whileHover={{ 
                              scale: 1.2,
                              rotate: 15,
                              transition: { duration: 0.2 }
                            }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <ArrowRight className="w-5 h-5 text-white" />
                          </motion.button>
                        </motion.div>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div 
              className="flex justify-center items-center gap-2 mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 text-purple-600 hover:text-purple-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                ก่อนหน้า
              </button>
              
              {getPaginationNumbers().map((number, index) => (
                <button
                  key={index}
                  onClick={() => typeof number === 'number' ? handlePageChange(number) : null}
                  disabled={number === '...'}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    number === currentPage
                      ? 'bg-purple-600 text-white'
                      : number === '...'
                      ? 'text-gray-400 cursor-default'
                      : 'text-purple-600 hover:bg-purple-100'
                  }`}
                >
                  {number}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-purple-600 hover:text-purple-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                ถัดไป
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default WorksPage; 