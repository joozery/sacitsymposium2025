import React, { useState, useEffect } from 'react';
import '@fontsource/poppins';
import '@fontsource/poppins/400.css';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Diamond, Sparkles, Users, Image as ImageIcon, Newspaper as LucideNewspaper, BarChart2, Send, Search, Menu, X, FileText } from 'lucide-react';
import Lightbox from '@/components/Lightbox';
import authService from '@/services/authService';
import ReactPlayer from 'react-player';
import CookieConsent from '@/components/CookieConsent';
import useSpeakers from '@/hooks/useSpeakers';
import useExhibitions from '@/hooks/useExhibitions';
import useGallery from '@/hooks/useGallery';
import useCreativeWorks from '@/hooks/useCreativeWorks';

import logoWhite from '@/assets/logow.svg';
import symposiumText from '@/assets/symposiam.svg';
import kvSymposium from '@/assets/KV Symposium.svg';
import heroslideImage from '@/assets/heroslide/heroslide.jpg';
import bghero from '@/assets/bghero.mp4';

// Speaker images (fallback)
import speaker01 from '@/assets/speker/01.jpg';
import speaker02 from '@/assets/speker/02.jpg';
import speaker03 from '@/assets/speker/03.jpg';
import speaker04 from '@/assets/speker/04.jpg';
import speaker05 from '@/assets/speker/05.jpg';

// Gallery images
import gallery01 from '@/assets/gallery/01.jpg';
import gallery02 from '@/assets/gallery/02.jpg';
import gallery03 from '@/assets/gallery/03.jpg';
import gallery04 from '@/assets/gallery/04.jpg';
import gallery05 from '@/assets/gallery/05.jpg';
import gallery06 from '@/assets/gallery/06.jpg';
import gallery07 from '@/assets/gallery/07.jpg';
import gallery08 from '@/assets/gallery/08.jpg';
import gallery09 from '@/assets/gallery/09.jpg';

// Live Exhibition Slideshow Component for Home - 6 Cards at a time
const LiveExhibitionSlideshowHome = ({ exhibitions, onExhibitionClick }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentMobileSlide, setCurrentMobileSlide] = useState(0); // Separate state for mobile
  const [isPlaying, setIsPlaying] = useState(false); // Disable auto-play by default
  const [autoPlayInterval, setAutoPlayInterval] = useState(null);
  
  const cardsPerSlide = 6;
  const cardsPerSlideMobile = 2;
  const totalSlides = Math.ceil(exhibitions.length / cardsPerSlide);
  const totalSlidesMobile = Math.ceil(exhibitions.length / cardsPerSlideMobile);

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
      }, 8000); // Change slide every 8 seconds (slower)
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
  }, [isPlaying, totalSlides]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Mobile navigation functions
  const nextMobileSlide = () => {
    setCurrentMobileSlide((prev) => (prev + 1) % exhibitions.length);
  };

  const prevMobileSlide = () => {
    setCurrentMobileSlide((prev) => (prev - 1 + exhibitions.length) % exhibitions.length);
  };

  const goToMobileSlide = (index) => {
    setCurrentMobileSlide(index);
  };

  const toggleAutoPlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Get current cards to display
  const getCurrentCards = () => {
    const startIndex = currentSlide * cardsPerSlide;
    return exhibitions.slice(startIndex, startIndex + cardsPerSlide);
  };

  // Get current cards for mobile
  const getCurrentCardsMobile = () => {
    const startIndex = currentSlide * cardsPerSlideMobile;
    return exhibitions.slice(startIndex, startIndex + cardsPerSlideMobile);
  };

  return (
    <div className="relative w-full">
      {/* Desktop Slideshow Container */}
      <div className="hidden md:block relative overflow-hidden" style={{ height: '356px' }}>
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 20 }} // Reduced movement
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }} // Reduced movement
          transition={{ duration: 0.3 }} // Faster transition
          className="absolute inset-0"
        >
          {/* Flex layout like Speaker cards */}
          <div className="flex gap-0 w-full h-full">
            {getCurrentCards().map((exhibition, index) => (
              <motion.div
                key={index}
                className="relative group overflow-hidden flex-1 cursor-pointer"
                style={{ height: '356px' }}
                initial={{ opacity: 0, y: 10 }} // Reduced movement
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }} // Faster and less delay
                onClick={() => onExhibitionClick(exhibition)}
                title={exhibition.pdfUrl ? `คลิกเพื่อดู ${exhibition.pdfFileName || 'เอกสาร'}` : `ข้อมูลศิลปิน: ${exhibition.name}`}
              >
                <img 
                  src={exhibition.imgSrc} 
                  alt={`${exhibition.name} - ${exhibition.title}`} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => {
                    e.target.style.backgroundColor = '#f3f4f6';
                    e.target.style.display = 'flex';
                    e.target.style.alignItems = 'center';
                    e.target.style.justifyContent = 'center';
                    e.target.innerHTML = '<span style="color: #6b7280;">Image not found</span>';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                
                {/* PDF Indicator */}
                {exhibition.pdfUrl && (
                  <div className="absolute top-4 right-4 bg-white/90 text-gray-800 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    PDF
                  </div>
                )}
                
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-lg font-custom-bold mb-1">{exhibition.name}</h3>
                  <p className="text-sm font-custom opacity-90">{exhibition.title}</p>
                  {exhibition.position && (
                    <p className="text-xs text-gray-300 mt-1">{exhibition.position}</p>
                  )}
                  {exhibition.pdfUrl && (
                    <p className="text-xs text-green-300 mt-1">คลิกเพื่อดูเอกสาร</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Mobile Slideshow Container */}
      <div className="md:hidden relative">
        {/* Carousel Container */}
        <div className="relative overflow-hidden rounded-lg" style={{ height: '400px' }}>
          <motion.div
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentMobileSlide * 100}%)` }}
          >
            {exhibitions.map((exhibition, index) => (
              <div
                key={index}
                className="relative w-full flex-shrink-0 cursor-pointer"
                style={{ height: '400px' }}
                onClick={() => onExhibitionClick(exhibition)}
                title={exhibition.pdfUrl ? `คลิกเพื่อดู ${exhibition.pdfFileName || 'เอกสาร'}` : `ข้อมูลศิลปิน: ${exhibition.name}`}
              >
                <img 
                  src={exhibition.imgSrc} 
                  alt={`${exhibition.name} - ${exhibition.title}`} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.backgroundColor = '#f3f4f6';
                    e.target.style.display = 'flex';
                    e.target.style.alignItems = 'center';
                    e.target.style.justifyContent = 'center';
                    e.target.innerHTML = '<span style="color: #6b7280;">Image not found</span>';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                
                {/* PDF Indicator */}
                {exhibition.pdfUrl && (
                  <div className="absolute top-4 right-4 bg-white/90 text-gray-800 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    PDF
                  </div>
                )}
                
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-xl font-custom-bold mb-2">{exhibition.name}</h3>
                  <p className="text-base font-custom opacity-90">{exhibition.title}</p>
                  {exhibition.position && (
                    <p className="text-sm text-gray-300 mt-1">{exhibition.position}</p>
                  )}
                  {exhibition.pdfUrl && (
                    <p className="text-sm text-green-300 mt-1">คลิกเพื่อดูเอกสาร</p>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prevMobileSlide}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <button
          onClick={nextMobileSlide}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-4 space-x-2">
          {exhibitions.map((_, index) => (
            <button
              key={index}
              onClick={() => goToMobileSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentMobileSlide 
                  ? 'bg-[#533193] scale-125' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Navigation Controls - Desktop Only */}
      <div className="hidden md:block absolute top-1/2 left-4 transform -translate-y-1/2">
        <button
          onClick={prevSlide}
          className="p-3 bg-white bg-opacity-80 rounded-full shadow-lg hover:bg-opacity-100 transition-all"
        >
          <ChevronLeft className="w-6 h-6 text-purple-600" />
        </button>
      </div>

      <div className="hidden md:block absolute top-1/2 right-4 transform -translate-y-1/2">
        <button
          onClick={nextSlide}
          className="p-3 bg-white bg-opacity-80 rounded-full shadow-lg hover:bg-opacity-100 transition-all"
        >
          <ChevronRight className="w-6 h-6 text-purple-600" />
        </button>
      </div>

      {/* Slide Indicators - Desktop Only */}
      <div className="hidden md:block absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="flex gap-2">
          {Array.from({ length: totalSlides }, (_, index) => (
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

      {/* Slide Counter - Desktop Only */}
      <div className="hidden md:block absolute bottom-4 right-4">
        <span className="px-3 py-1 bg-white bg-opacity-80 rounded-full text-sm font-custom-bold">
          {currentSlide + 1} / {totalSlides}
        </span>
      </div>
    </div>
  );
};

// Mobile Speaker Carousel Component
const MobileSpeakerCarousel = ({ speakers, onSpeakerClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === speakers.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? speakers.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="relative">
      {/* Carousel Container */}
      <div className="relative overflow-hidden rounded-lg" style={{ height: '400px' }}>
        <motion.div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {speakers.map((speaker, index) => (
            <div
              key={index}
              className="relative w-full flex-shrink-0 cursor-pointer"
              style={{ height: '400px' }}
              onClick={() => onSpeakerClick(speaker)}
            >
              <img 
                src={speaker.imgSrc} 
                alt={`${speaker.name} - ${speaker.title}`} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.backgroundColor = '#f3f4f6';
                  e.target.style.display = 'flex';
                  e.target.style.alignItems = 'center';
                  e.target.style.justifyContent = 'center';
                  e.target.innerHTML = '<span style="color: #6b7280;">Image not found</span>';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-xl font-custom-bold mb-2">{speaker.name}</h3>
                <p className="text-base font-custom opacity-90">{speaker.title}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-4 space-x-2">
        {speakers.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentIndex 
                ? 'bg-[#533193] scale-125' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// Mobile Exhibition Carousel Component
const MobileExhibitionCarousel = ({ exhibitions, onExhibitionClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === exhibitions.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? exhibitions.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="relative">
      {/* Carousel Container */}
      <div className="relative overflow-hidden rounded-lg" style={{ height: '400px' }}>
        <motion.div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {exhibitions.map((exhibition, index) => (
            <div
              key={index}
              className="relative w-full flex-shrink-0 cursor-pointer"
              style={{ height: '400px' }}
              onClick={() => onExhibitionClick(exhibition)}
            >
              <img 
                src={exhibition.imgSrc} 
                alt={`${exhibition.name} - ${exhibition.title}`} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.backgroundColor = '#f3f4f6';
                  e.target.style.display = 'flex';
                  e.target.style.alignItems = 'center';
                  e.target.style.justifyContent = 'center';
                  e.target.innerHTML = '<span style="color: #6b7280;">Image not found</span>';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              
              {/* PDF Indicator */}
              {exhibition.pdfUrl && (
                <div className="absolute top-4 right-4 bg-white/90 text-gray-800 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  PDF
                </div>
              )}
              
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-xl font-custom-bold mb-2">{exhibition.name}</h3>
                <p className="text-base font-custom opacity-90 mb-1">{exhibition.title}</p>
                {exhibition.position && (
                  <p className="text-sm text-gray-300 mb-1">{exhibition.position}</p>
                )}
                {exhibition.pdfUrl && (
                  <p className="text-sm text-green-300">คลิกเพื่อดูเอกสาร</p>
                )}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-4 space-x-2">
        {exhibitions.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentIndex 
                ? 'bg-[#533193] scale-125' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);

  // Use speakers API
  const { speakers: apiSpeakers, loading: speakersLoading } = useSpeakers({ 
    autoLoad: true,
    initialStatus: 'active'
  });

  // Use gallery API
  const { galleryImages, loading: galleryLoading, error: galleryError } = useGallery(10);

  // Fallback speakers data
  const fallbackSpeakers = [
    { name: 'ดร. สมชาย เชี่ยวชาญ', title: 'นักวิจัยด้านนวัตกรรมผ้าไทย', imgSrc: speaker01 },
    { name: 'คุณวนิดา สร้างสรรค์', title: 'ศิลปินเครื่องปั้นดินเผา', imgSrc: speaker02 },
    { name: 'อาจารย์มานพ สืบสาน', title: 'ผู้เชี่ยวชาญงานไม้แกะสลัก', imgSrc: speaker03 },
    { name: 'คุณรัตนา ต่อยอด', title: 'นักออกแบบเครื่องประดับร่วมสมัย', imgSrc: speaker04 },
    { name: 'คุณวิชัย พัฒนา', title: 'ผู้ประกอบการ OTOP ระดับประเทศ', imgSrc: speaker05 },
  ];

  // Fallback gallery data
  const fallbackGalleryImages = [
    { id: 1, url: gallery01, name: 'SACIT Symposium Gallery 1' },
    { id: 2, url: gallery02, name: 'SACIT Symposium Gallery 2' },
    { id: 3, url: gallery03, name: 'SACIT Symposium Gallery 3' },
    { id: 4, url: gallery04, name: 'SACIT Symposium Gallery 4' },
    { id: 5, url: gallery05, name: 'SACIT Symposium Gallery 5' },
    { id: 6, url: gallery06, name: 'SACIT Symposium Gallery 6' },
    { id: 7, url: gallery07, name: 'SACIT Symposium Gallery 7' },
    { id: 8, url: gallery08, name: 'SACIT Symposium Gallery 8' },
    { id: 9, url: gallery09, name: 'SACIT Symposium Gallery 9' },
    { id: 10, url: gallery01, name: 'SACIT Symposium Gallery 10' }, // ใช้รูปแรกซ้ำ
  ];

  // Select gallery images (API first, then fallback)
  const displayGalleryImages = galleryImages.length > 0 ? galleryImages : fallbackGalleryImages;
  
  // Debug logging
  console.log('🖼️ Gallery Debug:', {
    apiImages: galleryImages.length,
    fallbackImages: fallbackGalleryImages.length,
    displayImages: displayGalleryImages.length,
    loading: galleryLoading
  });

  // Transform API speakers to match the expected format
  const speakers = apiSpeakers.length > 0 
    ? apiSpeakers.slice(0, 5).map(speaker => ({
        name: speaker.name,
        title: speaker.position || 'ผู้เชี่ยวชาญด้านศิลปหัตถกรรม', // Use position from API or default title
        imgSrc: speaker.photo_url || speaker01, // Use API photo or fallback
        pdfUrl: speaker.pdf_url, // Add PDF URL
        pdfFileName: speaker.pdf_filename // Add PDF filename
      }))
    : fallbackSpeakers;

  const handleFeatureClick = () => {
    navigate('/speakers');
  };

  const handleGalleryClick = () => {
    navigate('/images');
  };

  const handleSpeakerClick = (speaker) => {
    if (speaker.pdfUrl) {
      // เปิด PDF ในแท็บใหม่
      const link = document.createElement('a');
      link.href = speaker.pdfUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.download = speaker.pdfFileName || `${speaker.name}_document.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // ถ้าไม่มี PDF ให้แสดง alert หรือ modal ข้อมูล
      console.log("Speaker details:", speaker);
      alert(`ข้อมูลผู้บรรยาย: ${speaker.name}\nตำแหน่ง: ${speaker.title}`);
    }
  };

  const handleExhibitionClick = (exhibition) => {
    if (exhibition.pdfUrl) {
      // เปิด PDF ในแท็บใหม่
      const link = document.createElement('a');
      link.href = exhibition.pdfUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.download = exhibition.pdfFileName || `${exhibition.name}_document.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // ถ้าไม่มี PDF ให้แสดงข้อมูลนิทรรศการ
      console.log('Exhibition clicked:', exhibition);
    }
  };

  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsMenuOpen(false);
    }
  };

  const openLightbox = (image, index) => {
    console.log('🔍 Opening lightbox:', { image, index, totalImages: displayGalleryImages.length });
    setCurrentImage(image);
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const nextImage = () => {
    const nextIndex = currentImageIndex === displayGalleryImages.length - 1 ? 0 : currentImageIndex + 1;
    setCurrentImageIndex(nextIndex);
    setCurrentImage(displayGalleryImages[nextIndex]?.url);
    console.log('📸 Next image:', { nextIndex, url: displayGalleryImages[nextIndex]?.url, name: displayGalleryImages[nextIndex]?.name });
  };

  const prevImage = () => {
    const prevIndex = currentImageIndex === 0 ? displayGalleryImages.length - 1 : currentImageIndex - 1;
    setCurrentImageIndex(prevIndex);
    setCurrentImage(displayGalleryImages[prevIndex]?.url);
    console.log('📸 Previous image:', { prevIndex, url: displayGalleryImages[prevIndex]?.url, name: displayGalleryImages[prevIndex]?.name });
  };

  const agendaItems = [
    { time: '9.00 a.m.', description: 'Registration and welcome' },
    { time: '9.30 a.m.', description: 'Opening ceremony' },
    { time: '10.00 a.m.', description: 'Panel discussion' },
    { time: '11.00 a.m.', description: 'Keynote speaker' },
    { time: '1.00 p.m.', description: 'Networking lunch' },
    { time: '2.30 p.m.', description: 'Closing remarks' },
  ];

  // Load exhibitions from admin system
  const { exhibitions: apiExhibitions, loading: exhibitionsLoading } = useExhibitions({ 
    autoLoad: true,
    initialStatus: 'active'
  });

  // Fallback exhibitions data - 12 items for slideshow
  const fallbackExhibitions = [
    { name: 'Rafie Syazawan Arpandi', title: 'ผู้ก่อตั้ง Sukaseni, Malaysia', position: 'ศิลปินจากมาเลเซีย', imgSrc: gallery01 },
    { name: 'Fanzura Banu', title: 'ผู้แทนจาก National Heritage Board (NHB)', position: 'ผู้แทนจากสิงคโปร์', imgSrc: gallery02 },
    { name: 'Lee Jeongeun', title: 'ผู้แทนจากศูนย์วัฒนธรรมแห่งเอเชีย National Asian Culture Center (ACC)', position: 'ผู้แทนจากเกาหลีใต้', imgSrc: gallery03 },
    { name: 'Tiao David Somsanith', title: 'ศิลปินและผู้เชี่ยวชาญด้านการสื่อสารวัฒนธรรมของ สปป.ลาว', position: 'ศิลปินจากลาว', imgSrc: gallery04 },
    { name: 'Maung Maung', title: 'ประธานสมาคมเครื่องรักเมียนมา และช่างฝีมือเครื่องรัก พม่า', position: 'ศิลปินจากเมียนมา', imgSrc: gallery05 },
    { name: 'Ahmad Fauzi', title: 'ศิลปินเครื่องปั้นดินเผา, Indonesia', position: 'ศิลปินจากอินโดนีเซีย', imgSrc: gallery06 },
    { name: 'Nguyen Van Minh', title: 'ช่างฝีมือเครื่องเขิน, Vietnam', position: 'ศิลปินจากเวียดนาม', imgSrc: gallery07 },
    { name: 'Sok Dara', title: 'ศิลปินผ้าทอ, Cambodia', position: 'ศิลปินจากกัมพูชา', imgSrc: gallery08 },
    { name: 'Maria Santos', title: 'ผู้เชี่ยวชาญงานหัตถกรรม, Philippines', position: 'ศิลปินจากฟิลิปปินส์', imgSrc: gallery09 },
    { name: 'Abdul Rahman', title: 'ศิลปินเครื่องเงิน, Brunei', position: 'ศิลปินจากบรูไน', imgSrc: gallery01 },
    { name: 'Siti Aminah', title: 'ช่างฝีมือเครื่องจักสาน, Malaysia', position: 'ศิลปินจากมาเลเซีย', imgSrc: gallery02 },
    { name: 'Khin Zaw', title: 'ศิลปินเครื่องรัก, Myanmar', position: 'ศิลปินจากเมียนมา', imgSrc: gallery03 },
  ];

  // Transform API exhibitions to match the expected format, filter out specific category, and show up to 12 items
  const exhibitions = apiExhibitions.length > 0 
    ? apiExhibitions
        .filter(exhibition => !exhibition.title?.includes('ช่างสิบหมู่ งานลงรักประดับมุก'))
        .slice(0, 12) // Show up to 12 items
        .map((exhibition, index) => ({
          id: index + 1,
          name: exhibition.name,
          title: exhibition.title, // Use actual title from API
          position: exhibition.position, // Add position information
          imgSrc: exhibition.image_url || gallery01, // Use API photo or fallback
          pdfUrl: exhibition.pdf_url, // Add PDF URL
          pdfFileName: exhibition.pdf_filename, // Add PDF filename
          description: exhibition.description
        }))
        .sort((a, b) => a.id - b.id) // Sort by ID to maintain order
    : fallbackExhibitions.slice(0, 12).map((exhibition, index) => ({
        id: index + 1,
        name: exhibition.name,
        title: exhibition.title,
        position: exhibition.position,
        imgSrc: exhibition.imgSrc,
        pdfUrl: null,
        pdfFileName: null,
        description: null
      })); // Show up to 12 fallback items

  // Use creative works data and gallery images to build Media & News section
  const { creativeWorks, loading: creativeWorksLoading } = useCreativeWorks();

  // Pick 2 images from gallery for Media & News cards
  const imageNewsItems = (displayGalleryImages || []).slice(0, 2).map((img) => ({
    title: img.name || 'ภาพกิจกรรม',
    description: img.subtitle || img.description || 'ภาพจากแกลเลอรี่',
    author: img.event || '',
    imgSrc: img.url,
    type: 'ภาพ',
    category: 'แกลเลอรี่',
    pageUrl: '/images'
  }));

  // Pick 2 creative works
  const worksNewsItems = (creativeWorks || []).slice(0, 2).map((work) => ({
    title: work.name || work.title || 'ไม่ระบุชื่อ',
    description: work.description || 'ไม่มีคำอธิบาย',
    author: work.owner_name || work.author || 'ไม่ระบุผู้สร้าง',
    imgSrc: work.photo_url || gallery01,
    type: work.type || 'ผลงาน',
    category: work.category || 'ผลงานสร้างสรรค์',
    pageUrl: '/creative-works'
  }));

  // Combine to show 4 cards total
  const newsItems = [...imageNewsItems, ...worksNewsItems];

  const lightboxImageData = [
    { alt: 'People at a conference registration desk', description: 'Attendees registering for SACIT event' },
    { alt: 'Speaker presenting on stage', description: 'Expert sharing insights at SACIT conference' },
    { alt: 'Handicrafts displayed at an exhibition', description: 'Beautiful Thai handicrafts on display' },
    { alt: 'Networking session at SACIT event', description: 'Participants networking and discussing' },
    { alt: 'Workshop participants learning a craft', description: 'Hands-on workshop at SACIT' },
    { alt: 'Colorful textile art', description: 'Vibrant Thai textile art piece' },
    { alt: 'Ceramic art pieces', description: 'Unique ceramic creations by Thai artists' },
    { alt: 'Wooden sculptures', description: 'Intricate wooden sculptures' },
    { alt: 'Traditional Thai pottery workshop', description: 'Artists creating beautiful pottery' },
    { alt: 'Cultural performance at symposium', description: 'Traditional dance performance' },
  ];

  const isLoggedIn = authService.isAuthenticated();

  return (
    <>
      <Helmet>
        <title>SACIT Symposium - สถาบันส่งเสริมศิลปหัตถกรรมไทย</title>
        <meta name="description" content="เข้าร่วม SACIT Symposium 2025 - งานประชุมวิชาการด้านศิลปหัตถกรรมครั้งที่ 1 เพื่อการพัฒนาที่ยั่งยืนในอาเซียนและนอกอาเซียน" />
      </Helmet>
      
      <div className="bg-white text-[#333333] font-['Poppins'] relative overflow-x-clip min-h-screen flex flex-col">
        {/* Shared Decorative Circles for Agenda & Speaker */}
        {/* Hero Section */}
        <div style={{ position: 'relative', width: '100vw', height: '80vh', overflow: 'hidden' }}>
          <video
            src={bghero}
            autoPlay
            loop
            muted
            playsInline
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100vw',
              height: '80vh',
              objectFit: 'cover',
              zIndex: 1
            }}
          />
        </div>

        {/* About Section */}
        <section className="py-16 sm:py-24 bg-transparent relative overflow-hidden" style={{marginTop: 0, paddingTop: '2rem'}}>
          {/* Background Shapes */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-[#8B7DC3] rounded-[20%] opacity-60 -translate-x-8 -translate-y-8"></div>
          <div className="absolute top-8 left-40 w-24 h-24 bg-[#B3FFD1] rounded-[20%] opacity-80 -rotate-12"></div>
          <div className="absolute top-16 right-16 w-28 h-28 bg-[#8B7DC3] rounded-[20%] opacity-60 rotate-12"></div>
          <div className="absolute bottom-8 left-16 w-32 h-32 bg-[#B3FFD1] rounded-[20%] opacity-80 rotate-6"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#8B7DC3] rounded-[20%] opacity-60 translate-x-8 translate-y-8"></div>
          <div className="absolute top-20 right-40 w-16 h-16 bg-[#B3FFD1] rounded-[20%] opacity-80 -rotate-12"></div>
          <div className="absolute top-10 left-1/2 w-6 h-6 bg-white rounded-[20%] opacity-80 -translate-x-1/2"></div>
          <div className="absolute bottom-10 right-1/2 w-6 h-6 bg-white rounded-[20%] opacity-80 translate-x-1/2"></div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-4xl mx-auto" style={{color: '#222'}}>
              <motion.h2
                className="text-lg sm:text-xl font-semibold mb-2"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >The 1st National Academic Symposium on Arts and Crafts</motion.h2>
              <motion.h1
                className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                viewport={{ once: true }}
              >SACIT Symposium 2025</motion.h1>
              <motion.h3
                className="text-lg sm:text-xl font-medium mb-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >“Crafting Sustainability across ASEAN and Beyond”</motion.h3>
              <motion.div
                className="text-base sm:text-lg mb-2 font-bold"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.45 }}
                viewport={{ once: true }}
              >Date: 7 – 8 August 2025</motion.div>
              <motion.div
                className="text-base sm:text-lg mb-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
              >Venue: The Sustainable Arts and Crafts Institute of Thailand (Public Organization),<br/>Bang Sai District, Phra Nakhon Si Ayutthaya Province</motion.div>
              <motion.div
                className="flex flex-col sm:flex-row justify-center gap-8 mt-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.75 }}
                viewport={{ once: true }}
              >
                <Link to="/sacit-symposium-en" style={{
                  background: 'linear-gradient(90deg, #B3FFD1 0%, #BFB4EE 100%)',
                  boxShadow: '0px 4px 4px 0px rgba(0,0,0,0.25)',
                  borderRadius: '40px',
                  padding: '18px 48px',
                  fontWeight: 400,
                  fontSize: '24px',
                  color: '#222',
                  fontFamily: 'AWConqueror Std Didot',
                  marginBottom: '0.5rem',
                  border: 'none',
                  outline: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textDecoration: 'none',
                  display: 'inline-block',
                }}>SACIT Symposium_EN</Link>
                <Link to="/sacit-symposium-th" style={{
                  background: 'linear-gradient(90deg, #B3FFD1 0%, #BFB4EE 100%)',
                  boxShadow: '0px 4px 4px 0px rgba(0,0,0,0.25)',
                  borderRadius: '40px',
                  padding: '18px 48px',
                  fontWeight: 400,
                  fontSize: '24px',
                  color: '#222',
                  fontFamily: 'AWConqueror Std Didot',
                  marginBottom: '0.5rem',
                  border: 'none',
                  outline: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textDecoration: 'none',
                  display: 'inline-block',
                }}>SACIT Symposium_TH</Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Symposium Banner Section */}
        <section style={{
                width: '100%',
          minHeight: '180px',
          background: 'linear-gradient(180deg, #240F47 0%, #533192 100%)',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          padding: '2.5rem 0 2.5rem 0',
          marginBottom: '2.5rem',
        }}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-start relative z-10">
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: 400, marginBottom: '0.5rem', lineHeight: 1.1 }}>Sustainability</h2>
              <h2 style={{ fontSize: '2rem', fontWeight: 400, marginBottom: '1.2rem', lineHeight: 1.1 }}>Across ASEAN and Beyond</h2>
              <div style={{ color: '#7FFFB3', fontSize: '1.2rem', fontWeight: 500, marginBottom: '1.2rem' }}>7-8 August 2025</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', color: '#fff' }}>
                <span style={{ fontSize: '1.3rem', color: '#FFD166' }}>📍</span>
                <span>The Sustainable Arts and Crafts Institute of Thailand (SACIT)<br/>Bang Sai District, Phra Nakhon Si Ayutthaya Province, Thailand</span>
              </div>
                </div>
            <div className="hidden md:block" style={{ position: 'absolute', top: 32, right: 48, textAlign: 'right' }}>
              <div style={{ fontFamily: 'AWConqueror Std Didot', fontWeight: 700, fontSize: '2rem', lineHeight: 1, letterSpacing: 0 }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 400, verticalAlign: 'middle', marginRight: 4 }}>* SACIT</span><br/>
                Symposium<br/>2025
              </div>
            </div>
          </div>
          {/* Curve Decoration */}
          <svg width="400" height="120" viewBox="0 0 400 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', right: 0, bottom: 0, zIndex: 1 }}>
            <path d="M0 120 Q 300 0 400 120" stroke="#BFB4EE" strokeWidth="3" fill="none" />
          </svg>
        </section>

        {/* Agenda Section */}
        <section className="py-16 sm:py-24 bg-white relative overflow-hidden" style={{marginBottom: 0, paddingBottom: '2rem'}}>
          {/* Background decorative elements */}
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#B3FFD1] rounded-full opacity-20 -translate-x-48 translate-y-48 z-0"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#BFB4EE] rounded-full opacity-20 translate-x-40 translate-y-40 z-0"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div style={{
              border: '4px solid #BFB4EE',
              borderRadius: '24px',
              background: '#fff',
              maxWidth: '900px',
              margin: '0 auto',
              padding: '2.5rem 1.5rem',
              boxShadow: '0 2px 16px 0 rgba(83,49,147,0.08)'
            }}>
              <h2 style={{
                fontFamily: 'AWConqueror Std Didot',
                fontWeight: 700,
                fontSize: '2.5rem',
                background: 'linear-gradient(90deg, #8B7DC3 0%, #BFB4EE 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textAlign: 'center',
                marginBottom: '0.5rem',
              }}>
              Agenda of SACIT Symposium 2025
              </h2>
              <div style={{
                fontFamily: 'AWConqueror Std Didot',
                color: '#8B7DC3',
                fontSize: '1.2rem',
                textAlign: 'center',
                marginBottom: '1.5rem',
              }}>
                SACIT Symposium 2025: Crafting Sustainability across ASEAN and Beyond
              </div>
              <div style={{
                background: 'linear-gradient(90deg, #8B7DC3 0%, #BFB4EE 100%)',
                color: '#fff',
                fontFamily: 'AWConqueror Std Didot',
                fontWeight: 500,
                fontSize: '1.4rem',
                textAlign: 'center',
                borderRadius: '4px',
                margin: '0 auto 1.5rem auto',
                maxWidth: '600px',
                padding: '0.5rem 0',
                letterSpacing: '0.5px',
              }}>
                August 7 – 8, 2025
              </div>
              <div style={{
                fontFamily: 'serif',
                color: '#222',
                fontSize: '1.15rem',
                textAlign: 'center',
                marginBottom: '2.5rem',
                lineHeight: 1.4,
              }}>
                At the Sustainable Arts and Crafts Institute of Thailand (SACIT)<br/>
                Bang Sai District, Phra Nakhon Si Ayutthaya Province, Thailand
                  </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Link to="/agenda" style={{
                  fontFamily: 'AWConqueror Std Didot',
                  fontWeight: 700,
                  fontSize: '1.3rem',
                  color: '#533193',
                  background: 'linear-gradient(90deg, #B3FFD1 0%, #BFB4EE 100%)',
                  border: 'none',
                  borderRadius: '40px',
                  boxShadow: '0px 4px 12px 0px rgba(83,49,147,0.10)',
                  padding: '12px 56px',
                  cursor: 'pointer',
                  letterSpacing: '2px',
                  transition: 'all 0.2s',
                  marginTop: 0,
                  marginBottom: 0,
                  textShadow: '0 1px 2px #fff8',
                  textDecoration: 'none',
                  display: 'inline-block',
                }}>SEE</Link>
              </div>
            </div>
          </div>
        </section>

        {/* Speakers Section */}
        <section className="py-16 sm:py-24 bg-white relative overflow-hidden" style={{marginTop: 0, paddingTop: '2rem'}}>
          {/* Background decorative elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-[#8B7DC3] rounded-full opacity-20 -translate-x-32 -translate-y-32 z-0"></div>
          <div className="absolute top-20 right-0 w-48 h-48 bg-[#B3FFD1] rounded-full opacity-30 translate-x-24 -translate-y-12 transform rotate-45 z-0"></div>
          <div className="absolute bottom-0 left-20 w-32 h-32 bg-[#BFB4EE] rounded-full opacity-25 z-0"></div>
          
          <div className="text-center mb-16">
            <motion.h2 
              className="text-4xl font-custom-bold text-center text-[#533193]"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Speaker
            </motion.h2>
          </div>
          
          {/* Loading State */}
          {speakersLoading && (
            <>
              {/* Desktop Loading */}
              <div className="hidden md:flex gap-0 mb-12 w-full">
                {[1, 2, 3, 4, 5].map((index) => (
                  <motion.div 
                    key={index} 
                    className="relative overflow-hidden flex-1"
                    style={{ height: '356px' }}
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
                      <div className="text-gray-400">กำลังโหลด...</div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Mobile Loading */}
              <div className="md:hidden mb-12">
                <div className="w-full h-64 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
                  <div className="text-gray-400">กำลังโหลด...</div>
                </div>
              </div>
            </>
          )}
          
          {/* Speakers Grid */}
          {!speakersLoading && (
            <>
              {/* Desktop View */}
              <div className="hidden md:flex gap-0 mb-12 w-full">
                {speakers.map((speaker, index) => (
                  <motion.div 
                    key={index} 
                    className="relative group overflow-hidden flex-1 cursor-pointer"
                    style={{
                      height: '356px'
                    }}
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    onClick={() => handleSpeakerClick(speaker)}
                    title={speaker.pdfUrl ? `คลิกเพื่อดู ${speaker.pdfFileName || 'เอกสาร'}` : `ข้อมูลผู้บรรยาย: ${speaker.name}`}
                  >
                    <img 
                      src={speaker.imgSrc} 
                      alt={`${speaker.name} - ${speaker.title}`} 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => {
                        e.target.style.backgroundColor = '#f3f4f6';
                        e.target.style.display = 'flex';
                        e.target.style.alignItems = 'center';
                        e.target.style.justifyContent = 'center';
                        e.target.innerHTML = '<span style="color: #6b7280;">Image not found</span>';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-lg font-custom-bold mb-1">{speaker.name}</h3>
                      <p className="text-sm font-custom opacity-90">{speaker.title}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Mobile Carousel */}
              <div className="md:hidden mb-12">
                <MobileSpeakerCarousel speakers={speakers} onSpeakerClick={handleSpeakerClick} />
              </div>
            </>
          )}
          
          <div className="text-center">
            <Button 
              variant="outline" 
              className="border-[#533193] text-[#533193] hover:bg-[#533193] hover:text-white transition-colors px-8 py-3 rounded-full text-lg font-custom-bold"
              onClick={handleFeatureClick}
            >
              all speakers
            </Button>
          </div>
        </section>

        {/* Live Exhibition Section */}
        <section className="py-16 sm:py-24 bg-white relative overflow-hidden" style={{marginTop: 0, paddingTop: '2rem'}}>
          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#B3FFD1] rounded-full opacity-30 translate-x-32 -translate-y-32 z-0"></div>
          <div className="absolute top-20 left-0 w-48 h-48 bg-[#8B7DC3] rounded-full opacity-20 -translate-x-24 -translate-y-12 transform rotate-45 z-0"></div>
          <div className="absolute bottom-0 right-20 w-32 h-32 bg-[#BFB4EE] rounded-full opacity-25 z-0"></div>
          
          <div className="text-center mb-16">
            <motion.h2 
              className="text-4xl font-custom-bold text-center text-[#533193]"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Live Exhibition (Demonstrative Area)
            </motion.h2>
          </div>
          
          {/* Loading State */}
          {exhibitionsLoading && (
            <>
              {/* Desktop Loading */}
              <div className="hidden md:block mb-12">
                <div className="flex gap-0 w-full" style={{ height: '356px' }}>
                  {[1, 2, 3, 4, 5, 6].map((index) => (
                    <motion.div 
                      key={index} 
                      className="relative overflow-hidden flex-1"
                      initial={{ opacity: 0, x: 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
                        <div className="text-gray-400">กำลังโหลด...</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Mobile Loading */}
              <div className="md:hidden mb-12">
                <div className="flex gap-0 w-full" style={{ height: '280px' }}>
                  {[1, 2].map((index) => (
                    <motion.div 
                      key={index} 
                      className="relative overflow-hidden flex-1"
                      initial={{ opacity: 0, x: 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
                        <div className="text-gray-400">กำลังโหลด...</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </>
          )}
          
          {/* Live Exhibition Slideshow - 6 Cards */}
          {!exhibitionsLoading && exhibitions.length > 0 && (
            <div className="mb-12">
              <LiveExhibitionSlideshowHome exhibitions={exhibitions} onExhibitionClick={handleExhibitionClick} />
            </div>
          )}
        </section>
        
        {/* News Section */}
        <section className="py-16 sm:py-24 bg-gradient-to-br from-[#8B7DC3] via-[#B3FFD1] to-[#BFB4EE] relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#533193] rounded-full opacity-20 -translate-x-48 -translate-y-48"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#533193] rounded-full opacity-15 translate-x-40 translate-y-40"></div>
          
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Header */}
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-4xl font-custom-bold text-[#533193]" style={{
              fontFamily: 'Prompt'
            }}>Media and news</h2>
              <Button 
                variant="outline" 
                className="border-[#533193] text-[#533193] hover:bg-[#533193] hover:text-white transition-colors px-6 py-2 rounded-full text-sm font-custom-bold"
                style={{
                  fontFamily: 'Prompt'
                }}
                onClick={() => navigate('/news')}
              >
                all media and news
              </Button>
            </div>
            
            {/* Cards */}
            <div className="flex gap-6 justify-start">
              {newsItems.map((item, index) => (
                <motion.div 
                  key={index} 
                  className="relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer flex-shrink-0"
                  style={{
                    width: '300px',
                    height: '380px',
                    borderRadius: '15px'
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => {
                    if (item.pageUrl) {
                      navigate(item.pageUrl);
                    } else {
                      handleFeatureClick();
                    }
                  }}
                >
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <img src={item.imgSrc} alt={item.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  </div>
                  
                  {/* Gradient Overlay */}
                  <div 
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, #533192 100%)'
                    }}
                  ></div>
                  
                  {/* Content */}
                  <div className="relative z-10 p-6 h-full flex flex-col justify-end">
                    {/* Content Section - All content at bottom */}
                    <div className="space-y-4">
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {item.category && (
                          <span className="text-white text-xs font-custom-bold px-3 py-1" style={{
                            fontFamily: 'Prompt',
                            borderRadius: '15px',
                            border: '1px solid #B3FFD1'
                          }}>
                            {item.category}
                          </span>
                        )}
                        {item.type && (
                          <span className="text-white text-xs font-custom-bold px-3 py-1" style={{
                            fontFamily: 'Prompt',
                            borderRadius: '15px',
                            border: '1px solid #B3FFD1'
                          }}>
                            {item.type}
                          </span>
                        )}
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-xl font-custom-bold text-white leading-tight" style={{
                        fontFamily: 'Prompt'
                      }}>{item.title}</h3>
                      
                      {/* Description */}
                      <p className="text-white/90 font-custom text-sm leading-relaxed" style={{
                        fontFamily: 'Prompt'
                      }}>{item.description}</p>
                      
                      {/* Author */}
                      {item.author && (
                        <p className="text-white/80 font-custom text-sm font-medium" style={{
                          fontFamily: 'Prompt'
                        }}>{item.author}</p>
                      )}
                      
                      {/* Arrow Button */}
                      <div className="flex justify-end">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 group-hover:bg-white/30 transition-colors">
                          <ChevronRight className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="text-center mb-12">
            <motion.h2 
              className="text-center font-custom-bold"
              style={{
                background: 'linear-gradient(90deg, #533193 0%, #BFB4EE 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: '40px',
                fontStyle: 'normal',
                fontWeight: 700,
                lineHeight: 'normal'
              }}
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Overall of SACIT Symposium
            </motion.h2>
          </div>
          
          {/* Gallery Grid */}
          <div className="w-full">
            {galleryLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#533193] mb-4"></div>
                <span className="text-lg text-gray-600 font-medium">กำลังโหลดภาพจากโฟลเดอร์...</span>
                <span className="text-sm text-gray-500 mt-2">กรุณารอสักครู่</span>
              </div>
            ) : displayGalleryImages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="text-6xl mb-4">📁</div>
                <span className="text-lg text-gray-600 font-medium">ไม่พบภาพในแกลเลอรี่</span>
                <span className="text-sm text-gray-500 mt-2">กรุณาเพิ่มภาพในระบบจัดการสื่อมัลติมีเดีย</span>
              </div>
            ) : (
              <>
                {console.log('🎯 Rendering gallery with:', displayGalleryImages.slice(0, 5).length, 'top images and', displayGalleryImages.slice(5, 10).length, 'bottom images')}
                
                {/* Top Row - 5 images (เลื่อนจากขวาไปซ้าย) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-0">
                  {displayGalleryImages.slice(0, 5).map((image, index) => (
                    <motion.div 
                      key={image.id || index} 
                      className="aspect-[4/3] bg-gray-200 overflow-hidden hover:opacity-80 transition-opacity duration-300 cursor-pointer"
                      initial={{ opacity: 0, x: 100 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                      onClick={() => openLightbox(image.url, index)}
                    >
                      <img 
                        src={image.url} 
                        alt={image.name || `Gallery ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = fallbackGalleryImages[index % fallbackGalleryImages.length].url;
                        }}
                      />
                    </motion.div>
                  ))}
                </div>
                
                {/* Bottom Row - 5 images (เลื่อนจากซ้ายไปขวา) */}
                {console.log('🔍 Bottom row check:', { 
                  totalImages: displayGalleryImages.length, 
                  hasMoreThan5: displayGalleryImages.length > 5,
                  bottomRowImages: displayGalleryImages.slice(5, 10).length 
                })}
                {/* ลบเงื่อนไขชั่วคราวเพื่อทดสอบ */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-0">
                    {displayGalleryImages.slice(5, 10).map((image, index) => (
                    <motion.div 
                      key={image.id || (index + 5)} 
                      className="aspect-[4/3] bg-gray-200 overflow-hidden hover:opacity-80 transition-opacity duration-300 cursor-pointer"
                      initial={{ opacity: 0, x: -100 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                      onClick={() => openLightbox(image.url, index + 5)}
                    >
                      <img 
                        src={image.url} 
                        alt={image.name || `Gallery ${index + 6}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = fallbackGalleryImages[(index + 5) % fallbackGalleryImages.length].url;
                        }}
                      />
                    </motion.div>
                    ))}
                </div>
              </>
            )}
          </div>
          
          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              className="border-[#533193] text-[#533193] hover:bg-[#533193] hover:text-white transition-colors px-8 py-3 rounded-full text-lg font-custom-bold"
              onClick={handleGalleryClick}
            >
              all photos and video
            </Button>
          </div>
        </section>

      </div>
      
      {/* Lightbox */}
      {isLightboxOpen && (
        <Lightbox
          imageUrl={currentImage}
          onClose={closeLightbox}
          onNext={nextImage}
          onPrev={prevImage}
          hasNext={true}
          hasPrev={true}
          currentIndex={currentImageIndex}
          totalImages={displayGalleryImages.length}
          imageTitle={displayGalleryImages[currentImageIndex]?.name || displayGalleryImages[currentImageIndex]?.folderName}
          imageDescription={displayGalleryImages[currentImageIndex]?.subtitle || `จากงาน ${displayGalleryImages[currentImageIndex]?.event || 'SACIT Symposium'}`}
        />
      )}
      
      {/* Cookie Consent Popup */}
      <CookieConsent />
    </>
  );
};

export default LandingPage;