import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Save, Plus, Trash2, FileText, Users, Calendar, Target, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

const SymposiumEnContentPage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState({
    // Header Section
    header_title_line1: 'The 1st National Academic Symposium on Arts and Crafts',
    header_title_line2: 'SACIT Symposium 2025',
    header_theme: 'Crafting Sustainability across ASEAN and Beyond',
    header_date: '7 – 8 August 2025',
    header_venue: 'The Sustainable Arts and Crafts Institute of Thailand (Public Organization), Bang Sai District, Phra Nakhon Si Ayutthaya Province',
    
    // Why SACIT Section
    why_paragraph1: '',
    why_paragraph2: '',
    why_paragraph3: '',
    why_paragraph4: '',
    why_programs: ['', '', '', ''],
    
    // Objectives
    objectives: ['', '', ''],
    
    // Program Format
    program_format: ['', '', '', ''],
    
    // Presentation Categories - Creative Works
    creative_works: ['', '', '', ''],
    
    // Presentation Categories - Research Papers
    research_papers: ['', '', '', '', ''],
    
    // Target Participants
    target_participants: ['', '', '', '', '', ''],
    
    // Timeline
    timeline_duration: '',
    timeline_dates: '',
    timeline_venue: '',
    
    // Project Lead
    project_lead: '',
    
    // Contact Persons
    contact1_name: '',
    contact1_title: '',
    contact1_email: '',
    contact1_email2: '',
    contact1_phone: '',
    contact2_name: '',
    contact2_title: '',
    contact2_email: '',
    contact2_phone: ''
  });

  useEffect(() => {
    fetchContent();
  }, []);

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
    project_lead: 'The Sustainable Arts and Crafts Institute of Thailand (Public Organization),\nBang Sai District, Phra Nakhon Si Ayutthaya Province',
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

  const fetchContent = async () => {
    try {
      setLoading(true);
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
        
        // Merge API data with default content
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
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถโหลดข้อมูลได้',
        variant: 'destructive'
      });
      // Use default content on error
      setContent(getDefaultContent());
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const response = await fetch(`${API_BASE_URL}/symposium-en`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(content)
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'บันทึกสำเร็จ!',
          description: 'เนื้อหา Symposium EN ได้รับการอัพเดตแล้ว'
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถบันทึกข้อมูลได้',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleArrayChange = (field, index, value) => {
    const newArray = [...content[field]];
    newArray[index] = value;
    setContent({ ...content, [field]: newArray });
  };

  const addArrayItem = (field) => {
    setContent({
      ...content,
      [field]: [...content[field], '']
    });
  };

  const removeArrayItem = (field, index) => {
    const newArray = content[field].filter((_, i) => i !== index);
    setContent({ ...content, [field]: newArray });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#533193] mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet><title>Symposium EN Content - SACIT Admin</title></Helmet>
      
      <div className="container mx-auto p-6 max-w-6xl">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Symposium EN Content</h1>
            <p className="text-gray-600 mt-1">จัดการเนื้อหาหน้า Symposium (English)</p>
          </div>
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="bg-[#533193] hover:bg-[#6B4AB6]"
            size="lg"
          >
            <Save className="mr-2 h-5 w-5" />
            {saving ? 'กำลังบันทึก...' : 'บันทึกทั้งหมด'}
          </Button>
        </motion.div>

        <div className="space-y-6">
          {/* Header Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#533193]" />
                Header Section
              </CardTitle>
              <CardDescription>ส่วนหัวของหน้า (Banner)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Title Line 1</Label>
                <Input
                  value={content.header_title_line1}
                  onChange={(e) => setContent({ ...content, header_title_line1: e.target.value })}
                  placeholder="The 1st National Academic Symposium..."
                />
              </div>
              
              <div>
                <Label>Title Line 2</Label>
                <Input
                  value={content.header_title_line2}
                  onChange={(e) => setContent({ ...content, header_title_line2: e.target.value })}
                  placeholder="SACIT Symposium 2025"
                />
              </div>
              
              <div>
                <Label>Theme</Label>
                <Input
                  value={content.header_theme}
                  onChange={(e) => setContent({ ...content, header_theme: e.target.value })}
                  placeholder="Crafting Sustainability across ASEAN and Beyond"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date</Label>
                  <Input
                    value={content.header_date}
                    onChange={(e) => setContent({ ...content, header_date: e.target.value })}
                    placeholder="7 – 8 August 2025"
                  />
                </div>
                
                <div>
                  <Label>Venue</Label>
                  <Textarea
                    value={content.header_venue}
                    onChange={(e) => setContent({ ...content, header_venue: e.target.value })}
                    placeholder="The Sustainable Arts and Crafts Institute..."
                    rows={2}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Why SACIT Symposium */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-[#533193]" />
                Why SACIT Symposium?
              </CardTitle>
              <CardDescription>เนื้อหาส่วนแนะนำ</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3, 4].map((num) => (
                <div key={num}>
                  <Label>Paragraph {num}</Label>
                  <Textarea
                    value={content[`why_paragraph${num}`]}
                    onChange={(e) => setContent({ ...content, [`why_paragraph${num}`]: e.target.value })}
                    placeholder={`Paragraph ${num}...`}
                    rows={4}
                  />
                </div>
              ))}
              
              <div>
                <Label className="mb-2 block">Programs List (4 key programs)</Label>
                {content.why_programs.map((program, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      value={program}
                      onChange={(e) => handleArrayChange('why_programs', index, e.target.value)}
                      placeholder={`Program ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Objectives */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#533193]" />
                Objectives
              </CardTitle>
              <CardDescription>วัตถุประสงค์</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {content.objectives.map((objective, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-1">
                    <Label>Objective {index + 1}</Label>
                    <Textarea
                      value={objective}
                      onChange={(e) => handleArrayChange('objectives', index, e.target.value)}
                      placeholder={`Objective ${index + 1}...`}
                      rows={3}
                    />
                  </div>
                  {content.objectives.length > 1 && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeArrayItem('objectives', index)}
                      className="mt-6"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('objectives')}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Objective
              </Button>
            </CardContent>
          </Card>

          {/* Program Format */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#533193]" />
                Program Format
              </CardTitle>
              <CardDescription>รูปแบบกิจกรรม</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {content.program_format.map((format, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={format}
                    onChange={(e) => handleArrayChange('program_format', index, e.target.value)}
                    placeholder={`Format ${index + 1}`}
                  />
                  {content.program_format.length > 1 && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeArrayItem('program_format', index)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('program_format')}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Format
              </Button>
            </CardContent>
          </Card>

          {/* Presentation Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#533193]" />
                Presentation Categories
              </CardTitle>
              <CardDescription>หมวดหมู่การนำเสนอ</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Creative Works */}
              <div>
                <Label className="text-base font-semibold mb-3 block">1. Creative Works</Label>
                {content.creative_works.map((work, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      value={work}
                      onChange={(e) => handleArrayChange('creative_works', index, e.target.value)}
                      placeholder={`Creative Work ${index + 1}`}
                    />
                    {content.creative_works.length > 1 && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeArrayItem('creative_works', index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayItem('creative_works')}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Creative Work
                </Button>
              </div>

              {/* Research Papers */}
              <div>
                <Label className="text-base font-semibold mb-3 block">2. Research Papers / Academic Articles</Label>
                {content.research_papers.map((paper, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      value={paper}
                      onChange={(e) => handleArrayChange('research_papers', index, e.target.value)}
                      placeholder={`Research Topic ${index + 1}`}
                    />
                    {content.research_papers.length > 1 && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeArrayItem('research_papers', index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayItem('research_papers')}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Research Topic
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Target Participants */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#533193]" />
                Target Participants
              </CardTitle>
              <CardDescription>กลุ่มเป้าหมาย</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {content.target_participants.map((participant, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={participant}
                    onChange={(e) => handleArrayChange('target_participants', index, e.target.value)}
                    placeholder={`Target Group ${index + 1}`}
                  />
                  {content.target_participants.length > 1 && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeArrayItem('target_participants', index)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('target_participants')}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Target Group
              </Button>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#533193]" />
                Timeline
              </CardTitle>
              <CardDescription>กำหนดการ</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Project Duration</Label>
                <Input
                  value={content.timeline_duration}
                  onChange={(e) => setContent({ ...content, timeline_duration: e.target.value })}
                  placeholder="April – August 2025"
                />
              </div>
              
              <div>
                <Label>Event Dates</Label>
                <Input
                  value={content.timeline_dates}
                  onChange={(e) => setContent({ ...content, timeline_dates: e.target.value })}
                  placeholder="7 – 8 August 2025"
                />
              </div>
              
              <div>
                <Label>Venue</Label>
                <Textarea
                  value={content.timeline_venue}
                  onChange={(e) => setContent({ ...content, timeline_venue: e.target.value })}
                  placeholder="The Sustainable Arts and Crafts Institute..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Project Lead */}
          <Card>
            <CardHeader>
              <CardTitle>Project Lead</CardTitle>
              <CardDescription>หน่วยงานรับผิดชอบ</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={content.project_lead}
                onChange={(e) => setContent({ ...content, project_lead: e.target.value })}
                placeholder="The Sustainable Arts and Crafts Institute..."
                rows={2}
              />
            </CardContent>
          </Card>

          {/* Contact Persons */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#533193]" />
                Contact Persons
              </CardTitle>
              <CardDescription>ผู้ติดต่อ</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Contact Person 1 */}
              <div className="border-b pb-4">
                <h4 className="font-semibold mb-3">Contact Person 1</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={content.contact1_name}
                      onChange={(e) => setContent({ ...content, contact1_name: e.target.value })}
                      placeholder="Mrs. Burachat Sriwilai"
                    />
                  </div>
                  
                  <div>
                    <Label>Title/Position</Label>
                    <Input
                      value={content.contact1_title}
                      onChange={(e) => setContent({ ...content, contact1_title: e.target.value })}
                      placeholder="Head of Craft Knowledge Management"
                    />
                  </div>
                  
                  <div>
                    <Label>Email 1</Label>
                    <Input
                      value={content.contact1_email}
                      onChange={(e) => setContent({ ...content, contact1_email: e.target.value })}
                      placeholder="burachat.s@sacit.or.th"
                    />
                  </div>
                  
                  <div>
                    <Label>Email 2 (Optional)</Label>
                    <Input
                      value={content.contact1_email2}
                      onChange={(e) => setContent({ ...content, contact1_email2: e.target.value })}
                      placeholder="symposium.2025@sacit.or.th"
                    />
                  </div>
                  
                  <div>
                    <Label>Mobile</Label>
                    <Input
                      value={content.contact1_phone}
                      onChange={(e) => setContent({ ...content, contact1_phone: e.target.value })}
                      placeholder="+66 85 040 0842"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Person 2 */}
              <div>
                <h4 className="font-semibold mb-3">Contact Person 2</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={content.contact2_name}
                      onChange={(e) => setContent({ ...content, contact2_name: e.target.value })}
                      placeholder="Mr. Tayud Mongkolrat"
                    />
                  </div>
                  
                  <div>
                    <Label>Title/Position</Label>
                    <Input
                      value={content.contact2_title}
                      onChange={(e) => setContent({ ...content, contact2_title: e.target.value })}
                      placeholder="Senior Partnership and Foreign Affairs Officer"
                    />
                  </div>
                  
                  <div>
                    <Label>Email</Label>
                    <Input
                      value={content.contact2_email}
                      onChange={(e) => setContent({ ...content, contact2_email: e.target.value })}
                      placeholder="tayud.m@sacit.or.th"
                    />
                  </div>
                  
                  <div>
                    <Label>Mobile</Label>
                    <Input
                      value={content.contact2_phone}
                      onChange={(e) => setContent({ ...content, contact2_phone: e.target.value })}
                      placeholder="+66 97 246 6550"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button (Bottom) */}
          <div className="flex justify-end pt-4">
            <Button 
              onClick={handleSave} 
              disabled={saving}
              className="bg-[#533193] hover:bg-[#6B4AB6]"
              size="lg"
            >
              <Save className="mr-2 h-5 w-5" />
              {saving ? 'กำลังบันทึก...' : 'บันทึกทั้งหมด'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SymposiumEnContentPage;
