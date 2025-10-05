import bgImg from '../../../assets/Group107.jpg';

const AboutHeader = () => {
  return (
    <div>
      {/* Hero Section */}
      <div
        className="w-full h-[340px] flex items-center justify-center relative pt-12"
        style={{
          backgroundImage: `url(${bgImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <h1
          className="relative z-10"
          style={{
            fontFamily: 'AWConqueror Std Didot',
            fontWeight: 700,
            fontSize: '64px',
            lineHeight: '100%',
            color: '#fff',
            textAlign: 'center',
            width: '100%',
            margin: 0,
            padding: 0,
          }}
        >
          About Us
        </h1>
      </div>
      
      {/* Breadcrumb Section */}
      <div className="w-full py-4 shadow-md border-b-4" style={{background: 'linear-gradient(90deg, #533193 0%, #BFB4EE 100%)', borderBottomColor: '#533193', borderBottomWidth: '4px'}}>
        <div className="container mx-auto flex justify-center items-center">
          <span
            className="flex items-center gap-2 text-lg font-medium drop-shadow"
            style={{
              fontFamily: 'Poppins',
              fontSize: '20px',
              fontWeight: 500,
              background: 'linear-gradient(90deg, #BFB4EE 0%, #B3FFD1 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              WebkitTextFillColor: 'transparent',
              lineHeight: 'normal',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <polygon points="9,2 16,9 9,16 2,9" fill="#C7BFFF"/>
            </svg>
            ประวัติความเป็นมา
          </span>
        </div>
      </div>
    </div>
  );
};

export default AboutHeader; 