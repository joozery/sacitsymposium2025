import React from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings } from 'lucide-react';


const AgendaHeader = ({
  symposiums,
  currentSymposiumId,
  onSymposiumChange,
  onAddSymposium,
  onEditSymposium,
  onDeleteSymposium,
  currentSymposium,
}) => {
  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">จัดการ Agenda</h1>
        <p className="text-gray-600 mt-1">เลือก Symposium เพื่อจัดการกำหนดการ</p>
      </div>
      <div className="flex items-center gap-2">
        <select 
          value={currentSymposiumId || ''} 
          onChange={(e) => e.target.value && onSymposiumChange(e.target.value)}
          className="w-full md:w-[250px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">เลือก Symposium...</option>
          {symposiums.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <Button variant="outline" onClick={onAddSymposium}>
          <Plus className="w-4 h-4 mr-2" /> สร้างใหม่
        </Button>
        {currentSymposium && (
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEditSymposium}>
                <Edit className="mr-2 h-4 w-4" />
                <span>แก้ไขชื่อ Symposium</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600" onClick={onDeleteSymposium}>
                <Trash2 className="mr-2 h-4 w-4" />
                <span>ลบ Symposium</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </motion.div>
  );
};

export default AgendaHeader;