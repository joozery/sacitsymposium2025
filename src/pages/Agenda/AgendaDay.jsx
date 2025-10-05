import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Edit, Trash2, CalendarDays, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AgendaDay = ({ day, onDragEnd, onEditItem, onDeleteItem }) => {
  return (
    <div>
      <DragDropContext onDragEnd={(result) => onDragEnd(result, day.id)}>
        <Droppable droppableId={day.id}>
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
              {day.items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`flex items-center space-x-4 p-4 rounded-lg transition-shadow bg-violet-50/50 border border-transparent ${snapshot.isDragging ? 'shadow-2xl bg-violet-100' : ''}`}
                    >
                      <div {...provided.dragHandleProps} className="cursor-grab text-gray-400 hover:text-violet-600">
                        <GripVertical className="w-5 h-5" />
                      </div>
                      <div className="font-medium text-violet-800 w-28 flex-shrink-0">{item.time}</div>
                      <div className="flex-grow text-gray-800 font-medium">{item.title}</div>
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEditItem(item)}><Edit className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600" onClick={() => onDeleteItem(item)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              {day.items.length === 0 && (
                <div className="text-center py-12 text-gray-500 border-2 border-dashed rounded-lg">
                  <CalendarDays className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-lg">ยังไม่มีกำหนดการสำหรับวันนี้</p>
                  <p className="text-sm mt-1">เพิ่มรายการแรกสำหรับวันนี้ได้เลย!</p>
                </div>
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default AgendaDay;