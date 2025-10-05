import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, Loader2 } from 'lucide-react';

import logoWhite from '@/assets/logow.svg';
import symposiumText from '@/assets/symposiam.svg';
import authService from '@/services/authService';
import registrationService from '@/services/registrationService';
import analytics from '@/services/analytics';

const RegisterForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const registrationType = location.state?.registrationType || 'general';
  
  // Debug: Log the location state
  console.log('Location State:', location.state);
  console.log('Registration Type:', registrationType);
  console.log('Privacy Consent:', location.state?.privacyConsent);
  console.log('Registration Date:', location.state?.registrationDate);

  const [formData, setFormData] = useState({
    title: '',
    titleOther: '',
    firstName: '',
    lastName: '',
    company: '',
    telephone: '',
    email: '',
    password: '',
    confirmPassword: '',
    educationLevel: '',
    educationOther: '',
    age: '',
    occupation: '',
    occupationOther: '',
    objectives: []
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
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
    
    // Clear submit error when user makes changes
    if (submitError) {
      setSubmitError('');
    }
  };

  const handleObjectiveChange = (objective) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.includes(objective)
        ? prev.objectives.filter(obj => obj !== objective)
        : [...prev.objectives, objective]
    }));
    
    // Clear error when user makes selection
    if (errors.objectives) {
      setErrors(prev => ({
        ...prev,
        objectives: ''
      }));
    }
    
    // Clear submit error when user makes changes
    if (submitError) {
      setSubmitError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title) newErrors.title = 'กรุณาเลือกคำนำหน้า';
    if (formData.title === 'other' && !formData.titleOther) newErrors.titleOther = 'กรุณาระบุคำนำหน้า';
    if (!formData.firstName) newErrors.firstName = 'กรุณากรอกชื่อ';
    if (!formData.lastName) newErrors.lastName = 'กรุณากรอกนามสกุล';
    if (!formData.company) newErrors.company = 'กรุณากรอกบริษัทหรือองค์กร';
    if (!formData.telephone) newErrors.telephone = 'กรุณากรอกเบอร์โทรศัพท์';
    if (!formData.email) newErrors.email = 'กรุณากรอกอีเมล';
    if (!formData.password) newErrors.password = 'กรุณากรอกรหัสผ่าน';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'กรุณายืนยันรหัสผ่าน';
    if (!formData.educationLevel) newErrors.educationLevel = 'กรุณาเลือกระดับการศึกษา';
    if (formData.educationLevel === 'other' && !formData.educationOther) newErrors.educationOther = 'กรุณาระบุระดับการศึกษา';
    
    if (!formData.age) newErrors.age = 'กรุณาเลือกอายุ';
    if (!formData.occupation) newErrors.occupation = 'กรุณาเลือกอาชีพ';
    if (formData.occupation === 'other' && !formData.occupationOther) newErrors.occupationOther = 'กรุณาระบุอาชีพ';
    if (!formData.objectives || formData.objectives.length === 0) newErrors.objectives = 'กรุณาเลือกเป้าหมายอย่างน้อย 1 ข้อ';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'รหัสผ่านไม่ตรงกัน';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) newErrors.email = 'รูปแบบอีเมลไม่ถูกต้อง';
    if (formData.password && formData.password.length < 6) newErrors.password = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    // Check if we have the required data from RegisterTerms
    if (!location.state?.privacyConsent || !location.state?.registrationDate) {
      setSubmitError('กรุณากลับไปยังหน้าเงื่อนไขและเลือกการยินยอมและวันที่ลงทะเบียน');
      return;
    }

    setIsLoading(true);
    setSubmitError('');

    try {
      const res = await registrationService.createRegistration({
        user_id: null, // ถ้ายังไม่ได้ login
        registration_type: location.state.registrationType,
        title_prefix: formData.title === 'other' ? formData.titleOther : formData.title,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password, // ✅ เพิ่มบรรทัดนี้
        phone: formData.telephone,
        organization: formData.company,
        education_level: formData.educationLevel === 'other' ? formData.educationOther : formData.educationLevel,
        registration_year: 225,
        terms_accepted: true,
        age: formData.age,
        occupation: formData.occupation === 'other' ? formData.occupationOther : formData.occupation,
        objectives: formData.objectives,
        privacy_consent: location.state.privacyConsent,
        registration_date: location.state.registrationDate
      });

      if (res.data.success) {
        // Track successful registration
        analytics.trackRegistration(location.state.registrationType);
        navigate('/register/success');
      }
    } catch (err) {
      console.error(err);
      setSubmitError('เกิดข้อผิดพลาดในการลงทะเบียน กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <div className="pt-[120px] pb-16 min-h-screen">
        <div className="container mx-auto px-4 max-w-2xl">
          
          {/* Step Indicator */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center mb-8"
          >
            <div className="flex items-center space-x-4">
              {/* Step 1 - Active */}
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-[#533193] text-white rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <span className="text-xs text-[#533193] mt-1">Firstly</span>
              </div>
              
              {/* Connector */}
              <div className="w-12 h-px bg-gray-300"></div>
              
              {/* Step 2 - Inactive */}
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <span className="text-xs text-gray-500 mt-1">Finally</span>
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
            <h1 className="text-3xl font-bold text-gray-800">General Information</h1>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Title Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                คำนำหน้า / Title<span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-4">
                {[
                  { value: 'mr', label: 'นาย / Mr.' },
                  { value: 'mrs', label: 'นาง / Mrs.' },
                  { value: 'ms', label: 'นางสาว / Ms.' },
                  { value: 'other', label: 'อื่นๆ / Other' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="title"
                      value={option.value}
                      checked={formData.title === option.value}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="mr-2 text-[#533193] focus:ring-[#533193]"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
              
              {/* Other Title Input */}
              {formData.title === 'other' && (
                <div className="mt-3">
                  <Input
                    type="text"
                    placeholder="ระบุคำนำหน้า / Specify Title"
                    value={formData.titleOther}
                    onChange={(e) => handleInputChange('titleOther', e.target.value)}
                    className={`w-full max-w-md ${errors.titleOther ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.titleOther && <p className="text-red-500 text-xs mt-1">{errors.titleOther}</p>}
                </div>
              )}
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  type="text"
                  placeholder="ชื่อ / First Name*"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={`w-full ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <Input
                  type="text"
                  placeholder="นามสกุล / Last Name*"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={`w-full ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>

            {/* Company */}
            <div>
              <Input
                type="text"
                placeholder="บริษัทหรือองค์กร / Company or Organization*"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                className={`w-full ${errors.company ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.company && <p className="text-red-500 text-xs mt-1">{errors.company}</p>}
            </div>

            {/* Telephone */}
            <div>
              <Input
                type="tel"
                placeholder="เบอร์โทรศัพท์ / Telephone Number*"
                value={formData.telephone}
                onChange={(e) => handleInputChange('telephone', e.target.value)}
                className={`w-full ${errors.telephone ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.telephone && <p className="text-red-500 text-xs mt-1">{errors.telephone}</p>}
            </div>

            {/* Email */}
            <div>
              <Input
                type="email"
                placeholder="อีเมล / Email*"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  type="password"
                  placeholder="รหัสผ่าน / Password*"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="ยืนยันรหัสผ่าน / Confirm Password*"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={`w-full ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Education Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                ระดับการศึกษา / Education Level<span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { value: 'bachelor', label: 'ปริญญาตรี / Bachelor Degrees' },
                  { value: 'master', label: 'ปริญญาโท / Master Degrees' },
                  { value: 'phd', label: 'ปริญญาเอก / Ph.D.(Doctor of Philosophy)' },
                  { value: 'other', label: 'อื่นๆ / Other' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="educationLevel"
                      value={option.value}
                      checked={formData.educationLevel === option.value}
                      onChange={(e) => handleInputChange('educationLevel', e.target.value)}
                      className="mr-2 text-[#533193] focus:ring-[#533193]"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
              {errors.educationLevel && <p className="text-red-500 text-xs mt-1">{errors.educationLevel}</p>}
              
              {/* Other Education Input */}
              {formData.educationLevel === 'other' && (
                <div className="mt-3">
                  <Input
                    type="text"
                    placeholder="ระบุระดับการศึกษา / Specify Education Level"
                    value={formData.educationOther}
                    onChange={(e) => handleInputChange('educationOther', e.target.value)}
                    className={`w-full max-w-md ${errors.educationOther ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.educationOther && <p className="text-red-500 text-xs mt-1">{errors.educationOther}</p>}
                </div>
              )}
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                อายุ (Age)<span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { value: 'under20', label: 'ต่ำกว่า 20 ปี (Under 20 years old)' },
                  { value: '21-30', label: 'ระหว่าง 21 - 30 ปี (Between 21 and 30 years old)' },
                  { value: '31-40', label: 'ระหว่าง 31 - 40 ปี (Between 31 and 40 years old)' },
                  { value: '41-50', label: 'ระหว่าง 41 - 50 ปี (Between 41 and 50 years old)' },
                  { value: '51-60', label: 'ระหว่าง 51 - 60 ปี (Between 51 and 60 years old)' },
                  { value: 'over60', label: 'มากกว่า 60 ปี (Over 60 years old)' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="age"
                      value={option.value}
                      checked={formData.age === option.value}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      className="mr-2 text-[#533193] focus:ring-[#533193]"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
              {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
            </div>

            {/* Occupation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                อาชีพ Occupation<span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { value: 'craftsman', label: 'ผู้สร้างสรรค์งานศิลปหัตถกรรม (Craftsman or Artisan)' },
                  { value: 'civil_servant', label: 'ข้าราชการ / เจ้าหน้าที่ของรัฐ (Civil Servant or Government Official)' },
                  { value: 'business_owner', label: 'ธุรกิจส่วนตัว (Business Owner)' },
                  { value: 'academic', label: 'นักวิชาการ (Academic)' },
                  { value: 'student', label: 'นักเรียน / นักศึกษา (Student)' },
                  { value: 'general_public', label: 'บุคคลทั่วไป (General Public)' },
                  { value: 'other', label: 'อื่น ๆ (Others)' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="occupation"
                      value={option.value}
                      checked={formData.occupation === option.value}
                      onChange={(e) => handleInputChange('occupation', e.target.value)}
                      className="mr-2 text-[#533193] focus:ring-[#533193]"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
              {errors.occupation && <p className="text-red-500 text-xs mt-1">{errors.occupation}</p>}
              
              {/* Other Occupation Input */}
              {formData.occupation === 'other' && (
                <div className="mt-3">
                  <Input
                    type="text"
                    placeholder="ระบุอาชีพ / Specify Occupation"
                    value={formData.occupationOther}
                    onChange={(e) => handleInputChange('occupationOther', e.target.value)}
                    className={`w-full max-w-md ${errors.occupationOther ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.occupationOther && <p className="text-red-500 text-xs mt-1">{errors.occupationOther}</p>}
                </div>
              )}
            </div>

            {/* Objectives */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                เป้าหมายในการเข้าร่วมโครงการ (Objectives for joining the project)<span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {[
                  { 
                    value: 'inspiration', 
                    label: 'เพื่อสร้างแรงบันดาลในการศึกษาองค์ความรู้งานศิลปหัตถกรรมไทย',
                    description: 'To foster inspiration in the study and appreciation of traditional Thai arts and crafts.'
                  },
                  { 
                    value: 'development', 
                    label: 'เพื่อศึกษาต่อยอดงานเครื่องรักในการพัฒนาผลิตภัณฑ์หัตถกรรมประกอบอาชีพ',
                    description: 'To explore the potential for further development of lacquerware craftsmanship in product innovation and professional practice.'
                  },
                  { 
                    value: 'knowledge', 
                    label: 'ติดตามองค์ความรู้จากวิทยากรโดยตรง',
                    description: 'To acquire in-depth knowledge directly from SACIT and subject matter experts.'
                  },
                  { 
                    value: 'networking', 
                    label: 'เพื่อพบปะผู้ชื่นชอบศึกษาองค์ความรู้งานศิลปหัตถกรรมรูปแบบเดียวกัน',
                    description: 'To engage with like-minded individuals who share a scholarly interest in traditional arts and crafts.'
                  }
                ].map((option) => (
                  <label key={option.value} className="flex items-start cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <input
                      type="checkbox"
                      value={option.value}
                      checked={formData.objectives.includes(option.value)}
                      onChange={() => handleObjectiveChange(option.value)}
                      className="mr-3 mt-1 text-[#533193] focus:ring-[#533193]"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-700">{option.label}</div>
                      <div className="text-xs text-gray-500 mt-1">{option.description}</div>
                    </div>
                  </label>
                ))}
              </div>
              {errors.objectives && <p className="text-red-500 text-xs mt-1">{errors.objectives}</p>}
            </div>

            {/* Error Message */}
            {submitError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-lg p-4"
              >
                <p className="text-red-600 text-sm">{submitError}</p>
              </motion.div>
            )}

            {/* Next Button */}
            <div className="flex justify-center pt-8">
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-[#533193] text-white hover:bg-[#533193]/90 px-12 py-3 rounded-full text-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    กำลังดำเนินการ...
                  </>
                ) : (
                  'NEXT'
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm; 