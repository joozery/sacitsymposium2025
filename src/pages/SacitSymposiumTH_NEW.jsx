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
      const response = await api.get('/symposium-en');
      setContent(response.data.data);
    } catch (error) {
      console.error('Error fetching symposium EN content:', error);
      // Keep default content if API fails
    } finally {
      setLoading(false);
    }
  };

  // Default content (fallback)
  const defaultContent = {
    header_title: 'The 1st National Academic Symposium on Arts and Crafts',
    header_main_title: 'SACIT Symposium 2025',
    header_theme: '"Crafting Sustainability across ASEAN and Beyond"',
    header_date: 'Date: 7 – 8 August 2025',
    header_venue: 'The Sustainable Arts and Crafts Institute of Thailand (Public Organization), Bang Sai District, Phra Nakhon Si Ayutthaya Province',
    why_sacit_content: `Traditional arts and crafts are a living legacy, passed down through generations and evolving into processes of creativity and storytelling. Sadly, many of these crafts have become "vanishing crafts" and are at risk of disappearing. With fewer artisans practicing them, some are fading from public knowledge and daily life.

In the year 2025, SACIT is taking action to strengthen and share Thai craft knowledge with local and international communities: including artisans, young creatives, designers, students, researchers, craft lovers, and beyond.

To that end, we are organizing the 1st Academic Symposium on Arts and Crafts, or SACIT Symposium 2025, under the theme "Crafting Sustainability across ASEAN and Beyond."

The SACIT Symposium 2025 aims to serve as a platform for presenting and sharing knowledge on arts and crafts through a variety of activities involving experts, artisans, and creators from ASEAN and other countries with shared roots in craft traditions and culture, including Thailand, Myanmar, Laos, Cambodia, Vietnam, China, South Korea, Japan, and others.

The symposium also welcomes organizations and institutions within craft-related networks to exchange both technical and academic knowledge, showcase creative works and innovations, and share ideas on the transmission and sustainable preservation of national craft heritage.`,
    why_sacit_programs: [
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
    presentation_categories: {
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
      ]
    },
    target_participants: [
      'SACIT Master Artisans of Thailand, Master Craftsmen, and Craftsmen Descendants in relevant fields',
      'Craftspeople and experts in arts and crafts, both Thais and foreign nationals',
      'SACIT members working in related professions',
      'Academics, researchers, and students in relevant disciplines',
      'Educational institutions and partner organizations, both domestic and international',
      'Designers, creatives, and next-generation entrepreneurs interested in traditional and contemporary crafts'
    ],
    timeline: [
      'Project Duration: April – August 2025',
      'Event Dates: 7 – 8 August 2025',
      'Venue: The Sustainable Arts and Crafts Institute of Thailand (Public Organization), Bang Sai District, Phra Nakhon Si Ayutthaya Province'
    ],
    project_lead: 'The Sustainable Arts and Crafts Institute of Thailand (Public Organization), Bang Sai District, Phra Nakhon Si Ayutthaya Province',
    contact_persons: [
      {
        name: 'Mrs. Burachat Sriwilai',
        position: 'Head of Craft Knowledge Management division',
        email: 'Burachat.s@sacit.or.th',
        email2: 'symposium.2025@sacit.or.th',
        mobile: '+66 85 040 0842'
      },
      {
        name: 'Mr. Tayud Mongkolrat',
        position: 'Senior Partnership and Foreign Affairs Officer',
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
