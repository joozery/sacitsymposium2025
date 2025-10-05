import bannerImg from '../../../assets/Vinyl.png';

const BannerSection = () => {
  return (
    <div className="w-full flex justify-center bg-[#fff] py-12">
      <div
        className="w-[1174px] h-[272px] relative overflow-hidden shadow-lg"
        style={{
          backgroundImage: `url(${bannerImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
        }}
      >
      </div>
    </div>
  );
};

export default BannerSection;
