import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { useAppContext } from '../context/AppContext';
import { 
  X, 
  Settings, 
  MessageCircle, 
  Trash2, 
  Search,
  Volume2,
  VolumeX,
  Bell,
  BellOff,
  User,
  Heart,
  Clock,
  MapPin,
  LogOut,
  Flag,
  Camera,
  Upload
} from 'lucide-react';
import { motion } from 'motion/react';

interface UserProfileProps {
  onClose: () => void;
}

export function UserProfile({ onClose }: UserProfileProps) {
  const { state, dispatch } = useAppContext();
  const [searchFriends, setSearchFriends] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Mock friends data based on private chats
  const friends = Object.keys(state.privateChats).map(userId => {
    const user = state.roomUsers.find(u => u.id === userId) || state.onlineUsers.find(u => u.id === userId);
    const lastMessage = state.privateChats[userId]?.slice(-1)[0];
    const unreadCount = state.privateChats[userId]?.filter(msg => !msg.isRead && msg.senderId !== state.currentUser?.id).length || 0;
    
    return {
      ...user,
      lastMessage,
      unreadCount,
      messageCount: state.privateChats[userId]?.length || 0
    };
  }).filter(Boolean);

  const filteredFriends = friends.filter(friend => 
    friend?.username.includes(searchFriends) || 
    friend?.fullName.includes(searchFriends)
  );

  const handleOpenChat = (userId: string) => {
    dispatch({ type: 'OPEN_PRIVATE_MESSAGE', payload: userId });
    onClose();
  };

  const handleClearHistory = (userId: string) => {
    if (confirm('آیا مطمئن هستید که می‌خواهید تاریخچه چت را پاک کنید؟')) {
      dispatch({ type: 'CLEAR_CHAT_HISTORY', payload: userId });
    }
  };

  const handleLogout = () => {
    if (confirm('آیا مطمئن هستید که می‌خواهید از حساب کاربری خارج شوید؟')) {
      dispatch({ type: 'LOGOUT' });
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('fa-IR', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit'
    }).format(date);
  };

  const getStatusColor = (user: any) => {
    if (!user) return 'bg-gray-400';
    if (user.isOnline) return 'bg-green-500';
    const timeDiff = Date.now() - user.lastSeen.getTime();
    if (timeDiff < 300000) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
        className="w-full max-w-2xl h-[90vh] lg:h-[700px]"
      >
        <Card className="h-full flex flex-col bg-white/95 backdrop-blur">
          <CardHeader className="py-4 border-b">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
              <CardTitle className="flex items-center gap-2 text-[#9933CC]">
                پروفایل و تنظیمات
                <User className="h-5 w-5 text-[#9933CC]" />
              </CardTitle>
            </div>
          </CardHeader>

          <div className="flex-1 overflow-hidden">
            <Tabs defaultValue="profile" className="h-full flex flex-col">
              <div className="px-6 pt-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="profile">پروفایل</TabsTrigger>
                  <TabsTrigger value="friends">دوستان</TabsTrigger>
                  <TabsTrigger value="settings">تنظیمات</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="profile" className="flex-1 overflow-hidden">
                <ScrollArea className="h-full px-6 pb-6">
                  <div className="space-y-6">
                    {/* User Info */}
                    <div className="flex items-center gap-4 p-4 bg-[#f0e6ff] rounded-lg">
                      <div className="relative">
                        <Avatar className="h-16 w-16">
                          {profileImage ? (
                            <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            <AvatarFallback className="bg-[#9933CC] text-white text-xl">
                              {state.currentUser?.fullName.charAt(0)}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <label className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#9933CC] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#7A2AA0] transition-colors">
                          <Camera className="h-3 w-3 text-white" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <div className="flex-1 text-right">
                        <h3 className="font-medium text-right">{state.currentUser?.fullName}</h3>
                        <p className="text-sm text-muted-foreground text-right">{state.currentUser?.username}</p>
                        <p className="text-sm text-muted-foreground text-right">{state.currentUser?.email}</p>
                        <div className="flex items-center gap-2 mt-2 justify-end">
                          <span className="text-sm text-green-600">آنلاین</span>
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                      </div>
                    </div>

                    {/* Location Info */}
                    <div className="space-y-4">
                      <h4 className="font-medium flex items-center gap-2 justify-end text-right">
                        موقعیت فعلی
                        <MapPin className="h-4 w-4 text-[#9933CC]" />
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-3 bg-gray-50 rounded-lg text-right">
                          <div className="text-xs sm:text-sm text-muted-foreground text-right">اتاق</div>
                          <div className="font-medium text-sm sm:text-base truncate text-right">
                            {state.provinces.find(p => p.id === state.selectedProvince)?.cities.find(c => c.id === state.selectedCity)?.rooms.find(r => r.id === state.selectedRoom)?.name}
                          </div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg text-right">
                          <div className="text-xs sm:text-sm text-muted-foreground text-right">شهر</div>
                          <div className="font-medium text-sm sm:text-base truncate text-right">
                            {state.provinces.find(p => p.id === state.selectedProvince)?.cities.find(c => c.id === state.selectedCity)?.name}
                          </div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg text-right">
                          <div className="text-xs sm:text-sm text-muted-foreground text-right">است��ن</div>
                          <div className="font-medium text-sm sm:text-base truncate text-right">{state.provinces.find(p => p.id === state.selectedProvince)?.name}</div>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-right">آمار فعالیت</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-blue-50 rounded-lg text-right">
                          <div className="text-xl sm:text-2xl font-bold text-blue-600 text-right">{friends.length}</div>
                          <div className="text-xs sm:text-sm text-blue-600 text-right">دوست</div>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg text-right">
                          <div className="text-xl sm:text-2xl font-bold text-green-600 text-right">
                            {Object.values(state.privateChats).reduce((total, chat) => total + chat.length, 0)}
                          </div>
                          <div className="text-xs sm:text-sm text-green-600 text-right">پیام ارسالی</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="friends" className="flex-1 overflow-hidden">
                <div className="px-6 pb-6 h-full flex flex-col">
                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="جستجو در دوستان..."
                        value={searchFriends}
                        onChange={(e) => setSearchFriends(e.target.value)}
                        className="pr-10"
                      />
                    </div>
                  </div>

                  <ScrollArea className="flex-1">
                    {filteredFriends.length === 0 ? (
                      <div className="text-center text-muted-foreground py-8">
                        <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>هنوز دوستی ندارید</p>
                        <p className="text-sm mt-1">با کاربران دیگر چت کنید تا به لیست دوستان اضافه شوند</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {filteredFriends.map((friend) => (
                          <div key={friend?.id} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                            <div className="flex gap-0.5 sm:gap-1 flex-shrink-0">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleOpenChat(friend?.id || '')}
                                className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-[#9933CC] hover:bg-[#9933CC]/10"
                              >
                                <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleClearHistory(friend?.id || '')}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7 w-7 sm:h-8 sm:w-8 p-0"
                              >
                                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                            </div>

                            <div className="flex-1 min-w-0 text-right">
                              <div className="flex items-center gap-1 sm:gap-2 justify-end">
                                {friend?.unreadCount > 0 && (
                                  <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                                    {friend.unreadCount}
                                  </Badge>
                                )}
                                <span className="font-medium truncate text-sm sm:text-base">{friend?.username}</span>
                              </div>
                              <div className="text-xs sm:text-sm text-muted-foreground truncate text-right">
                                {friend?.lastMessage ? (
                                  <>
                                    {formatTime(friend.lastMessage.timestamp)}
                                    <span className="mx-1 sm:mx-2">•</span>
                                    {friend.lastMessage.content.length > 25 
                                      ? friend.lastMessage.content.substring(0, 25) + '...' 
                                      : friend.lastMessage.content
                                    }
                                  </>
                                ) : (
                                  'هیچ پیامی موجود نیست'
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground text-right">
                                {friend?.messageCount} پیام
                              </div>
                            </div>
                            
                            <div className="relative flex-shrink-0">
                              <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                                <AvatarFallback className="bg-[#f0e6ff] text-[#9933CC] text-sm">
                                  {friend?.fullName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div 
                                className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 border-white ${getStatusColor(friend)}`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="flex-1 overflow-hidden">
                <ScrollArea className="h-full px-3 sm:px-6 pb-4 sm:pb-6">
                  <div className="space-y-4 sm:space-y-6">
                    {/* Sound Settings */}
                    <div className="space-y-3 sm:space-y-4">
                      <h4 className="font-medium flex items-center gap-2 text-sm sm:text-base justify-end">
                        تنظیمات صدا
                        <Volume2 className="h-4 w-4 text-[#9933CC]" />
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-start sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Switch
                              id="sound-enabled"
                              checked={state.soundEnabled}
                              onCheckedChange={() => dispatch({ type: 'TOGGLE_SOUND' })}
                            />
                            {state.soundEnabled ? <Volume2 className="h-4 w-4 text-[#9933CC]" /> : <VolumeX className="h-4 w-4 text-red-500" />}
                          </div>
                          <div className="space-y-0.5 flex-1 min-w-0 text-right">
                            <Label htmlFor="sound-enabled" className="text-sm text-right">صدای پیام‌ها</Label>
                            <p className="text-xs sm:text-sm text-muted-foreground text-right">
                              پخش صدا هنگام ارسال و دریافت پیام
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Notification Settings */}
                    <div className="space-y-3 sm:space-y-4">
                      <h4 className="font-medium flex items-center gap-2 text-sm sm:text-base justify-end">
                        تنظیمات اعلان‌ها
                        <Bell className="h-4 w-4 text-[#9933CC]" />
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-start sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Switch
                              id="notifications-enabled"
                              checked={state.notificationsEnabled}
                              onCheckedChange={() => dispatch({ type: 'TOGGLE_NOTIFICATIONS' })}
                            />
                            {state.notificationsEnabled ? <Bell className="h-4 w-4 text-[#9933CC]" /> : <BellOff className="h-4 w-4 text-red-500" />}
                          </div>
                          <div className="space-y-0.5 flex-1 min-w-0 text-right">
                            <Label htmlFor="notifications-enabled" className="text-sm text-right">اعلان‌های دسکتاپ</Label>
                            <p className="text-xs sm:text-sm text-muted-foreground text-right">
                              نمایش اعلان برای پیام‌های جدید
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Account Actions */}
                    <div className="space-y-3 sm:space-y-4">
                      <h4 className="font-medium flex items-center gap-2 text-sm sm:text-base justify-end">
                        حساب کاربری
                        <Settings className="h-4 w-4 text-[#9933CC]" />
                      </h4>
                      <div className="space-y-2 sm:space-y-3">
                        <Button 
                          variant="outline" 
                          className="w-full justify-between text-sm text-right border-[#9933CC] text-[#9933CC] hover:bg-[#9933CC] hover:text-white"
                          onClick={() => dispatch({ type: 'SET_PAGE', payload: 'location' })}
                        >
                          <MapPin className="h-4 w-4 ml-2" />
                          تغییر مکان و اتاق
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full justify-between text-sm text-right border-[#9933CC] text-[#9933CC] hover:bg-[#9933CC] hover:text-white"
                          onClick={() => dispatch({ type: 'SET_PAGE', payload: 'support' })}
                        >
                          <Flag className="h-4 w-4 ml-2" />
                          تیکت پشتیبانی
                        </Button>
                        <Button 
                          variant="destructive" 
                          className="w-full justify-between text-sm text-right"
                          onClick={handleLogout}
                        >
                          <LogOut className="h-4 w-4 ml-2" />
                          خروج از حساب کاربری
                        </Button>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}