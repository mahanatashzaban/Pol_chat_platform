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
  MoreVertical,
  Minus,
  GripVertical
} from 'lucide-react';
import { MediaAttachment } from './MediaAttachment';
import { motion, AnimatePresence } from 'motion/react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useIsMobile } from './ui/use-mobile';

interface DraggablePrivateChatProps {
  userId: string;
  onClose: () => void;
  onMinimize: () => void;
  position: { x: number; y: number };
  zIndex: number;
  onBringToFront: () => void;
}

export function DraggablePrivateChat({ 
  userId, 
  onClose, 
  onMinimize, 
  position, 
  zIndex, 
  onBringToFront 
}: DraggablePrivateChatProps) {
  const { state, dispatch } = useAppContext();
  const [message, setMessage] = useState('');
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

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

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMobile || (e.target as HTMLElement).closest('.no-drag')) return;
    
    setIsDragging(true);
    onBringToFront();
    
    const rect = chatRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      // Keep within viewport bounds
      const maxX = window.innerWidth - 400; // chat width
      const maxY = window.innerHeight - 600; // chat height
      
      const boundedX = Math.max(0, Math.min(newX, maxX));
      const boundedY = Math.max(0, Math.min(newY, maxY));
      
      if (chatRef.current) {
        chatRef.current.style.left = `${boundedX}px`;
        chatRef.current.style.top = `${boundedY}px`;
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

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
    <div
      ref={chatRef}
      className={`fixed flex flex-col shadow-2xl rounded-lg overflow-hidden ${
        isMobile 
          ? 'inset-4 w-auto h-auto max-h-[calc(100vh-2rem)]' 
          : 'w-96 h-[600px]'
      }`}
      style={isMobile ? { zIndex: zIndex } : {
        left: position.x,
        top: position.y,
        zIndex: zIndex
      }}
      onMouseDown={handleMouseDown}
    >
      <Card className="h-full flex flex-col bg-white/95 backdrop-blur border-2 border-[#9933CC]/20">
        {/* Header */}
        <CardHeader 
          className={`py-2 sm:py-3 border-b bg-gradient-to-r from-[#9933CC] to-[#B347D9] text-white ${!isMobile ? 'cursor-move' : ''}`}
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              {!isMobile && <GripVertical className="h-4 w-4 opacity-60 flex-shrink-0" />}
              <div className="relative flex-shrink-0">
                <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                  <AvatarFallback className="bg-white/20 text-white text-xs sm:text-sm">
                    {targetUser.fullName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div 
                  className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 border-white ${getStatusColor()}`}
                />
              </div>
              <div className="min-w-0 flex-1">
                <CardTitle className="text-xs sm:text-sm text-white truncate">{targetUser.username}</CardTitle>
                <div className="text-xs text-white/80 truncate">
                  {targetUser.isOnline ? 'آنلاین' : `آخرین بازدید: ${formatTime(targetUser.lastSeen)}`}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-0.5 sm:gap-1 no-drag flex-shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-5 w-5 sm:h-6 sm:w-6 p-0 text-white hover:bg-white/20">
                    <MoreVertical className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
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
              
              {!isMobile && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onMinimize}
                  className="h-5 w-5 sm:h-6 sm:w-6 p-0 text-white hover:bg-white/20"
                >
                  <Minus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                </Button>
              )}
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                className="h-5 w-5 sm:h-6 sm:w-6 p-0 text-white hover:bg-white/20"
              >
                <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Messages */}
        <div className="flex-1 flex flex-col min-h-0 no-drag">
          <ScrollArea className="flex-1 p-2 sm:p-3">
            {chatMessages.length === 0 ? (
              <div className="text-center text-muted-foreground py-4 sm:py-8">
                <Circle className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 sm:mb-3 opacity-50" />
                <p className="text-xs sm:text-sm">هنوز پیامی رد و بدل نشده</p>
                <p className="text-xs mt-1">اولین پیام را ارسال کنید! 💬</p>
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                <AnimatePresence>
                  {chatMessages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`flex ${msg.senderId === state.currentUser?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[85%] sm:max-w-[75%] p-2 sm:p-2.5 rounded-lg text-xs sm:text-sm ${ 
                          msg.senderId === state.currentUser?.id 
                            ? 'bg-[#9933CC] text-white' 
                            : 'bg-gray-100'
                        }`}
                      >
                        {editingMessage === msg.id ? (
                          <div className="space-y-1.5 sm:space-y-2">
                            <Input
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              className="text-xs text-right bg-white/20 h-7 sm:h-8"
                            />
                            <div className="flex gap-1">
                              <Button size="sm" onClick={handleSaveEdit} className="h-5 sm:h-6 text-xs bg-white/20 hover:bg-white/30 px-2">ذخیره</Button>
                              <Button size="sm" variant="outline" onClick={() => setEditingMessage(null)} className="h-5 sm:h-6 text-xs bg-white/20 hover:bg-white/30 px-2">لغو</Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="text-right leading-relaxed">{msg.content}</div>
                            {msg.isEdited && (
                              <div className="text-xs opacity-70 mt-1 text-right">ویرایش شده</div>
                            )}
                            <div className="flex items-center justify-between mt-1.5 sm:mt-2">
                              <div className="text-xs opacity-70">
                                {formatTime(msg.timestamp)}
                              </div>
                              
                              <div className="flex items-center gap-0.5 sm:gap-1">
                                {getReadStatus(msg)}
                                
                                {msg.senderId === state.currentUser?.id && (
                                  <div className="flex gap-0.5 ml-0.5 sm:ml-1">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-3.5 w-3.5 sm:h-4 sm:w-4 p-0 text-xs opacity-70 hover:opacity-100"
                                      onClick={() => handleEditMessage(msg.id, msg.content)}
                                    >
                                      <Edit className="h-2 w-2 sm:h-2.5 sm:w-2.5" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-3.5 w-3.5 sm:h-4 sm:w-4 p-0 text-xs opacity-70 hover:opacity-100"
                                      onClick={() => handleDeleteMessage(msg.id)}
                                    >
                                      <Trash2 className="h-2 w-2 sm:h-2.5 sm:w-2.5" />
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
          <div className="p-2 sm:p-3 border-t bg-white">
            <form onSubmit={handleSendMessage} className="flex gap-1 sm:gap-2">
              <MediaAttachment onAttach={handleMediaAttach} />
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="پیام خصوصی..."
                className="flex-1 text-right text-xs sm:text-sm h-7 sm:h-8"
              />
              <Button 
                type="submit" 
                disabled={!message.trim()}
                size="sm"
                className="bg-[#9933CC] hover:bg-[#7A2AA0] h-7 w-7 sm:h-8 sm:w-8 p-0"
              >
                <Send className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              </Button>
            </form>
          </div>
        </div>
      </Card>
    </div>
  );
}