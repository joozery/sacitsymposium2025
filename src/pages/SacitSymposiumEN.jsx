import React from 'react';
import { Link } from 'react-router-dom';

const SacitSymposiumEN = () => {
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
            The 1st National Academic Symposium on Arts and Crafts
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
            Date: 7 – 8 August 2025
          </p>
          <p className="mb-3" style={{
            color: '#000',
            fontFamily: 'Prompt',
            fontSize: '18px',
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: 'normal'
          }}>
            <span style={{ fontWeight: 500 }}>Venue:</span> The Sustainable Arts and Crafts Institute of Thailand (Public Organization), Bang Sai District, Phra Nakhon Si Ayutthaya Province
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Why SACIT Symposium Section */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Why SACIT Symposium?</h3>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Traditional arts and crafts are a living legacy, passed down through generations and evolving
              into processes of creativity and storytelling. Sadly, many of these crafts have become
              "vanishing crafts" and are at risk of disappearing. With fewer artisans practicing them, some
              are fading from public knowledge and daily life.
            </p>
            <p className="text-gray-700 mb-4 leading-relaxed">
              In the year 2025, SACIT is taking action to strengthen and share Thai craft knowledge with
              local and international communities: including artisans, young creatives, designers, students,
              researchers, craft lovers, and beyond.
            </p>
            <p className="text-gray-700 mb-4 leading-relaxed">
              To that end, we are organizing the 1st Academic Symposium on Arts and Crafts, or SACIT
              Symposium 2025, under the theme "Crafting Sustainability across ASEAN and Beyond."
            </p>
            <p className="text-gray-700 mb-2 leading-relaxed">The event will feature four key programs:</p>
            <ul className="list-disc list-inside text-gray-700 mb-4 ml-4 space-y-1">
              <li>Knowledge-sharing and panel discussions</li>
              <li>Academic and craftwork presentations</li>
              <li>Live demonstrations of creative processes behind lacquerware and other crafts</li>
              <li>An exhibition featuring lacquerware, related knowledge, and various other craftworks</li>
            </ul>
            <p className="text-gray-700 mb-4 leading-relaxed">
              The SACIT Symposium 2025 aims to serve as a platform for presenting and sharing
              knowledge on arts and crafts through a variety of activities involving experts, artisans, and
              creators from ASEAN and other countries with shared roots in craft traditions and culture,
              including Thailand, Myanmar, Laos, Cambodia, Vietnam, China, South Korea, Japan, and
              others.
            </p>
            <p className="text-gray-700 mb-6 leading-relaxed">
              The symposium also welcomes organizations and institutions within craft-related networks to
              exchange both technical and academic knowledge, showcase creative works and innovations,
              and share ideas on the transmission and sustainable preservation of national craft heritage.
            </p>
          </div>

          {/* Objectives Section */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Objectives</h3>
            <ol className="list-decimal list-inside text-gray-700 space-y-4 ml-4">
              <li className="leading-relaxed">
                To promote and enhance the value of local arts and crafts in academic contexts
                and through collaborative activities with partner organizations or agencies involved
                in supporting crafts both domestically and internationally. The symposium aims to
                foster networks of craft knowledge at both national and international levels, laying the
                groundwork for future collaboration.
              </li>
              <li className="leading-relaxed">
                To foster interest in Thai arts and crafts within the country and among ASEAN
                nations, and to support SACIT's role as a hub of knowledge in arts and crafts.
              </li>
              <li className="leading-relaxed">
                To promote intangible craft heritage as a valuable social and cultural asset—
                a source of pride and a foundation for developing knowledge in multiple dimensions.
                This includes proper documentation, dissemination, and practical application, while
                also encouraging the creation of a knowledge ecosystem that supports the sustainable
                transmission of craft traditions.
              </li>
            </ol>
          </div>

          {/* Program Format Section */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Program Format</h3>
            <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
              <li>Keynote Speech and Special Lectures</li>
              <li>Academic Presentations and Panel Discussions</li>
              <li>Workshops and Live Showcases</li>
              <li>Exhibition</li>
            </ol>
          </div>

          {/* Presentation Categories Section */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Presentation Categories</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">1. Creative Works</h4>
                <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                  <li>Lacquerwares</li>
                  <li>Craftworks and fine art pieces</li>
                  <li>Contemporary and applied crafts</li>
                  <li>Local crafts and other traditional craftworks</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">2. Research Papers / Academic Articles</h4>
                <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                  <li>Lacquer sap, lacquer tree, and other resin-producing plants as raw materials in crafts</li>
                  <li>Art, culture, and the creative development of traditional crafts</li>
                  <li>Preservation of traditional knowledge in crafts</li>
                  <li>Material science and sustainable alternatives in craft-making</li>
                  <li>Artistic works and craftworks aligned with the ESG framework</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Target Participants Section */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Target Participants</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>SACIT Master Artisans of Thailand, Master Craftsmen, and Craftsmen Descendants in relevant fields</li>
              <li>Craftspeople and experts in arts and crafts, both Thais and foreign nationals</li>
              <li>SACIT members working in related professions</li>
              <li>Academics, researchers, and students in relevant disciplines</li>
              <li>Educational institutions and partner organizations, both domestic and international</li>
              <li>Designers, creatives, and next-generation entrepreneurs interested in traditional and contemporary crafts</li>
            </ul>
          </div>

          {/* Timeline Section */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Timeline</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Project Duration: April – August 2025</li>
              <li>Event Dates: 7 – 8 August 2025</li>
              <li>Venue: The Sustainable Arts and Crafts Institute of Thailand (Public Organization), Bang Sai District, Phra Nakhon Si Ayutthaya Province</li>
            </ul>
          </div>

          {/* Project Lead Section */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Project Lead</h3>
            <p className="text-gray-700 mb-4">
              The Sustainable Arts and Crafts Institute of Thailand (Public Organization),<br/>
              Bang Sai District, Phra Nakhon Si Ayutthaya Province
            </p>
          </div>

          {/* Contact Persons Section */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Contact Persons</h3>
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-gray-800">Mrs. Burachat Sriwilai</p>
                <p className="text-gray-700">Head of Craft Knowledge Management division</p>
                <p className="text-gray-700">E-mail: Burachat.s@sacit.or.th</p>
                <p className="text-gray-700">symposium.2025@sacit.or.th</p>
                <p className="text-gray-700">Mobile: +66 85 040 0842</p>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Mr. Tayud Mongkolrat</p>
                <p className="text-gray-700">Senior Partnership and Foreign Affairs Officer</p>
                <p className="text-gray-700">E-mail: tayud.m@sacit.or.th</p>
                <p className="text-gray-700">Mobile: +66 97 246 6550</p>
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

export default SacitSymposiumEN; 