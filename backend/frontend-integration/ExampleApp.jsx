import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Users, Plus, BarChart3, Settings } from 'lucide-react';

// Import Speakers components
import { SpeakerForm, SpeakerList, useSpeakers } from './index';

// ตัวอย่างหน้าจัดการผู้บรรยาย
const SpeakersManagementPage = () => {
  const {
    speakers,
    loading,
    error,
    totalSpeakers,
    activeSpeakers,
    createSpeaker,
    refresh
  } = useSpeakers();

  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const handleCreateSuccess = (newSpeaker) => {
    console.log('Speaker created:', newSpeaker);
    setShowCreateDialog(false);
    // สามารถเพิ่ม notification หรือ redirect ได้ตามต้องการ
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">จัดการผู้บรรยาย</h1>
          <p className="text-gray-600 mt-2">จัดการข้อมูลผู้บรรยายสำหรับงานสัมมนา</p>
        </div>
        
        {/* Quick Create Button */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-violet-600 hover:bg-violet-700">
              <Plus className="w-4 h-4 mr-2" />
              เพิ่มผู้บรรยายใหม่
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>เพิ่มผู้บรรยายใหม่</DialogTitle>
            </DialogHeader>
            <SpeakerForm
              onSuccess={handleCreateSuccess}
              onCancel={() => setShowCreateDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ผู้บรรยายทั้งหมด</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSpeakers}</div>
            <p className="text-xs text-muted-foreground">
              คน
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ใช้งานอยู่</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeSpeakers}</div>
            <p className="text-xs text-muted-foreground">
              คน
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">สถานะ</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-green-600">
                เชื่อมต่อแล้ว
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              API พร้อมใช้งาน
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">รายการผู้บรรยาย</TabsTrigger>
          <TabsTrigger value="create">เพิ่มผู้บรรยาย</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="space-y-4">
          <SpeakerList />
        </TabsContent>
        
        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>เพิ่มผู้บรรยายใหม่</CardTitle>
              <CardDescription>
                กรอกข้อมูลผู้บรรยายและอัปโหลดไฟล์ที่เกี่ยวข้อง
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SpeakerForm
                onSuccess={(newSpeaker) => {
                  console.log('Speaker created:', newSpeaker);
                  // Switch to list tab after successful creation
                  document.querySelector('[value="list"]').click();
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// ตัวอย่างการใช้ในรูปแบบ Modal/Dialog
const SpeakerModal = ({ isOpen, onClose, speaker = null }) => {
  const handleSuccess = (data) => {
    console.log('Modal success:', data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {speaker ? 'แก้ไขข้อมูลผู้บรรยาย' : 'เพิ่มผู้บรรยายใหม่'}
          </DialogTitle>
        </DialogHeader>
        <SpeakerForm
          speaker={speaker}
          onSuccess={handleSuccess}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

// ตัวอย่างการใช้ Hook ในการแสดงข้อมูล
const SpeakerStats = () => {
  const { 
    speakers, 
    loading, 
    totalSpeakers, 
    activeSpeakers, 
    inactiveSpeakers 
  } = useSpeakers();

  if (loading) {
    return <div>กำลังโหลด...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold">{totalSpeakers}</div>
          <p className="text-sm text-gray-600">ทั้งหมด</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-green-600">{activeSpeakers}</div>
          <p className="text-sm text-gray-600">ใช้งานอยู่</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-gray-400">{inactiveSpeakers}</div>
          <p className="text-sm text-gray-600">ปิดใช้งาน</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-blue-600">
            {speakers.filter(s => s.photo_url).length}
          </div>
          <p className="text-sm text-gray-600">มีรูปภาพ</p>
        </CardContent>
      </Card>
    </div>
  );
};

// ตัวอย่างการใช้ในหน้า Dashboard
const DashboardWithSpeakers = () => {
  const { speakers, loading } = useSpeakers({ autoLoad: true });
  const [selectedSpeaker, setSelectedSpeaker] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const recentSpeakers = speakers
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <SpeakerStats />
      
      {/* Recent Speakers */}
      <Card>
        <CardHeader>
          <CardTitle>ผู้บรรยายล่าสุด</CardTitle>
          <CardDescription>ผู้บรรยายที่เพิ่มเข้าระบบล่าสุด</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>กำลังโหลด...</p>
          ) : (
            <div className="space-y-3">
              {recentSpeakers.map((speaker) => (
                <div 
                  key={speaker.id} 
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setSelectedSpeaker(speaker);
                    setShowModal(true);
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
                      <Users className="w-5 h-5 text-violet-600" />
                    </div>
                    <div>
                      <p className="font-medium">{speaker.name}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(speaker.created_at).toLocaleDateString('th-TH')}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    {speaker.status === 'active' ? 'ใช้งาน' : 'ปิดใช้งาน'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Speaker Modal */}
      <SpeakerModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedSpeaker(null);
        }}
        speaker={selectedSpeaker}
      />
    </div>
  );
};

// Export components
export {
  SpeakersManagementPage,
  SpeakerModal,
  SpeakerStats,
  DashboardWithSpeakers
};

export default SpeakersManagementPage;