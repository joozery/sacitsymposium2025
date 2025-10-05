import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AgendaDay from '../AgendaDay';
import { Button } from '@/components/ui/button';
import { Plus, Edit3, Trash } from 'lucide-react';
import AgendaItemFormDialog from './AgendaItemFormDialog';
import DayFormDialog from './DayFormDialog';
import ConfirmationDialog from './ConfirmationDialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const AgendaTabs = ({ agenda }) => {
  const [activeTab, setActiveTab] = useState(agenda.currentSymposium?.days[0]?.id);
  const [isItemFormOpen, setIsItemFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isDayFormOpen, setIsDayFormOpen] = useState(false);
  const [editingDay, setEditingDay] = useState(null);
  const [deletingInfo, setDeletingInfo] = useState({ type: null, data: null });

  const currentDayId = activeTab || agenda.currentSymposium?.days[0]?.id;

  const handleAddItem = (dayId) => {
    setEditingItem(null);
    setIsItemFormOpen(true);
  };
  
  const handleEditItem = (item) => {
    setEditingItem(item);
    setIsItemFormOpen(true);
  };

  const handleItemFormSubmit = (data) => {
    if (editingItem) {
      agenda.updateItem(currentDayId, data);
    } else {
      agenda.addItem(currentDayId, data);
    }
  };

  const handleAddDay = () => {
    setEditingDay(null);
    setIsDayFormOpen(true);
  };

  const handleEditDay = (day) => {
    setEditingDay(day);
    setIsDayFormOpen(true);
  };

  const handleDayFormSubmit = (data) => {
    if (editingDay) {
      agenda.updateDay(data);
    } else {
      agenda.addDay(data);
    }
  };

  const handleDeleteItem = (item) => {
    setDeletingInfo({ type: 'item', data: item });
  };
  
  const handleDeleteDay = (day) => {
    setDeletingInfo({ type: 'day', data: day });
  };
  
  const confirmDelete = () => {
    if (deletingInfo.type === 'item') {
      agenda.deleteItem(currentDayId, deletingInfo.data.id);
    } else if (deletingInfo.type === 'day') {
      agenda.deleteDay(deletingInfo.data.id);
      // Switch tab if the active one is deleted
      const remainingDays = agenda.currentSymposium.days.filter(d => d.id !== deletingInfo.data.id);
      if (remainingDays.length > 0) {
        setActiveTab(remainingDays[0].id);
      } else {
        setActiveTab(null);
      }
    }
    setDeletingInfo({ type: null, data: null });
  };

  return (
    <>
      <Tabs defaultValue={agenda.currentSymposium.days[0]?.id} onValueChange={setActiveTab} value={activeTab} className="w-full">
        <div className="flex justify-between items-center border-b-0 pb-2">
          <TabsList>
            {agenda.currentSymposium.days.map(day => (
              <div key={day.id} className="relative group">
                <TabsTrigger value={day.id}>{day.title}</TabsTrigger>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="absolute -top-1 -right-1 p-1 rounded-full bg-gray-200 hover:bg-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Edit3 className="w-3 h-3 text-gray-600" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleEditDay(day)}>แก้ไข</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-500" onClick={() => handleDeleteDay(day)}>ลบ</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </TabsList>
          <Button variant="outline" size="sm" onClick={handleAddDay}>
            <Plus className="w-4 h-4 mr-2" /> เพิ่มวัน
          </Button>
        </div>
        {agenda.currentSymposium.days.map(day => (
          <TabsContent key={day.id} value={day.id}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">{day.date}</h3>
              <Button onClick={() => handleAddItem(day.id)}>
                <Plus className="w-4 h-4 mr-2" /> เพิ่มรายการในวันนี้
              </Button>
            </div>
            <AgendaDay
              day={day}
              onDragEnd={agenda.reorderItems}
              onEditItem={handleEditItem}
              onDeleteItem={handleDeleteItem}
            />
          </TabsContent>
        ))}
      </Tabs>
      
      <AgendaItemFormDialog
        isOpen={isItemFormOpen}
        onOpenChange={setIsItemFormOpen}
        item={editingItem}
        onSubmit={handleItemFormSubmit}
      />
      
      <DayFormDialog
        isOpen={isDayFormOpen}
        onOpenChange={setIsDayFormOpen}
        day={editingDay}
        onSubmit={handleDayFormSubmit}
      />
      
      <ConfirmationDialog
        isOpen={!!deletingInfo.data}
        onOpenChange={() => setDeletingInfo({ type: null, data: null })}
        onConfirm={confirmDelete}
        title={`ยืนยันการลบ ${deletingInfo.type === 'day' ? 'วัน' : 'รายการ'}`}
        description={`คุณแน่ใจหรือไม่ว่าต้องการลบ "${deletingInfo.data?.title}"?`}
      />
    </>
  );
};

export default AgendaTabs;