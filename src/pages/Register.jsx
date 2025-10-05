import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';


import logoWhite from '@/assets/logow.svg';
import symposiumText from '@/assets/symposiam.svg';
import heroslideImage from '@/assets/heroslide/heroslide.jpg';

const Register = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState(null);

  const handleRegistrationTypeSelect = (type) => {
    setSelectedType(type);
    // Navigate to terms and conditions page with the selected type
    navigate('/register/terms', { state: { registrationType: type } });
  };

  const handleFeatureClick = () => {
    console.log("Feature not implemented yet.");
  };

  const registrationTypes = [
    {
      id: 'general',
      title: 'ลงทะเบียนเข้าร่วมงานทั่วไป',
      description: 'สำหรับผู้เข้าร่วมงานทั่วไป'
    },
    {
      id: 'research',
      title: 'นำเสนอผลงานวิจัย/บทความวิชาการ',
      description: 'สำหรับการนำเสนอผลงานวิจัยและบทความวิชาการ'
    },
    {
      id: 'creative',
      title: 'นำเสนอผลงานสร้างสรรค์',
      description: 'สำหรับการนำเสนอผลงานสร้างสรรค์และศิลปกรรม'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8B7DC3] via-[#B3FFD1] to-[#BFB4EE] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#533193] rounded-full opacity-10 -translate-x-48 -translate-y-48"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#533193] rounded-full opacity-15 translate-x-40 translate-y-40"></div>
      


      {/* Main Content */}
      <div className="pt-[120px] pb-16 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Background Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative w-full max-w-[600px] mx-auto">
              {/* Purple Frame */}
              <div className="absolute inset-0 bg-[#533193] rounded-lg transform translate-x-4 translate-y-4"></div>
              
              {/* Image */}
              <div className="relative bg-white rounded-lg overflow-hidden">
                <img src={heroslideImage} alt="SACIT Symposium Event" className="w-full h-[500px] object-cover"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Registration Options */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-[#533193] mb-4">Register</h1>
              <p className="text-[#533193]/80 text-lg">เลือกประเภทการลงทะเบียน</p>
            </div>

            <div className="space-y-4">
              {registrationTypes.map((type, index) => (
                <motion.button
                  key={type.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-[#B3FFD1]/80 backdrop-blur-sm text-[#533193] py-4 px-6 rounded-full text-lg font-medium border border-[#533193]/20 hover:bg-[#B3FFD1] transition-all duration-300 shadow-lg text-left"
                  onClick={() => handleRegistrationTypeSelect(type.id)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                >
                  <div>
                    <div className="font-semibold">{type.title}</div>
                    <div className="text-sm text-[#533193]/70 mt-1">{type.description}</div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Back to Home */}
            <div className="text-center mt-8">
              <Link 
                to="/" 
                className="text-[#533193] hover:text-[#533193]/80 transition-colors font-medium"
              >
                ← กลับสู่หน้าหลัก
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register; 