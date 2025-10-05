import React, { useState, useRef, useEffect } from 'react';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { 
  UploadCloud, 
  Type, 
  Image, 
  Palette, 
  Save, 
  Eye,
  Download,
  Trash2,
  Edit3,
  Move,
  RotateCcw
} from 'lucide-react';

const CertificateTemplateEditor = ({ 
  template, 
  onSave, 
  onCancel, 
  onPreview,
  onDelete 
}) => {
  const { toast } = useToast();
  const canvasRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [templateData, setTemplateData] = useState({
    id: template?.id || Date.now(),
    name: template?.name || 'เทมเพลตใหม่',
    description: template?.description || '',
    width: template?.width || 800,
    height: template?.height || 600,
    backgroundImage: template?.backgroundImage || null,
    backgroundUrl: template?.backgroundUrl || '',
    elements: template?.elements || [
      {
        id: 'title',
        type: 'text',
        content: 'ใบประกาศนียบัตร',
        x: 400,
        y: 100,
        fontSize: 48,
        fontFamily: 'Prompt',
        color: '#533193',
        alignment: 'center'
      },
      {
        id: 'recipientName',
        type: 'placeholder',
        content: '{{recipientName}}',
        x: 400,
        y: 250,
        fontSize: 36,
        fontFamily: 'Prompt',
        color: '#2D3748',
        alignment: 'center',
        placeholder: 'ชื่อผู้รับ'
      },
      {
        id: 'eventName',
        type: 'text',
        content: 'SACIT Symposium 2025',
        x: 400,
        y: 350,
        fontSize: 24,
        fontFamily: 'Prompt',
        color: '#4A5568',
        alignment: 'center'
      },
      {
        id: 'date',
        type: 'placeholder',
        content: '{{date}}',
        x: 400,
        y: 400,
        fontSize: 18,
        fontFamily: 'Prompt',
        color: '#718096',
        alignment: 'center',
        placeholder: 'วันที่'
      },
      {
        id: 'signature',
        type: 'text',
        content: 'ลงนามโดย',
        x: 400,
        y: 500,
        fontSize: 16,
        fontFamily: 'Prompt',
        color: '#718096',
        alignment: 'center'
      }
    ]
  });

  const [selectedElement, setSelectedElement] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const fontOptions = [
    { value: 'Prompt', label: 'Prompt Regular' },
    { value: 'Prompt-Bold', label: 'Prompt Bold' },
    { value: 'Prompt-Light', label: 'Prompt Light' },
    { value: 'Arial', label: 'Arial' },
    { value: 'Times New Roman', label: 'Times New Roman' },
    { value: 'Georgia', label: 'Georgia' }
  ];

  const colorOptions = [
    { value: '#533193', label: 'Primary Purple' },
    { value: '#8B7DC3', label: 'Secondary Purple' },
    { value: '#2D3748', label: 'Dark Gray' },
    { value: '#4A5568', label: 'Medium Gray' },
    { value: '#718096', label: 'Light Gray' },
    { value: '#000000', label: 'Black' },
    { value: '#FFFFFF', label: 'White' }
  ];

  useEffect(() => {
    drawCanvas();
  }, [templateData]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    if (templateData.backgroundUrl) {
      const img = document.createElement('img');
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        drawElements(ctx);
      };
      img.src = templateData.backgroundUrl;
    } else {
      // Default background
      ctx.fillStyle = '#F7FAFC';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawElements(ctx);
    }
  };

  const drawElements = (ctx) => {
    templateData.elements.forEach(element => {
      // Use fallback fonts for better compatibility
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
    });
  };

  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicked on an element
    const clickedElement = templateData.elements.find(element => {
      const elementWidth = element.content.length * element.fontSize * 0.6;
      const elementHeight = element.fontSize;
      
      return x >= element.x - elementWidth/2 && 
             x <= element.x + elementWidth/2 &&
             y >= element.y - elementHeight/2 && 
             y <= element.y + elementHeight/2;
    });

    setSelectedElement(clickedElement || null);
  };

  const handleMouseDown = (e) => {
    if (selectedElement) {
      setIsDragging(true);
      const rect = canvasRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left - selectedElement.x,
        y: e.clientY - rect.top - selectedElement.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && selectedElement) {
      const rect = canvasRef.current.getBoundingClientRect();
      const newX = e.clientX - rect.left - dragOffset.x;
      const newY = e.clientY - rect.top - dragOffset.y;

      setTemplateData(prev => ({
        ...prev,
        elements: prev.elements.map(el =>
          el.id === selectedElement.id
            ? { ...el, x: newX, y: newY }
            : el
        )
      }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleAddElement = (type) => {
    const newElement = {
      id: `element_${Date.now()}`,
      type: type,
      content: type === 'placeholder' ? '{{placeholder}}' : 'ข้อความใหม่',
      x: 400,
      y: 300,
      fontSize: 24,
      fontFamily: 'PromptP-Regular',
      color: '#533193',
      alignment: 'center',
      placeholder: type === 'placeholder' ? 'ข้อความ' : ''
    };

    setTemplateData(prev => ({
      ...prev,
      elements: [...prev.elements, newElement]
    }));
    setSelectedElement(newElement);
  };

  const handleUpdateElement = (field, value) => {
    if (!selectedElement) return;

    setTemplateData(prev => ({
      ...prev,
      elements: prev.elements.map(el =>
        el.id === selectedElement.id
          ? { ...el, [field]: value }
          : el
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
      const reader = new FileReader();
      reader.onload = (e) => {
        setTemplateData(prev => ({
          ...prev,
          backgroundImage: file,
          backgroundUrl: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // Separate backgroundImage from templateData
    const { backgroundImage, ...templateDataWithoutImage } = templateData;
    onSave(templateDataWithoutImage, backgroundImage);
    toast({
      title: "บันทึกสำเร็จ!",
      description: `เทมเพลต "${templateData.name}" ถูกบันทึกแล้ว`
    });
  };

  const handlePreview = () => {
    const previewData = {
      ...templateData,
      elements: templateData.elements.map(el => ({
        ...el,
        content: el.type === 'placeholder' 
          ? (el.placeholder === 'ชื่อผู้รับ' ? 'สมชาย ใจดี' :
             el.placeholder === 'วันที่' ? '8 สิงหาคม 2025' : el.content)
          : el.content
      }))
    };
    onPreview(previewData);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Panel - Canvas */}
      <div className="flex-1 p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">แก้ไขเทมเพลต</h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreview}
              >
                <Eye className="w-4 h-4 mr-2" />
                ดูตัวอย่าง
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
              >
                <Save className="w-4 h-4 mr-2" />
                บันทึก
              </Button>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <canvas
              ref={canvasRef}
              width={templateData.width}
              height={templateData.height}
              className="border cursor-crosshair"
              onClick={handleCanvasClick}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              style={{ 
                maxWidth: '100%', 
                height: 'auto',
                cursor: isDragging ? 'grabbing' : 'grab'
              }}
            />
          </div>
        </div>
      </div>

      {/* Right Panel - Controls */}
      <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
        <div className="space-y-6">
          {/* Template Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">ข้อมูลเทมเพลต</h3>
            <div className="space-y-3">
              <div>
                <Label>ชื่อเทมเพลต</Label>
                <Input
                  value={templateData.name}
                  onChange={(e) => setTemplateData(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>คำอธิบาย</Label>
                <Textarea
                  value={templateData.description}
                  onChange={(e) => setTemplateData(prev => ({ ...prev, description: e.target.value }))}
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Background */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">พื้นหลัง</h3>
            <div className="space-y-3">
              <div>
                <Label>อัปโหลดภาพพื้นหลัง</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleBackgroundUpload}
                  className="mt-1"
                />
              </div>
              {templateData.backgroundUrl && (
                <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
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
            <h3 className="text-lg font-semibold text-gray-800 mb-4">เพิ่มองค์ประกอบ</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddElement('text')}
              >
                <Type className="w-4 h-4 mr-2" />
                ข้อความ
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddElement('placeholder')}
              >
                <Edit3 className="w-4 h-4 mr-2" />
                พื้นที่จัดวาง
              </Button>
            </div>
          </div>

          {/* Element Properties */}
          {selectedElement && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">คุณสมบัติองค์ประกอบ</h3>
              <div className="space-y-3">
                <div>
                  <Label>เนื้อหา</Label>
                  <Input
                    value={selectedElement.content}
                    onChange={(e) => handleUpdateElement('content', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>ขนาดตัวอักษร</Label>
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
                  <Label>ฟอนต์</Label>
                  <Select
                    value={selectedElement.fontFamily}
                    onValueChange={(value) => handleUpdateElement('fontFamily', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontOptions.map(font => (
                        <SelectItem key={font.value} value={font.value}>
                          {font.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>สี</Label>
                  <Select
                    value={selectedElement.color}
                    onValueChange={(value) => handleUpdateElement('color', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {colorOptions.map(color => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-4 h-4 rounded border"
                              style={{ backgroundColor: color.value }}
                            />
                            {color.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>การจัดตำแหน่ง</Label>
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

          {!selectedElement && (
            <div className="text-center text-gray-500 py-8">
              <Edit3 className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p>คลิกที่องค์ประกอบเพื่อแก้ไข</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CertificateTemplateEditor; 