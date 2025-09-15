import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useAppContext } from '../context/AppContext';
import { MapPin, Users, ArrowRight, Sparkles, User, LogOut } from 'lucide-react';
import { formatPersianNumber } from '../utils/persian';
import { BridgeLogo } from './BridgeLogo';
import { motion } from 'motion/react';

export function LocationSelector() {
  const { state, dispatch } = useAppContext();

  const selectedProvince = state.provinces.find(p => p.id === state.selectedProvince);
  const selectedCity = selectedProvince?.cities.find(c => c.id === state.selectedCity);

  const handleProvinceSelect = (provinceId: string) => {
    dispatch({ type: 'SELECT_PROVINCE', payload: provinceId });
  };

  const handleCitySelect = (cityId: string) => {
    dispatch({ type: 'SELECT_CITY', payload: cityId });
  };

  const handleRoomSelect = (roomId: string) => {
    dispatch({ type: 'SELECT_ROOM', payload: roomId });
  };

  const handleBackToProvince = () => {
    dispatch({ type: 'SELECT_PROVINCE', payload: '' });
  };

  const handleBackToCity = () => {
    dispatch({ type: 'SELECT_CITY', payload: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 p-2 lg:p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Top Navigation */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-4 lg:mb-6 gap-3">
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={() => dispatch({ type: 'SET_PAGE', payload: 'profile' })}
                className="flex items-center gap-2 flex-1 sm:flex-none bg-white hover:bg-gray-50 border-2 border-purple-200 rounded-xl px-4 py-2 shadow-sm hover:shadow-md transition-all"
              >
                <User className="h-4 w-4 text-purple-600" />
                <span className="text-sm">پروفایل</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => dispatch({ type: 'LOGOUT' })}
                className="flex items-center gap-2 text-red-600 hover:bg-red-50 flex-1 sm:flex-none bg-white border-2 border-red-200 rounded-xl px-4 py-2 shadow-sm hover:shadow-md transition-all"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm">خروج</span>
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 mb-4">
            <BridgeLogo size={48} />
            <div className="text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#9933CC] to-[#CC33FF] bg-clip-text text-transparent">پل</h1>
              <p className="text-sm text-[#9933CC]">انتخاب مکان چت</p>
            </div>
          </div>
          <p className="text-muted-foreground text-center">
            استان، شهر و اتاق مورد نظر خود را انتخاب کنید
          </p>
          <div className="flex items-center justify-center gap-2 lg:gap-4 mt-4 flex-wrap">
            <Badge variant="secondary" className="flex items-center gap-1 bg-purple-100 text-purple-700 text-xs lg:text-sm">
              <Users className="h-3 w-3 lg:h-4 lg:w-4" />
              {formatPersianNumber(state.totalUsers)} کاربر
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1 bg-green-100 text-green-700 text-xs lg:text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              {formatPersianNumber(state.totalOnlineUsers)} آنلاین
            </Badge>
          </div>
        </motion.div>

        {/* Breadcrumb */}
        <motion.div 
          className="flex items-center justify-center gap-2 mb-6 text-right"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Badge variant="outline" className="bg-[#9933CC] text-white border-[#9933CC] text-right">انتخاب استان</Badge>
          {selectedProvince && (
            <>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <Badge variant="outline" className="bg-[#9933CC] text-white border-[#9933CC] text-right">انتخاب شهر</Badge>
            </>
          )}
          {selectedCity && (
            <>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <Badge variant="outline" className="bg-[#9933CC] text-white border-[#9933CC] text-right">انتخاب اتاق</Badge>
            </>
          )}
        </motion.div>

        {/* Province Selection */}
        {!selectedProvince && (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {state.provinces.map((province, index) => (
              <motion.div
                key={province.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card 
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur border-0"
                  onClick={() => handleProvinceSelect(province.id)}
                >
                  <CardHeader className="text-right">
                    <CardTitle className="text-right flex items-center justify-center gap-2">
                      <MapPin className="h-5 w-5 text-purple-500" />
                      {province.name}
                    </CardTitle>
                    <CardDescription className="text-right text-center">
                      {province.cities.length} شهر موجود
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <Badge variant="secondary" className="mb-2">
                        {province.cities.reduce((total, city) => total + city.rooms.reduce((roomTotal, room) => roomTotal + room.userCount, 0), 0).toLocaleString('fa-IR')} کاربر فعال
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* City Selection */}
        {selectedProvince && !selectedCity && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <Button variant="outline" onClick={handleBackToProvince}>
                بازگشت
              </Button>
              <h2 className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-purple-500" />
                شهرهای {selectedProvince.name}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedProvince.cities.map((city, index) => (
                <motion.div
                  key={city.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card 
                    className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur border-0"
                    onClick={() => handleCitySelect(city.id)}
                  >
                    <CardHeader className="text-center">
                      <CardTitle className="text-center">{city.name}</CardTitle>
                      <CardDescription className="text-center">
                        {city.rooms.length} اتاق چت
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <Badge variant="secondary" className="mb-2">
                          {city.rooms.reduce((total, room) => total + room.userCount, 0).toLocaleString('fa-IR')} کاربر آنلاین
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Room Selection */}
        {selectedCity && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <Button variant="outline" onClick={handleBackToCity}>
                بازگشت
              </Button>
              <h2 className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-500" />
                اتاق‌های چت {selectedCity.name}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {selectedCity.rooms.map((room, index) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                >
                  <Card 
                    className={`cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur border-0 ${
                      room.userCount >= room.maxUsers ? 'opacity-75' : ''
                    }`}
                    onClick={() => room.userCount < room.maxUsers && handleRoomSelect(room.id)}
                  >
                    <CardHeader className="text-center pb-2">
                      <CardTitle className="text-center text-lg">{room.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center space-y-2">
                        <div className="flex items-center justify-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {room.userCount.toLocaleString('fa-IR')} / {room.maxUsers.toLocaleString('fa-IR')}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all ${
                              room.userCount >= room.maxUsers * 0.8 ? 'bg-red-500' :
                              room.userCount >= room.maxUsers * 0.6 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${(room.userCount / room.maxUsers) * 100}%` }}
                          ></div>
                        </div>
                        {room.userCount >= room.maxUsers ? (
                          <Badge variant="destructive" className="text-xs">پر</Badge>
                        ) : (
                          <Badge 
                            variant={room.userCount >= room.maxUsers * 0.8 ? 'secondary' : 'default'} 
                            className="text-xs"
                          >
                            {room.userCount >= room.maxUsers * 0.8 ? 'تقریباً پر' : 'آزاد'}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}