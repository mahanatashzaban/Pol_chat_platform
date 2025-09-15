import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { useAppContext, Message } from '../context/AppContext';
import { 
  Send, 
  X, 
  Edit, 
  Trash2, 
  Check, 
  CheckCheck,
  Circle,
  Flag,
  MoreVertical
} from 'lucide-react';
import { MediaAttachment } from './MediaAttachment';
import { motion, AnimatePresence } from 'motion/react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

interface PrivateChatProps {
  userId: string;
  onClose: () => void;
}

export function PrivateChat({ userId, onClose }: PrivateChatProps) {
  const { state, dispatch } = useAppContext();
  const [message, setMessage] = useState('');
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const targetUser = state.roomUsers.find(user => user.id === userId) || 
                    state.onlineUsers.find(user => user.id === userId);
  
  const chatMessages = state.privateChats[userId] || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    // Mark messages as read when opening chat
    if (chatMessages.length > 0) {
      dispatch({ type: 'MARK_MESSAGES_READ', payload: { userId } });
    }
  }, [userId, dispatch, chatMessages.length]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !state.currentUser) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: state.currentUser.id,
      senderName: state.currentUser.username,
      content: message,
      timestamp: new Date(),
      isRead: false,
      isEdited: false,
      type: 'private',
      recipientId: userId
    };

    dispatch({ type: 'ADD_PRIVATE_MESSAGE', payload: { userId, message: newMessage } });
    setMessage('');

    // Play private message sound if enabled
    if (state.soundEnabled) {
      console.log('🔊 Playing private message send sound');
    }

    // Simulate read receipt after 2 seconds
    setTimeout(() => {
      dispatch({ type: 'MARK_MESSAGES_READ', payload: { userId } });
    }, 2000);
  };

  const handleMediaAttach = (type: 'image' | 'file' | 'sticker' | 'camera', data: any) => {
    if (!state.currentUser) return;

    let content = '';
    if (type === 'sticker') {
      content = data.emoji;
    } else if (type === 'image' || type === 'camera') {
      content = `[تصویر: ${data.name}]`;
    } else if (type === 'file') {
      content = `[فایل: ${data.name}]`;
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: state.currentUser.id,
      senderName: state.currentUser.username,
      content,
      timestamp: new Date(),
      isRead: false,
      isEdited: false,
      type: 'private',
      recipientId: userId
    };

    dispatch({ type: 'ADD_PRIVATE_MESSAGE', payload: { userId, message: newMessage } });
  };

  const handleEditMessage = (messageId: string, currentContent: string) => {
    setEditingMessage(messageId);
    setEditContent(currentContent);
  };

  const handleSaveEdit = () => {
    if (editingMessage && editContent.trim()) {
      dispatch({ 
        type: 'EDIT_MESSAGE', 
        payload: { messageId: editingMessage, newContent: editContent, isPrivate: true, userId }
      });
      setEditingMessage(null);
      setEditContent('');
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    dispatch({ type: 'DELETE_MESSAGE', payload: { messageId, isPrivate: true, userId } });
  };

  const handleClearHistory = () => {
    if (confirm('آیا مطمئن هستید که می‌خواهید تاریخچه چت را پاک کنید؟')) {
      dispatch({ type: 'CLEAR_CHAT_HISTORY', payload: userId });
    }
  };

  const handleReportUser = () => {
    alert('گزارش کاربر با موفقیت ارسال شد. تیم پشتیبانی بررسی خواهد کرد.');
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('fa-IR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusColor = () => {
    if (!targetUser) return 'bg-gray-400';
    if (targetUser.isOnline) return 'bg-green-500';
    const timeDiff = Date.now() - targetUser.lastSeen.getTime();
    if (timeDiff < 300000) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  const getReadStatus = (msg: Message) => {
    if (msg.senderId !== state.currentUser?.id) return null;
    
    if (msg.isRead) {
      return <CheckCheck className="h-3 w-3 text-blue-500" />;
    } else {
      return <Check className="h-3 w-3 text-gray-400" />;
    }
  };

  if (!targetUser) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md h-[600px] flex flex-col"
      >
        <Card className="h-full flex flex-col bg-white/95 backdrop-blur">
          {/* Header */}
          <CardHeader className="py-3 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-purple-100 text-purple-700">
                      {targetUser.fullName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div 
                    className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor()}`}
                  />
                </div>
                <div>
                  <CardTitle className="text-lg">{targetUser.username}</CardTitle>
                  <div className="text-sm text-muted-foreground">
                    {targetUser.isOnline ? 'آنلاین' : `آخرین بازدید: ${formatTime(targetUser.lastSeen)}`}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleClearHistory}>
                      <Trash2 className="h-4 w-4 ml-2" />
                      پاک کردن تاریخچه
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleReportUser} className="text-red-600">
                      <Flag className="h-4 w-4 ml-2" />
                      گزارش کاربر
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {/* Messages */}
          <div className="flex-1 flex flex-col min-h-0">
            <ScrollArea className="flex-1 p-4">
              {chatMessages.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <Circle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>هنوز پیامی رد و بدل نشده</p>
                  <p className="text-sm mt-1">اولین پیام را ارسال کنید! 💬</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {chatMessages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`flex ${msg.senderId === state.currentUser?.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[80%] p-3 rounded-lg ${
                            msg.senderId === state.currentUser?.id 
                              ? 'bg-purple-500 text-white' 
                              : 'bg-gray-100'
                          }`}
                        >
                          {editingMessage === msg.id ? (
                            <div className="space-y-2">
                              <Input
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="text-sm"
                              />
                              <div className="flex gap-2">
                                <Button size="sm" onClick={handleSaveEdit}>ذخیره</Button>
                                <Button size="sm" variant="outline" onClick={() => setEditingMessage(null)}>لغو</Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="text-sm text-right">{msg.content}</div>
                              {msg.isEdited && (
                                <div className="text-xs opacity-70 mt-1 text-right">ویرایش شده</div>
                              )}
                              <div className="flex items-center justify-between mt-2">
                                <div className="text-xs opacity-70">
                                  {formatTime(msg.timestamp)}
                                </div>
                                
                                <div className="flex items-center gap-1">
                                  {getReadStatus(msg)}
                                  
                                  {msg.senderId === state.currentUser?.id && (
                                    <div className="flex gap-1 ml-1">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-5 w-5 p-0 text-xs opacity-70 hover:opacity-100"
                                        onClick={() => handleEditMessage(msg.id, msg.content)}
                                      >
                                        <Edit className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-5 w-5 p-0 text-xs opacity-70 hover:opacity-100"
                                        onClick={() => handleDeleteMessage(msg.id)}
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t bg-white">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <MediaAttachment onAttach={handleMediaAttach} />
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="پیام خصوصی..."
                  className="flex-1 text-right"
                />
                <Button type="submit" disabled={!message.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}