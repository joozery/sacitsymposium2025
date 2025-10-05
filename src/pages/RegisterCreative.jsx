import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, Upload } from 'lucide-react';

import logoWhite from '@/assets/logow.svg';
import symposiumText from '@/assets/symposiam.svg';

const RegisterCreative = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const registrationType = location.state?.registrationType || 'creative';
  const formData = location.state?.formData || {};
  
  const [creativeData, setCreativeData] = useState({
    projectTitle: '',
    category: '',
    concept: '',
    process: '',
    materials: '',
    estimatedValue: '',
    dimensions: '',
    displayFormat: '',
    keywords: '',
    images: []
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setCreativeData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      // Check file size and count limits
      const validFiles = [];
      const invalidFiles = [];
      
      files.forEach(file => {
        const sizeInKB = file.size / 1024;
        if (sizeInKB >= 500 && sizeInKB <= 3072) { // 500KB to 3MB
          validFiles.push(file);
        } else {
          invalidFiles.push(file.name);
        }
      });

      // Check total count limit
      const totalFiles = validFiles.length + creativeData.images.length;
      
      if (totalFiles <= 5) {
        setCreativeData(prev => ({
          ...prev,
          images: [...prev.images, ...validFiles]
        }));
        
        if (errors.images) {
          setErrors(prev => ({
            ...prev,
            images: ''
          }));
        }
        
        // Show warning for invalid files
        if (invalidFiles.length > 0) {
          setErrors(prev => ({
            ...prev,
            images: `ไฟล์ที่ไม่ถูกต้อง: ${invalidFiles.join(', ')} (ขนาดไฟล์ต้อง 500KB-3MB)`
          }));
        }
      } else {
        setErrors(prev => ({
          ...prev,
          images: `สามารถอัปโหลดได้สูงสุด 5 ไฟล์ (ปัจจุบัน: ${creativeData.images.length})`
        }));
      }
    }
  };

  const removeImage = (index) => {
    setCreativeData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!creativeData.projectTitle) newErrors.projectTitle = 'กรุณากรอกชื่อผลงาน';
    if (!creativeData.category) newErrors.category = 'กรุณาเลือกประเภทผลงาน';
    if (!creativeData.concept) newErrors.concept = 'กรุณากรอกแนวคิดผลงาน';
    if (!creativeData.process) newErrors.process = 'กรุณากรอกกระบวนการสร้างสรรค์';
    if (!creativeData.materials) newErrors.materials = 'กรุณากรอกวัสดุที่ใช้';
    if (!creativeData.estimatedValue) newErrors.estimatedValue = 'กรุณากรอกมูลค่าโดยประมาณ';
    if (!creativeData.dimensions) newErrors.dimensions = 'กรุณากรอกขนาดผลงาน';
    if (!creativeData.displayFormat) newErrors.displayFormat = 'กรุณากรอกรูปแบบการจัดแสดง';
    if (!creativeData.keywords) newErrors.keywords = 'กรุณากรอกคำสำคัญ';
    if (creativeData.images.length === 0) newErrors.images = 'กรุณาอัปโหลดรูปภาพประกอบ';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Creative data:', creativeData);
      console.log('Form data:', formData);
      navigate('/register/success', { 
        state: { 
          formData, 
          creativeData, 
          registrationType 
        } 
      });
    }
  };

  const categories = [
    {
      value: 'lacquerwares',
      label: 'งานเครื่องรัก - เครื่องเขิน',
      labelEn: 'Lacquerwares'
    },
    {
      value: 'traditional',
      label: 'งานหัตถกรรมประเพณีท้องถิ่น',
      labelEn: 'Traditional and fine crafts'
    },
    {
      value: 'contemporary',
      label: 'งานหัตถกรรมร่วมสมัย',
      labelEn: 'Contemporary and applied crafts'
    },
    {
      value: 'local',
      label: 'งานหัตถกรรมพื้นถิ่น และหัตถกรรมอื่น ๆ',
      labelEn: 'Local crafts and other traditional craftworks'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <div className="pt-[120px] pb-16 min-h-screen">
        <div className="container mx-auto px-4 max-w-4xl">
          
          {/* Step Indicator */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center mb-8"
          >
            <div className="flex items-center space-x-4">
              {/* Step 1 - Completed */}
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-[#533193] text-white rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <span className="text-xs text-[#533193] mt-1">Firstly</span>
              </div>
              
              {/* Connector */}
              <div className="w-12 h-px bg-[#533193]"></div>
              
              {/* Step 2 - Active */}
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-[#533193] text-white rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <span className="text-xs text-[#533193] mt-1">Finally</span>
              </div>
            </div>
          </motion.div>

          {/* Form Title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center mb-8"
          >
            <h1 className="text-2xl font-bold text-gray-800 mb-2">ผลงานสร้างสรรค์ / Creative Work</h1>
            <p className="text-lg text-gray-600">ข้อมูลของผลงานสร้างสรรค์ / Creative Work Information</p>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Project Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ชื่อผลงาน / Project, Activity Title<span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={creativeData.projectTitle}
                onChange={(e) => handleInputChange('projectTitle', e.target.value)}
                className={`w-full ${errors.projectTitle ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.projectTitle && <p className="text-red-500 text-xs mt-1">{errors.projectTitle}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                ประเภทผลงาน / Category<span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {categories.map((category) => (
                  <label key={category.value} className="flex items-start cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value={category.value}
                      checked={creativeData.category === category.value}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="mr-3 mt-1 text-[#533193] focus:ring-[#533193] flex-shrink-0"
                    />
                    <div className="text-sm text-gray-700">
                      <div>{category.label} / <span className="italic">{category.labelEn}</span></div>
                    </div>
                  </label>
                ))}
              </div>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </div>

            {/* Concept */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                แนวคิดผลงาน (การสืบทอดการอนุรักษ์ สืบทอด และการสร้างสรรค์อย่างยั่งยืน) / Concept of the Work<br />
                <span className="text-xs text-gray-500">(How it reflects the preservation, transmission, and sustainable continuation of cultural value)</span>
                <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={creativeData.concept}
                onChange={(e) => handleInputChange('concept', e.target.value)}
                className={`w-full h-32 ${errors.concept ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.concept && <p className="text-red-500 text-xs mt-1">{errors.concept}</p>}
            </div>

            {/* Process */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                กระบวนการสร้างสรรค์ / Creative Process<span className="text-red-500">*</span>
              </label>
              <Textarea
                value={creativeData.process}
                onChange={(e) => handleInputChange('process', e.target.value)}
                className={`w-full h-32 ${errors.process ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.process && <p className="text-red-500 text-xs mt-1">{errors.process}</p>}
            </div>

            {/* Materials */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                วัสดุที่ใช้ / Materials Used<span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={creativeData.materials}
                onChange={(e) => handleInputChange('materials', e.target.value)}
                className={`w-full ${errors.materials ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.materials && <p className="text-red-500 text-xs mt-1">{errors.materials}</p>}
            </div>

            {/* Estimated Value */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                มูลค่าโดยประมาณ / Estimated Value of the Work<span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={creativeData.estimatedValue}
                onChange={(e) => handleInputChange('estimatedValue', e.target.value)}
                className={`w-full ${errors.estimatedValue ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="เช่น 5,000 บาท"
              />
              {errors.estimatedValue && <p className="text-red-500 text-xs mt-1">{errors.estimatedValue}</p>}
            </div>

            {/* Dimensions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ขนาดผลงาน (กว้าง x ยาว x สูง) หรือขนาดอื่นๆ (โดยประมาณ) / Dimensions of the Work<br />
                <span className="text-xs text-gray-500">(Width x Length x Height in cm). Please also specify approximate weight.</span>
                <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={creativeData.dimensions}
                onChange={(e) => handleInputChange('dimensions', e.target.value)}
                className={`w-full ${errors.dimensions ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="เช่น 30 x 20 x 15 ซม. น้ำหนัก 2 กก."
              />
              {errors.dimensions && <p className="text-red-500 text-xs mt-1">{errors.dimensions}</p>}
            </div>

            {/* Display Format */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                รูปแบบการจัดแสดง (โปรดระบุ) / Display Format (Please specify clearly)<span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={creativeData.displayFormat}
                onChange={(e) => handleInputChange('displayFormat', e.target.value)}
                className={`w-full ${errors.displayFormat ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="เช่น แขวนผนัง, วางโต๊ะ, ติดตั้งพื้น"
              />
              {errors.displayFormat && <p className="text-red-500 text-xs mt-1">{errors.displayFormat}</p>}
            </div>

            {/* Keywords */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                คำสำคัญ (ไม่เกิน 5 คำ) / Keyword (no more than 5)<span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={creativeData.keywords}
                onChange={(e) => handleInputChange('keywords', e.target.value)}
                className={`w-full ${errors.keywords ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="คำสำคัญ1, คำสำคัญ2, คำสำคัญ3"
              />
              {errors.keywords && <p className="text-red-500 text-xs mt-1">{errors.keywords}</p>}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ภาพประกอบผลงานไม่น้อยกว่า (500 Kb แต่ไม่เกิน 3 KB จำนวน 3 – 5 ภาพ) /<br />
                Illustrative Images <span className="text-xs text-gray-500">(Minimum file size: 500 KB Maximum: 3 MB Submit 3-5images)</span>
                <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed rounded-[10px] p-6 text-center" style={{
                background: 'linear-gradient(90deg, #BFB4EE 0%, #B3FFD1 100%)',
                borderColor: '#BFB4EE'
              }}>
                <input
                  type="file"
                  id="creative-images"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label htmlFor="creative-images" className="cursor-pointer">
                  <div className="bg-[#533193] text-white px-6 py-2 rounded-lg inline-flex items-center gap-2 hover:bg-[#533193]/90 transition-colors">
                    <Upload className="w-4 h-4" />
                    upload
                  </div>
                </label>
                
                {/* Display uploaded images */}
                {creativeData.images.length > 0 ? (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                    {creativeData.images.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                        <p className="text-xs text-gray-600 mt-1 truncate">{file.name}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 mt-4">ยังไม่ได้อัปโหลดไฟล์</p>
                )}
                
                {creativeData.images.length === 0 ? (
                  <p className="text-xs text-gray-600 mt-2">
                    อัปโหลดแล้ว 0/5 ไฟล์
                  </p>
                ) : (
                  <p className="text-xs text-green-600 mt-2 font-medium">
                    อัปโหลดแล้ว {creativeData.images.length}/5 ไฟล์
                  </p>
                )}
              </div>
              {errors.images && <p className="text-red-500 text-xs mt-1">{errors.images}</p>}
              
              {/* Image Guidelines */}
              <div className="mt-4 text-xs text-gray-600 space-y-1">
                <p><strong>หมายเหตุ / Notes:</strong></p>
                <p>1. ควรมีมีองค์ประกอบสำคัญครบถ้วนของผลงานอย่างน้อย 3 ภาพ / <em>You may attach additional images (minimum 3 images) showcasing the creative work.</em></p>
                <p>2. ขนาดภาพแต่ละภาพขนาดไม่เกิน 2 MB ข้อมูลภาพ 1 รูป / <em>A maximum of 2 entries per applicant is allowed.</em></p>
                <p>3. ผลงานที่ส่งร่วมสมัยควรมีการจัดหัวข้อของผลงานให้ชัดเจน / <em>All submitted works must clearly specify weight.</em></p>
                <p>4. ผลงานที่ส่งร่วมสมัย 2 ชิ้น ขนาดไม่เกิน (250 ซม. x 200 ซม.) และจะจัดกระดาษไม่เกิน 10 ซม.</p>
                <p>5. ผลงานที่ส่งร่วมสมัยของผลงานควรมีกระดาษขนาดไม่เกิน 20 ซม. ขึ้นไป ควรมีขนาดไม่เกิน 200 ซม. / <em>For 2D works, maximum size is 200 cm, and they must not extend more than 10 cm from the wall. Clearly state the intended display method—wall-mounted, easel-mounted, or pedestal.</em></p>
                <p>6. ผลงานที่ส่งร่วมสมัยควรมีขนาดไม่เกิน 200 ซม. ขนาดไม่เกิน 100 ซม. ควรมีขนาดไม่เกิน 100 ซม. x 100 ซม. / <em>For 3D works, maximum size is 100 cm x 100 cm. Please provide appropriate pedestal dimensions (Width x Length x Height) to support exhibition planning.</em></p>
                <p>7. ผู้สมัครสามารถส่งผลงานชิ้นสุดท้ายและจัดกลุ่มผลงานล่วงหน้าได้ - ขั้นต่ำ ผลงานสุดท้ายแสดงออก ณ สถานที่ส่ง หรือไม่ส่งไปยังสถานที่ / <em>Creators selected to exhibit must deliver and collect their works in person at the SACIT office or as otherwise specified by SACIT.</em></p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-8">
              <Button
                onClick={handleSubmit}
                className="bg-[#533193] text-white hover:bg-[#533193]/90 px-12 py-3 rounded-full text-lg font-medium transition-all duration-300"
              >
                SUBMIT
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RegisterCreative; 