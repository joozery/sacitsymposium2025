import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/services/api';

const SacitSymposiumEN = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await api.get('/symposium-th');
      setContent(response.data.data);
    } catch (error) {
      console.error('Error fetching symposium TH content:', error);
      // Keep default content if API fails
    } finally {
      setLoading(false);
    }
  };

  // Default content (fallback) - Thai version
  const defaultContent = {
    header_title: 'การประชุมวิชาการศิลปหัตถกรรมแห่งชาติ ครั้งที่ 1',
    header_main_title: 'SACIT Symposium 2025',
    header_theme: '"Crafting Sustainability across ASEAN and Beyond"',
    header_date: 'วันที่: 7 – 8 สิงหาคม 2568',
    header_venue: 'สถาบันส่งเสริมศิลปหัตถกรรมไทย (องค์การมหาชน), อำเภอบางไทร จังหวัดพระนครศรีอยุธยา',
    why_sacit_content: `ศิลปหัตถกรรมดั้งเดิมเป็นมรดกที่มีชีวิต สืบทอดผ่านรุ่นสู่รุ่นและพัฒนากลายเป็นกระบวนการแห่งความคิดสร้างสรรค์และการเล่าเรื่อง น่าเศร้าที่ศิลปหัตถกรรมหลายอย่างได้กลายเป็น "ศิลปหัตถกรรมที่กำลังหายไป" และเสี่ยงต่อการสูญหาย ด้วยช่างฝีมือที่เหลือน้อยลง บางอย่างกำลังเลือนหายจากความรู้สาธารณะและชีวิตประจำวัน

ในปี 2568 สศท. ได้ดำเนินการเพื่อเสริมสร้างและแบ่งปันความรู้ศิลปหัตถกรรมไทยกับชุมชนในประเทศและต่างประเทศ รวมถึงช่างฝีมือ นักสร้างสรรค์รุ่นใหม่ นักออกแบบ นักศึกษา นักวิจัย ผู้ที่รักศิลปหัตถกรรม และอื่นๆ

เพื่อจุดประสงค์นี้ เราได้จัดงานประชุมวิชาการศิลปหัตถกรรมครั้งที่ 1 หรือ SACIT Symposium 2025 ภายใต้ธีม "Crafting Sustainability across ASEAN and Beyond"

SACIT Symposium 2025 มุ่งหวังที่จะเป็นเวทีสำหรับการนำเสนอและแบ่งปันความรู้ด้านศิลปหัตถกรรม ผ่านกิจกรรมหลากหลายที่เกี่ยวข้องกับผู้เชี่ยวชาญ ช่างฝีมือ และผู้สร้างสรรค์จากอาเซียนและประเทศอื่นๆ ที่มีรากเหง้าทางวัฒนธรรมและประเพณีศิลปหัตถกรรมร่วมกัน รวมถึงไทย เมียนมาร์ ลาว กัมพูชา เวียดนาม จีน เกาหลีใต้ ญี่ปุ่น และอื่นๆ

การประชุมยังยินดีต้อนรับองค์กรและสถาบันในเครือข่ายที่เกี่ยวข้องกับศิลปหัตถกรรม เพื่อแลกเปลี่ยนความรู้ทั้งด้านเทคนิคและวิชาการ แสดงผลงานสร้างสรรค์และนวัตกรรม และแบ่งปันความคิดเห็นเกี่ยวกับการถ่ายทอดและการอนุรักษ์มรดกศิลปหัตถกรรมแห่งชาติอย่างยั่งยืน`,
    why_sacit_programs: [
      'การแบ่งปันความรู้และการอภิปราย',
      'การนำเสนอผลงานวิชาการและผลงานศิลปหัตถกรรม',
      'การสาธิตสดกระบวนการสร้างสรรค์เบื้องหลังงานรักและศิลปหัตถกรรมอื่นๆ',
      'นิทรรศการแสดงงานรัก ความรู้ที่เกี่ยวข้อง และผลงานศิลปหัตถกรรมต่างๆ'
    ],
    objectives: [
      'เพื่อส่งเสริมและเพิ่มคุณค่าของศิลปหัตถกรรมท้องถิ่นในบริบททางวิชาการ และผ่านกิจกรรมความร่วมมือกับองค์กรหรือหน่วยงานพันธมิตรที่เกี่ยวข้องกับการสนับสนุนศิลปหัตถกรรมทั้งในและต่างประเทศ การประชุมมุ่งหวังที่จะสร้างเครือข่ายความรู้ศิลปหัตถกรรมทั้งในระดับชาติและนานาชาติ เป็นรากฐานสำหรับการร่วมมือในอนาคต',
      'เพื่อส่งเสริมความสนใจในศิลปหัตถกรรมไทยทั้งในประเทศและในหมู่ประเทศอาเซียน และสนับสนุนบทบาทของ สศท. ในฐานะศูนย์กลางความรู้ด้านศิลปหัตถกรรม',
      'เพื่อส่งเสริมมรดกศิลปหัตถกรรมที่จับต้องไม่ได้เป็นทรัพย์สินทางสังคมและวัฒนธรรมที่มีค่า เป็นแหล่งความภาคภูมิใจและรากฐานสำหรับการพัฒนาความรู้ในหลายมิติ รวมถึงการจัดทำเอกสาร การเผยแพร่ และการประยุกต์ใช้อย่างเหมาะสม พร้อมทั้งส่งเสริมการสร้างระบบนิเวศความรู้ที่สนับสนุนการถ่ายทอดประเพณีศิลปหัตถกรรมอย่างยั่งยืน'
    ],
    program_format: [
      'ปาฐกถาพิเศษและการบรรยายพิเศษ',
      'การนำเสนอผลงานวิชาการและการอภิปราย',
      'การอบรมเชิงปฏิบัติการและการสาธิตสด',
      'นิทรรศการ'
    ],
    presentation_categories: {
      creative_works: [
        'งานรัก',
        'ผลงานศิลปหัตถกรรมและวิจิตรศิลป์',
        'ศิลปหัตถกรรมร่วมสมัยและประยุกต์',
        'ศิลปหัตถกรรมท้องถิ่นและประเพณีอื่นๆ'
      ],
      research_papers: [
        'น้ำยางรัก ต้นรัก และพืชที่ให้น้ำยางอื่นๆ เป็นวัตถุดิบในศิลปหัตถกรรม',
        'ศิลปะ วัฒนธรรม และการพัฒนาสร้างสรรค์ของศิลปหัตถกรรมดั้งเดิม',
        'การอนุรักษ์ความรู้ดั้งเดิมในศิลปหัตถกรรม',
        'วิทยาศาสตร์วัสดุและทางเลือกที่ยั่งยืนในการสร้างสรรค์ศิลปหัตถกรรม',
        'ผลงานศิลปะและศิลปหัตถกรรมที่สอดคล้องกับกรอบ ESG'
      ]
    },
    target_participants: [
      'ช่างศิลปหัตถกรรมแห่งชาติ สศท. ช่างฝีมือ และทายาทช่างในสาขาที่เกี่ยวข้อง',
      'ช่างฝีมือและผู้เชี่ยวชาญด้านศิลปหัตถกรรม ทั้งชาวไทยและชาวต่างชาติ',
      'สมาชิก สศท. ที่ทำงานในวิชาชีพที่เกี่ยวข้อง',
      'นักวิชาการ นักวิจัย และนักศึกษาในสาขาวิชาที่เกี่ยวข้อง',
      'สถาบันการศึกษาและองค์กรพันธมิตร ทั้งในและต่างประเทศ',
      'นักออกแบบ นักสร้างสรรค์ และผู้ประกอบการรุ่นใหม่ที่สนใจศิลปหัตถกรรมดั้งเดิมและร่วมสมัย'
    ],
    timeline: [
      'ระยะเวลาโครงการ: เมษายน – สิงหาคม 2568',
      'วันที่จัดงาน: 7 – 8 สิงหาคม 2568',
      'สถานที่: สถาบันส่งเสริมศิลปหัตถกรรมไทย (องค์การมหาชน) อำเภอบางไทร จังหวัดพระนครศรีอยุธยา'
    ],
    project_lead: 'สถาบันส่งเสริมศิลปหัตถกรรมไทย (องค์การมหาชน), อำเภอบางไทร จังหวัดพระนครศรีอยุธยา',
    contact_persons: [
      {
        name: 'นางบุรฉัตร ศรีวิไล',
        position: 'หัวหน้าฝ่ายจัดการความรู้ศิลปหัตถกรรม',
        email: 'Burachat.s@sacit.or.th',
        email2: 'symposium.2025@sacit.or.th',
        mobile: '+66 85 040 0842'
      },
      {
        name: 'นายทยูท มงคลรัตน์',
        position: 'เจ้าหน้าที่อาวุโสฝ่ายพันธมิตรและกิจการต่างประเทศ',
        email: 'tayud.m@sacit.or.th',
        mobile: '+66 97 246 6550'
      }
    ]
  };

  const displayContent = content || defaultContent;

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

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
            {displayContent.header_title}
          </h1>
          <h2 className="mb-3" style={{
            color: '#000',
            fontFamily: 'Prompt',
            fontSize: '40px',
            fontStyle: 'normal',
            fontWeight: 500,
            lineHeight: 'normal'
          }}>
            {displayContent.header_main_title}
          </h2>
          <p className="mb-3" style={{
            color: '#000',
            fontFamily: 'Prompt',
            fontSize: '30px',
            fontStyle: 'italic',
            fontWeight: 400,
            lineHeight: 'normal'
          }}>
            {displayContent.header_theme}
          </p>
          <p className="mb-3" style={{
            color: '#000',
            fontFamily: 'Prompt',
            fontSize: '22px',
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: 'normal'
          }}>
            {displayContent.header_date}
          </p>
          <p className="mb-3" style={{
            color: '#000',
            fontFamily: 'Prompt',
            fontSize: '18px',
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: 'normal'
          }}>
            <span style={{ fontWeight: 500 }}>Venue:</span> {displayContent.header_venue}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Why SACIT Symposium Section */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Why SACIT Symposium?</h3>
            {displayContent.why_sacit_content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-gray-700 mb-4 leading-relaxed">
                {paragraph}
              </p>
            ))}
            {displayContent.why_sacit_programs && displayContent.why_sacit_programs.length > 0 && (
              <>
                <p className="text-gray-700 mb-2 leading-relaxed">The event will feature four key programs:</p>
                <ul className="list-disc list-inside text-gray-700 mb-4 ml-4 space-y-1">
                  {displayContent.why_sacit_programs.map((program, index) => (
                    <li key={index}>{program}</li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* Objectives Section */}
          {displayContent.objectives && displayContent.objectives.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Objectives</h3>
              <ol className="list-decimal list-inside text-gray-700 space-y-4 ml-4">
                {displayContent.objectives.map((objective, index) => (
                  <li key={index} className="leading-relaxed">
                    {objective}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Program Format Section */}
          {displayContent.program_format && displayContent.program_format.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Program Format</h3>
              <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                {displayContent.program_format.map((format, index) => (
                  <li key={index}>{format}</li>
                ))}
              </ol>
            </div>
          )}

          {/* Presentation Categories Section */}
          {displayContent.presentation_categories && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Presentation Categories</h3>
              <div className="space-y-4">
                {displayContent.presentation_categories.creative_works && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">1. Creative Works</h4>
                    <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                      {displayContent.presentation_categories.creative_works.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {displayContent.presentation_categories.research_papers && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">2. Research Papers / Academic Articles</h4>
                    <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                      {displayContent.presentation_categories.research_papers.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Target Participants Section */}
          {displayContent.target_participants && displayContent.target_participants.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Target Participants</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                {displayContent.target_participants.map((participant, index) => (
                  <li key={index}>{participant}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Timeline Section */}
          {displayContent.timeline && displayContent.timeline.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Timeline</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                {displayContent.timeline.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Project Lead Section */}
          {displayContent.project_lead && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Project Lead</h3>
              <p className="text-gray-700 mb-4">
                {displayContent.project_lead.split('\n').map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    {index < displayContent.project_lead.split('\n').length - 1 && <br/>}
                  </React.Fragment>
                ))}
              </p>
            </div>
          )}

          {/* Contact Persons Section */}
          {displayContent.contact_persons && displayContent.contact_persons.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Contact Persons</h3>
              <div className="space-y-4">
                {displayContent.contact_persons.map((contact, index) => (
                  <div key={index}>
                    <p className="font-semibold text-gray-800">{contact.name}</p>
                    <p className="text-gray-700">{contact.position}</p>
                    <p className="text-gray-700">E-mail: {contact.email}</p>
                    {contact.email2 && <p className="text-gray-700">{contact.email2}</p>}
                    <p className="text-gray-700">Mobile: {contact.mobile}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
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

export default SacitSymposiumEN;
