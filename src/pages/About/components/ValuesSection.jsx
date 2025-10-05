const ValuesSection = () => {
  const valuesItems = [
    {
      letter: "S",
      title: "เสริมพลังสร้างคุณค่า",
      description: ""
    },
    {
      letter: "A",
      title: "จิตสำนึก",
      subtitle: "ในความรับผิดชอบ",
      description: ""
    },
    {
      letter: "C",
      title: "มีความคิดสร้างสรรค์",
      subtitle: "และใส่ใจ ห่วงใย เต็มใจให้บริการ",
      description: ""
    },
    {
      letter: "I",
      title: "ยึดมั่นในคุณธรรม",
      subtitle: "และจริยธรรม",
      description: ""
    },
    {
      letter: "T",
      title: "ทีมประสิทธิภาพ",
      subtitle: "และประสิทธิผล",
      description: ""
    }
  ];

  return (
    <div 
      className="w-full py-20"
      style={{
        background: 'linear-gradient(135deg, #E8E4F3 0%, #F3F0FF 100%)',
      }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <h2 
            className="text-center mb-16"
            style={{
              color: '#533193',
              fontFamily: 'Prompt, sans-serif',
              fontWeight: 700,
              fontSize: '2.5rem',
              lineHeight: 1.2,
            }}
          >
            ค่านิยมองค์กร
          </h2>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {valuesItems.map((item, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                {/* Letter Card */}
                <div 
                  className="mb-6 flex flex-col items-center justify-center shadow-lg"
                  style={{
                    width: '192px',
                    height: '231px',
                    flexShrink: 0,
                    borderRadius: '5px',
                    background: '#BFB4EE',
                    boxShadow: '0 4px 12px rgba(83, 49, 147, 0.2)',
                    padding: '24px',
                  }}
                >
                  {/* Letter */}
                  <span 
                    className="font-bold mb-4"
                    style={{
                      fontFamily: 'AWConqueror Std Didot, serif',
                      fontSize: '4rem',
                      color: '#533193',
                      lineHeight: 1,
                    }}
                  >
                    {item.letter}
                  </span>
                  
                  {/* Title */}
                  <h3 
                    className="mb-2 text-center"
                    style={{
                      fontFamily: 'Prompt, sans-serif',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      color: '#533193',
                      lineHeight: 1.3,
                    }}
                  >
                    {item.title}
                  </h3>
                  
                  {/* Subtitle */}
                  {item.subtitle && (
                    <p 
                      className="text-center"
                      style={{
                        fontFamily: 'Prompt, sans-serif',
                        fontSize: '0.95rem',
                        color: '#533193',
                        lineHeight: 1.4,
                      }}
                    >
                      {item.subtitle}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValuesSection; 