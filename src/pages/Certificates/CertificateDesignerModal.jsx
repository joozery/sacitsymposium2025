import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Eye, Plus, Trash2, Move, Type, Image as ImageIcon, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
} from "@/components/ui/dialog";

const CertificateDesignerModal = ({ 
  certificate, 
  isOpen, 
  onClose, 
  onSave, 
  onPreview 
}) => {
  const [designData, setDesignData] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);
  const [draggedElement, setDraggedElement] = useState(null);

  useEffect(() => {
    if (certificate && isOpen) {
      setDesignData({ ...certificate });
    }
  }, [certificate, isOpen]);

  if (!isOpen || !designData) return null;

  const handleSave = () => {
    onSave(designData);
  };

  const handlePreview = () => {
    onPreview(designData);
  };

  const addTextElement = () => {
    const newElement = {
      id: `text_${Date.now()}`,
      type: 'text',
      content: 'ข้อความใหม่',
      x: 100,
      y: 100,
      fontSize: 24,
      fontFamily: 'PromptP-Regular',
      color: '#000000',
      alignment: 'left',
      fontWeight: 'normal',
      fontStyle: 'normal',
      textDecoration: 'none',
      opacity: 1,
      rotation: 0,
      zIndex: designData.elements.length + 1
    };
    setDesignData({
      ...designData,
      elements: [...designData.elements, newElement]
    });
  };

  const addPlaceholderElement = () => {
    const newElement = {
      id: `placeholder_${Date.now()}`,
      type: 'placeholder',
      content: '{{ตัวแปรใหม่}}',
      placeholder: 'ตัวแปรใหม่',
      x: 150,
      y: 150,
      fontSize: 20,
      fontFamily: 'PromptP-Regular',
      color: '#666666',
      alignment: 'left',
      fontWeight: 'normal',
      fontStyle: 'normal',
      textDecoration: 'none',
      opacity: 1,
      rotation: 0,
      zIndex: designData.elements.length + 1
    };
    setDesignData({
      ...designData,
      elements: [...designData.elements, newElement]
    });
  };

  const updateElement = (elementId, updates) => {
    setDesignData({
      ...designData,
      elements: designData.elements.map(el => 
        el.id === elementId ? { ...el, ...updates } : el
      )
    });
  };

  const deleteElement = (elementId) => {
    setDesignData({
      ...designData,
      elements: designData.elements.filter(el => el.id !== elementId)
    });
    if (selectedElement?.id === elementId) {
      setSelectedElement(null);
    }
  };

  const handleElementClick = (element) => {
    setSelectedElement(element);
  };

  const handleCanvasClick = (e) => {
    if (e.target === e.currentTarget) {
      setSelectedElement(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="text-xl font-bold flex items-center justify-between">
            <span>ออกแบบใบประกาศ: {designData.name}</span>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handlePreview} className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                ดูตัวอย่าง
              </Button>
              <Button onClick={handleSave} className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                บันทึก
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Toolbar */}
          <div className="w-64 border-r bg-gray-50 p-4 overflow-y-auto">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">เพิ่มองค์ประกอบ</h3>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={addTextElement}
                    className="w-full justify-start"
                  >
                    <Type className="w-4 h-4 mr-2" />
                    ข้อความ
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={addPlaceholderElement}
                    className="w-full justify-start"
                  >
                    <Square className="w-4 h-4 mr-2" />
                    ตัวแปร
                  </Button>
                </div>
              </div>

              {/* Element Properties */}
              {selectedElement && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">คุณสมบัติ</h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs">เนื้อหา</Label>
                      <Input
                        value={selectedElement.content}
                        onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                        className="text-xs"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">X</Label>
                        <Input
                          type="number"
                          value={selectedElement.x}
                          onChange={(e) => updateElement(selectedElement.id, { x: parseInt(e.target.value) || 0 })}
                          className="text-xs"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Y</Label>
                        <Input
                          type="number"
                          value={selectedElement.y}
                          onChange={(e) => updateElement(selectedElement.id, { y: parseInt(e.target.value) || 0 })}
                          className="text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs">ขนาดตัวอักษร</Label>
                      <Input
                        type="number"
                        value={selectedElement.fontSize}
                        onChange={(e) => updateElement(selectedElement.id, { fontSize: parseInt(e.target.value) || 12 })}
                        className="text-xs"
                      />
                    </div>

                    <div>
                      <Label className="text-xs">สี</Label>
                      <Input
                        type="color"
                        value={selectedElement.color}
                        onChange={(e) => updateElement(selectedElement.id, { color: e.target.value })}
                        className="text-xs h-8"
                      />
                    </div>

                    <div>
                      <Label className="text-xs">แบบอักษร</Label>
                      <Select 
                        value={selectedElement.fontFamily} 
                        onValueChange={(value) => updateElement(selectedElement.id, { fontFamily: value })}
                      >
                        <SelectTrigger className="text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PromptP-Regular">PromptP Regular</SelectItem>
                          <SelectItem value="PromptP-Bold">PromptP Bold</SelectItem>
                          <SelectItem value="PromptP-Light">PromptP Light</SelectItem>
                          <SelectItem value="Poppins-Light">Poppins Light</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-xs">การจัดตำแหน่ง</Label>
                      <Select 
                        value={selectedElement.alignment} 
                        onValueChange={(value) => updateElement(selectedElement.id, { alignment: value })}
                      >
                        <SelectTrigger className="text-xs">
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
                      onClick={() => deleteElement(selectedElement.id)}
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

          {/* Canvas */}
          <div className="flex-1 p-4 bg-gray-100 overflow-auto">
            <div className="flex justify-center">
              <div 
                className="relative bg-white shadow-lg"
                style={{ 
                  width: designData.width,
                  height: designData.height,
                  backgroundColor: designData.backgroundColor 
                }}
                onClick={handleCanvasClick}
              >
                {/* Background Image */}
                {designData.backgroundUrl && (
                  <img 
                    src={designData.backgroundUrl} 
                    alt="Background"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}

                {/* Elements */}
                {designData.elements.map((element) => (
                  <div
                    key={element.id}
                    className={`absolute cursor-pointer transition-all duration-200 ${
                      selectedElement?.id === element.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    style={{
                      left: element.x,
                      top: element.y,
                      fontSize: element.fontSize,
                      fontFamily: element.fontFamily,
                      color: element.color,
                      textAlign: element.alignment,
                      fontWeight: element.fontWeight,
                      fontStyle: element.fontStyle,
                      textDecoration: element.textDecoration,
                      opacity: element.opacity,
                      transform: `rotate(${element.rotation}deg)`,
                      zIndex: element.zIndex
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleElementClick(element);
                    }}
                  >
                    {element.type === 'placeholder' ? (
                      <span className="bg-yellow-100 px-2 py-1 rounded border-dashed border-2 border-yellow-400">
                        {element.placeholder || element.content}
                      </span>
                    ) : (
                      element.content
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CertificateDesignerModal;