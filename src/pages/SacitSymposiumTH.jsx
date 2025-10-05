import React from 'react';
import { Link } from 'react-router-dom';

const SacitSymposiumTH = () => {
  return (
    <div className="min-h-screen bg-white relative">
      {/* Top Gradient Border */}
      <div 
        className="h-1 w-full"
        style={{
          background: 'linear-gradient(90deg, #BFB4EE 0%, #B3FFD1 100%)'
        }}
      ></div>

      {/* Header Banner - Full Width */}
      <div className="relative overflow-hidden mt-20" style={{
        background: 'linear-gradient(90deg, #BFB4EE 32.07%, #B3FFD1 100%)',
        minHeight: '180px',
        padding: '2.5rem 1.5rem'
      }}>
        {/* Decorative Shapes */}
        <div className="absolute top-4 left-4 w-24 h-24 bg-gradient-to-br from-green-300 to-green-400 rounded-xl opacity-70 transform rotate-0 shadow-lg animate-bounce" style={{ animationDuration: '2s' }}></div>
        <div className="absolute bottom-4 left-4 w-12 h-12 bg-gradient-to-br from-white to-gray-100 rounded-lg opacity-90 transform rotate-0 shadow-md animate-bounce" style={{ animationDuration: '1.5s', animationDelay: '0.5s' }}></div>
        <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-white to-gray-100 rounded-lg opacity-90 transform rotate-0 shadow-md animate-bounce" style={{ animationDuration: '1.8s', animationDelay: '1s' }}></div>
        <div className="absolute bottom-4 right-4 w-28 h-28 bg-gradient-to-br from-purple-300 to-purple-400 rounded-xl opacity-70 transform rotate-0 shadow-lg animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.3s' }}></div>
        
        {/* Additional Professional Elements */}
        <div className="absolute top-1/2 left-8 w-8 h-8 bg-yellow-300 rounded-full opacity-60 animate-bounce" style={{ animationDuration: '1.2s' }}></div>
        <div className="absolute top-1/3 right-12 w-6 h-6 bg-blue-300 rounded-full opacity-50 animate-bounce" style={{ animationDuration: '1.6s', animationDelay: '0.8s' }}></div>
        <div className="absolute bottom-1/3 left-16 w-5 h-5 bg-pink-300 rounded-full opacity-40 animate-bounce" style={{ animationDuration: '1.4s', animationDelay: '1.2s' }}></div>
        
        {/* Floating Elements */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-orange-300 rounded-full opacity-50 animate-bounce" style={{ animationDuration: '1.8s', animationDelay: '0.2s' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-teal-300 rounded-full opacity-40 animate-bounce" style={{ animationDuration: '1.3s', animationDelay: '0.7s' }}></div>
        
        {/* Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <h1 className="mb-3" style={{
            color: '#000',
            fontFamily: 'Prompt',
            fontSize: '22px',
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: 'normal'
          }}>
            การประชุมวิชาการศิลปหัตถกรรมแห่งชาติ ครั้งที่ 1
          </h1>
          <h2 className="mb-3" style={{
            color: '#000',
            fontFamily: 'Prompt',
            fontSize: '40px',
            fontStyle: 'normal',
            fontWeight: 500,
            lineHeight: 'normal'
          }}>
            SACIT Symposium 2025
          </h2>
          <p className="mb-3" style={{
            color: '#000',
            fontFamily: 'Prompt',
            fontSize: '30px',
            fontStyle: 'italic',
            fontWeight: 400,
            lineHeight: 'normal'
          }}>
            "Crafting Sustainability across ASEAN and Beyond"
          </p>
          <p className="mb-3" style={{
            color: '#000',
            fontFamily: 'Prompt',
            fontSize: '22px',
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: 'normal'
          }}>
            วันที่: 7 – 8 สิงหาคม 2568
          </p>
          <p className="mb-3" style={{
            color: '#000',
            fontFamily: 'Prompt',
            fontSize: '18px',
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: 'normal'
          }}>
            <span style={{ fontWeight: 500 }}>สถานที่:</span> สถาบันส่งเสริมศิลปหัตถกรรมไทย (องค์การมหาชน), อำเภอบางไทร จังหวัดพระนครศรีอยุธยา
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Why SACIT Symposium Section */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">ทำไมต้อง SACIT Symposium?</h3>
            <p className="text-gray-700 mb-4 leading-relaxed">
              ศิลปหัตถกรรมดั้งเดิมเป็นมรดกที่มีชีวิต สืบทอดผ่านรุ่นสู่รุ่นและพัฒนากลายเป็นกระบวนการแห่งความคิดสร้างสรรค์และการเล่าเรื่อง 
              น่าเศร้าที่ศิลปหัตถกรรมหลายอย่างได้กลายเป็น "ศิลปหัตถกรรมที่กำลังหายไป" และเสี่ยงต่อการสูญหาย 
              ด้วยช่างฝีมือที่เหลือน้อยลง บางอย่างกำลังเลือนหายจากความรู้สาธารณะและชีวิตประจำวัน
            </p>
            <p className="text-gray-700 mb-4 leading-relaxed">
              ในปี 2568 สศท. ได้ดำเนินการเพื่อเสริมสร้างและแบ่งปันความรู้ศิลปหัตถกรรมไทยกับชุมชนในประเทศและต่างประเทศ 
              รวมถึงช่างฝีมือ นักสร้างสรรค์รุ่นใหม่ นักออกแบบ นักศึกษา นักวิจัย ผู้ที่รักศิลปหัตถกรรม และอื่นๆ
            </p>
            <p className="text-gray-700 mb-4 leading-relaxed">
              เพื่อจุดประสงค์นี้ เราได้จัดงานประชุมวิชาการศิลปหัตถกรรมครั้งที่ 1 หรือ SACIT Symposium 2025 
              ภายใต้ธีม "Crafting Sustainability across ASEAN and Beyond"
            </p>
            <p className="text-gray-700 mb-2 leading-relaxed">งานจะประกอบด้วยโปรแกรมหลัก 4 ประเภท:</p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4 space-y-1">
              <li>การแบ่งปันความรู้และการอภิปราย</li>
              <li>การนำเสนอผลงานวิชาการและผลงานศิลปหัตถกรรม</li>
              <li>การสาธิตสดกระบวนการสร้างสรรค์เบื้องหลังงานรักและศิลปหัตถกรรมอื่นๆ</li>
              <li>นิทรรศการแสดงงานรัก ความรู้ที่เกี่ยวข้อง และผลงานศิลปหัตถกรรมต่างๆ</li>
            </ul>
            <p className="text-gray-700 mb-4 leading-relaxed">
              SACIT Symposium 2025 มุ่งหวังที่จะเป็นเวทีสำหรับการนำเสนอและแบ่งปันความรู้ด้านศิลปหัตถกรรม 
              ผ่านกิจกรรมหลากหลายที่เกี่ยวข้องกับผู้เชี่ยวชาญ ช่างฝีมือ และผู้สร้างสรรค์จากอาเซียนและประเทศอื่นๆ 
              ที่มีรากเหง้าทางวัฒนธรรมและประเพณีศิลปหัตถกรรมร่วมกัน รวมถึงไทย เมียนมาร์ ลาว กัมพูชา เวียดนาม จีน เกาหลีใต้ ญี่ปุ่น และอื่นๆ
            </p>
            <p className="text-gray-700 mb-6 leading-relaxed">
              การประชุมยังยินดีต้อนรับองค์กรและสถาบันในเครือข่ายที่เกี่ยวข้องกับศิลปหัตถกรรม 
              เพื่อแลกเปลี่ยนความรู้ทั้งด้านเทคนิคและวิชาการ แสดงผลงานสร้างสรรค์และนวัตกรรม 
              และแบ่งปันความคิดเห็นเกี่ยวกับการถ่ายทอดและการอนุรักษ์มรดกศิลปหัตถกรรมแห่งชาติอย่างยั่งยืน
            </p>
          </div>

          {/* Objectives Section */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">วัตถุประสงค์</h3>
            <ol className="list-decimal list-inside text-gray-700 space-y-4 ml-4">
              <li className="leading-relaxed">
                เพื่อส่งเสริมและเพิ่มคุณค่าของศิลปหัตถกรรมท้องถิ่นในบริบททางวิชาการ 
                และผ่านกิจกรรมความร่วมมือกับองค์กรหรือหน่วยงานพันธมิตรที่เกี่ยวข้องกับการสนับสนุนศิลปหัตถกรรมทั้งในและต่างประเทศ 
                การประชุมมุ่งหวังที่จะสร้างเครือข่ายความรู้ศิลปหัตถกรรมทั้งในระดับชาติและนานาชาติ 
                เป็นรากฐานสำหรับการร่วมมือในอนาคต
              </li>
              <li className="leading-relaxed">
                เพื่อส่งเสริมความสนใจในศิลปหัตถกรรมไทยทั้งในประเทศและในหมู่ประเทศอาเซียน 
                และสนับสนุนบทบาทของ สศท. ในฐานะศูนย์กลางความรู้ด้านศิลปหัตถกรรม
              </li>
              <li className="leading-relaxed">
                เพื่อส่งเสริมมรดกศิลปหัตถกรรมที่จับต้องไม่ได้เป็นทรัพย์สินทางสังคมและวัฒนธรรมที่มีค่า 
                เป็นแหล่งความภาคภูมิใจและรากฐานสำหรับการพัฒนาความรู้ในหลายมิติ 
                รวมถึงการจัดทำเอกสาร การเผยแพร่ และการประยุกต์ใช้อย่างเหมาะสม 
                พร้อมทั้งส่งเสริมการสร้างระบบนิเวศความรู้ที่สนับสนุนการถ่ายทอดประเพณีศิลปหัตถกรรมอย่างยั่งยืน
              </li>
            </ol>
          </div>

          {/* Program Format Section */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">รูปแบบโปรแกรม</h3>
            <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
              <li>ปาฐกถาพิเศษและการบรรยายพิเศษ</li>
              <li>การนำเสนอผลงานวิชาการและการอภิปราย</li>
              <li>การอบรมเชิงปฏิบัติการและการสาธิตสด</li>
              <li>นิทรรศการ</li>
            </ol>
          </div>

          {/* Presentation Categories Section */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">หมวดหมู่การนำเสนอ</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">1. ผลงานสร้างสรรค์</h4>
                <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                  <li>งานรัก</li>
                  <li>ผลงานศิลปหัตถกรรมและวิจิตรศิลป์</li>
                  <li>ศิลปหัตถกรรมร่วมสมัยและประยุกต์</li>
                  <li>ศิลปหัตถกรรมท้องถิ่นและประเพณีอื่นๆ</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">2. เอกสารวิชาการ / บทความวิชาการ</h4>
                <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                  <li>น้ำยางรัก ต้นรัก และพืชที่ให้น้ำยางอื่นๆ เป็นวัตถุดิบในศิลปหัตถกรรม</li>
                  <li>ศิลปะ วัฒนธรรม และการพัฒนาสร้างสรรค์ของศิลปหัตถกรรมดั้งเดิม</li>
                  <li>การอนุรักษ์ความรู้ดั้งเดิมในศิลปหัตถกรรม</li>
                  <li>วิทยาศาสตร์วัสดุและทางเลือกที่ยั่งยืนในการสร้างสรรค์ศิลปหัตถกรรม</li>
                  <li>ผลงานศิลปะและศิลปหัตถกรรมที่สอดคล้องกับกรอบ ESG</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Target Participants Section */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">กลุ่มเป้าหมาย</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>ช่างศิลปหัตถกรรมแห่งชาติ สศท. ช่างฝีมือ และทายาทช่างในสาขาที่เกี่ยวข้อง</li>
              <li>ช่างฝีมือและผู้เชี่ยวชาญด้านศิลปหัตถกรรม ทั้งชาวไทยและชาวต่างชาติ</li>
              <li>สมาชิก สศท. ที่ทำงานในวิชาชีพที่เกี่ยวข้อง</li>
              <li>นักวิชาการ นักวิจัย และนักศึกษาในสาขาวิชาที่เกี่ยวข้อง</li>
              <li>สถาบันการศึกษาและองค์กรพันธมิตร ทั้งในและต่างประเทศ</li>
              <li>นักออกแบบ นักสร้างสรรค์ และผู้ประกอบการรุ่นใหม่ที่สนใจศิลปหัตถกรรมดั้งเดิมและร่วมสมัย</li>
            </ul>
          </div>

          {/* Timeline Section */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">ไทม์ไลน์</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>ระยะเวลาโครงการ: เมษายน – สิงหาคม 2568</li>
              <li>วันที่จัดงาน: 7 – 8 สิงหาคม 2568</li>
              <li>สถานที่: สถาบันส่งเสริมศิลปหัตถกรรมไทย (องค์การมหาชน) อำเภอบางไทร จังหวัดพระนครศรีอยุธยา</li>
            </ul>
          </div>

          {/* Project Lead Section */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">ผู้รับผิดชอบโครงการ</h3>
            <p className="text-gray-700 mb-4">
              สถาบันส่งเสริมศิลปหัตถกรรมไทย (องค์การมหาชน),<br/>
              อำเภอบางไทร จังหวัดพระนครศรีอยุธยา
            </p>
          </div>

          {/* Contact Persons Section */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">ผู้ติดต่อ</h3>
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-gray-800">นางบุรฉัตร ศรีวิไล</p>
                <p className="text-gray-700">หัวหน้าฝ่ายจัดการความรู้ศิลปหัตถกรรม</p>
                <p className="text-gray-700">อีเมล: Burachat.s@sacit.or.th</p>
                <p className="text-gray-700">symposium.2025@sacit.or.th</p>
                <p className="text-gray-700">มือถือ: +66 85 040 0842</p>
              </div>
              <div>
                <p className="font-semibold text-gray-800">นายทยูท มงคลรัตน์</p>
                <p className="text-gray-700">เจ้าหน้าที่อาวุโสฝ่ายพันธมิตรและกิจการต่างประเทศ</p>
                <p className="text-gray-700">อีเมล: tayud.m@sacit.or.th</p>
                <p className="text-gray-700">มือถือ: +66 97 246 6550</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Border */}
      <div 
        className="h-1 w-full absolute bottom-0"
        style={{
          background: 'linear-gradient(90deg, #533193 0%, #533193 100%)'
        }}
      ></div>
    </div>
  );
};

export default SacitSymposiumTH; 