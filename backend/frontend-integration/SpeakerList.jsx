import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  User, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  FileText, 
  Image,
  Loader2,
  RefreshCw,
  Download,
  ExternalLink
} from 'lucide-react';
import SpeakerForm from './SpeakerForm';
import SpeakersAPI from './speakersAPI';

const SpeakerList = () => {
  // State สำหรับข้อมูล
  const [speakers, setSpeakers] = useState([]);
  const [filteredSpeakers, setFilteredSpeakers] = useState([]);
  
  // State สำหรับ UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // State สำหรับ Dialog
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedSpeaker, setSelectedSpeaker] = useState(null);
  
  // State สำหรับการลบ
  const [deletingId, setDeletingId] = useState(null);

  // Load speakers data
  const loadSpeakers = async () => {
    try {
      setLoading(true);
      setError('');
      
      const result = await SpeakersAPI.getAll({ status: 'active' });
      setSpeakers(result.data);
      
    } catch (error) {
      console.error('Error loading speakers:', error);
      setError('ไม่สามารถโหลดข้อมูลผู้บรรยายได้: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter speakers based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredSpeakers(speakers);
    } else {
      const filtered = speakers.filter(speaker =>
        speaker.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSpeakers(filtered);
    }
  }, [speakers, searchTerm]);

  // Load data on component mount
  useEffect(() => {
    loadSpeakers();
  }, []);

  // Handle search input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle create success
  const handleCreateSuccess = (newSpeaker) => {
    setSpeakers(prev => [newSpeaker, ...prev]);
    setShowCreateDialog(false);
  };

  // Handle edit success
  const handleEditSuccess = (updatedSpeaker) => {
    setSpeakers(prev => 
      prev.map(speaker => 
        speaker.id === updatedSpeaker.id ? updatedSpeaker : speaker
      )
    );
    setShowEditDialog(false);
    setSelectedSpeaker(null);
  };

  // Handle edit speaker
  const handleEdit = (speaker) => {
    setSelectedSpeaker(speaker);
    setShowEditDialog(true);
  };

  // Handle delete speaker
  const handleDelete = async (speakerId, speakerName) => {
    try {
      setDeletingId(speakerId);
      
      await SpeakersAPI.delete(speakerId);
      
      // Remove from local state
      setSpeakers(prev => prev.filter(speaker => speaker.id !== speakerId));
      
    } catch (error) {
      console.error('Error deleting speaker:', error);
      setError('ไม่สามารถลบผู้บรรยายได้: ' + error.message);
    } finally {
      setDeletingId(null);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-violet-600" />
          <p className="text-gray-600">กำลังโหลดข้อมูลผู้บรรยาย...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">รายการผู้บรรยาย</h2>
          <p className="text-gray-600">จัดการข้อมูลผู้บรรยายทั้งหมด</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Refresh Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={loadSpeakers}
            disabled={loading}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            รีเฟรช
          </Button>
          
          {/* Create Button */}
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-violet-600 hover:bg-violet-700">
                <Plus className="w-4 h-4 mr-2" />
                เพิ่มผู้บรรยาย
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
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <Button 
              variant="link" 
              className="ml-2 h-auto p-0 text-red-600"
              onClick={() => setError('')}
            >
              ปิด
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="ค้นหาผู้บรรยาย..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10"
          />
        </div>
        
        {searchTerm && (
          <Badge variant="secondary">
            พบ {filteredSpeakers.length} รายการ
          </Badge>
        )}
      </div>

      {/* Speakers Grid */}
      {filteredSpeakers.length === 0 ? (
        <div className="text-center py-12">
          <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'ไม่พบผู้บรรยายที่ค้นหา' : 'ยังไม่มีข้อมูลผู้บรรยาย'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm 
              ? 'ลองค้นหาด้วยคำค้นอื่น' 
              : 'เริ่มต้นด้วยการเพิ่มผู้บรรยายคนแรก'
            }
          </p>
          {!searchTerm && (
            <Button 
              onClick={() => setShowCreateDialog(true)}
              className="bg-violet-600 hover:bg-violet-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              เพิ่มผู้บรรยาย
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSpeakers.map((speaker) => (
            <div 
              key={speaker.id} 
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              {/* Speaker Info */}
              <div className="flex items-start space-x-4 mb-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={speaker.photo_url} />
                  <AvatarFallback className="bg-violet-100 text-violet-600">
                    <User className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {speaker.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    เพิ่มเข้าระบบ: {new Date(speaker.created_at).toLocaleDateString('th-TH')}
                  </p>
                  
                  {/* File Indicators */}
                  <div className="flex items-center space-x-2 mt-2">
                    {speaker.photo_url && (
                      <Badge variant="secondary" className="text-xs">
                        <Image className="w-3 h-3 mr-1" />
                        รูปภาพ
                      </Badge>
                    )}
                    {speaker.pdf_url && (
                      <Badge variant="secondary" className="text-xs">
                        <FileText className="w-3 h-3 mr-1" />
                        PDF
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* File Links */}
              {(speaker.photo_url || speaker.pdf_url) && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {speaker.photo_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => window.open(speaker.photo_url, '_blank')}
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      ดูรูป
                    </Button>
                  )}
                  {speaker.pdf_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => window.open(speaker.pdf_url, '_blank')}
                    >
                      <Download className="w-3 h-3 mr-1" />
                      ดาวน์โหลด PDF
                    </Button>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  {/* Edit Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(speaker)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    แก้ไข
                  </Button>
                  
                  {/* Delete Button */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={deletingId === speaker.id}
                      >
                        {deletingId === speaker.id ? (
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4 mr-1" />
                        )}
                        ลบ
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>ยืนยันการลบ</AlertDialogTitle>
                        <AlertDialogDescription>
                          คุณต้องการลบผู้บรรยาย <strong>"{speaker.name}"</strong> หรือไม่?
                          <br />
                          การกระทำนี้สามารถย้อนกลับได้ (ข้อมูลจะถูกซ่อนไว้)
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(speaker.id, speaker.name)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          ลบ
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                
                <Badge variant="outline" className="text-green-600 border-green-300">
                  {speaker.status === 'active' ? 'ใช้งาน' : 'ปิดใช้งาน'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>แก้ไขข้อมูลผู้บรรยาย</DialogTitle>
          </DialogHeader>
          {selectedSpeaker && (
            <SpeakerForm
              speaker={selectedSpeaker}
              onSuccess={handleEditSuccess}
              onCancel={() => {
                setShowEditDialog(false);
                setSelectedSpeaker(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SpeakerList;