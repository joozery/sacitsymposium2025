import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, Upload, Loader2 } from 'lucide-react';
import registrationService from '@/services/registrationService';
import authService from '@/services/authService';

import logoWhite from '@/assets/logow.svg';
import symposiumText from '@/assets/symposiam.svg';

const RegisterResearch = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const registrationType = location.state?.registrationType || 'research';
  const formData = location.state?.formData || {};
  
  const [researchData, setResearchData] = useState({
    projectTitle: '',
    category: '',
    categoryOther: '',
    abstract: '',
    keywords: '',
    researchFile: null
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleInputChange = (field, value) => {
    setResearchData(prev => ({
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

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          researchFile: 'กรุณาอัปโหลดไฟล์ PDF หรือ Word เท่านั้น'
        }));
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          researchFile: 'ขนาดไฟล์ต้องไม่เกิน 10MB'
        }));
        return;
      }

      setResearchData(prev => ({
        ...prev,
        researchFile: file
      }));
      
      if (errors.researchFile) {
        setErrors(prev => ({
          ...prev,
          researchFile: ''
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!researchData.projectTitle) newErrors.projectTitle = 'กรุณากรอกชื่อผลงาน';
    if (!researchData.category) newErrors.category = 'กรุณาเลือกประเภทผลงาน';
    if (researchData.category === 'other' && !researchData.categoryOther) {
      newErrors.categoryOther = 'กรุณาระบุประเภทผลงาน';
    }
    if (!researchData.abstract) newErrors.abstract = 'กรุณากรอกบทคัดย่อ';
    if (!researchData.keywords) newErrors.keywords = 'กรุณากรอกคำสำคัญ';
    if (!researchData.researchFile) newErrors.researchFile = 'กรุณาอัปโหลดเอกสารงานวิจัย';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Get registration ID from previous step
      let registrationId = location.state?.registrationId;
      
      console.log('Location state:', location.state);
      console.log('Registration ID from location state:', registrationId);
      console.log('Form data from location state:', formData);
      
      // Check if user is logged in
      const isLoggedIn = authService.isAuthenticated();
      const currentUser = authService.getCurrentUser();
      
      console.log('User logged in:', isLoggedIn);
      console.log('Current user:', currentUser);
      
      // If user is logged in but no registrationId, try to find their existing registration
      if (isLoggedIn && !registrationId && currentUser?.email) {
        console.log('User is logged in but no registration ID, trying to find registration...');
        
        try {
          // Try to get user registrations first
          const userRegistrations = await registrationService.getUserRegistrations();
          console.log('User registrations result:', userRegistrations);
          
          if (userRegistrations.success && userRegistrations.data && userRegistrations.data.length > 0) {
            // Find the most recent registration for this year and type
            const currentYearRegistration = userRegistrations.data.find(reg => 
              reg.registration_year === 2025 && reg.registration_type === registrationType
            );
            
            if (currentYearRegistration) {
              registrationId = currentYearRegistration.id;
              console.log('Found existing registration ID:', registrationId);
            }
          }
        } catch (getUserError) {
          console.log('getUserRegistrations failed:', getUserError);
          
          // Fallback: try search by email (now supports pending status)
          try {
            const searchResult = await registrationService.searchRegistrationByEmail(currentUser.email);
            console.log('Search result:', searchResult);
            
            if (searchResult.success && searchResult.data?.registration) {
              registrationId = searchResult.data.registration.id;
              console.log('Found existing registration ID from search:', registrationId);
            }
          } catch (searchError) {
            console.log('Search by email also failed:', searchError);
          }
        }
      }
      
      // If we have registrationId, update existing registration
      if (registrationId) {
        console.log('Using registration ID:', registrationId);
        
        // Prepare research data for update
        const researchUpdateData = {
          research_data: {
            project_title: researchData.projectTitle,
            category: researchData.category === 'other' ? researchData.categoryOther : researchData.category,
            abstract: researchData.abstract,
            keywords: researchData.keywords.split(',').map(keyword => keyword.trim()),
          }
        };

        console.log('Updating registration with research data:', researchUpdateData);

        // Update existing registration with research data
        const updateResult = await registrationService.updateRegistration(registrationId, researchUpdateData);
        
        console.log('Update result:', updateResult);
        
        if (!updateResult.success) {
          let errorMessage = updateResult.message || 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล';
          
          if (updateResult.errors) {
            console.log('Update errors:', updateResult.errors);
            let errorDetails = formatErrors(updateResult.errors);
            if (errorDetails) {
              errorMessage += '\n\nรายละเอียด:\n' + errorDetails;
            }
          }
          
          throw new Error(errorMessage);
        }

        // Upload research file if update was successful
        if (researchData.researchFile) {
          const fileUploadResult = await registrationService.uploadResearchFile(
            researchData.researchFile, 
            registrationId
          );

          console.log('File upload result:', fileUploadResult);

          if (!fileUploadResult.success) {
            console.warn('File upload failed but registration update succeeded.');
            setSubmitError('อัปเดตข้อมูลสำเร็จแล้ว แต่การอัปโหลดไฟล์ล้มเหลว กรุณาติดต่อเจ้าหน้าที่');
            
            setTimeout(() => {
              navigate('/register/success', { 
                state: { 
                  formData, 
                  researchData, 
                  registrationType,
                  registrationId,
                  fileUploadFailed: true
                } 
              });
            }, 3000);
            return;
          }
        }

        // Navigate to success page
        navigate('/register/success', { 
          state: { 
            formData, 
            researchData, 
            registrationType,
            registrationId
          } 
        });
        return;
      }
      
      // If no registrationId found, show helpful error message
      if (isLoggedIn) {
        throw new Error('ไม่พบข้อมูลการลงทะเบียนของท่าน\n\nเป็นไปได้ว่า:\n1. ท่านยังไม่ได้ลงทะเบียน\n2. ท่านลงทะเบียนแล้วแต่เป็นประเภทอื่น\n\nกรุณาเริ่มต้นการลงทะเบียนใหม่จากขั้นตอนแรก');
      } else {
        throw new Error('กรุณาเริ่มต้นการลงทะเบียนจากขั้นตอนแรก\n\nคลิก "ลงทะเบียน" จากหน้าหลักและกรอกข้อมูลส่วนตัวให้ครบถ้วนก่อน จากนั้นจะสามารถกรอกข้อมูลงานวิจัยได้');
      }

    } catch (error) {
      console.error('Registration submission error:', error);
      
      // Format error message for display
      let displayError = error.message || 'เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง';
      
      // If it's a network error or specific API error
      if (error.response) {
        console.error('API Error Response:', error.response);
        const apiError = error.response.data;
        
        if (apiError?.message) {
          displayError = apiError.message;
        } else if (apiError?.error) {
          displayError = apiError.error;
        } else {
          displayError = `เกิดข้อผิดพลาด (${error.response.status}): ${error.response.statusText}`;
        }
        
        // Add validation errors if available
        if (apiError?.errors) {
          console.log('API validation errors:', apiError.errors);
          let errorDetails = formatErrors(apiError.errors);
          if (errorDetails) {
            displayError += '\n\nรายละเอียด:\n' + errorDetails;
          }
        }
      }
      
      setSubmitError(displayError);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to format errors
  const formatErrors = (errors) => {
    let errorDetails = '';
    
    if (Array.isArray(errors)) {
      errorDetails = errors
        .map((error, index) => {
          if (typeof error === 'string') {
            return `${index + 1}. ${error}`;
          } else if (typeof error === 'object' && error !== null) {
            if (error.message) {
              return `${index + 1}. ${error.message}`;
            } else if (error.field && error.msg) {
              return `${index + 1}. ${error.field}: ${error.msg}`;
            } else if (error.path && error.msg) {
              return `${index + 1}. ${error.path}: ${error.msg}`;
            } else {
              return `${index + 1}. ${JSON.stringify(error)}`;
            }
          }
          return `${index + 1}. ${String(error)}`;
        })
        .join('\n');
    } else if (typeof errors === 'object') {
      errorDetails = Object.entries(errors)
        .map(([field, messages]) => {
          if (Array.isArray(messages)) {
            return `${field}: ${messages.join(', ')}`;
          } else if (typeof messages === 'string') {
            return `${field}: ${messages}`;
          } else {
            return `${field}: ${JSON.stringify(messages)}`;
          }
        })
        .join('\n');
    }
    
    return errorDetails;
  };

  const categories = [
    {
      value: 'lacquer',
      label: 'งานวิจัยเกี่ยวกับยางรัก ต้นรัก และพืชให้ยางกับการใช้เป็นวัตถุดิบในงานหัตถกรรม',
      labelEn: 'Lacquer sap, lacquer tree, and other resin-producing plants as raw materials in crafts'
    },
    {
      value: 'culture',
      label: 'งานวิจัยเกี่ยวกับศิลป วัฒนธรรมและการสร้างสรรคงานหัตถกรรม',
      labelEn: 'Art, culture, and the creative development of traditional crafts'
    },
    {
      value: 'preservation',
      label: 'งานวิจัยเกี่ยวกับการอนุรักษ์ภูมิปัญญาในงานหัตถกรรม',
      labelEn: 'Preservation of traditional knowledge in crafts'
    },
    {
      value: 'sustainability',
      label: 'งานวิจัยเกี่ยวกับวัสดุทางเลือกและการใช้วัตถุดิบในงานหัตถกรรมที่สอดคล้องกับยุคดิจิทัล',
      labelEn: 'Material science and sustainable alternatives in craft-making'
    },
    {
      value: 'esg',
      label: 'งานวิจัยเกี่ยวกับงานหัตถกรรมที่สอดคล้องกับแนวคิด ESG',
      labelEn: 'Artistic works and craftworks aligned with the ESG framework'
    },
    {
      value: 'other',
      label: 'งานวิจัยอื่น ๆ',
      labelEn: 'Other relevant research'
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
            <h1 className="text-2xl font-bold text-gray-800 mb-2">ผลงานวิจัย หรือ บทความสร้างสรรค์ /</h1>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Researcher or Academic Work</h2>
            <p className="text-lg text-gray-600">ข้อมูลของผลงานวิจัย หรือ บทความวิชาการ / Researcher or Academic Work Information</p>
          </motion.div>

          {/* Error Message */}
          {submitError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
            >
              <div className="text-red-600 text-sm whitespace-pre-line">{submitError}</div>
              {(submitError.includes('กรุณาเริ่มต้นการลงทะเบียนจากขั้นตอนแรก') || 
                submitError.includes('ไม่พบข้อมูลการลงทะเบียนของท่าน')) && (
                <div className="mt-4 flex justify-center">
                  <Button
                    onClick={() => navigate('/register')}
                    className="bg-[#533193] text-white hover:bg-[#533193]/90 px-6 py-2 rounded-lg text-sm transition-colors"
                  >
                    กลับไปลงทะเบียน
                  </Button>
                </div>
              )}
            </motion.div>
          )}

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
                value={researchData.projectTitle}
                onChange={(e) => handleInputChange('projectTitle', e.target.value)}
                className={`w-full ${errors.projectTitle ? 'border-red-500' : 'border-gray-300'}`}
                disabled={isSubmitting}
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
                      checked={researchData.category === category.value}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="mr-3 mt-1 text-[#533193] focus:ring-[#533193] flex-shrink-0"
                      disabled={isSubmitting}
                    />
                    <div className="text-sm text-gray-700">
                      <div>{category.label} /</div>
                      <div className="italic text-gray-600">{category.labelEn}</div>
                    </div>
                  </label>
                ))}
              </div>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
              
              {/* Other Category Input */}
              {researchData.category === 'other' && (
                <div className="mt-3">
                  <Input
                    type="text"
                    placeholder="ระบุประเภทผลงาน / Specify Category"
                    value={researchData.categoryOther}
                    onChange={(e) => handleInputChange('categoryOther', e.target.value)}
                    className={`w-full max-w-md ${errors.categoryOther ? 'border-red-500' : 'border-gray-300'}`}
                    disabled={isSubmitting}
                  />
                  {errors.categoryOther && <p className="text-red-500 text-xs mt-1">{errors.categoryOther}</p>}
                </div>
              )}
            </div>

            {/* Abstract */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                บทคัดย่อ (ไม่เกิน 500 คำ) / Abstract (no more than 500)<span className="text-red-500">*</span>
              </label>
              <Textarea
                value={researchData.abstract}
                onChange={(e) => handleInputChange('abstract', e.target.value)}
                className={`w-full h-32 ${errors.abstract ? 'border-red-500' : 'border-gray-300'}`}
                maxLength={500}
                disabled={isSubmitting}
              />
              <div className="text-right text-xs text-gray-500 mt-1">
                {researchData.abstract.length}/500
              </div>
              {errors.abstract && <p className="text-red-500 text-xs mt-1">{errors.abstract}</p>}
            </div>

            {/* Keywords */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                คำสำคัญ (ไม่เกิน 5 คำ) / Keyword (no more than 5)<span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={researchData.keywords}
                onChange={(e) => handleInputChange('keywords', e.target.value)}
                className={`w-full ${errors.keywords ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="คำสำคัญ1, คำสำคัญ2, คำสำคัญ3"
                disabled={isSubmitting}
              />
              {errors.keywords && <p className="text-red-500 text-xs mt-1">{errors.keywords}</p>}
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                เอกสารงานวิจัย / Research Article<span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed rounded-[10px] p-6 text-center" style={{
                background: 'linear-gradient(90deg, #BFB4EE 0%, #B3FFD1 100%)',
                borderColor: '#BFB4EE'
              }}>
                <input
                  type="file"
                  id="research-file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isSubmitting}
                />
                <label htmlFor="research-file" className={`cursor-pointer ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <div className="bg-[#533193] text-white px-6 py-2 rounded-lg inline-flex items-center gap-2 hover:bg-[#533193]/90 transition-colors">
                    <Upload className="w-4 h-4" />
                    upload
                  </div>
                </label>
                {researchData.researchFile && (
                  <p className="text-sm text-gray-600 mt-2">
                    ไฟล์ที่เลือก: {researchData.researchFile.name}
                  </p>
                )}
              </div>
              {errors.researchFile && <p className="text-red-500 text-xs mt-1">{errors.researchFile}</p>}
              
              {/* File Guidelines */}
              <div className="mt-4 text-xs text-gray-600 space-y-1">
                <p><strong>เอกสารอ้างอิง</strong> (ใช้รูปแบบ APA Style) จัดเรียงตามตัวอักษรโดยไม่ต้องแบ่งแยกตามประเภทเอกสาร นำเสนอแหล่งอ้างอิงภาษาไทยและแหล่งอ้างอิงภาษาอังกฤษ / <em>References (Use APA Style. Arrange entries alphabetically without separating by document type. List Thai sources first, followed by English sources.)</em></p>
                
                <p><strong>หมายเหตุ / Notes on Formatting:</strong></p>
                <p>1.1 ชื่อหัวข้อให้ใช้แบบอักษร TH SarabunPSK ขนาด 18 ตัวหนา / <em>Project title: TH SarabunPSK, font size 18, bold</em></p>
                <p>1.2 เนื้อหาให้ใช้แบบอักษร TH SarabunPSK ขนาด 16 / <em>Body text: TH SarabunPSK, font size 16</em></p>
                <p>1.3 ระยะห่างระหว่างบรรทัดให้เว้น 1.0 / <em>Line spacing: 1.0</em></p>
                <p>1.4 เอกสารที่ส่งมาควรไม่น้อยกว่า 1 หน้า แต่ไม่เกิน 300 คำ ความยาวไม่เกิน 3 - 5หน้ากระดาษ A4 การจัดหน้ากระดาษให้ใช้ระยะขอบ (ด้านบน ด้านล่าง ด้านซ้าย ด้านขวา) 1.0 นิ้ว 2.54 ซม. / <em>Abstract: - Thai version no more than 1 page, - English version no more than 300 words, - Full article: 3-5 pages (A4), - Page margins: 1 inch (2.54 cm) on all sides</em></p>
                <p>1.5 แนบไฟล์ในรูแบบ Microsoft Word แบบไฟล์ที่สำหรับเป็น PDF แบบแนบเฉพาะ / <em>Submit in Microsoft Word format and include a PDF backup file</em></p>
                <p>1.6 บทความฉบับเต็มควรมีไม่น้อยกว่า 10 หน้า แต่ไม่เกิน 15 หน้า / <em>Full-length article should be no fewer than 10 pages and no more than 15 pages</em></p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-8">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-[#533193] text-white hover:bg-[#533193]/90 px-12 py-3 rounded-full text-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    กำลังส่งข้อมูล...
                  </>
                ) : (
                  'SUBMIT'
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RegisterResearch; 