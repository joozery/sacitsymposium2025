import sacitvision from '/src/assets/sacitvision.webp';

const VisionSection = () => {
  return (
    <div 
      className="w-full py-20"
      style={{
        background: 'linear-gradient(135deg, #BFB4EE 0%, #B3FFD1 100%)',
        boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25) inset',
        backdropFilter: 'blur(2px)',
      }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Content */}
          <div className="flex-1 lg:max-w-2xl">
            <h3 
              className="mb-6"
              style={{
                color: '#533193',
                fontFamily: 'Prompt, sans-serif',
                fontWeight: 600,
                fontSize: '1.5rem',
                lineHeight: 1.2,
              }}
            >
              วิสัยทัศน์
            </h3>
            
            <h2 
              className="mb-8"
              style={{
                color: '#533193',
                fontFamily: 'Prompt, sans-serif',
                fontWeight: 400,
                fontSize: '3rem',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
              }}
            >
              สืบสาน<br />
              สร้างสรรค์<br />
              ส่งเสริม
            </h2>
            
            <p 
              className="text-gray-700 text-lg mb-2"
              style={{
                fontFamily: 'Prompt, sans-serif',
                lineHeight: '1.8',
                fontSize: '1.1rem',
              }}
            >
              งานศิลปหัตถกรรมไทยทุกชนิด ให้ก้าวไกลสอยสง่างนิรันดร์
            </p>
          </div>

          {/* Right Content - Stacked Rectangles */}
          <div className="flex-1 relative flex flex-col items-end" style={{ height: '400px' }}>
            {/* SACIT Box - Top Rectangle */}
            <div 
              className="px-16 py-12 shadow-lg"
              style={{
                background: '#533193',
                width: '300px',
                height: '150px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '-20px',
                zIndex: 2,
                position: 'relative',
              }}
            >
              <h3 
                className="text-white text-center"
                style={{
                  fontFamily: 'Prompt, sans-serif',
                  fontWeight: 700,
                  fontSize: '2.5rem',
                  letterSpacing: '0.1em',
                }}
              >
                SACIT
              </h3>
            </div>

            {/* Crafts Image - Bottom Rectangle */}
            <div 
              style={{
                width: '300px',
                height: '220px',
                marginLeft: '-50px',
                zIndex: 1,
                position: 'relative',
              }}
            >
              <img
                src={sacitvision}
                alt="SACIT Vision"
                className="w-full h-full object-cover shadow-lg"
              />
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisionSection; 