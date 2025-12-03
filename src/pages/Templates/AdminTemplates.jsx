import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Settings, Trash2, Eye, Download, FileText, Calendar, 
  Users, Award, CheckCircle, Edit3, Sparkles, Copy, MoreVertical,
  TrendingUp, Activity, Zap, Star, Layout, Palette
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { certificateService } from '@/services/certificateService';
import { 
  AlertDialog, AlertDialogAction, AlertDialogCancel, 
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter, 
  AlertDialogHeader, AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
const AdminTemplates = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [certificateTemplates, setCertificateTemplates] = useState([]);
  const [deletingTemplate, setDeletingTemplate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    thisMonth: 0
  });

  const loadCertificateTemplates = async () => {
    try {
      setLoading(true);
      const response = await certificateService.getTemplates();
      if (response.success) {
        setCertificateTemplates(response.data);
        
        // Calculate stats
        const published = response.data.filter(t => t.status === 'published').length;
        const draft = response.data.filter(t => t.status === 'draft').length;
        const thisMonth = response.data.filter(t => {
          const created = new Date(t.created_at);
          const now = new Date();
          return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
        }).length;
        
        setStats({
          total: response.data.length,
          published,
          draft,
          thisMonth
        });
      }
    } catch (error) {
      console.error('Error loading certificate templates:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดเทมเพลตได้",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCertificateTemplates();
  }, []);

  const handleCreateCertificateTemplate = () => {
    navigate('/admin/templates/new');
  };

  const handleEditCertificateTemplate = (template) => {
    navigate(`/admin/templates/edit/${template.id}`);
  };


  const confirmDelete = async () => {
    if (deletingTemplate) {
      try {
        await certificateService.deleteTemplate(deletingTemplate.id);
        toast({ 
          title: "ลบสำเร็จ", 
          description: `เทมเพลต "${deletingTemplate.name}" ถูกลบแล้ว`
        });
        
        await loadCertificateTemplates();
        setDeletingTemplate(null);
      } catch (error) {
        console.error('Error deleting template:', error);
        toast({ 
          title: "เกิดข้อผิดพลาด", 
          description: error.message || "ไม่สามารถลบเทมเพลตได้",
          variant: "destructive"
        });
      }
    }
  };

  const getTypeConfig = (type) => {
    const configs = {
      participation: { 
        icon: Users, 
        label: 'เข้าร่วม', 
        color: 'bg-blue-500',
        lightColor: 'bg-blue-50',
        textColor: 'text-blue-700'
      },
      achievement: { 
        icon: Award, 
        label: 'รางวัล', 
        color: 'bg-yellow-500',
        lightColor: 'bg-yellow-50',
        textColor: 'text-yellow-700'
      },
      completion: { 
        icon: CheckCircle, 
        label: 'สำเร็จ', 
        color: 'bg-green-500',
        lightColor: 'bg-green-50',
        textColor: 'text-green-700'
      },
      appreciation: { 
        icon: Sparkles, 
        label: 'ขอบคุณ', 
        color: 'bg-purple-500',
        lightColor: 'bg-purple-50',
        textColor: 'text-purple-700'
      }
    };
    return configs[type] || configs.participation;
  };

  return (
    <>
      <Helmet><title>Certificate Templates - SACIT Admin</title></Helmet>
      
      <div className="min-h-screen bg-gray-50">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-[#533193] to-[#8B7DC3] p-3 rounded-xl shadow-lg">
                  <Layout className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Certificate Templates</h1>
                  <p className="text-sm text-gray-500 mt-0.5">Manage and create certificate templates</p>
                </div>
              </div>
              
              <Button 
                onClick={handleCreateCertificateTemplate}
                className="bg-gradient-to-r from-[#533193] to-[#8B7DC3] hover:from-[#6B4AB6] hover:to-[#A594D4] text-white shadow-lg hover:shadow-xl transition-all"
                size="lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                New Template
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Layout className="w-6 h-6 text-[#533193]" />
                </div>
                <span className="text-sm font-medium text-gray-500">Total</span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                  <p className="text-sm text-gray-500 mt-1">Templates</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-500">Published</span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-900">{stats.published}</p>
                  <p className="text-sm text-gray-500 mt-1">Active</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <Edit3 className="w-6 h-6 text-orange-600" />
                </div>
                <span className="text-sm font-medium text-gray-500">Draft</span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-900">{stats.draft}</p>
                  <p className="text-sm text-gray-500 mt-1">In Progress</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-500">This Month</span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-900">{stats.thisMonth}</p>
                  <p className="text-sm text-gray-500 mt-1">Created</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Templates Section */}
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-[#533193] rounded-full border-t-transparent animate-spin"></div>
                </div>
                <p className="text-gray-600 font-medium">Loading templates...</p>
              </div>
            </div>
          ) : certificateTemplates.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100"
            >
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FileText className="w-12 h-12 text-[#533193]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No templates yet</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Get started by creating your first certificate template
              </p>
              <Button 
                onClick={handleCreateCertificateTemplate}
                className="bg-gradient-to-r from-[#533193] to-[#8B7DC3] hover:from-[#6B4AB6] hover:to-[#A594D4] text-white"
                size="lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create First Template
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {certificateTemplates.map((template, index) => {
                  const typeConfig = getTypeConfig(template.type);
                  const Icon = typeConfig.icon;
                  
                  return (
                    <motion.div
                      key={template.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.05 }}
                      className="group bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300 overflow-hidden"
                    >
                      {/* Template Preview */}
                      <div className="relative h-56 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                        {template.background_url ? (
                          <img 
                            src={`http://localhost:5001${template.background_url}`}
                            alt={template.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#533193]/10 to-[#8B7DC3]/10">
                            <div className="text-center">
                              <Palette className="w-16 h-16 text-[#533193]/30 mx-auto mb-2" />
                              <p className="text-sm text-gray-400 font-medium">No Preview</p>
                            </div>
                          </div>
                        )}
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                            <Button
                              size="sm"
                              className="flex-1 bg-white/95 hover:bg-white text-gray-900"
                              onClick={() => handleEditCertificateTemplate(template)}
                            >
                              <Edit3 className="w-4 h-4 mr-2" />
                              Edit
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="bg-white/95 hover:bg-white text-gray-900"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditCertificateTemplate(template)}>
                                  <Edit3 className="w-4 h-4 mr-2" />
                                  Edit Template
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Copy className="w-4 h-4 mr-2" />
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => setDeletingTemplate(template)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="absolute top-4 right-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm ${
                            template.status === 'published' 
                              ? 'bg-green-500/90 text-white' 
                              : 'bg-orange-500/90 text-white'
                          }`}>
                            {template.status === 'published' ? (
                              <>
                                <CheckCircle className="w-3 h-3" />
                                Published
                              </>
                            ) : (
                              <>
                                <Edit3 className="w-3 h-3" />
                                Draft
                              </>
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Template Info */}
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-bold text-gray-900 line-clamp-1 flex-1">
                            {template.name}
                          </h3>
                        </div>

                        {template.description && (
                          <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                            {template.description}
                          </p>
                        )}

                        {/* Meta Info */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`flex items-center gap-2 px-3 py-1.5 ${typeConfig.lightColor} rounded-lg`}>
                            <Icon className={`w-4 h-4 ${typeConfig.textColor}`} />
                            <span className={`text-xs font-semibold ${typeConfig.textColor}`}>
                              {typeConfig.label}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{new Date(template.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          </div>
                        </div>

                        {/* Action Button */}
                        <Button
                          onClick={() => handleEditCertificateTemplate(template)}
                          className="w-full bg-gradient-to-r from-[#533193] to-[#8B7DC3] hover:from-[#6B4AB6] hover:to-[#A594D4] text-white"
                          size="sm"
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Configure Template
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingTemplate} onOpenChange={() => setDeletingTemplate(null)}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Template?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingTemplate?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Template
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AdminTemplates;
