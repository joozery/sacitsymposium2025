import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, ArrowLeft, Check } from 'lucide-react';


import logoWhite from '@/assets/logow.svg';
import symposiumText from '@/assets/symposiam.svg';

const RegisterTerms = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [agreed, setAgreed] = useState(false);
  const [privacyConsent, setPrivacyConsent] = useState('');
  const [registrationDate, setRegistrationDate] = useState('');
  
  const registrationType = location.state?.registrationType || 'general';
  
  const registrationTypeNames = {
    general: 'ลงทะเบียนเข้าร่วมงานทั่วไป',
    research: 'นำเสนอผลงานวิจัย/บทความวิชาการ',
    creative: 'นำเสนอผลงานสร้างสรรค์'
  };

  const handleAcceptTerms = () => {
    if (agreed && privacyConsent && registrationDate) {
      // Navigate to registration form with the selected type and data
      navigate('/register/form', { 
        state: { 
          registrationType,
          privacyConsent,
          registrationDate
        } 
      });
    }
  };

  const handleBackToSelection = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <div className="pt-[120px] pb-16 min-h-screen">
        <div className="container mx-auto px-4 max-w-4xl">
          
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              การลงทะเบียนเข้าร่วมงาน [Attend Registration]
            </h1>
          </motion.div>

          {/* Terms Content Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white border border-gray-200 rounded-lg shadow-lg p-8 mb-8"
          >
            <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
              <p>
                ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA) สถาบันส่งเสริมศิลปหัตถกรรมไทย (องค์การมหาชน) 
                ให้ความสำคัญกับการคุ้มครองข้อมูลส่วนบุคคลของท่าน โดยข้อมูลส่วนบุคคลที่ท่านลงทะเบียนไว้จะถูกใช้เพื่อวัตถุประสงค์ดังนี้:
              </p>

              <ol className="list-decimal list-inside space-y-3 ml-4">
                <li>จัดทำรายชื่อ/เอกสารประกอบการประชุม</li>
                <li>ประมวลผลและจัดทำรายงานสถิติผู้เข้าร่วม</li>
                <li>จัดทำและเผยแพร่วิดีโอที่เกี่ยวข้องกับการจัดประชุม</li>
                <li>ติดต่อประสานงานและแจ้งข้อมูลข่าวสาร</li>
                <li>เผยแพร่ประชาสัมพันธ์ข้อมูล รูปถ่าย และวิดีโอต่างๆ ในวันจัดประชุม</li>
              </ol>

              <p>
                ข้อมูลของท่านจะถูกเก็บเป็นความลับและเปิดเผยเท่าที่จำเป็นสำหรับการจัดการประชุมเท่านั้น
              </p>
            </div>

            {/* Privacy Policy Consent */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <span className="text-red-500">*</span> การยินยอม
              </label>
              <div className="space-y-3">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="privacyConsent"
                    value="agree"
                    checked={privacyConsent === 'agree'}
                    onChange={(e) => setPrivacyConsent(e.target.value)}
                    className="mr-2 text-[#533193] focus:ring-[#533193]"
                  />
                  <span className="text-sm text-gray-700">ยินยอม (Agree)</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="privacyConsent"
                    value="disagree"
                    checked={privacyConsent === 'disagree'}
                    onChange={(e) => setPrivacyConsent(e.target.value)}
                    className="mr-2 text-[#533193] focus:ring-[#533193]"
                  />
                  <span className="text-sm text-gray-700">ไม่ยินยอม (Disagree)</span>
                </label>
              </div>
            </div>

            {/* Registration Date Selection */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Date of Registeration<span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="registrationDate"
                    value="august7"
                    checked={registrationDate === 'august7'}
                    onChange={(e) => setRegistrationDate(e.target.value)}
                    className="mr-2 text-[#533193] focus:ring-[#533193]"
                  />
                  <span className="text-sm text-gray-700">วันที่ 7 สิงหาคม 2568 (August 7, 2025)</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="registrationDate"
                    value="august8"
                    checked={registrationDate === 'august8'}
                    onChange={(e) => setRegistrationDate(e.target.value)}
                    className="mr-2 text-[#533193] focus:ring-[#533193]"
                  />
                  <span className="text-sm text-gray-700">วันที่ 8 สิงหาคม 2568 (August 8, 2025)</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="registrationDate"
                    value="august7-8"
                    checked={registrationDate === 'august7-8'}
                    onChange={(e) => setRegistrationDate(e.target.value)}
                    className="mr-2 text-[#533193] focus:ring-[#533193]"
                  />
                  <span className="text-sm text-gray-700">วันที่ 7-8 สิงหาคม 2568 (August 7-8, 2025)</span>
                </label>
              </div>
            </div>

            {/* Agreement Checkbox */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-start space-x-3">
                <button
                  onClick={() => setAgreed(!agreed)}
                  className={`flex-shrink-0 w-5 h-5 rounded border-2 border-gray-400 flex items-center justify-center transition-colors mt-0.5 ${
                    agreed ? 'bg-gray-600 border-gray-600 text-white' : 'bg-white'
                  }`}
                >
                  {agreed && <Check className="w-3 h-3" />}
                </button>
                <label className="text-sm text-gray-700 cursor-pointer leading-relaxed" onClick={() => setAgreed(!agreed)}>
                  ยอมรับเงื่อนไขและข้อตกลงการลงทะเบียนในการเข้าร่วม
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mt-8">
              <Button
                onClick={handleAcceptTerms}
                disabled={!agreed || !privacyConsent || !registrationDate}
                className={`px-8 py-2 rounded-full transition-all duration-300 ${
                  agreed && privacyConsent && registrationDate
                    ? 'bg-[#533193] text-white hover:bg-[#533193]' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                ถัดไป
              </Button>
            </div>

            {/* Back Link */}
            <div className="text-center mt-6">
              <button 
                onClick={handleBackToSelection}
                className="text-blue-600 hover:text-blue-800 transition-colors font-medium underline"
              >
                กลับไปยังหน้าแรก
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RegisterTerms; 