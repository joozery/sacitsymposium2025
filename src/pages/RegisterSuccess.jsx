import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const RegisterSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const registrationType = location.state?.registrationType || 'general';

  if (registrationType === 'general') {
    // บุคคลทั่วไป
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="max-w-md w-full text-center">
          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 rounded-full bg-[#B9A7E6] flex items-center justify-center mb-4">
              <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-[#533193]">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">ลงทะเบียนสำเร็จ</h1>
            <p className="text-gray-700 mb-4">
              ขอบคุณที่ลงทะเบียนเข้าร่วมงาน<br />แล้วพบกันวันที่ 7-8 สิงหาคม 2568 ในงาน <b>SACIT Symposium 2025</b>
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 px-6 py-2 bg-[#533193] text-white rounded-full hover:bg-[#6c4bb6] transition"
            >
              กลับหน้าหลัก
            </button>
          </div>
        </div>
      </div>
    );
  }

  // สำหรับผู้ส่งผลงาน
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="max-w-xl w-full text-center">
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-green-500">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ลงทะเบียนสำเร็จ!</h1>
          <p className="text-gray-700 mb-4">
            ขอบคุณสำหรับการลงทะเบียนเข้าร่วม SACIT Symposium 2025<br />กรุณาเก็บหมายเลขนี้ไว้สำหรับการอ้างอิง
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6 text-left">
            <div className="font-bold text-blue-900 mb-2">ขั้นตอนต่อไป</div>
            <ul className="list-disc list-inside text-blue-900 text-sm">
              <li>กรุณาเตรียมเอกสารสำหรับการส่งผลงาน</li>
              <li>ระบบจะแจ้งคุณไปยังหน้าส่งผลงานต่อไป</li>
              <li>กำหนดส่งผลงาน: 31 มกราคม 2025</li>
            </ul>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition"
            >
              กลับหน้าหลัก
            </button>
            <button
              onClick={() => navigate('/submit')}
              className="px-6 py-2 bg-[#533193] text-white rounded-full hover:bg-[#6c4bb6] transition"
            >
              ส่งผลงานต่อไป
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterSuccess; 