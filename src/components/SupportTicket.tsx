import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { 
  X, 
  Send, 
  MessageSquare, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Flag,
  Bug,
  HelpCircle,
  Star
} from 'lucide-react';
import { motion } from 'motion/react';

interface SupportTicketProps {
  onClose: () => void;
}

interface Ticket {
  id: string;
  subject: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  createdAt: Date;
  messages: Array<{
    id: string;
    content: string;
    sender: 'user' | 'support';
    timestamp: Date;
  }>;
}

export function SupportTicket({ onClose }: SupportTicketProps) {
  const [activeTab, setActiveTab] = useState<'new' | 'existing'>('new');
  const [formData, setFormData] = useState({
    subject: '',
    category: '',
    priority: 'medium' as const,
    description: ''
  });
  const [newMessage, setNewMessage] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  // Mock existing tickets
  const [tickets] = useState<Ticket[]>([
    {
      id: '1',
      subject: 'مشکل در ارسال پیام',
      category: 'technical',
      priority: 'high',
      status: 'in-progress',
      createdAt: new Date(Date.now() - 86400000),
      messages: [
        {
          id: '1-1',
          content: 'سلام، من نمی‌توانم پیام ارسال کنم. لطفاً کمک کنید.',
          sender: 'user',
          timestamp: new Date(Date.now() - 86400000)
        },
        {
          id: '1-2',
          content: 'سلام، با تشکر از تماس شما. مشکل شما در حال بررسی است. لطفاً مرورگر خود را مجدد راه‌اندازی کنید.',
          sender: 'support',
          timestamp: new Date(Date.now() - 82800000)
        },
        {
          id: '1-3',
          content: 'مشکل حل شد! ممنون از کمکتان.',
          sender: 'user',
          timestamp: new Date(Date.now() - 3600000)
        }
      ]
    },
    {
      id: '2',
      subject: 'درخواست ویژگی جدید',
      category: 'feature',
      priority: 'low',
      status: 'open',
      createdAt: new Date(Date.now() - 172800000),
      messages: [
        {
          id: '2-1',
          content: 'آیا امکان اضافه کردن ایموجی به پیام‌ها وجود دارد؟',
          sender: 'user',
          timestamp: new Date(Date.now() - 172800000)
        }
      ]
    }
  ]);

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject.trim() || !formData.category || !formData.description.trim()) {
      alert('لطفاً تمام فیلدهای الزامی را تکمیل کنید');
      return;
    }

    alert('تیکت شما با موفقیت ارسال شد. شماره تیکت: #' + Math.random().toString(36).substr(2, 9).toUpperCase());
    
    setFormData({
      subject: '',
      category: '',
      priority: 'medium',
      description: ''
    });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    alert('پیام شما ارسال شد');
    setNewMessage('');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-700';
      case 'in-progress': return 'bg-yellow-100 text-yellow-700';
      case 'resolved': return 'bg-green-100 text-green-700';
      case 'closed': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <Clock className="h-3 w-3" />;
      case 'in-progress': return <AlertCircle className="h-3 w-3" />;
      case 'resolved': return <CheckCircle className="h-3 w-3" />;
      case 'closed': return <X className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const selectedTicketData = tickets.find(t => t.id === selectedTicket);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 lg:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-6xl h-[95vh] lg:h-[700px]"
      >
        <Card className="h-full flex flex-col bg-white/95 backdrop-blur">
          <CardHeader className="py-3 lg:py-4 border-b">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
              <CardTitle className="flex items-center gap-2 text-sm lg:text-base text-right text-[#9933CC]">
                پشتیبانی و تیکت
                <MessageSquare className="h-4 w-4 lg:h-5 lg:w-5 text-[#9933CC]" />
              </CardTitle>
            </div>
          </CardHeader>

          <div className="flex-1 overflow-hidden">
            <div className="h-full flex flex-col lg:flex-row">
              {/* Mobile Tab Navigation */}
              <div className="lg:hidden border-b bg-gray-50/50">
                <div className="p-3">
                  <div className="flex gap-1">
                    <Button
                      variant={activeTab === 'new' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setActiveTab('new')}
                      className={`flex-1 text-xs ${activeTab === 'new' ? 'bg-[#9933CC] text-white hover:bg-[#7A2AA0]' : 'text-[#9933CC] hover:bg-[#9933CC]/10'}`}
                    >
                      تیکت جدید
                    </Button>
                    <Button
                      variant={activeTab === 'existing' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setActiveTab('existing')}
                      className={`flex-1 text-xs ${activeTab === 'existing' ? 'bg-[#9933CC] text-white hover:bg-[#7A2AA0]' : 'text-[#9933CC] hover:bg-[#9933CC]/10'}`}
                    >
                      تیکت‌های من
                    </Button>
                  </div>
                </div>
              </div>

              {/* Desktop Sidebar */}
              <div className="hidden lg:block w-80 border-l bg-gray-50/50">
                <div className="p-4 border-b">
                  <div className="flex gap-1">
                    <Button
                      variant={activeTab === 'new' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setActiveTab('new')}
                      className={`flex-1 ${activeTab === 'new' ? 'bg-[#9933CC] text-white hover:bg-[#7A2AA0]' : 'text-[#9933CC] hover:bg-[#9933CC]/10'}`}
                    >
                      تیکت جدید
                    </Button>
                    <Button
                      variant={activeTab === 'existing' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setActiveTab('existing')}
                      className={`flex-1 ${activeTab === 'existing' ? 'bg-[#9933CC] text-white hover:bg-[#7A2AA0]' : 'text-[#9933CC] hover:bg-[#9933CC]/10'}`}
                    >
                      تیکت‌های من
                    </Button>
                  </div>
                </div>

                {activeTab === 'existing' && (
                  <ScrollArea className="h-[calc(100%-80px)]">
                    <div className="p-4 space-y-3">
                      {tickets.map(ticket => (
                        <motion.div
                          key={ticket.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                            selectedTicket === ticket.id ? 'bg-[#f0e6ff] border-[#9933CC]/30' : 'bg-white hover:bg-gray-50'
                          }`}
                          onClick={() => setSelectedTicket(ticket.id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-sm truncate text-right">{ticket.subject}</h4>
                            <Badge variant="outline" className={`text-xs ${getStatusColor(ticket.status)}`}>
                              {getStatusIcon(ticket.status)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className={`text-xs ${getPriorityColor(ticket.priority)}`}>
                              {ticket.priority === 'high' && 'بالا'}
                              {ticket.priority === 'medium' && 'متوسط'}
                              {ticket.priority === 'low' && 'پایین'}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground text-right">
                            {formatTime(ticket.createdAt)}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </div>

              {/* Mobile Ticket List for existing tickets */}
              {activeTab === 'existing' && (
                <div className="lg:hidden flex-1 overflow-hidden">
                  {selectedTicket ? (
                    // Show selected ticket details
                    <div className="h-full flex flex-col">
                      <div className="p-3 border-b bg-gray-50">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedTicket(null)}
                          className="mb-2 text-right"
                        >
                          بازگشت به لیست ←
                        </Button>
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-sm truncate text-right">{selectedTicketData?.subject}</h3>
                          <div className="flex items-center gap-1">
                            <Badge className={`text-xs ${getPriorityColor(selectedTicketData?.priority || 'medium')}`}>
                              {selectedTicketData?.priority === 'high' && 'بالا'}
                              {selectedTicketData?.priority === 'medium' && 'متوسط'}
                              {selectedTicketData?.priority === 'low' && 'پایین'}
                            </Badge>
                            <Badge className={`text-xs ${getStatusColor(selectedTicketData?.status || 'open')}`}>
                              {getStatusIcon(selectedTicketData?.status || 'open')}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      {/* Messages */}
                      <ScrollArea className="flex-1 p-3">
                        <div className="space-y-3">
                          {selectedTicketData?.messages.map(message => (
                            <div
                              key={message.id}
                              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div 
                                className={`max-w-[85%] p-3 rounded-lg text-sm ${
                                  message.sender === 'user' 
                                    ? 'bg-[#9933CC] text-white' 
                                    : 'bg-gray-100'
                                }`}
                              >
                                <div className="text-right">{message.content}</div>
                                <div className="text-xs opacity-70 mt-2 text-right">
                                  {message.sender === 'user' ? 'شما' : 'تیم پشتیبانی'} • {formatTime(message.timestamp)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>

                      {/* Reply Form */}
                      {selectedTicketData?.status !== 'closed' && (
                        <div className="p-3 border-t bg-gray-50/50">
                          <form onSubmit={handleSendMessage} className="flex gap-2">
                            <Input
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              placeholder="پاسخ خود را بنویسید..."
                              className="flex-1 text-sm"
                            />
                            <Button type="submit" disabled={!newMessage.trim()} size="sm" className="bg-[#9933CC] hover:bg-[#7A2AA0] text-white">
                              <Send className="h-4 w-4" />
                            </Button>
                          </form>
                        </div>
                      )}
                    </div>
                  ) : (
                    // Show ticket list
                    <ScrollArea className="flex-1">
                      <div className="p-3 space-y-3">
                        {tickets.map(ticket => (
                          <motion.div
                            key={ticket.id}
                            className="p-3 rounded-lg border bg-white cursor-pointer transition-colors hover:bg-gray-50"
                            onClick={() => setSelectedTicket(ticket.id)}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium text-sm truncate flex-1 text-right">{ticket.subject}</h4>
                              <Badge variant="outline" className={`text-xs ml-2 ${getStatusColor(ticket.status)}`}>
                                {getStatusIcon(ticket.status)}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className={`text-xs ${getPriorityColor(ticket.priority)}`}>
                                {ticket.priority === 'high' && 'بالا'}
                                {ticket.priority === 'medium' && 'متوسط'}
                                {ticket.priority === 'low' && 'پایین'}
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground text-right">
                              {formatTime(ticket.createdAt)}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </div>
              )}

              {/* Main Content */}
              <div className={`flex-1 flex flex-col ${activeTab === 'existing' ? 'lg:flex hidden lg:block' : ''}`}>
                {activeTab === 'new' && (
                  <div className="p-3 lg:p-6">
                    <h3 className="text-base lg:text-lg font-medium mb-4 lg:mb-6 text-center">ارسال تیکت جدید</h3>
                    
                    <form onSubmit={handleSubmitTicket} className="space-y-4 lg:space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
                        <div>
                          <Label htmlFor="subject" className="text-sm text-right">موضوع *</Label>
                          <Input
                            id="subject"
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            placeholder="موضوع تیکت را وارد کنید"
                            className="text-sm text-right"
                            required
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="category" className="text-sm text-right">دسته‌بندی *</Label>
                          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                            <SelectTrigger className="text-sm">
                              <SelectValue placeholder="دسته‌بندی را انتخاب کنید" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="technical">
                                <div className="flex items-center gap-2">
                                  <Bug className="h-4 w-4" />
                                  مشکل فنی
                                </div>
                              </SelectItem>
                              <SelectItem value="feature">
                                <div className="flex items-center gap-2">
                                  <Star className="h-4 w-4" />
                                  درخواست ویژگی
                                </div>
                              </SelectItem>
                              <SelectItem value="report">
                                <div className="flex items-center gap-2">
                                  <Flag className="h-4 w-4" />
                                  گزارش کاربر
                                </div>
                              </SelectItem>
                              <SelectItem value="general">
                                <div className="flex items-center gap-2">
                                  <HelpCircle className="h-4 w-4" />
                                  سوال عمومی
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="priority" className="text-sm text-right">اولویت</Label>
                        <Select value={formData.priority} onValueChange={(value: any) => setFormData({ ...formData, priority: value })}>
                          <SelectTrigger className="text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">پایین</SelectItem>
                            <SelectItem value="medium">متوسط</SelectItem>
                            <SelectItem value="high">بالا</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="description" className="text-sm">توضیحات *</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="توضیحات کاملی از مشکل یا درخواست خود ارائه دهید..."
                          rows={4}
                          className="text-sm resize-none"
                          required
                        />
                      </div>

                      <Button type="submit" className="w-full text-sm bg-[#9933CC] hover:bg-[#7A2AA0] text-white">
                        <Send className="h-4 w-4 ml-2" />
                        ارسال تیکت
                      </Button>
                    </form>
                  </div>
                )}

                {activeTab === 'existing' && selectedTicketData ? (
                  <div className="hidden lg:flex flex-col h-full">
                    {/* Ticket Header */}
                    <div className="p-4 border-b bg-gray-50/50">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-sm lg:text-base truncate flex-1">{selectedTicketData.subject}</h3>
                        <div className="flex items-center gap-2 ml-2">
                          <Badge className={`text-xs ${getPriorityColor(selectedTicketData.priority)}`}>
                            {selectedTicketData.priority === 'high' && 'بالا'}
                            {selectedTicketData.priority === 'medium' && 'متوسط'}
                            {selectedTicketData.priority === 'low' && 'پایین'}
                          </Badge>
                          <Badge className={`text-xs ${getStatusColor(selectedTicketData.status)}`}>
                            {getStatusIcon(selectedTicketData.status)}
                            <span className="mr-1">
                              {selectedTicketData.status === 'open' && 'باز'}
                              {selectedTicketData.status === 'in-progress' && 'پیگیری'}
                              {selectedTicketData.status === 'resolved' && 'حل شده'}
                              {selectedTicketData.status === 'closed' && 'بسته'}
                            </span>
                          </Badge>
                        </div>
                      </div>
                      <div className="text-xs lg:text-sm text-muted-foreground">
                        ایجاد شده در: {formatTime(selectedTicketData.createdAt)}
                      </div>
                    </div>

                    {/* Messages */}
                    <ScrollArea className="flex-1 p-3 lg:p-4">
                      <div className="space-y-3 lg:space-y-4">
                        {selectedTicketData.messages.map(message => (
                          <div
                            key={message.id}
                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div 
                              className={`max-w-[85%] lg:max-w-[80%] p-3 rounded-lg text-sm ${
                                message.sender === 'user' 
                                  ? 'bg-[#9933CC] text-white' 
                                  : 'bg-gray-100'
                              }`}
                            >
                              <div>{message.content}</div>
                              <div className="text-xs opacity-70 mt-2">
                                {message.sender === 'user' ? 'شما' : 'تیم پشتیبانی'} • {formatTime(message.timestamp)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>

                    {/* Reply Form */}
                    {selectedTicketData.status !== 'closed' && (
                      <div className="p-3 lg:p-4 border-t bg-gray-50/50">
                        <form onSubmit={handleSendMessage} className="flex gap-2">
                          <Input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="پاسخ خود را بنویسید..."
                            className="flex-1 text-sm"
                          />
                          <Button type="submit" disabled={!newMessage.trim()} size="sm" className="bg-[#9933CC] hover:bg-[#7A2AA0] text-white">
                            <Send className="h-4 w-4" />
                          </Button>
                        </form>
                      </div>
                    )}
                  </div>
                ) : activeTab === 'existing' ? (
                  <div className="hidden lg:flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                      <MessageSquare className="h-8 w-8 lg:h-12 lg:w-12 mx-auto mb-2 lg:mb-4 opacity-50" />
                      <p className="text-sm">تیکتی را از فهرست انتخاب کنید</p>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}