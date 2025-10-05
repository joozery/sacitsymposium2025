import React from 'react';
import { motion } from 'framer-motion';
import bgImg from '../../assets/Group107.jpg';
import chingmaiLogo from '../../assets/universal/chingmai.jpg';
import lannaLogo from '../../assets/universal/lanna.jpg';
import gosinLogo from '../../assets/universal/gosin.png';
import sacitmatLogo from '../../assets/universal/sacitmat.png';

const CollaborativePartners = () => {
  // University partners data
  const universities = [
    {
      id: 1,
      name: 'มหาวิทยาลัยเชียงใหม่',
      nameEn: 'Chiang Mai University',
      logo: chingmaiLogo,
      color: '#8B4513', // Brown color for CMU
      description: 'มหาวิทยาลัยชั้นนำของภาคเหนือ ที่มีประวัติศาสตร์ยาวนานและเป็นแหล่งเรียนรู้ทางวิชาการ',
      established: '2461',
      pdfUrl: 'https://sacsitsymposium.s3.ap-southeast-1.amazonaws.com/Creative+work/University/%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2%E0%B8%A5%E0%B8%B1%E0%B8%A2%E0%B9%80%E0%B8%8A%E0%B8%B5%E0%B8%A2%E0%B8%87%E0%B9%83%E0%B8%AB%E0%B8%A1%E0%B9%88/SACIT+-+%E0%B8%A1%E0%B8%8A+%E0%B9%83%E0%B8%AA%E0%B9%88%E0%B8%9B%E0%B8%81+(01+AUG).pdf'
    },
    {
      id: 2,
      name: 'มหาวิทยาลัยเทคโนโลยีราชมงคลรัตนโกสินทร์',
      nameEn: 'Rajamangala University of Technology Rattanakosin',
      logo: gosinLogo,
      color: '#1E40AF', // Blue color
      description: 'มหาวิทยาลัยเทคโนโลยีที่มุ่งเน้นการพัฒนาทักษะด้านเทคโนโลยีและนวัตกรรม',
      established: '2548',
      pdfUrl: 'https://sacsitsymposium.s3.ap-southeast-1.amazonaws.com/Creative+work/University/%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2%E0%B8%A5%E0%B8%B1%E0%B8%A2%E0%B9%80%E0%B8%97%E0%B8%84%E0%B9%82%E0%B8%99%E0%B9%82%E0%B8%A5%E0%B8%A2%E0%B8%B5%E0%B8%A3%E0%B8%B2%E0%B8%8A%E0%B8%A1%E0%B8%87%E0%B8%84%E0%B8%A5%E0%B8%A3%E0%B8%B1%E0%B8%95%E0%B8%99%E0%B9%82%E0%B8%81%E0%B8%AA%E0%B8%B4%E0%B8%99%E0%B8%97%E0%B8%A3%E0%B9%8C/SACIT+-+%E0%B9%80%E0%B8%9E%E0%B8%B2%E0%B8%B0%E0%B8%8A%E0%B9%88%E0%B8%B2%E0%B8%87+%E0%B9%83%E0%B8%AA%E0%B9%88%E0%B8%9B%E0%B8%81+(01+AUG).pdf'
    },
    {
      id: 3,
      name: 'มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา',
      nameEn: 'Rajamangala University of Technology Lanna',
      subName: 'คณะศิลปกรรมและสถาปัตยกรรมศาสตร์',
      logo: lannaLogo,
      color: '#7C3AED', // Purple color
      description: 'คณะที่เน้นการพัฒนาศิลปกรรมและสถาปัตยกรรม เพื่อสร้างสรรค์งานศิลปะที่มีคุณค่า',
      established: '2552',
      pdfUrl: 'https://sacsitsymposium.s3.ap-southeast-1.amazonaws.com/Creative+work/University/%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2%E0%B8%A5%E0%B8%B1%E0%B8%A2%E0%B9%80%E0%B8%97%E0%B8%84%E0%B9%82%E0%B8%99%E0%B9%82%E0%B8%A5%E0%B8%A2%E0%B8%B5%E0%B8%A3%E0%B8%B2%E0%B8%8A%E0%B8%A1%E0%B8%87%E0%B8%84%E0%B8%A5%E0%B8%A5%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%99%E0%B8%B2/SACIT+-+%E0%B8%A5%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%99%E0%B8%B2+%E0%B9%83%E0%B8%AA%E0%B9%88%E0%B8%9B%E0%B8%81+(01+AUG).pdf'
    }
  ];

  const handleUniversityClick = (university) => {
    if (university.pdfUrl) {
      // เปิด PDF ในแท็บใหม่
      const link = document.createElement('a');
      link.href = university.pdfUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div
        className="w-full h-[340px] flex items-center justify-center relative pt-12"
        style={{
          backgroundImage: `url(${bgImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <h1
          className="relative z-10"
          style={{
            fontFamily: 'AWConqueror Std Didot',
            fontWeight: 700,
            fontSize: '64px',
            lineHeight: '100%',
            color: '#fff',
            textAlign: 'center',
            width: '100%',
            margin: 0,
            padding: 0,
          }}
        >
          Creative Works Exhibition
        </h1>
      </div>
      
      {/* Breadcrumb Section */}
      <div className="w-full py-4 shadow-md border-b-4" style={{background: 'linear-gradient(90deg, #533193 0%, #BFB4EE 100%)', borderBottomColor: '#533193', borderBottomWidth: '4px'}}>
        <div className="container mx-auto flex justify-center items-center">
          <span
            className="flex items-center gap-2 text-lg font-medium drop-shadow"
            style={{
              fontFamily: 'Poppins',
              fontSize: '20px',
              fontWeight: 500,
              background: 'linear-gradient(90deg, #BFB4EE 0%, #B3FFD1 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              WebkitTextFillColor: 'transparent',
              lineHeight: 'normal',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <polygon points="9,2 16,9 9,16 2,9" fill="#C7BFFF"/>
            </svg>
            Collaborative Partners
          </span>
        </div>
      </div>

      {/* Universities Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 relative">
        {/* Background Decoration - Multiple instances */}
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
          <img 
            src={sacitmatLogo} 
            alt="SACIT Background Pattern"
            className="w-64 h-64 object-contain"
          />
        </div>
        
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 opacity-8 pointer-events-none">
          <img 
            src={sacitmatLogo} 
            alt="SACIT Background Pattern"
            className="w-48 h-48 object-contain"
          />
        </div>
        
        <div className="absolute top-1/2 left-8 transform -translate-y-1/2 opacity-6 pointer-events-none">
          <img 
            src={sacitmatLogo} 
            alt="SACIT Background Pattern"
            className="w-32 h-32 object-contain"
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
          {universities.map((university, index) => (
            <motion.div
              key={university.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="group"
            >
              {/* University Card */}
              <div 
                className="bg-white rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-700 transform hover:scale-105 hover:-translate-y-2 overflow-hidden h-96 border border-gray-100 cursor-pointer"
                onClick={() => handleUniversityClick(university)}
              >
                {/* Logo Section */}
                <div 
                  className="relative h-64 flex items-center justify-center overflow-hidden bg-white"
                >
                  {/* University Logo */}
                  <div className="w-full h-full flex items-center justify-center p-6">
                    <img 
                      src={university.logo} 
                      alt={`${university.name} logo`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  {/* PDF Indicator */}
                  {university.pdfUrl && (
                    <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                      PDF
                    </div>
                  )}
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-transparent"></div>
                  
                  {/* Decorative elements */}
                  <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm border border-white/50"></div>
                  <div className="absolute bottom-4 left-4 w-6 h-6 rounded-full bg-white/40 backdrop-blur-sm border border-white/50"></div>
                </div>

                {/* Content Section */}
                <div className="p-6 h-32 flex flex-col justify-center bg-gradient-to-b from-white to-gray-50/50">
                  <div className="text-center">
                    <h3 
                      className="text-xl font-bold mb-2"
                      style={{
                        color: university.color,
                        fontFamily: 'Prompt',
                        fontWeight: '800',
                        textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                      }}
                    >
                      {university.name}
                    </h3>
                    {university.subName && (
                      <p 
                        className="text-sm mb-1"
                        style={{
                          color: university.color,
                          fontFamily: 'Prompt',
                          fontWeight: '600'
                        }}
                      >
                        {university.subName}
                      </p>
                    )}
                    <p 
                      className="text-gray-600 text-xs font-medium"
                      style={{
                        fontFamily: 'Prompt',
                        fontWeight: '500'
                      }}
                    >
                      {university.nameEn}
                    </p>
                    {university.pdfUrl && (
                      <p className="text-blue-600 text-xs mt-2 font-medium">
                        คลิกเพื่อดูเอกสาร
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Collaboration Statement */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h3 
              className="text-3xl font-bold mb-6"
              style={{
                color: 'rgb(83, 49, 146)',
                fontFamily: 'Prompt',
                fontWeight: '700'
              }}
            >
              ความร่วมมือเพื่อการพัฒนา
            </h3>
            <p 
              className="text-lg text-gray-700 leading-relaxed"
              style={{
                fontFamily: 'Prompt',
                fontWeight: '500'
              }}
            >
              การจัดนิทรรศการ Creative Works Exhibition ครั้งนี้ เป็นผลจากความร่วมมือระหว่างสถาบันการศึกษาชั้นนำ
              ที่มีวิสัยทัศน์ร่วมกันในการส่งเสริมศิลปะ วัฒนธรรม และนวัตกรรมทางการออกแบบ 
              เพื่อสร้างเครือข่ายการเรียนรู้และแลกเปลี่ยนประสบการณ์ที่จะนำไปสู่การพัฒนาที่ยั่งยืน
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CollaborativePartners;