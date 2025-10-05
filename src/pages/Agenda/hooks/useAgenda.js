import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

const SYMPOSIUMS_STORAGE_KEY = 'sacit_symposiums_v4';

const initialSymposiums = [
  {
    id: 'symposium-2024',
    name: 'SACIT Symposium 2024',
    days: [
      { id: 'day-1-2024', title: 'Symposium Day 1', date: 'Monday, August 8', items: [
          { id: 'item-1', time: '8.30 a.m.', type: 'break', title: 'Breakfast and register', speaker: '' },
          { id: 'item-2', time: '10.00 a.m.', type: 'talk', title: 'General sessions', speaker: 'Various Speakers' },
        ]
      },
      { id: 'day-2-2024', title: 'Symposium Day 2', date: 'Tuesday, August 9', items: [
           { id: 'item-5', time: '09:00 - 10:30', type: 'talk', title: 'Workshop: The Future of Thai Silk', speaker: 'คุณสมศรี สร้างสรรค์' },
        ]
      }
    ]
  }
];

export const useAgenda = () => {
  const { toast } = useToast();
  const [symposiums, setSymposiums] = useState([]);
  const [currentSymposiumId, setCurrentSymposiumId] = useState(null);
  const [isSymposiumFormOpen, setIsSymposiumFormOpen] = useState(false);
  
  const currentSymposium = symposiums.find(s => s.id === currentSymposiumId);

  useEffect(() => {
    try {
      const savedSymposiums = localStorage.getItem(SYMPOSIUMS_STORAGE_KEY);
      const parsedSymposiums = savedSymposiums ? JSON.parse(savedSymposiums) : initialSymposiums;
      setSymposiums(parsedSymposiums);
      if (parsedSymposiums.length > 0) {
        if (!currentSymposiumId) {
          setCurrentSymposiumId(parsedSymposiums[0].id);
        }
      }
    } catch (error) {
      console.error("Failed to parse symposiums from localStorage", error);
      setSymposiums(initialSymposiums);
      if (initialSymposiums.length > 0) {
        setCurrentSymposiumId(initialSymposiums[0].id);
      }
    }
  }, []);

  const saveSymposiums = (updatedSymposiums) => {
    setSymposiums(updatedSymposiums);
    localStorage.setItem(SYMPOSIUMS_STORAGE_KEY, JSON.stringify(updatedSymposiums));
  };
  
  const addSymposium = (symposiumData) => {
    const newSymposium = {
      ...symposiumData,
      id: `symposium-${Date.now()}`,
      days: [{ id: `day-${Date.now()}`, title: 'Day 1', date: 'New Date', items: [] }]
    };
    const updatedSymposiums = [...symposiums, newSymposium];
    saveSymposiums(updatedSymposiums);
    setCurrentSymposiumId(newSymposium.id);
    toast({ title: "สร้าง Symposium ใหม่สำเร็จ!" });
  };
  
  const updateSymposium = (symposiumData) => {
    const updatedSymposiums = symposiums.map(s => s.id === symposiumData.id ? { ...s, ...symposiumData } : s);
    saveSymposiums(updatedSymposiums);
    toast({ title: "อัปเดต Symposium สำเร็จ!" });
  };
  
  const deleteSymposium = (id) => {
    const updatedSymposiums = symposiums.filter(s => s.id !== id);
    saveSymposiums(updatedSymposiums);
    if (currentSymposiumId === id) {
      setCurrentSymposiumId(updatedSymposiums[0]?.id || null);
    }
    toast({ title: "ลบ Symposium สำเร็จ!", variant: "destructive" });
  };
  
  const addDay = (dayData) => {
    const updatedSymposiums = symposiums.map(s => {
      if (s.id === currentSymposiumId) {
        const newDay = { ...dayData, id: `day-${Date.now()}`, items: [] };
        return { ...s, days: [...s.days, newDay] };
      }
      return s;
    });
    saveSymposiums(updatedSymposiums);
    toast({ title: "เพิ่มวันใหม่สำเร็จ!" });
  };

  const updateDay = (dayData) => {
    const updatedSymposiums = symposiums.map(s => s.id === currentSymposiumId ? {
      ...s,
      days: s.days.map(d => d.id === dayData.id ? dayData : d)
    } : s);
    saveSymposiums(updatedSymposiums);
    toast({ title: "อัปเดตข้อมูลวันสำเร็จ!" });
  };

  const deleteDay = (dayId) => {
    const updatedSymposiums = symposiums.map(s => s.id === currentSymposiumId ? {
      ...s,
      days: s.days.filter(d => d.id !== dayId)
    } : s);
    saveSymposiums(updatedSymposiums);
    toast({ title: "ลบวันสำเร็จ!", variant: "destructive" });
  };

  const addItem = (dayId, itemData) => {
    const updatedSymposiums = symposiums.map(s => s.id === currentSymposiumId ? {
      ...s,
      days: s.days.map(d => d.id === dayId ? {
        ...d,
        items: [...d.items, { ...itemData, id: `item-${Date.now()}` }]
      } : d)
    } : s);
    saveSymposiums(updatedSymposiums);
    toast({ title: "เพิ่มรายการใหม่สำเร็จ!" });
  };

  const updateItem = (dayId, itemData) => {
    const updatedSymposiums = symposiums.map(s => s.id === currentSymposiumId ? {
      ...s,
      days: s.days.map(d => d.id === dayId ? {
        ...d,
        items: d.items.map(it => it.id === itemData.id ? itemData : it)
      } : d)
    } : s);
    saveSymposiums(updatedSymposiums);
    toast({ title: "แก้ไขรายการสำเร็จ!" });
  };

  const deleteItem = (dayId, itemId) => {
    const updatedSymposiums = symposiums.map(s => s.id === currentSymposiumId ? {
      ...s,
      days: s.days.map(d => d.id === dayId ? {
        ...d,
        items: d.items.filter(it => it.id !== itemId)
      } : d)
    } : s);
    saveSymposiums(updatedSymposiums);
    toast({ title: "ลบรายการสำเร็จ!", variant: "destructive" });
  };

  const reorderItems = (dayId, result) => {
    if (!result.destination) return;
    const { source, destination } = result;
    
    const updatedSymposiums = symposiums.map(s => {
      if (s.id === currentSymposiumId) {
        return {
          ...s,
          days: s.days.map(d => {
            if (d.id === dayId) {
              const reorderedItems = Array.from(d.items);
              const [removed] = reorderedItems.splice(source.index, 1);
              reorderedItems.splice(destination.index, 0, removed);
              return { ...d, items: reorderedItems };
            }
            return d;
          })
        };
      }
      return s;
    });
    saveSymposiums(updatedSymposiums);
    toast({ title: "จัดลำดับใหม่สำเร็จ!" });
  };

  return {
    symposiums,
    setSymposiums,
    currentSymposiumId,
    setCurrentSymposiumId,
    currentSymposium,
    isSymposiumFormOpen,
    setIsSymposiumFormOpen,
    addSymposium,
    updateSymposium,
    deleteSymposium,
    addDay,
    updateDay,
    deleteDay,
    addItem,
    updateItem,
    deleteItem,
    reorderItems,
  };
};
