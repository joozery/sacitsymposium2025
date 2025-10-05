const MissionSection = () => {
  const missionItems = [
    {
      number: 1,
      text: "ส่งเสริมและสนับสนุนให้มีการประกอบอาชีพเพื่อสร้างผลิตภัณฑ์ศิลปหัตถกรรมไทยอย่างยั่งยืน"
    },
    {
      number: 2,
      text: "พัฒนาคุณภาพและมาตรฐานของผลิตภัณฑ์ศิลปหัตถกรรมไทย รวมทั้งนำเทคโนโลยี นวัตกรรม ความคิดสร้างสรรค์และภูมิปัญญาท้องถิ่นมาประยุกต์ใช้ในการพัฒนาผลิตภัณฑ์ศิลปหัตถกรรมไทย"
    },
    {
      number: 3,
      text: "ส่งเสริมและสนับสนุนการสร้างมูลค่าเพิ่มให้แก่ผลิตภัณฑ์ศิลปหัตถกรรมไทยโดยและยกชาดผลิตภัณฑ์ศิลปหัตถกรรมไทยทั้งในและต่างประเทศรวมทั้งส่งเสริมการพัฒนาและการรายงานของผลิตภัณฑ์ศิลปหัตถกรรมไทยให้มีพร้อมง"
    },
    {
      number: 4,
      text: "ส่งเสริมและพัฒนากิจกรรมผู้ประกอบการศิลปหัตถกรรมไทยให้มีความรู้ความสามารถในการบริหารจัดการด้านการผลิต การเงิน การตลาด"
    },
    {
      number: 5,
      text: "สืบสาน ส่งเสริมคุณค่า ยกย่องเชิดชู รักษา พัฒนาและเผยแพร่องค์ความรู้ เกี่ยวกับภูมิปัญญาชาวศิลปหัตถกรรมไทย"
    },
    {
      number: 6,
      text: "สร้างและสำนึกของความรู้และวิธีบริหารจัดการวัฒนธรรมในส่วนที่เกี่ยวกับศิลปหัตถกรรมไทย"
    },
    {
      number: 7,
      text: "จัดกิจานข้อมูลเกี่ยวกับศิลปหัตถกรรมไทย ผู้ประกอบการ บุคลากร และข้อมูลอื่นที่เกี่ยวข้องกับศิลปหัตถกรรมไทย"
    },
    {
      number: 8,
      text: "รับรองมาตรฐานผลิตภัณฑ์ศิลปหัตถกรรมไทย"
    },
    {
      number: 9,
      text: "ส่งเสริมและสนับสนุนการจดทะเบียนลิขสิทธิ์นิติ เครื่องหมายการค้าหรือสิทธิพิเศษทางกิจกรรมอันเกี่ยวข้องกับศิลปหัตถกรรมไทย"
    }
  ];

  return (
    <div className="w-full py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <h2 
            className="text-left mb-12"
            style={{
              color: '#533193',
              fontFamily: 'Prompt, sans-serif',
              fontWeight: 600,
              fontSize: '2.5rem',
              lineHeight: 1.2,
              borderBottom: '2px solid #E5E5E5',
              paddingBottom: '16px',
            }}
          >
            พันธกิจ สศท.
          </h2>

          {/* Mission Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-8">
            {missionItems.map((item) => (
              <div 
                key={item.number} 
                className="flex gap-4 items-start p-4 rounded-lg"
                style={{
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  borderBottom: '1px solid #E5E5E5',
                }}
              >
                {/* Number Circle */}
                <div 
                  className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                  style={{
                    background: '#533193',
                    fontFamily: 'Prompt, sans-serif',
                    fontSize: '1.2rem',
                    boxShadow: '0 2px 4px rgba(83, 49, 147, 0.3)',
                  }}
                >
                  {item.number}
                </div>
                
                {/* Text Content */}
                <p 
                  className="text-gray-800 leading-relaxed flex-1"
                  style={{
                    fontFamily: 'Prompt, sans-serif',
                    fontSize: '1rem',
                    lineHeight: '1.7',
                  }}
                >
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionSection; 