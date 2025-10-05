import sacsitImg from '../../../assets/sacsit.jpg';

const AboutContent = () => {
  return (
    <div className="w-full py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start gap-12">
      {/* รูปภาพซ้าย */}
      <div className="relative w-full max-w-[500px] flex-shrink-0">
        {/* เงาสีม่วงด้านหลัง */}
        <div
          className="absolute w-full h-full"
          style={{
            background: '#533193',
            top: '20px',
            left: '-20px',
            zIndex: 0,
          }}
        />
        <img
          src={sacsitImg}
          alt="SACIT Craft Center"
          className="relative w-full h-auto object-cover z-10"
          style={{
            position: 'relative',
            zIndex: 1,
          }}
        />
      </div>

      {/* เนื้อหาขวา */}
      <div className="flex-1 flex flex-col justify-start">
        <h2
          className="mb-6"
          style={{
            color: '#533193',
            fontFamily: 'AWConqueror Std Didot, serif',
            fontWeight: 700,
            fontSize: '2.25rem',
            lineHeight: 1.2,
          }}
        >
          สถาบันส่งเสริมศิลปหัตถกรรมไทย<br />(องค์การมหาชน)
        </h2>
        
        <div className="space-y-4" style={{ fontFamily: 'Prompt, sans-serif' }}>
          <p className="text-gray-800 text-base leading-relaxed">
            พระบาทสมเด็จพระปรมินทรมหาภูมิพลอดุลยเดช บรมนาถบพิตร ทรงลงพระปรมาภิไธยในพระราชกฤษฎีกาจัดตั้ง ศูนย์ส่งเสริมศิลปาชีพระหว่างประเทศ (องค์การมหาชน) พ.ศ. 2546 หรือ ศ.ศ.ป. ต่อมาพระราชกฤษฎีกาจัดตั้ง สถาบันส่งเสริมศิลปหัตถกรรมไทย (องค์การมหาชน) พ.ศ. 2564 หรือ สศท. มีผลบังคับใช้ตามกฎหมาย เมื่อวันที่ 14 กรกฎาคม 2564
          </p>
          
          <p className="text-gray-800 text-base leading-relaxed">
            ซึ่งเปลี่ยนชื่อมาจากศูนย์ส่งเสริมศิลปาชีพระหว่างประเทศ (องค์การมหาชน) พร้อมทั้งให้มีการ ปรับปรุงวัตถุประสงค์ หน้าที่ และอำนาจของสถาบัน องค์ประกอบของคณะกรรมการสถาบันฯ ตลอดจนบทบัญญัติต่างๆ ที่เกี่ยวข้อง ให้สอดคล้องกับการดำเนินงานของสถาบัน โดยเป็น หน่วยงานหลักในการดูแลส่งเสริมและสนับสนุนศิลปหัตถกรรมไทยให้มีประสิทธิภาพมากยิ่งขึ้น อาทิ การส่งเสริมและสนับสนุนให้มีการประกอบอาชีพเพื่อสร้างผลิตภัณฑ์ศิลปหัตถกรรมไทยอย่างยั่งยืน การพัฒนาคุณภาพและมาตรฐานของผลิตภัณฑ์ฯ ทั้งด้านเทคโนโลยี นวัตกรรม ความคิดสร้างสรรค์ และภูมิปัญญาท้องถิ่นมาประยุกต์ใช้ในการพัฒนาผลิตภัณฑ์การสร้างมูลค่าเพิ่มให้แก่ผลิตภัณฑ์ฯ ด้วยการเปิดและขายตลาดผลิตภัณฑ์ศิลปหัตถกรรมไทยทั้งในและต่างประเทศ
          </p>
          
          <p className="text-gray-800 text-base leading-relaxed">
            ซึ่งตามหน้าที่สามารถจัดให้มีและบริหารแพลตฟอร์มอิเล็กทรอนิกส์เพื่อส่งเสริมการซื้อขายผลิตภัณฑ์ศิลปหัตถกรรมไทย ได้ด้วยรวมทั้งส่งเสริมภาพลักษณ์และการขายของผลิตภัณฑ์ให้แพร่หลายสร้างและถ่ายทอดองค์ ความรู้ และวิธีบริหารจัดการวัฒนธรรมในส่วนที่เกี่ยวข้องกับศิลปหัตถกรรมไทย และการรับรอง มาตรฐานผลิตภัณฑ์ศิลปหัตถกรรมไทย เป็นต้น
          </p>
        </div>
      </div>
        </div>
      </div>
    </div>
  );
};

export default AboutContent; 