import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

const SacitSymposiumEN = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/symposium-en`);
      const data = await response.json();
      
      if (data.success && data.data) {
        // Parse JSON arrays
        const parseArray = (field, defaultArray) => {
          if (!data.data[field]) return defaultArray;
          return typeof data.data[field] === 'string' 
            ? JSON.parse(data.data[field]) 
            : data.data[field];
        };
        
        // Merge API data with default content (use default if field is empty)
        const defaultContent = getDefaultContent();
        const mergedContent = {};
        
        Object.keys(defaultContent).forEach(key => {
          if (Array.isArray(defaultContent[key])) {
            const apiArray = parseArray(key, []);
            mergedContent[key] = apiArray.length > 0 && apiArray.some(item => item) 
              ? apiArray 
              : defaultContent[key];
          } else {
            mergedContent[key] = data.data[key] || defaultContent[key];
          }
        });
        
        setContent(mergedContent);
      } else {
        // Use default content if no data
        setContent(getDefaultContent());
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      // Use default content if API fails
      setContent(getDefaultContent());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultContent = () => ({
    header_title_line1: 'The 1st National Academic Symposium on Arts and Crafts',
    header_title_line2: 'SACIT Symposium 2025',
    header_theme: 'Crafting Sustainability across ASEAN and Beyond',
    header_date: '7 – 8 August 2025',
    header_venue: 'The Sustainable Arts and Crafts Institute of Thailand (Public Organization), Bang Sai District, Phra Nakhon Si Ayutthaya Province',
    why_paragraph1: 'Traditional arts and crafts are a living legacy, passed down through generations and evolving into processes of creativity and storytelling. Sadly, many of these crafts have become "vanishing crafts" and are at risk of disappearing. With fewer artisans practicing them, some are fading from public knowledge and daily life.',
    why_paragraph2: 'In the year 2025, SACIT is taking action to strengthen and share Thai craft knowledge with local and international communities: including artisans, young creatives, designers, students, researchers, craft lovers, and beyond.',
    why_paragraph3: 'To that end, we are organizing the 1st Academic Symposium on Arts and Crafts, or SACIT Symposium 2025, under the theme "Crafting Sustainability across ASEAN and Beyond."',
    why_paragraph4: 'The SACIT Symposium 2025 aims to serve as a platform for presenting and sharing knowledge on arts and crafts through a variety of activities involving experts, artisans, and creators from ASEAN and other countries with shared roots in craft traditions and culture, including Thailand, Myanmar, Laos, Cambodia, Vietnam, China, South Korea, Japan, and others.',
    why_programs: [
      'Knowledge-sharing and panel discussions',
      'Academic and craftwork presentations',
      'Live demonstrations of creative processes behind lacquerware and other crafts',
      'An exhibition featuring lacquerware, related knowledge, and various other craftworks'
    ],
    objectives: [
      'To promote and enhance the value of local arts and crafts in academic contexts and through collaborative activities with partner organizations or agencies involved in supporting crafts both domestically and internationally. The symposium aims to foster networks of craft knowledge at both national and international levels, laying the groundwork for future collaboration.',
      'To foster interest in Thai arts and crafts within the country and among ASEAN nations, and to support SACIT\'s role as a hub of knowledge in arts and crafts.',
      'To promote intangible craft heritage as a valuable social and cultural asset—a source of pride and a foundation for developing knowledge in multiple dimensions. This includes proper documentation, dissemination, and practical application, while also encouraging the creation of a knowledge ecosystem that supports the sustainable transmission of craft traditions.'
    ],
    program_format: [
      'Keynote Speech and Special Lectures',
      'Academic Presentations and Panel Discussions',
      'Workshops and Live Showcases',
      'Exhibition'
    ],
    creative_works: [
      'Lacquerwares',
      'Craftworks and fine art pieces',
      'Contemporary and applied crafts',
      'Local crafts and other traditional craftworks'
    ],
    research_papers: [
      'Lacquer sap, lacquer tree, and other resin-producing plants as raw materials in crafts',
      'Art, culture, and the creative development of traditional crafts',
      'Preservation of traditional knowledge in crafts',
      'Material science and sustainable alternatives in craft-making',
      'Artistic works and craftworks aligned with the ESG framework'
    ],
    target_participants: [
      'SACIT Master Artisans of Thailand, Master Craftsmen, and Craftsmen Descendants in relevant fields',
      'Craftspeople and experts in arts and crafts, both Thais and foreign nationals',
      'SACIT members working in related professions',
      'Academics, researchers, and students in relevant disciplines',
      'Educational institutions and partner organizations, both domestic and international',
      'Designers, creatives, and next-generation entrepreneurs interested in traditional and contemporary crafts'
    ],
    timeline_duration: 'April – August 2025',
    timeline_dates: '7 – 8 August 2025',
    timeline_venue: 'The Sustainable Arts and Crafts Institute of Thailand (Public Organization), Bang Sai District, Phra Nakhon Si Ayutthaya Province',
    project_lead: 'The Sustainable Arts and Crafts Institute of Thailand (Public Organization), Bang Sai District, Phra Nakhon Si Ayutthaya Province',
    contact1_name: 'Mrs. Burachat Sriwilai',
    contact1_title: 'Head of Craft Knowledge Management division',
    contact1_email: 'Burachat.s@sacit.or.th',
    contact1_email2: 'symposium.2025@sacit.or.th',
    contact1_phone: '+66 85 040 0842',
    contact2_name: 'Mr. Tayud Mongkolrat',
    contact2_title: 'Senior Partnership and Foreign Affairs Officer',
    contact2_email: 'tayud.m@sacit.or.th',
    contact2_phone: '+66 97 246 6550'
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#533193] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return null;
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
            {content.header_title_line1}
          </h1>
          <h2 className="mb-3" style={{
            color: '#000',
            fontFamily: 'Prompt',
            fontSize: '40px',
            fontStyle: 'normal',
            fontWeight: 500,
            lineHeight: 'normal'
          }}>
            {content.header_title_line2}
          </h2>
          <p className="mb-3" style={{
            color: '#000',
            fontFamily: 'Prompt',
            fontSize: '30px',
            fontStyle: 'italic',
            fontWeight: 400,
            lineHeight: 'normal'
          }}>
            "{content.header_theme}"
          </p>
          <p className="mb-3" style={{
            color: '#000',
            fontFamily: 'Prompt',
            fontSize: '22px',
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: 'normal'
          }}>
            Date: {content.header_date}
          </p>
          <p className="mb-3" style={{
            color: '#000',
            fontFamily: 'Prompt',
            fontSize: '18px',
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: 'normal'
          }}>
            <span style={{ fontWeight: 500 }}>Venue:</span> {content.header_venue}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Why SACIT Symposium Section */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Why SACIT Symposium?</h3>
            {content.why_paragraph1 && (
              <p className="text-gray-700 mb-4 leading-relaxed">{content.why_paragraph1}</p>
            )}
            {content.why_paragraph2 && (
              <p className="text-gray-700 mb-4 leading-relaxed">{content.why_paragraph2}</p>
            )}
            {content.why_paragraph3 && (
              <p className="text-gray-700 mb-4 leading-relaxed">{content.why_paragraph3}</p>
            )}
            {content.why_programs && content.why_programs.length > 0 && (
              <>
                <p className="text-gray-700 mb-2 leading-relaxed">The event will feature four key programs:</p>
                <ul className="list-disc list-inside text-gray-700 mb-4 ml-4 space-y-1">
                  {content.why_programs.map((program, index) => (
                    program && <li key={index}>{program}</li>
                  ))}
                </ul>
              </>
            )}
            {content.why_paragraph4 && (
              <p className="text-gray-700 mb-6 leading-relaxed">{content.why_paragraph4}</p>
            )}
          </div>

          {/* Objectives Section */}
          {content.objectives && content.objectives.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Objectives</h3>
              <ol className="list-decimal list-inside text-gray-700 space-y-4 ml-4">
                {content.objectives.map((objective, index) => (
                  objective && (
                    <li key={index} className="leading-relaxed">{objective}</li>
                  )
                ))}
              </ol>
            </div>
          )}

          {/* Program Format Section */}
          {content.program_format && content.program_format.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Program Format</h3>
              <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                {content.program_format.map((format, index) => (
                  format && <li key={index}>{format}</li>
                ))}
              </ol>
            </div>
          )}

          {/* Presentation Categories Section */}
          {((content.creative_works && content.creative_works.length > 0) || 
            (content.research_papers && content.research_papers.length > 0)) && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Presentation Categories</h3>
              <div className="space-y-4">
                {content.creative_works && content.creative_works.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">1. Creative Works</h4>
                    <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                      {content.creative_works.map((work, index) => (
                        work && <li key={index}>{work}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {content.research_papers && content.research_papers.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">2. Research Papers / Academic Articles</h4>
                    <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                      {content.research_papers.map((paper, index) => (
                        paper && <li key={index}>{paper}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Target Participants Section */}
          {content.target_participants && content.target_participants.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Target Participants</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                {content.target_participants.map((participant, index) => (
                  participant && <li key={index}>{participant}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Timeline Section */}
          {(content.timeline_duration || content.timeline_dates || content.timeline_venue) && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Timeline</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                {content.timeline_duration && <li>Project Duration: {content.timeline_duration}</li>}
                {content.timeline_dates && <li>Event Dates: {content.timeline_dates}</li>}
                {content.timeline_venue && <li>Venue: {content.timeline_venue}</li>}
              </ul>
            </div>
          )}

          {/* Project Lead Section */}
          {content.project_lead && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Project Lead</h3>
              <p className="text-gray-700 mb-4" style={{ whiteSpace: 'pre-line' }}>
                {content.project_lead}
              </p>
            </div>
          )}

          {/* Contact Persons Section */}
          {(content.contact1_name || content.contact2_name) && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Contact Persons</h3>
              <div className="space-y-4">
                {content.contact1_name && (
                  <div>
                    <p className="font-semibold text-gray-800">{content.contact1_name}</p>
                    {content.contact1_title && <p className="text-gray-700">{content.contact1_title}</p>}
                    {content.contact1_email && <p className="text-gray-700">E-mail: {content.contact1_email}</p>}
                    {content.contact1_email2 && <p className="text-gray-700">{content.contact1_email2}</p>}
                    {content.contact1_phone && <p className="text-gray-700">Mobile: {content.contact1_phone}</p>}
                  </div>
                )}
                {content.contact2_name && (
                  <div>
                    <p className="font-semibold text-gray-800">{content.contact2_name}</p>
                    {content.contact2_title && <p className="text-gray-700">{content.contact2_title}</p>}
                    {content.contact2_email && <p className="text-gray-700">E-mail: {content.contact2_email}</p>}
                    {content.contact2_phone && <p className="text-gray-700">Mobile: {content.contact2_phone}</p>}
                  </div>
                )}
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
