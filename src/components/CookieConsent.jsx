import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Cookie } from 'lucide-react';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem('cookieConsent');
    
    if (!hasConsented) {
      // Show popup after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);



  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <>
      
      {/* Cookie Popup */}
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-[9999]">
        <div 
          className="bg-white rounded-2xl shadow-2xl border border-purple-200 overflow-hidden animate-in slide-in-from-bottom-4 duration-500"
          style={{ fontFamily: 'Prompt, sans-serif' }}
        >
          {/* Header */}
          <div 
            className="px-6 py-4 relative"
            style={{ background: 'linear-gradient(180deg, #533192 0%, #31195C 100%)' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Cookie className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-white font-semibold text-lg">คุกกี้</h3>
              </div>
              <button
                onClick={handleClose}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              เราใช้คุกกี้เพื่อพัฒนาประสิทธิภาพ และประสบการณ์ที่ดีในการใช้เว็บไซต์ของคุณ 
              คุณสามารถศึกษารายละเอียดได้ที่ 
              <Link 
                to="/cookie-policy" 
                className="text-purple-600 hover:text-purple-700 font-medium underline ml-1"
              >
                นโยบายคุกกี้
              </Link>
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleAccept}
                className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2.5 rounded-xl font-medium hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                ยอมรับทั้งหมด
              </button>
              <button
                onClick={handleReject}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition-all duration-300 border border-gray-300"
              >
                ปฏิเสธ
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CookieConsent; 