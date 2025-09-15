import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  isOnline: boolean;
  lastSeen: Date;
  province: string;
  city: string;
  room: string;
  profileImage?: string;
  hasMicrophone?: boolean;
  isMicrophoneMuted?: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  isEdited: boolean;
  type: 'public' | 'private';
  roomId?: string;
  recipientId?: string;
}

export interface Room {
  id: string;
  name: string;
  city: string;
  userCount: number;
  maxUsers: number;
}

export interface Province {
  id: string;
  name: string;
  cities: City[];
}

export interface City {
  id: string;
  name: string;
  rooms: Room[];
}

interface AppState {
  currentUser: User | null;
  isAuthenticated: boolean;
  provinces: Province[];
  selectedProvince: string | null;
  selectedCity: string | null;
  selectedRoom: string | null;
  currentPage: 'auth' | 'location' | 'chat' | 'profile' | 'support';
  authMode: 'login' | 'signup' | 'reset';
  publicMessages: Message[];
  privateChats: { [userId: string]: Message[] };
  onlineUsers: User[];
  roomUsers: User[];
  totalUsers: number;
  totalOnlineUsers: number;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  privateMessageOpen: string | null;
  searchQuery: string;
  nearbyUsers: User[];
  microphoneHolder: string | null;
  microphoneQueue: string[];
  mutedMicrophone: boolean;
}

type AppAction = 
  | { type: 'SET_USER'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_PAGE'; payload: AppState['currentPage'] }
  | { type: 'SET_AUTH_MODE'; payload: AppState['authMode'] }
  | { type: 'SELECT_PROVINCE'; payload: string }
  | { type: 'SELECT_CITY'; payload: string }
  | { type: 'SELECT_ROOM'; payload: string }
  | { type: 'ADD_PUBLIC_MESSAGE'; payload: Message }
  | { type: 'ADD_PRIVATE_MESSAGE'; payload: { userId: string; message: Message } }
  | { type: 'EDIT_MESSAGE'; payload: { messageId: string; newContent: string; isPrivate?: boolean; userId?: string } }
  | { type: 'DELETE_MESSAGE'; payload: { messageId: string; isPrivate?: boolean; userId?: string } }
  | { type: 'MARK_MESSAGES_READ'; payload: { userId: string } }
  | { type: 'SET_ONLINE_USERS'; payload: User[] }
  | { type: 'SET_ROOM_USERS'; payload: User[] }
  | { type: 'TOGGLE_SOUND' }
  | { type: 'TOGGLE_NOTIFICATIONS' }
  | { type: 'OPEN_PRIVATE_MESSAGE'; payload: string }
  | { type: 'CLOSE_PRIVATE_MESSAGE' }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_NEARBY_USERS'; payload: User[] }
  | { type: 'CLEAR_CHAT_HISTORY'; payload: string }
  | { type: 'REQUEST_MICROPHONE' }
  | { type: 'RELEASE_MICROPHONE' }
  | { type: 'TOGGLE_MICROPHONE_MUTE' }
  | { type: 'SET_MICROPHONE_HOLDER'; payload: string | null };

const initialState: AppState = {
  currentUser: null,
  isAuthenticated: false,
  provinces: [
    {
      id: '1',
      name: 'تهران',
      cities: [
        { id: '1-1', name: 'تهران', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `1-1-${i + 1}`, name: `اتاق ${i + 1}`, city: 'تهران', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '1-2', name: 'کرج', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `1-2-${i + 1}`, name: `اتاق ${i + 1}`, city: 'کرج', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '1-3', name: 'ورامین', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `1-3-${i + 1}`, name: `اتاق ${i + 1}`, city: 'ورامین', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '1-4', name: 'دماوند', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `1-4-${i + 1}`, name: `اتاق ${i + 1}`, city: 'دماوند', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '1-5', name: 'شهریار', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `1-5-${i + 1}`, name: `اتاق ${i + 1}`, city: 'شهریار', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '1-6', name: 'اسلامشهر', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `1-6-${i + 1}`, name: `اتاق ${i + 1}`, city: 'اسلامشهر', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '1-7', name: 'رباط کریم', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `1-7-${i + 1}`, name: `اتاق ${i + 1}`, city: 'رباط کریم', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '1-8', name: 'پاکدشت', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `1-8-${i + 1}`, name: `اتاق ${i + 1}`, city: 'پاکدشت', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) }
      ]
    },
    {
      id: '2',
      name: 'اصفهان',
      cities: [
        { id: '2-1', name: 'اصفهان', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `2-1-${i + 1}`, name: `اتاق ${i + 1}`, city: 'اصفهان', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '2-2', name: 'کاشان', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `2-2-${i + 1}`, name: `اتاق ${i + 1}`, city: 'کاشان', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '2-3', name: 'نجف‌آباد', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `2-3-${i + 1}`, name: `اتاق ${i + 1}`, city: 'نجف‌آباد', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '2-4', name: 'خمینی‌شهر', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `2-4-${i + 1}`, name: `اتاق ${i + 1}`, city: 'خمینی‌شهر', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '2-5', name: 'شاهین‌شهر', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `2-5-${i + 1}`, name: `اتاق ${i + 1}`, city: 'شاهین‌شهر', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '2-6', name: 'گلپایگان', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `2-6-${i + 1}`, name: `اتاق ${i + 1}`, city: 'گلپایگان', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '2-7', name: 'خوانسار', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `2-7-${i + 1}`, name: `اتاق ${i + 1}`, city: 'خوانسار', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) }
      ]
    },
    {
      id: '3',
      name: 'فارس',
      cities: [
        { id: '3-1', name: 'شیراز', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `3-1-${i + 1}`, name: `اتاق ${i + 1}`, city: 'شیراز', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '3-2', name: 'مرودشت', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `3-2-${i + 1}`, name: `اتاق ${i + 1}`, city: 'مرودشت', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '3-3', name: 'کازرون', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `3-3-${i + 1}`, name: `اتاق ${i + 1}`, city: 'کازرون', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '3-4', name: 'لار', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `3-4-${i + 1}`, name: `اتاق ${i + 1}`, city: 'لار', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '3-5', name: 'فسا', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `3-5-${i + 1}`, name: `اتاق ${i + 1}`, city: 'فسا', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '3-6', name: 'داراب', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `3-6-${i + 1}`, name: `اتاق ${i + 1}`, city: 'داراب', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '3-7', name: 'جهرم', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `3-7-${i + 1}`, name: `اتاق ${i + 1}`, city: 'جهرم', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) }
      ]
    },
    {
      id: '4',
      name: 'خراسان رضوی',
      cities: [
        { id: '4-1', name: 'مشهد', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `4-1-${i + 1}`, name: `اتاق ${i + 1}`, city: 'مشهد', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '4-2', name: 'نیشابور', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `4-2-${i + 1}`, name: `اتاق ${i + 1}`, city: 'نیشابور', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '4-3', name: 'سبزوار', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `4-3-${i + 1}`, name: `اتاق ${i + 1}`, city: 'سبزوار', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '4-4', name: 'قوچان', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `4-4-${i + 1}`, name: `اتاق ${i + 1}`, city: 'قوچان', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '4-5', name: 'کاشمر', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `4-5-${i + 1}`, name: `اتاق ${i + 1}`, city: 'کاشمر', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '4-6', name: 'تربت حیدریه', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `4-6-${i + 1}`, name: `اتاق ${i + 1}`, city: 'تربت حیدریه', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) }
      ]
    },
    {
      id: '5',
      name: 'آذربایجان شرقی',
      cities: [
        { id: '5-1', name: 'تبریز', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `5-1-${i + 1}`, name: `اتاق ${i + 1}`, city: 'تبریز', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '5-2', name: 'مراغه', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `5-2-${i + 1}`, name: `اتاق ${i + 1}`, city: 'مراغه', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '5-3', name: 'میانه', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `5-3-${i + 1}`, name: `اتاق ${i + 1}`, city: 'میانه', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '5-4', name: 'اهر', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `5-4-${i + 1}`, name: `اتاق ${i + 1}`, city: 'اهر', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '5-5', name: 'بناب', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `5-5-${i + 1}`, name: `اتاق ${i + 1}`, city: 'بناب', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '5-6', name: 'ملکان', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `5-6-${i + 1}`, name: `اتاق ${i + 1}`, city: 'ملکان', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) }
      ]
    },
    {
      id: '6',
      name: 'گیلان',
      cities: [
        { id: '6-1', name: 'رشت', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `6-1-${i + 1}`, name: `اتاق ${i + 1}`, city: 'رشت', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '6-2', name: 'بندر انزلی', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `6-2-${i + 1}`, name: `اتاق ${i + 1}`, city: 'بندر انزلی', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '6-3', name: 'لاهیجان', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `6-3-${i + 1}`, name: `اتاق ${i + 1}`, city: 'لاهیجان', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '6-4', name: 'آستارا', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `6-4-${i + 1}`, name: `اتاق ${i + 1}`, city: 'آستارا', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '6-5', name: 'فومن', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `6-5-${i + 1}`, name: `اتاق ${i + 1}`, city: 'فومن', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '6-6', name: 'صومعه سرا', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `6-6-${i + 1}`, name: `اتاق ${i + 1}`, city: 'صومعه سرا', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) }
      ]
    },
    {
      id: '7',
      name: 'مازندران',
      cities: [
        { id: '7-1', name: 'ساری', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `7-1-${i + 1}`, name: `اتاق ${i + 1}`, city: 'ساری', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '7-2', name: 'بابل', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `7-2-${i + 1}`, name: `اتاق ${i + 1}`, city: 'بابل', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '7-3', name: 'آمل', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `7-3-${i + 1}`, name: `اتاق ${i + 1}`, city: 'آمل', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '7-4', name: 'قائم‌شهر', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `7-4-${i + 1}`, name: `اتاق ${i + 1}`, city: 'قائم‌شهر', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '7-5', name: 'بابلسر', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `7-5-${i + 1}`, name: `اتاق ${i + 1}`, city: 'بابلسر', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '7-6', name: 'چالوس', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `7-6-${i + 1}`, name: `اتاق ${i + 1}`, city: 'چالوس', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) }
      ]
    },
    {
      id: '8',
      name: 'خوزستان',
      cities: [
        { id: '8-1', name: 'اهواز', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `8-1-${i + 1}`, name: `اتاق ${i + 1}`, city: 'اهواز', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '8-2', name: 'آبادان', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `8-2-${i + 1}`, name: `اتاق ${i + 1}`, city: 'آبادان', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '8-3', name: 'خرمشهر', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `8-3-${i + 1}`, name: `اتاق ${i + 1}`, city: 'خرمشهر', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '8-4', name: 'دزفول', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `8-4-${i + 1}`, name: `اتاق ${i + 1}`, city: 'دزفول', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '8-5', name: 'اندیمشک', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `8-5-${i + 1}`, name: `اتاق ${i + 1}`, city: 'اندیمشک', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '8-6', name: 'ماهشهر', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `8-6-${i + 1}`, name: `اتاق ${i + 1}`, city: 'ماهشهر', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) }
      ]
    },
    {
      id: '9',
      name: 'کرمان',
      cities: [
        { id: '9-1', name: 'کرمان', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `9-1-${i + 1}`, name: `اتاق ${i + 1}`, city: 'کرمان', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '9-2', name: 'زرند', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `9-2-${i + 1}`, name: `اتاق ${i + 1}`, city: 'زرند', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '9-3', name: 'سیرجان', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `9-3-${i + 1}`, name: `اتاق ${i + 1}`, city: 'سیرجان', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '9-4', name: 'رفسنجان', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `9-4-${i + 1}`, name: `اتاق ${i + 1}`, city: 'رفسنجان', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '9-5', name: 'بم', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `9-5-${i + 1}`, name: `اتاق ${i + 1}`, city: 'بم', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '9-6', name: 'جیرفت', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `9-6-${i + 1}`, name: `اتاق ${i + 1}`, city: 'جیرفت', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) }
      ]
    },
    {
      id: '10',
      name: 'یزد',
      cities: [
        { id: '10-1', name: 'یزد', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `10-1-${i + 1}`, name: `اتاق ${i + 1}`, city: 'یزد', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '10-2', name: 'اردکان', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `10-2-${i + 1}`, name: `اتاق ${i + 1}`, city: 'اردکان', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '10-3', name: 'میبد', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `10-3-${i + 1}`, name: `اتاق ${i + 1}`, city: 'میبد', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '10-4', name: 'ابرکوه', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `10-4-${i + 1}`, name: `اتاق ${i + 1}`, city: 'ابرکوه', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) }
      ]
    },
    {
      id: '11',
      name: 'آذربایجان غربی',
      cities: [
        { id: '11-1', name: 'ارومیه', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `11-1-${i + 1}`, name: `اتاق ${i + 1}`, city: 'ارومیه', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '11-2', name: 'خوی', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `11-2-${i + 1}`, name: `اتاق ${i + 1}`, city: 'خوی', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '11-3', name: 'مهاباد', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `11-3-${i + 1}`, name: `اتاق ${i + 1}`, city: 'مهاباد', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '11-4', name: 'میاندوآب', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `11-4-${i + 1}`, name: `اتاق ${i + 1}`, city: 'میاندوآب', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) }
      ]
    },
    {
      id: '12',
      name: 'کردستان',
      cities: [
        { id: '12-1', name: 'سنندج', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `12-1-${i + 1}`, name: `اتاق ${i + 1}`, city: 'سنندج', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '12-2', name: 'سقز', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `12-2-${i + 1}`, name: `اتاق ${i + 1}`, city: 'سقز', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '12-3', name: 'مریوان', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `12-3-${i + 1}`, name: `اتاق ${i + 1}`, city: 'مریوان', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '12-4', name: 'بانه', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `12-4-${i + 1}`, name: `اتاق ${i + 1}`, city: 'بانه', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) }
      ]
    },
    {
      id: '13',
      name: 'کرمانشاه',
      cities: [
        { id: '13-1', name: 'کرمانشاه', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `13-1-${i + 1}`, name: `اتاق ${i + 1}`, city: 'کرمانشاه', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '13-2', name: 'اسلام آباد غرب', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `13-2-${i + 1}`, name: `اتاق ${i + 1}`, city: 'اسلام آباد غرب', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '13-3', name: 'کنگاور', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `13-3-${i + 1}`, name: `اتاق ${i + 1}`, city: 'کنگاور', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '13-4', name: 'هرسین', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `13-4-${i + 1}`, name: `اتاق ${i + 1}`, city: 'هرسین', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) }
      ]
    },
    {
      id: '14',
      name: 'لرستان',
      cities: [
        { id: '14-1', name: 'خرم آباد', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `14-1-${i + 1}`, name: `اتاق ${i + 1}`, city: 'خرم آباد', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '14-2', name: 'بروجرد', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `14-2-${i + 1}`, name: `اتاق ${i + 1}`, city: 'بروجرد', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '14-3', name: 'دورود', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `14-3-${i + 1}`, name: `اتاق ${i + 1}`, city: 'دورود', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '14-4', name: 'کوهدشت', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `14-4-${i + 1}`, name: `اتاق ${i + 1}`, city: 'کوهدشت', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) }
      ]
    },
    {
      id: '15',
      name: 'هرمزگان',
      cities: [
        { id: '15-1', name: 'بندر عباس', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `15-1-${i + 1}`, name: `اتاق ${i + 1}`, city: 'بندر عباس', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '15-2', name: 'کیش', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `15-2-${i + 1}`, name: `اتاق ${i + 1}`, city: 'کیش', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '15-3', name: 'قشم', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `15-3-${i + 1}`, name: `اتاق ${i + 1}`, city: 'قشم', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '15-4', name: 'بندر لنگه', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `15-4-${i + 1}`, name: `اتاق ${i + 1}`, city: 'بندر لنگه', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) }
      ]
    },
    {
      id: '16',
      name: 'سیستان و بلوچستان',
      cities: [
        { id: '16-1', name: 'زاهدان', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `16-1-${i + 1}`, name: `اتاق ${i + 1}`, city: 'زاهدان', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '16-2', name: 'چابهار', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `16-2-${i + 1}`, name: `اتاق ${i + 1}`, city: 'چابهار', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '16-3', name: 'زابل', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `16-3-${i + 1}`, name: `اتاق ${i + 1}`, city: 'زابل', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '16-4', name: 'ایرانشهر', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `16-4-${i + 1}`, name: `اتاق ${i + 1}`, city: 'ایرانشهر', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) }
      ]
    },
    {
      id: '17',
      name: 'بوشهر',
      cities: [
        { id: '17-1', name: 'بوشهر', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `17-1-${i + 1}`, name: `اتاق ${i + 1}`, city: 'بوشهر', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '17-2', name: 'برازجان', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `17-2-${i + 1}`, name: `اتاق ${i + 1}`, city: 'برازجان', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '17-3', name: 'گناوه', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `17-3-${i + 1}`, name: `اتاق ${i + 1}`, city: 'گناوه', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) }
      ]
    },
    {
      id: '18',
      name: 'همدان',
      cities: [
        { id: '18-1', name: 'همدان', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `18-1-${i + 1}`, name: `اتاق ${i + 1}`, city: 'همدان', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '18-2', name: 'ملایر', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `18-2-${i + 1}`, name: `اتاق ${i + 1}`, city: 'ملایر', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '18-3', name: 'نهاوند', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `18-3-${i + 1}`, name: `اتاق ${i + 1}`, city: 'نهاوند', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) }
      ]
    },
    {
      id: '19',
      name: 'زنجان',
      cities: [
        { id: '19-1', name: 'زنجان', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `19-1-${i + 1}`, name: `اتاق ${i + 1}`, city: 'زنجان', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '19-2', name: 'ابهر', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `19-2-${i + 1}`, name: `اتاق ${i + 1}`, city: 'ابهر', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '19-3', name: 'خدابنده', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `19-3-${i + 1}`, name: `اتاق ${i + 1}`, city: 'خدابنده', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) }
      ]
    },
    {
      id: '20',
      name: 'سمنان',
      cities: [
        { id: '20-1', name: 'سمنان', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `20-1-${i + 1}`, name: `اتاق ${i + 1}`, city: 'سمنان', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '20-2', name: 'شاهرود', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `20-2-${i + 1}`, name: `اتاق ${i + 1}`, city: 'شاهرود', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '20-3', name: 'گرمسار', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `20-3-${i + 1}`, name: `اتاق ${i + 1}`, city: 'گرمسار', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) }
      ]
    },
    {
      id: '21',
      name: 'قزوین',
      cities: [
        { id: '21-1', name: 'قزوین', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `21-1-${i + 1}`, name: `اتاق ${i + 1}`, city: 'قزوین', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '21-2', name: 'تاکستان', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `21-2-${i + 1}`, name: `اتاق ${i + 1}`, city: 'تاکستان', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) }
      ]
    },
    {
      id: '22',
      name: 'قم',
      cities: [
        { id: '22-1', name: 'قم', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `22-1-${i + 1}`, name: `اتاق ${i + 1}`, city: 'قم', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) }
      ]
    },
    {
      id: '23',
      name: 'مرکزی',
      cities: [
        { id: '23-1', name: 'اراک', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `23-1-${i + 1}`, name: `اتاق ${i + 1}`, city: 'اراک', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '23-2', name: 'خمین', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `23-2-${i + 1}`, name: `اتاق ${i + 1}`, city: 'خمین', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '23-3', name: 'ساوه', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `23-3-${i + 1}`, name: `اتاق ${i + 1}`, city: 'ساوه', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) }
      ]
    },
    {
      id: '24',
      name: 'ایلام',
      cities: [
        { id: '24-1', name: 'ایلام', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `24-1-${i + 1}`, name: `اتاق ${i + 1}`, city: 'ایلام', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '24-2', name: 'دهلران', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `24-2-${i + 1}`, name: `اتاق ${i + 1}`, city: 'دهلران', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) }
      ]
    },
    {
      id: '25',
      name: 'کهگیلویه و بویراحمد',
      cities: [
        { id: '25-1', name: 'یاسوج', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `25-1-${i + 1}`, name: `اتاق ${i + 1}`, city: 'یاسوج', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '25-2', name: 'گچساران', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `25-2-${i + 1}`, name: `اتاق ${i + 1}`, city: 'گچساران', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) }
      ]
    },
    {
      id: '26',
      name: 'چهارمحال و بختیاری',
      cities: [
        { id: '26-1', name: 'شهرکرد', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `26-1-${i + 1}`, name: `اتاق ${i + 1}`, city: 'شهرکرد', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '26-2', name: 'بروجن', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `26-2-${i + 1}`, name: `اتاق ${i + 1}`, city: 'بروجن', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) }
      ]
    },
    {
      id: '27',
      name: 'گلستان',
      cities: [
        { id: '27-1', name: 'گرگان', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `27-1-${i + 1}`, name: `اتاق ${i + 1}`, city: 'گرگان', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '27-2', name: 'آق قلا', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `27-2-${i + 1}`, name: `اتاق ${i + 1}`, city: 'آق قلا', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '27-3', name: 'گنبد کاووس', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `27-3-${i + 1}`, name: `اتاق ${i + 1}`, city: 'گنبد کاووس', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) }
      ]
    },
    {
      id: '28',
      name: 'خراسان شمالی',
      cities: [
        { id: '28-1', name: 'بجنورد', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `28-1-${i + 1}`, name: `اتاق ${i + 1}`, city: 'بجنورد', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '28-2', name: 'شیروان', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `28-2-${i + 1}`, name: `اتاق ${i + 1}`, city: 'شیروان', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) }
      ]
    },
    {
      id: '29',
      name: 'خراسان جنوبی',
      cities: [
        { id: '29-1', name: 'بیرجند', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `29-1-${i + 1}`, name: `اتاق ${i + 1}`, city: 'بیرجند', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '29-2', name: 'قائن', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `29-2-${i + 1}`, name: `اتاق ${i + 1}`, city: 'قائن', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) }
      ]
    },
    {
      id: '30',
      name: 'اردبیل',
      cities: [
        { id: '30-1', name: 'اردبیل', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `30-1-${i + 1}`, name: `اتاق ${i + 1}`, city: 'اردبیل', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '30-2', name: 'پارس آباد', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `30-2-${i + 1}`, name: `اتاق ${i + 1}`, city: 'پارس آباد', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '30-3', name: 'خلخال', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `30-3-${i + 1}`, name: `اتاق ${i + 1}`, city: 'خلخال', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) }
      ]
    },
    {
      id: '31',
      name: 'البرز',
      cities: [
        { id: '31-1', name: 'کرج', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `31-1-${i + 1}`, name: `اتاق ${i + 1}`, city: 'کرج', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '31-2', name: 'فردیس', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `31-2-${i + 1}`, name: `اتاق ${i + 1}`, city: 'فردیس', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) },
        { id: '31-3', name: 'نظرآباد', rooms: Array.from({ length: 20 }, (_, i) => ({ id: `31-3-${i + 1}`, name: `اتاق ${i + 1}`, city: 'نظرآباد', userCount: Math.floor(Math.random() * 100), maxUsers: 100 })) }
      ]
    }
  ],
  selectedProvince: null,
  selectedCity: null,
  selectedRoom: null,
  currentPage: 'auth',
  authMode: 'login',
  publicMessages: [],
  privateChats: {},
  onlineUsers: [],
  roomUsers: [],
  totalUsers: 12847,
  totalOnlineUsers: 1532,
  soundEnabled: true,
  notificationsEnabled: true,
  privateMessageOpen: null,
  searchQuery: '',
  nearbyUsers: [],
  microphoneHolder: null,
  microphoneQueue: [],
  mutedMicrophone: false
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        currentUser: action.payload,
        isAuthenticated: true
      };
    case 'LOGOUT':
      return {
        ...state,
        currentUser: null,
        isAuthenticated: false,
        currentPage: 'auth',
        selectedProvince: null,
        selectedCity: null,
        selectedRoom: null,
        publicMessages: [],
        privateChats: {},
        privateMessageOpen: null
      };
    case 'SET_PAGE':
      return {
        ...state,
        currentPage: action.payload
      };
    case 'SET_AUTH_MODE':
      return {
        ...state,
        authMode: action.payload
      };
    case 'SELECT_PROVINCE':
      return {
        ...state,
        selectedProvince: action.payload,
        selectedCity: null,
        selectedRoom: null
      };
    case 'SELECT_CITY':
      return {
        ...state,
        selectedCity: action.payload,
        selectedRoom: null
      };
    case 'SELECT_ROOM':
      return {
        ...state,
        selectedRoom: action.payload,
        currentPage: 'chat'
      };
    case 'ADD_PUBLIC_MESSAGE':
      return {
        ...state,
        publicMessages: [...state.publicMessages, action.payload]
      };
    case 'ADD_PRIVATE_MESSAGE':
      const { userId, message } = action.payload;
      return {
        ...state,
        privateChats: {
          ...state.privateChats,
          [userId]: [...(state.privateChats[userId] || []), message]
        }
      };
    case 'EDIT_MESSAGE':
      if (action.payload.isPrivate && action.payload.userId) {
        return {
          ...state,
          privateChats: {
            ...state.privateChats,
            [action.payload.userId]: state.privateChats[action.payload.userId]?.map(msg =>
              msg.id === action.payload.messageId
                ? { ...msg, content: action.payload.newContent, isEdited: true }
                : msg
            ) || []
          }
        };
      } else {
        return {
          ...state,
          publicMessages: state.publicMessages.map(msg =>
            msg.id === action.payload.messageId
              ? { ...msg, content: action.payload.newContent, isEdited: true }
              : msg
          )
        };
      }
    case 'DELETE_MESSAGE':
      if (action.payload.isPrivate && action.payload.userId) {
        return {
          ...state,
          privateChats: {
            ...state.privateChats,
            [action.payload.userId]: state.privateChats[action.payload.userId]?.filter(msg =>
              msg.id !== action.payload.messageId
            ) || []
          }
        };
      } else {
        return {
          ...state,
          publicMessages: state.publicMessages.filter(msg => msg.id !== action.payload.messageId)
        };
      }
    case 'MARK_MESSAGES_READ':
      return {
        ...state,
        privateChats: {
          ...state.privateChats,
          [action.payload.userId]: state.privateChats[action.payload.userId]?.map(msg => ({ ...msg, isRead: true })) || []
        }
      };
    case 'SET_ONLINE_USERS':
      return {
        ...state,
        onlineUsers: action.payload,
        totalOnlineUsers: action.payload.length
      };
    case 'SET_ROOM_USERS':
      return {
        ...state,
        roomUsers: action.payload
      };
    case 'TOGGLE_SOUND':
      return {
        ...state,
        soundEnabled: !state.soundEnabled
      };
    case 'TOGGLE_NOTIFICATIONS':
      return {
        ...state,
        notificationsEnabled: !state.notificationsEnabled
      };
    case 'OPEN_PRIVATE_MESSAGE':
      return {
        ...state,
        privateMessageOpen: action.payload
      };
    case 'CLOSE_PRIVATE_MESSAGE':
      return {
        ...state,
        privateMessageOpen: null
      };
    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.payload
      };
    case 'SET_NEARBY_USERS':
      return {
        ...state,
        nearbyUsers: action.payload
      };
    case 'CLEAR_CHAT_HISTORY':
      return {
        ...state,
        privateChats: {
          ...state.privateChats,
          [action.payload]: []
        }
      };
    case 'REQUEST_MICROPHONE':
      if (!state.currentUser || state.microphoneHolder) return state;
      return {
        ...state,
        microphoneHolder: state.currentUser.id
      };
    case 'RELEASE_MICROPHONE':
      return {
        ...state,
        microphoneHolder: null
      };
    case 'TOGGLE_MICROPHONE_MUTE':
      return {
        ...state,
        mutedMicrophone: !state.mutedMicrophone
      };
    case 'SET_MICROPHONE_HOLDER':
      return {
        ...state,
        microphoneHolder: action.payload
      };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}