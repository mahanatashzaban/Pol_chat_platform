import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { useAppContext, User, Message } from '../context/AppContext';
import { 
  Send, 
  Users, 
  Volume2, 
  VolumeX, 
  Bell, 
  BellOff, 
  Search,
  Edit,
  Trash2,
  Flag,
  MessageCircle,
  MoreVertical,
  MapPin,
  Home,
  User as UserIcon,
  Mic,
  MicOff,
  ArrowLeft,
  Radio
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { PrivateChat } from './PrivateChat';
import { MediaAttachment } from './MediaAttachment';
import { VoiceActivityIndicator } from './VoiceActivityIndicator';
import { formatPersianNumber } from '../utils/persian';

export function ChatRoom() {
  const { state, dispatch } = useAppContext();
  const [message, setMessage] = useState('');
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock data for room users
  const mockUsers: User[] = [
    { id: '2', email: 'user2@test.com', username: 'علی_۱۳۸۰', fullName: 'علی احمدی', isOnline: true, lastSeen: new Date(), province: 'تهران', city: 'تهران', room: state.selectedRoom || '' },
    { id: '3', email: 'user3@test.com', username: 'مریم_دوست', fullName: 'مریم حسینی', isOnline: true, lastSeen: new Date(), province: 'تهران', city: 'تهران', room: state.selectedRoom || '' },
    { id: '4', email: 'user4@test.com', username: 'رضا_کول', fullName: 'رضا محمدی', isOnline: false, lastSeen: new Date(Date.now() - 300000), province: 'تهران', city: 'تهران', room: state.selectedRoom || '' },
    { id: '5', email: 'user5@test.com', username: 'سارا_جان', fullName: 'سارا کریمی', isOnline: true, lastSeen: new Date(), province: 'تهران', city: 'تهران', room: state.selectedRoom || '' },
  ];

  useEffect(() => {
    dispatch({ type: 'SET_ROOM_USERS', payload: mockUsers });
    
    // Add some mock messages
    const mockMessages: Message[] = [
      {
        id: '1',
        senderId: '2',
        senderName: 'علی_۱۳۸۰',
        content: 'سلام دوستان! چطورید؟',
        timestamp: new Date(Date.now() - 120000),
        isRead: true,
        isEdited: false,
        type: 'public',
        roomId: state.selectedRoom || ''
      },
      {
        id: '2',
        senderId: '3',
        senderName: 'مریم_دوست',
        content: 'سلام عزیزم! خوبم ممنون 😊',
        timestamp: new Date(Date.now() - 60000),
        isRead: true,
        isEdited: false,
        type: 'public',
        roomId: state.selectedRoom || ''
      }
    ];

    mockMessages.forEach(msg => {
      dispatch({ type: 'ADD_PUBLIC_MESSAGE', payload: msg });
    });
  }, [state.selectedRoom, dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.publicMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !state.currentUser) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: state.currentUser.id,
      senderName: state.currentUser.username,
      content: message,
      timestamp: new Date(),
      isRead: true,
      isEdited: false,
      type: 'public',
      roomId: state.selectedRoom || ''
    };

    dispatch({ type: 'ADD_PUBLIC_MESSAGE', payload: newMessage });
    setMessage('');

    // Play send sound if enabled
    if (state.soundEnabled) {
      console.log('🔊 Playing send sound');
    }
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
      isRead: true,
      isEdited: false,
      type: 'public',
      roomId: state.selectedRoom || ''
    };

    dispatch({ type: 'ADD_PUBLIC_MESSAGE', payload: newMessage });
  };

  const handleEditMessage = (messageId: string, currentContent: string) => {
    setEditingMessage(messageId);
    setEditContent(currentContent);
  };

  const handleSaveEdit = () => {
    if (editingMessage && editContent.trim()) {
      dispatch({ 
        type: 'EDIT_MESSAGE', 
        payload: { messageId: editingMessage, newContent: editContent }
      });
      setEditingMessage(null);
      setEditContent('');
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    dispatch({ type: 'DELETE_MESSAGE', payload: { messageId } });
  };

  const handleUserDoubleClick = (userId: string) => {
    if (userId !== state.currentUser?.id) {
      dispatch({ type: 'OPEN_PRIVATE_MESSAGE', payload: userId });
    }
  };

  const handleRequestMicrophone = () => {
    if (!state.microphoneHolder) {
      dispatch({ type: 'REQUEST_MICROPHONE' });
    }
  };

  const handleReleaseMicrophone = () => {
    if (state.microphoneHolder === state.currentUser?.id) {
      dispatch({ type: 'RELEASE_MICROPHONE' });
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('fa-IR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusColor = (user: User) => {
    if (user.isOnline) return 'bg-green-500';
    const timeDiff = Date.now() - user.lastSeen.getTime();
    if (timeDiff < 300000) return 'bg-yellow-500'; // 5 minutes
    return 'bg-gray-400';
  };

  const selectedRoom = state.provinces
    .find(p => p.id === state.selectedProvince)?.cities
    .find(c => c.id === state.selectedCity)?.rooms
    .find(r => r.id === state.selectedRoom);

  const canEditOrDelete = (msg: Message) => {
    return msg.senderId === state.currentUser?.id;
  };

  const currentSpeaker = state.roomUsers.find(u => u.id === state.microphoneHolder);

  return (
    <div className="h-screen flex flex-col lg:flex-row bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-h-0 lg:order-2">
        {/* Header */}
        <Card className="rounded-none border-x-0 border-t-0 bg-gradient-to-r from-white via-purple-50 to-pink-50 backdrop-blur">
          <CardHeader className="py-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-2 lg:gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => dispatch({ type: 'SET_PAGE', payload: 'location' })}
                  className="flex items-center gap-2 bg-white hover:bg-gray-50 border-2 border-purple-200 rounded-xl"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">بازگشت</span>
                </Button>
                <div className="min-w-0 flex-1">
                  <CardTitle className="flex items-center gap-2 text-purple-700 text-sm lg:text-base">
                    <MessageCircle className="h-4 w-4 lg:h-5 lg:w-5 text-purple-500" />
                    <span className="truncate">{selectedRoom?.name}</span>
                  </CardTitle>
                  <div className="flex items-center gap-2 lg:gap-4 mt-1 flex-wrap">
                    <Badge variant="secondary" className="flex items-center gap-1 bg-purple-100 text-purple-700 text-xs">
                      <Users className="h-3 w-3" />
                      {formatPersianNumber(state.roomUsers.length)}
                      <span className="hidden sm:inline"> کاربر</span>
                    </Badge>
                    <Badge variant="secondary" className="flex items-center gap-1 bg-blue-100 text-blue-700 text-xs">
                      <MapPin className="h-3 w-3" />
                      <span className="text-right">
                        {selectedRoom?.name}
                        {' '}←{' '}
                        {state.provinces.find(p => p.id === state.selectedProvince)?.cities.find(c => c.id === state.selectedCity)?.name}
                        {' '}←{' '}
                        {state.provinces.find(p => p.id === state.selectedProvince)?.name}
                      </span>
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 lg:gap-2 flex-wrap">
                <Badge variant="outline" className="flex items-center gap-1 bg-white border-purple-200 text-xs">
                  <span className="hidden sm:inline">کل: </span>{formatPersianNumber(state.totalUsers)}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200 text-xs">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="hidden sm:inline">آنلاین: </span>{formatPersianNumber(state.totalOnlineUsers)}
                </Badge>
                {/* Mobile Users Sheet */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="lg:hidden bg-white hover:bg-gray-50 border-2 border-purple-200 rounded-xl"
                    >
                      <Users className="h-4 w-4 text-purple-600" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-80">
                    <SheetHeader>
                      <SheetTitle className="center-text flex items-center justify-center gap-2 text-purple-700">
                        <Users className="h-5 w-5" />
                        کاربران اتاق
                      </SheetTitle>
                      <SheetDescription className="text-center">
                        {formatPersianNumber(state.roomUsers.length)} کاربر در اتاق
                      </SheetDescription>
                      <div className="relative mt-4">
                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="جستجو در کاربران..."
                          value={state.searchQuery}
                          onChange={(e) => dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value })}
                          className="pr-10 text-right bg-white border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </SheetHeader>
                    <ScrollArea className="h-[calc(100vh-200px)] mt-6">
                      <div className="space-y-3">
                        {state.roomUsers
                          .filter(user => 
                            user.username.includes(state.searchQuery) || 
                            user.fullName.includes(state.searchQuery)
                          )
                          .map((user) => (
                          <motion.div
                            key={user.id}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 cursor-pointer transition-all duration-300 border border-transparent hover:border-purple-200"
                            onDoubleClick={() => handleUserDoubleClick(user.id)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="relative">
                              <Avatar className="h-10 w-10 border-2 border-purple-200">
                                <AvatarFallback className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 font-medium">
                                  🙂
                                </AvatarFallback>
                              </Avatar>
                              <div 
                                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(user)}`}
                              />
                              {state.microphoneHolder === user.id && (
                                <div className="absolute -top-1 -left-1 w-4 h-4 bg-red-500 rounded-full animate-pulse flex items-center justify-center">
                                  <Mic className="h-2 w-2 text-white" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0 text-right">
                              <div className="font-medium text-sm truncate text-purple-700">{user.username}</div>
                              <div className="text-xs text-muted-foreground truncate">
                                {user.isOnline ? 'آنلاین' : `آخرین بازدید: ${formatPersianNumber(formatTime(user.lastSeen))}`}
                              </div>
                            </div>
                            {user.id !== state.currentUser?.id && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 rounded-lg hover:bg-purple-100"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUserDoubleClick(user.id);
                                }}
                              >
                                <MessageCircle className="h-4 w-4 text-purple-600" />
                              </Button>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </ScrollArea>
                  </SheetContent>
                </Sheet>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => dispatch({ type: 'TOGGLE_SOUND' })}
                  className="bg-white hover:bg-gray-50 border-2 border-purple-200 rounded-xl"
                  title="صدای اتاق گفت‌وگو"
                >
                  {state.soundEnabled ? <Volume2 className="h-4 w-4 text-purple-600" /> : <VolumeX className="h-4 w-4 text-red-500" />}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => dispatch({ type: 'TOGGLE_NOTIFICATIONS' })}
                  className="bg-white hover:bg-gray-50 border-2 border-purple-200 rounded-xl"
                >
                  {state.notificationsEnabled ? <Bell className="h-4 w-4 text-purple-600" /> : <BellOff className="h-4 w-4 text-red-500" />}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => dispatch({ type: 'SET_PAGE', payload: 'profile' })}
                  className="bg-white hover:bg-gray-50 border-2 border-purple-200 rounded-xl"
                >
                  <UserIcon className="h-4 w-4 text-purple-600" />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="bg-white hover:bg-gray-50 border-2 border-purple-200 rounded-xl">
                      <MoreVertical className="h-4 w-4 text-purple-600" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => dispatch({ type: 'SET_PAGE', payload: 'support' })}>
                      <Flag className="h-4 w-4 ml-2" />
                      تیکت پشتیبانی
                    </DropdownMenuItem>
                    <Separator />
                    <DropdownMenuItem onClick={() => dispatch({ type: 'LOGOUT' })} className="text-red-600">
                      <Home className="h-4 w-4 ml-2" />
                      خروج ا�� حساب
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Voice Activity Indicator */}
            <AnimatePresence>
              {state.microphoneHolder && (
                <VoiceActivityIndicator
                  isActive={!!state.microphoneHolder}
                  speakerName={currentSpeaker?.username}
                  className="mt-3"
                />
              )}
            </AnimatePresence>
          </CardHeader>
        </Card>

        {/* Messages Area */}
        <div className="flex-1 flex">
          <div className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 p-4 bg-gradient-to-b from-transparent to-purple-50/30">
              <div className="space-y-4">
                <AnimatePresence>
                  {state.publicMessages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`flex ${msg.senderId === state.currentUser?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-md p-4 rounded-2xl shadow-lg ${
                          msg.senderId === state.currentUser?.id 
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white mr-4' 
                            : 'bg-white shadow-lg border border-gray-100 ml-4'
                        }`}
                      >
                        {msg.senderId !== state.currentUser?.id && (
                          <div 
                            className="font-medium text-sm text-purple-600 mb-2 cursor-pointer hover:underline text-right"
                            onDoubleClick={() => handleUserDoubleClick(msg.senderId)}
                          >
                            {msg.senderName}
                          </div>
                        )}
                        
                        {editingMessage === msg.id ? (
                          <div className="space-y-2">
                            <Input
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              className="text-sm text-right bg-white/20"
                            />
                            <div className="flex gap-2">
                              <Button size="sm" onClick={handleSaveEdit} className="bg-white/20 hover:bg-white/30">ذخیره</Button>
                              <Button size="sm" variant="outline" onClick={() => setEditingMessage(null)} className="bg-white/20 hover:bg-white/30">لغو</Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="text-sm text-right leading-relaxed">{msg.content}</div>
                            {msg.isEdited && (
                              <div className="text-xs opacity-70 mt-1 text-right">ویرایش شده</div>
                            )}
                            <div className="flex items-center justify-between mt-2">
                              <div className="text-xs opacity-70">
                                {formatPersianNumber(formatTime(msg.timestamp))}
                              </div>
                              
                              {canEditOrDelete(msg) && (
                                <div className="flex gap-1">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0 text-xs opacity-70 hover:opacity-100"
                                    onClick={() => handleEditMessage(msg.id, msg.content)}
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0 text-xs opacity-70 hover:opacity-100"
                                    onClick={() => handleDeleteMessage(msg.id)}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <Card className="rounded-none border-x-0 border-b-0 bg-white/90 backdrop-blur">
              <CardContent className="p-4">
                {/* Microphone Control */}
                <div className="flex items-center justify-center mb-4">
                  <div className="flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-2">
                    {state.microphoneHolder === state.currentUser?.id ? (
                      <Button
                        variant="destructive"
                        onClick={handleReleaseMicrophone}
                        className="animate-pulse bg-red-500 hover:bg-red-600 rounded-xl"
                      >
                        <MicOff className="h-4 w-4 ml-2" />
                        رها کردن میکروفن
                      </Button>
                    ) : state.microphoneHolder ? (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Radio className="h-4 w-4 text-red-500 animate-pulse" />
                        <span>{currentSpeaker?.username} در حال صحبت</span>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={handleRequestMicrophone}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 border-0 rounded-xl"
                      >
                        <Mic className="h-4 w-4 ml-2" />
                        گرفتن میکروفن
                      </Button>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => dispatch({ type: 'TOGGLE_MICROPHONE_MUTE' })}
                      className="rounded-xl"
                    >
                      {state.mutedMicrophone ? 
                        <VolumeX className="h-4 w-4 text-red-500" /> : 
                        <Volume2 className="h-4 w-4 text-purple-600" />
                      }
                    </Button>
                  </div>
                </div>

                <form onSubmit={handleSendMessage} className="flex gap-3">
                  <MediaAttachment onAttach={handleMediaAttach} />
                  <Input
                    ref={inputRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="پیام خود را بنویسید..."
                    className="flex-1 text-right bg-gray-50 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                  <Button 
                    type="submit" 
                    disabled={!message.trim()}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl px-6"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Users Sidebar */}
          <Card className="hidden lg:block w-80 rounded-none border-y-0 border-l-0 bg-gradient-to-b from-white to-purple-50/50 backdrop-blur">
            <CardHeader className="py-4 bg-gradient-to-r from-purple-100 to-pink-100">
              <CardTitle className="center-text flex items-center justify-center gap-2 text-purple-700">
                <Users className="h-5 w-5" />
                کاربران اتاق
              </CardTitle>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="جستجو در کاربران..."
                  value={state.searchQuery}
                  onChange={(e) => dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value })}
                  className="pr-10 text-right bg-white border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="p-4 space-y-3">
                  {state.roomUsers
                    .filter(user => 
                      user.username.includes(state.searchQuery) || 
                      user.fullName.includes(state.searchQuery)
                    )
                    .map((user) => (
                    <motion.div
                      key={user.id}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 cursor-pointer transition-all duration-300 border border-transparent hover:border-purple-200"
                      onDoubleClick={() => handleUserDoubleClick(user.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="relative">
                        <Avatar className="h-10 w-10 border-2 border-purple-200">
                          <AvatarFallback className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 font-medium">
                            🙂
                          </AvatarFallback>
                        </Avatar>
                        <div 
                          className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(user)}`}
                        />
                        {state.microphoneHolder === user.id && (
                          <div className="absolute -top-1 -left-1 w-4 h-4 bg-red-500 rounded-full animate-pulse flex items-center justify-center">
                            <Mic className="h-2 w-2 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 text-right">
                        <div className="font-medium text-sm truncate text-purple-700">{user.username}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {user.isOnline ? 'آنلاین' : `آخرین بازدید: ${formatPersianNumber(formatTime(user.lastSeen))}`}
                        </div>
                      </div>
                      {user.id !== state.currentUser?.id && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 rounded-lg hover:bg-purple-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUserDoubleClick(user.id);
                          }}
                        >
                          <MessageCircle className="h-4 w-4 text-purple-600" />
                        </Button>
                      )}
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Private Chat Modal */}
      {state.privateMessageOpen && (
        <PrivateChat 
          userId={state.privateMessageOpen}
          onClose={() => dispatch({ type: 'CLOSE_PRIVATE_MESSAGE' })}
        />
      )}
    </div>
  );
}