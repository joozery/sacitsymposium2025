import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import agenda071 from '/src/assets/agenda/saciteng.png';
import agenda081 from '/src/assets/agenda/saciteng2.png';

const Agenda = () => {
  const [activeTab, setActiveTab] = useState('day1');
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
            textAlign: 'center',
            fontFamily: 'AWConqueror Std Didot',
            fontSize: '40px',
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: 'normal',
            background: 'linear-gradient(90deg, #533193 0%, #BFB4EE 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Agenda of SACIT Symposium 2025
          </h1>
          <h2 className="mb-3" style={{
            width: '911px',
            height: '40px',
            flexShrink: 0,
            color: '#533192',
            textAlign: 'center',
            fontFamily: 'AWConqueror Std Didot',
            fontSize: '24px',
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: 'normal'
          }}>
            SACIT Symposium 2025: Crafting Sustainability across ASEAN and Beyond
          </h2>
          <div className="mb-3 inline-block rounded-lg" style={{
            width: '900px',
            height: '36px',
            flexShrink: 0,
            background: 'linear-gradient(90deg, #533193 0%, #BFB4EE 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{
              color: '#FFF',
              textAlign: 'center',
              fontFamily: 'AWConqueror Std Didot',
              fontSize: '20px',
              fontStyle: 'normal',
              fontWeight: 700,
              lineHeight: 'normal'
            }}>
              August 7 – 8, 2025
            </span>
          </div>
          <p className="mb-2" style={{
            color: '#000',
            textAlign: 'center',
            fontFamily: 'AWConqueror Std Didot',
            fontSize: '24px',
            fontStyle: 'normal',
            fontWeight: 300,
            lineHeight: 'normal'
          }}>
            At the Sustainable Arts and Crafts Institute of Thailand (SACIT)
          </p>
          <p className="mb-3" style={{
            color: '#000',
            textAlign: 'center',
            fontFamily: 'AWConqueror Std Didot',
            fontSize: '24px',
            fontStyle: 'normal',
            fontWeight: 300,
            lineHeight: 'normal'
          }}>
            Bang Sai District, Phra Nakhon Si Ayutthaya Province, Thailand
          </p>
        </div>
      </div>

      {/* Main Content Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Tab Navigation */}
            <div className="flex mb-0">
              <button 
                className={`flex-1 py-4 px-6 text-lg font-semibold transition-all duration-300 flex items-center justify-center ${
                  activeTab === 'day1' 
                    ? 'bg-purple-200 text-purple-800' 
                    : 'bg-white text-gray-400'
                }`}
                onClick={() => setActiveTab('day1')}
              >
                <span className="mr-2">◆</span>
                Day 1
              </button>
              <button 
                className={`flex-1 py-4 px-6 text-lg font-semibold transition-all duration-300 ${
                  activeTab === 'day2' 
                    ? 'bg-purple-200 text-purple-800' 
                    : 'bg-white text-gray-400'
                }`}
                onClick={() => setActiveTab('day2')}
              >
                Day 2
              </button>
            </div>

            {/* Gradient Header Bar */}
            <div className="flex items-center px-6 w-full" style={{
              height: '60px',
              flexShrink: 0,
              background: 'linear-gradient(90deg, #533192 0%, #BFB4EE 50%, #B3FFD1 100%)'
            }}>
              <h3 className="text-2xl font-bold text-white">
                {activeTab === 'day1' ? 'Day 1 August 7, 2025' : 'Day 2 August 8, 2025'}
              </h3>
            </div>

            {/* Day 1 Content */}
            {activeTab === 'day1' && (
              <div className="bg-white rounded-b-lg p-4">
                <div className="space-y-6">
                  <div className="w-full">
                    <img 
                      src={agenda071} 
                      alt="Day 1 Agenda"
                      className="w-full h-auto rounded-lg shadow-lg"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Day 2 Content */}
            {activeTab === 'day2' && (
              <div className="bg-white rounded-b-lg p-4">
                <div className="space-y-6">
                  <div className="w-full">
                    <img 
                      src={agenda081} 
                      alt="Day 2 Agenda"
                      className="w-full h-auto rounded-lg shadow-lg"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Back to Home Button */}
            <div className="text-center mt-12">
              <Link 
                to="/"
                className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-800 text-white font-semibold rounded-full hover:from-purple-700 hover:to-purple-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Gradient Border */}
      <div 
        className="h-1 w-full"
        style={{
          background: 'linear-gradient(90deg, #BFB4EE 0%, #B3FFD1 100%)'
        }}
      ></div>
    </div>
  );
};

export default Agenda;