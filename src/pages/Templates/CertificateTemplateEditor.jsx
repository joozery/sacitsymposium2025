import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ArrowLeft,
  Grid3x3,
  Eye,
  Save,
  Plus,
  Type,
  Image as ImageIcon,
  Trash2,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react';
import { certificateService } from '@/services/certificateService';

const CertificateTemplateEditor = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  
  const [templateData, setTemplateData] = useState({
    id: Date.now(),
    name: 'เทมเพลตใหม่',
    description: '',
    type: 'participation',
    width: 1200,
    height: 900,
    backgroundImage: null,
    backgroundUrl: '',
    elements: [
      {
        id: 'title_thai',
        type: 'text',
        content: 'ใบประกาศนียบัตร',
        x: 600,
        y: 210,
        fontSize: 48,
        fontFamily: 'Prompt',
        color: '#533193',
        alignment: 'center'
      },
      {
        id: 'title_english',
        type: 'text',
        content: 'Certificate of Participation',
        x: 600,
        y: 260,
        fontSize: 24,
        fontFamily: 'Prompt',
        color: '#8B7DC3',
        alignment: 'center'
      },
      {
        id: 'recipient_name',
        type: 'placeholder',
        content: 'ชื่อผู้รับ',
        x: 600,
        y: 360,
        fontSize: 42,
        fontFamily: 'Prompt',
        color: '#2D3748',
        alignment: 'center',
        placeholder: 'ชื่อผู้รับ'
      },
      {
        id: 'event_name',
        type: 'text',
        content: 'SACIT Symposium 2025',
        x: 600,
        y: 435,
        fontSize: 32,
        fontFamily: 'Prompt',
        color: '#4A5568',
        alignment: 'center'
      },
      {
        id: 'date',
        type: 'text',
        content: 'วันที่',
        x: 600,
        y: 485,
        fontSize: 20,
        fontFamily: 'Prompt',
        color: '#718096',
        alignment: 'center'
      }
    ]
  });

  const [selectedElement, setSelectedElement] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(100);
  const [showGrid, setShowGrid] = useState(true);

  // Load template if editing
  useEffect(() => {
    const loadTemplate = async () => {
      if (id) {
        try {
          setLoading(true);
          const response = await certificateService.getTemplate(id);
          if (response.success && response.data) {
            const template = response.data;
            setTemplateData({
              id: template.id,
              name: template.name || 'เทมเพลตใหม่',
              description: template.description || '',
              type: template.type || 'participation',
              width: template.width || 1200,
              height: template.height || 900,
              backgroundImage: null,
              backgroundUrl: template.background_url ? `http://localhost:5001${template.background_url}` : '',
              elements: template.elements || []
            });
          }
        } catch (error) {
          console.error('Error loading template:', error);
          toast({
            title: "เกิดข้อผิดพลาด",
            description: "ไม่สามารถโหลดเทมเพลตได้",
            variant: "destructive"
          });
        } finally {
          setLoading(false);
        }
      }
    };
    loadTemplate();
  }, [id]);

  useEffect(() => {
    drawCanvas();
  }, [templateData, selectedElement, showGrid]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    if (templateData.backgroundUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        drawGrid(ctx);
        drawElements(ctx);
      };
      img.onerror = () => {
        console.error('Failed to load background image');
        drawDefaultBackground(ctx);
        drawGrid(ctx);
        drawElements(ctx);
      };
      img.src = templateData.backgroundUrl;
    } else {
      drawDefaultBackground(ctx);
      drawGrid(ctx);
      drawElements(ctx);
    }
  };

  const drawDefaultBackground = (ctx) => {
    ctx.fillStyle = '#F0F4F8';
    ctx.fillRect(0, 0, templateData.width, templateData.height);
  };

  const drawGrid = (ctx) => {
    if (!showGrid) return;
    
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);

    // Vertical lines
    for (let x = 0; x <= templateData.width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, templateData.height);
      ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y <= templateData.height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(templateData.width, y);
      ctx.stroke();
    }

    // Center lines (dashed)
    ctx.strokeStyle = '#CBD5E0';
    ctx.setLineDash([10, 10]);
    
    // Vertical center
    ctx.beginPath();
    ctx.moveTo(templateData.width / 2, 0);
    ctx.lineTo(templateData.width / 2, templateData.height);
    ctx.stroke();

    // Horizontal center
    ctx.beginPath();
    ctx.moveTo(0, templateData.height / 2);
    ctx.lineTo(templateData.width, templateData.height / 2);
    ctx.stroke();

    ctx.setLineDash([]);
  };

  const drawElements = (ctx) => {
    templateData.elements.forEach(element => {
      ctx.save();
      
      let fontFamily;
      if (element.fontFamily === 'Prompt' || element.fontFamily === 'Prompt-Bold' || element.fontFamily === 'Prompt-Light') {
        fontFamily = 'Prompt, "Noto Sans Thai", Arial, sans-serif';
      } else {
        fontFamily = `${element.fontFamily}, Arial, sans-serif`;
      }
      
      ctx.font = `${element.fontSize}px ${fontFamily}`;
      ctx.fillStyle = element.color;
      ctx.textAlign = element.alignment;
      ctx.textBaseline = 'middle';

      const x = element.alignment === 'center' ? element.x : 
                element.alignment === 'right' ? element.x - 50 : element.x + 50;

      ctx.fillText(element.content, x, element.y);

      // Draw selection box
      if (selectedElement && selectedElement.id === element.id) {
        const metrics = ctx.measureText(element.content);
        const textWidth = metrics.width;
        const textHeight = element.fontSize;
        
        ctx.strokeStyle = '#7C3AED';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(
          x - textWidth / 2 - 10,
          element.y - textHeight / 2 - 10,
          textWidth + 20,
          textHeight + 20
        );
        ctx.setLineDash([]);
      }

      ctx.restore();
    });
  };

  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = templateData.width / rect.width;
    const scaleY = templateData.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const clickedElement = templateData.elements.find(element => {
      const ctx = canvasRef.current.getContext('2d');
      ctx.font = `${element.fontSize}px ${element.fontFamily}`;
      const metrics = ctx.measureText(element.content);
      const textWidth = metrics.width;
      const textHeight = element.fontSize;
      
      return x >= element.x - textWidth/2 - 10 && 
             x <= element.x + textWidth/2 + 10 &&
             y >= element.y - textHeight/2 - 10 && 
             y <= element.y + textHeight/2 + 10;
    });

    setSelectedElement(clickedElement || null);
  };

  const handleMouseDown = (e) => {
    if (selectedElement) {
      setIsDragging(true);
      const rect = canvasRef.current.getBoundingClientRect();
      const scaleX = templateData.width / rect.width;
      const scaleY = templateData.height / rect.height;
      setDragOffset({
        x: (e.clientX - rect.left) * scaleX - selectedElement.x,
        y: (e.clientY - rect.top) * scaleY - selectedElement.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && selectedElement) {
      const rect = canvasRef.current.getBoundingClientRect();
      const scaleX = templateData.width / rect.width;
      const scaleY = templateData.height / rect.height;
      const newX = (e.clientX - rect.left) * scaleX - dragOffset.x;
      const newY = (e.clientY - rect.top) * scaleY - dragOffset.y;

      setTemplateData(prev => ({
        ...prev,
        elements: prev.elements.map(el =>
          el.id === selectedElement.id
            ? { ...el, x: newX, y: newY }
            : el
        )
      }));

      setSelectedElement(prev => ({ ...prev, x: newX, y: newY }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleAddElement = (type) => {
    const newElement = {
      id: `element_${Date.now()}`,
      type: type,
      content: type === 'placeholder' ? '{{ชื่อผู้รับ}}' : 'ข้อความใหม่',
      x: templateData.width / 2,
      y: templateData.height / 2,
      fontSize: 32,
      fontFamily: 'Prompt',
      color: '#2D3748',
      alignment: 'center',
      placeholder: type === 'placeholder' ? 'ชื่อผู้รับ' : ''
    };

    setTemplateData(prev => ({
      ...prev,
      elements: [...prev.elements, newElement]
    }));
    setSelectedElement(newElement);
  };

  const handleUpdateElement = (field, value) => {
    if (!selectedElement) return;

    const updatedElement = { ...selectedElement, [field]: value };
    setSelectedElement(updatedElement);

    setTemplateData(prev => ({
      ...prev,
      elements: prev.elements.map(el =>
        el.id === selectedElement.id ? updatedElement : el
      )
    }));
  };

  const handleDeleteElement = () => {
    if (!selectedElement) return;

    setTemplateData(prev => ({
      ...prev,
      elements: prev.elements.filter(el => el.id !== selectedElement.id)
    }));
    setSelectedElement(null);
  };

  const handleBackgroundUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('📁 File selected:', file.name, file.type, file.size);
      const reader = new FileReader();
      reader.onload = (e) => {
        console.log('✅ File loaded successfully');
        setTemplateData(prev => ({
          ...prev,
          backgroundImage: file,
          backgroundUrl: e.target.result
        }));
      };
      reader.onerror = (error) => {
        console.error('❌ File read error:', error);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    console.log('💾 Saving template...', templateData);
    
    if (!templateData.name || !templateData.type) {
      toast({
        title: "ข้อมูลไม่ครบ",
        description: "กรุณากรอกชื่อและเลือกประเภทเทมเพลต",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoading(true);
      const { backgroundImage, ...templateDataWithoutImage } = templateData;
      
      if (id) {
        // Update existing template
        await certificateService.updateTemplate(id, templateDataWithoutImage, backgroundImage);
        toast({ 
          title: "สำเร็จ!", 
          description: `เทมเพลต "${templateData.name}" ได้รับการอัปเดต`,
          className: "bg-green-50 border-green-200"
        });
      } else {
        // Create new template
        await certificateService.createTemplate(templateDataWithoutImage, backgroundImage);
        toast({ 
          title: "สร้างสำเร็จ!", 
          description: `เทมเพลต "${templateData.name}" ถูกสร้างแล้ว`,
          className: "bg-green-50 border-green-200"
        });
      }
      
      // Navigate back to templates list
      navigate('/admin/templates');
    } catch (error) {
      console.error('Error saving template:', error);
      toast({ 
        title: "เกิดข้อผิดพลาด", 
        description: error.message || "ไม่สามารถบันทึกเทมเพลตได้",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/templates');
  };

  if (loading && id) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7C3AED] mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดเทมเพลต...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            กลับ
          </Button>
          <div className="h-6 w-px bg-gray-300"></div>
          <h1 className="text-xl font-semibold text-gray-900">
            {id ? 'แก้ไขเทมเพลต' : 'สร้างเทมเพลตใหม่'}
          </h1>
          <span className="text-sm text-gray-500">
            ออกแบบใบประกาศนียบัตรของคุณ
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowGrid(!showGrid)}
            className={showGrid ? 'bg-purple-50 border-purple-200' : ''}
          >
            <Grid3x3 className="w-4 h-4 mr-2" />
            {showGrid ? 'ซ่อนเส้นช่วย' : 'แสดงเส้นช่วย'}
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={loading}
            className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'กำลังบันทึก...' : 'บันทึก'}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-80 border-r border-gray-200 bg-white overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Template Info */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <div className="w-1 h-4 bg-[#7C3AED] rounded"></div>
                ข้อมูลเทมเพลต
              </h3>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-gray-600">ชื่อเทมเพลต</Label>
                  <Input
                    value={templateData.name}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1"
                    placeholder="ชื่อเทมเพลตใหม่..."
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600">คำอธิบาย</Label>
                  <Textarea
                    value={templateData.description}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, description: e.target.value }))}
                    className="mt-1"
                    rows={3}
                    placeholder="อธิบายเทมเพลตนี้..."
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600">ประเภท</Label>
                  <Select
                    value={templateData.type}
                    onValueChange={(value) => setTemplateData(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="เลือกประเภท" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="participation">ใบประกาศ - ผู้เข้าร่วม</SelectItem>
                      <SelectItem value="speaker">ใบประกาศ - วิทยากร</SelectItem>
                      <SelectItem value="award">ใบประกาศ - รางวัล</SelectItem>
                      <SelectItem value="completion">ใบประกาศ - ผ่านการอบรม</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Dimensions */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <div className="w-1 h-4 bg-[#7C3AED] rounded"></div>
                ความกว้าง × ความสูง
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-gray-600">ความกว้าง</Label>
                  <Input
                    type="number"
                    value={templateData.width}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, width: parseInt(e.target.value) }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600">ความสูง</Label>
                  <Input
                    type="number"
                    value={templateData.height}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, height: parseInt(e.target.value) }))}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Background */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <div className="w-1 h-4 bg-[#7C3AED] rounded"></div>
                พื้นหลัง
              </h3>
              <div className="space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleBackgroundUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  อัปโหลดภาพพื้นหลัง
                </Button>
                <p className="text-xs text-gray-500">รองรับ JPG, PNG (สูงสุด 5MB)</p>
                {templateData.backgroundUrl && (
                  <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={templateData.backgroundUrl}
                      alt="Background"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Add Elements */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <div className="w-1 h-4 bg-[#7C3AED] rounded"></div>
                เพิ่มองค์ประกอบ
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddElement('text')}
                  className="justify-start"
                >
                  <Type className="w-4 h-4 mr-2" />
                  ข้อความ
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddElement('placeholder')}
                  className="justify-start"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  พื้นที่จัดวาง
                </Button>
              </div>
            </div>

            {/* Element Properties */}
            {selectedElement && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-1 h-4 bg-[#7C3AED] rounded"></div>
                  คุณสมบัติองค์ประกอบ
                </h3>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs text-gray-600">เนื้อหา</Label>
                    <Input
                      value={selectedElement.content}
                      onChange={(e) => handleUpdateElement('content', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-xs text-gray-600">ขนาดตัวอักษร</Label>
                    <Input
                      type="number"
                      value={selectedElement.fontSize}
                      onChange={(e) => handleUpdateElement('fontSize', parseInt(e.target.value))}
                      className="mt-1"
                      min="8"
                      max="120"
                    />
                  </div>

                  <div>
                    <Label className="text-xs text-gray-600">ฟอนต์</Label>
                    <Select
                      value={selectedElement.fontFamily}
                      onValueChange={(value) => handleUpdateElement('fontFamily', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Prompt">Prompt Regular</SelectItem>
                        <SelectItem value="Prompt-Bold">Prompt Bold</SelectItem>
                        <SelectItem value="Prompt-Light">Prompt Light</SelectItem>
                        <SelectItem value="Arial">Arial</SelectItem>
                        <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-xs text-gray-600">สี</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        type="color"
                        value={selectedElement.color}
                        onChange={(e) => handleUpdateElement('color', e.target.value)}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        type="text"
                        value={selectedElement.color}
                        onChange={(e) => handleUpdateElement('color', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-gray-600">การจัดตำแหน่ง</Label>
                    <Select
                      value={selectedElement.alignment}
                      onValueChange={(value) => handleUpdateElement('alignment', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="left">ซ้าย</SelectItem>
                        <SelectItem value="center">กลาง</SelectItem>
                        <SelectItem value="right">ขวา</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDeleteElement}
                    className="w-full"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    ลบองค์ประกอบ
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center Canvas Area */}
        <div className="flex-1 bg-gray-50 overflow-auto">
          <div className="p-8">
            {/* Zoom Controls */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-600">
                {templateData.width} × {templateData.height} px
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoom(Math.max(25, zoom - 25))}
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-sm font-medium text-gray-700 min-w-[60px] text-center">
                  {zoom}%
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoom(Math.min(200, zoom + 25))}
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoom(100)}
                >
                  <RotateCcw className="w-4 h-4" />
                  รีเซ็ต
                </Button>
              </div>
            </div>

            {/* Canvas */}
            <div className="flex items-center justify-center">
              <div 
                className="bg-white shadow-xl rounded-lg overflow-hidden"
                style={{ 
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: 'top center',
                  transition: 'transform 0.2s'
                }}
              >
                <canvas
                  ref={canvasRef}
                  width={templateData.width}
                  height={templateData.height}
                  className="cursor-crosshair"
                  onClick={handleCanvasClick}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  style={{ 
                    cursor: isDragging ? 'grabbing' : 'grab'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateTemplateEditor;
