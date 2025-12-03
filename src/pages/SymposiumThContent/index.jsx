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

const SymposiumThContentPage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState({
    // Header Section
    header_title_line1: 'การประชุมวิชาการระดับชาติด้านศิลปหัตถกรรมครั้งที่ 1',
    header_title_line2: 'SACIT Symposium 2025',
    header_theme: '"สร้างสรรค์ความยั่งยืนข้ามอาเซียนและเกินกว่า"',
    header_date: '7 – 8 สิงหาคม 2568',
    header_venue: 'สถาบันศิลปหัตถกรรมไทยเพื่อความยั่งยืน (องค์การมหาชน) อำเภอบางไทร จังหวัดพระนครศรีอยุธยา',
    
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
    header_title_line1: 'การประชุมวิชาการระดับชาติด้านศิลปหัตถกรรมครั้งที่ 1',
    header_title_line2: 'SACIT Symposium 2025',
    header_theme: '"สร้างสรรค์ความยั่งยืนข้ามอาเซียนและเกินกว่า"',
    header_date: '7 – 8 สิงหาคม 2568',
    header_venue: 'สถาบันศิลปหัตถกรรมไทยเพื่อความยั่งยืน (องค์การมหาชน) อำเภอบางไทร จังหวัดพระนครศรีอยุธยา',
    why_paragraph1: 'ศิลปหัตถกรรมท้องถิ่นเป็นมรดกที่มีชีวิต ถ่ายทอดจากรุ่นสู่รุ่นและพัฒนาเป็นกระบวนการสร้างสรรค์และการเล่าเรื่อง น่าเสียดายที่หัตถกรรมหลายอย่างกลายเป็น "หัตถกรรมที่กำลังจะสูญหาย" และมีความเสี่ยงที่จะหายไป',
    why_paragraph2: 'ในปี 2568 SACIT ดำเนินการเพื่อเสริมสร้างและแบ่งปันความรู้หัตถกรรมไทยกับชุมชนท้องถิ่นและนานาชาติ รวมถึงช่างฝีมือ นักสร้างสรรค์รุ่นใหม่ นักออกแบบ นักเรียน นักวิจัย และผู้รักหัตถกรรม',
    why_paragraph3: 'เพื่อจุดประสงค์นี้ เราจัดการประชุมวิชาการด้านศิลปหัตถกรรมครั้งที่ 1 หรือ SACIT Symposium 2025 ภายใต้หัวข้อ "สร้างสรรค์ความยั่งยืนข้ามอาเซียนและเกินกว่า"',
    why_paragraph4: 'SACIT Symposium 2025 มีเป้าหมายเป็นเวทีสำหรับนำเสนอและแบ่งปันความรู้เกี่ยวกับศิลปหัตถกรรมผ่านกิจกรรมต่างๆ ที่เกี่ยวข้องกับผู้เชี่ยวชาญ ช่างฝีมือ และผู้สร้างสรรค์จากอาเซียนและประเทศอื่นๆ',
    why_programs: [
      'การแบ่งปันความรู้และการอภิปราย',
      'การนำเสนอผลงานวิชาการและหัตถกรรม',
      'การสาธิตสดกระบวนการสร้างสรรค์เครื่องเขิน และหัตถกรรมอื่นๆ',
      'นิทรรศการเครื่องเขิน ความรู้ที่เกี่ยวข้อง และหัตถกรรมต่างๆ'
    ],
    objectives: [
      'เพื่อส่งเสริมและเพิ่มมูลค่าศิลปหัตถกรรมท้องถิ่นในบริบทวิชาการและผ่านกิจกรรมร่วมมือกับองค์กรหรือหน่วยงานที่เกี่ยวข้อง',
      'เพื่อส่งเสริมความสนใจในศิลปหัตถกรรมไทยภายในประเทศและในหมู่ประเทศอาเซียน และสนับสนุนบทบาทของ SACIT ในฐานะศูนย์กลางความรู้ด้านศิลปหัตถกรรม',
      'เพื่อส่งเสริมมรดกหัตถกรรมที่จับต้องไม่ได้ให้เป็นทรัพย์สินทางสังคมและวัฒนธรรมที่มีคุณค่า'
    ],
    program_format: [
      'การบรรยายพิเศษและการบรรยายหลัก',
      'การนำเสนอผลงานวิชาการและการอภิปราย',
      'เวิร์กช็อปและการสาธิตสด',
      'นิทรรศการ'
    ],
    creative_works: [
      'เครื่องเขิน',
      'หัตถกรรมและงานศิลปะ',
      'หัตถกรรมร่วมสมัยและประยุกต์',
      'หัตถกรรมท้องถิ่นและหัตถกรรมดั้งเดิมอื่นๆ'
    ],
    research_papers: [
      'น้ำยางเขิน ต้นเขิน และพืชผลิตยางอื่นๆ ที่เป็นวัตถุดิบในหัตถกรรม',
      'ศิลปะ วัฒนธรรม และการพัฒนาสร้างสรรค์หัตถกรรมดั้งเดิม',
      'การอนุรักษ์ความรู้ดั้งเดิมในหัตถกรรม',
      'วัสดุศาสตร์และทางเลือกที่ยั่งยืนในการทำหัตถกรรม',
      'ผลงานศิลปะและหัตถกรรมที่สอดคล้องกับกรอบ ESG'
    ],
    target_participants: [
      'ช่างฝีมือระดับปรมาจารย์ ช่างใหญ่ และทายาทช่างในสาขาที่เกี่ยวข้อง',
      'ช่างฝีมือและผู้เชี่ยวชาญด้านศิลปหัตถกรรม ทั้งไทยและต่างชาติ',
      'สมาชิก SACIT ที่ทำงานในวิชาชีพที่เกี่ยวข้อง',
      'นักวิชาการ นักวิจัย และนักศึกษาในสาขาที่เกี่ยวข้อง',
      'สถาบันการศึกษาและองค์กรพันธมิตร ทั้งในและต่างประเทศ',
      'นักออกแบบ นักสร้างสรรค์ และผู้ประกอบการรุ่นใหม่ที่สนใจหัตถกรรมดั้งเดิมและร่วมสมัย'
    ],
    timeline_duration: 'เมษายน – สิงหาคม 2568',
    timeline_dates: '7 – 8 สิงหาคม 2568',
    timeline_venue: 'สถาบันศิลปหัตถกรรมไทยเพื่อความยั่งยืน (องค์การมหาชน) อำเภอบางไทร จังหวัดพระนครศรีอยุธยา',
    project_lead: 'สถาบันศิลปหัตถกรรมไทยเพื่อความยั่งยืน (องค์การมหาชน)\nอำเภอบางไทร จังหวัดพระนครศรีอยุธยา',
    contact1_name: 'นางสาวบุรฉัตร ศรีวิไล',
    contact1_title: 'หัวหน้าฝ่ายจัดการความรู้หัตถกรรม',
    contact1_email: 'Burachat.s@sacit.or.th',
    contact1_email2: 'symposium.2025@sacit.or.th',
    contact1_phone: '+66 85 040 0842',
    contact2_name: 'นายทยุทธ มงคลรัตน์',
    contact2_title: 'เจ้าหน้าที่อาวุโสด้านพันธมิตรและกิจการต่างประเทศ',
    contact2_email: 'tayud.m@sacit.or.th',
    contact2_phone: '+66 97 246 6550'
  });

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/symposium-th`);
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
      
      const response = await fetch(`${API_BASE_URL}/symposium-th`, {
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
          description: 'เนื้อหา Symposium TH ได้รับการอัพเดตแล้ว'
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
      <Helmet><title>Symposium TH Content - SACIT Admin</title></Helmet>
      
      <div className="container mx-auto p-6 max-w-6xl">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Symposium TH Content</h1>
            <p className="text-gray-600 mt-1">จัดการเนื้อหาหน้า Symposium (ภาษาไทย)</p>
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
                <Label>Title Line 1 (ภาษาไทย)</Label>
                <Input
                  value={content.header_title_line1}
                  onChange={(e) => setContent({ ...content, header_title_line1: e.target.value })}
                  placeholder="การประชุมวิชาการระดับชาติ..."
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
                <Label>Theme (ภาษาไทย)</Label>
                <Input
                  value={content.header_theme}
                  onChange={(e) => setContent({ ...content, header_theme: e.target.value })}
                  placeholder="สร้างสรรค์ความยั่งยืน..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date</Label>
                  <Input
                    value={content.header_date}
                    onChange={(e) => setContent({ ...content, header_date: e.target.value })}
                    placeholder="7 – 8 สิงหาคม 2568"
                  />
                </div>
                
                <div>
                  <Label>Venue</Label>
                  <Textarea
                    value={content.header_venue}
                    onChange={(e) => setContent({ ...content, header_venue: e.target.value })}
                    placeholder="สถาบันศิลปหัตถกรรมไทย..."
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
                เพิ่ม Objective
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
                เพิ่ม Format
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
                <Label className="text-base font-semibold mb-3 block">1. ผลงานสร้างสรรค์</Label>
                {content.creative_works.map((work, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      value={work}
                      onChange={(e) => handleArrayChange('creative_works', index, e.target.value)}
                      placeholder={`ผลงานสร้างสรรค์ ${index + 1}`}
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
                  เพิ่มผลงานสร้างสรรค์
                </Button>
              </div>

              {/* Research Papers */}
              <div>
                <Label className="text-base font-semibold mb-3 block">2. บทความวิจัย / บทความวิชาการ</Label>
                {content.research_papers.map((paper, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      value={paper}
                      onChange={(e) => handleArrayChange('research_papers', index, e.target.value)}
                      placeholder={`หัวข้อวิจัย ${index + 1}`}
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
                  เพิ่มหัวข้อวิจัย
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
                    placeholder={`กลุ่มเป้าหมาย ${index + 1}`}
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
                เพิ่มกลุ่มเป้าหมาย
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
                <Label>ระยะเวลาโครงการ</Label>
                <Input
                  value={content.timeline_duration}
                  onChange={(e) => setContent({ ...content, timeline_duration: e.target.value })}
                  placeholder="เมษายน – สิงหาคม 2568"
                />
              </div>
              
              <div>
                <Label>วันที่จัดงาน</Label>
                <Input
                  value={content.timeline_dates}
                  onChange={(e) => setContent({ ...content, timeline_dates: e.target.value })}
                  placeholder="7 – 8 สิงหาคม 2568"
                />
              </div>
              
              <div>
                <Label>สถานที่</Label>
                <Textarea
                  value={content.timeline_venue}
                  onChange={(e) => setContent({ ...content, timeline_venue: e.target.value })}
                  placeholder="สถาบันศิลปหัตถกรรมไทย..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Project Lead */}
          <Card>
            <CardHeader>
              <CardTitle>หน่วยงานรับผิดชอบ</CardTitle>
              <CardDescription>Project Lead</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={content.project_lead}
                onChange={(e) => setContent({ ...content, project_lead: e.target.value })}
                placeholder="สถาบันศิลปหัตถกรรมไทย..."
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
                <h4 className="font-semibold mb-3">ผู้ติดต่อคนที่ 1</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>ชื่อ</Label>
                    <Input
                      value={content.contact1_name}
                      onChange={(e) => setContent({ ...content, contact1_name: e.target.value })}
                      placeholder="นางสาวบุรฉัตร ศรีวิไล"
                    />
                  </div>
                  
                  <div>
                    <Label>ตำแหน่ง</Label>
                    <Input
                      value={content.contact1_title}
                      onChange={(e) => setContent({ ...content, contact1_title: e.target.value })}
                      placeholder="หัวหน้าฝ่ายจัดการความรู้หัตถกรรม"
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
                <h4 className="font-semibold mb-3">ผู้ติดต่อคนที่ 2</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>ชื่อ</Label>
                    <Input
                      value={content.contact2_name}
                      onChange={(e) => setContent({ ...content, contact2_name: e.target.value })}
                      placeholder="นายทยุทธ มงคลรัตน์"
                    />
                  </div>
                  
                  <div>
                    <Label>ตำแหน่ง</Label>
                    <Input
                      value={content.contact2_title}
                      onChange={(e) => setContent({ ...content, contact2_title: e.target.value })}
                      placeholder="เจ้าหน้าที่อาวุโส..."
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

export default SymposiumThContentPage;
