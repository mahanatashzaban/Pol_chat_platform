import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { useAppContext } from '../context/AppContext';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';
import { BridgeLogo } from './BridgeLogo';
import { formatPersianNumber } from '../utils/persian';

// API base URL
const API_BASE_URL = '/api';

export function AuthPage() {
  const { state, dispatch } = useAppContext();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    termsAccepted: false
  });
  const [isAwake, setIsAwake] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'خطا در ورود');
      }

      setIsAwake(true);
      
      // Save token to localStorage
      localStorage.setItem('token', data.token);
      
      // Update user state
      dispatch({ type: 'SET_USER', payload: data.user });
      dispatch({ type: 'SET_PAGE', payload: 'location' });

    } catch (error: any) {
      setError(error.message);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('رمز عبور و تأیید رمز عبور مطابقت ندارند');
      return;
    }
    
    if (!formData.termsAccepted) {
      alert('لطفاً شرایط و ضوابط را مطالعه کرده و پذیرفته باشید');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          fullName: formData.fullName,
          termsAccepted: formData.termsAccepted
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'خطا در ثبت نام');
      }

      setIsAwake(true);
      
      // Save token to localStorage
      localStorage.setItem('token', data.token);
      
      // Update user state
      dispatch({ type: 'SET_USER', payload: data.user });
      dispatch({ type: 'SET_PAGE', payload: 'location' });

    } catch (error: any) {
      setError(error.message);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'خطا در بازیابی رمز عبور');
      }

      alert('لینک بازیابی رمز عبور به ایمیل شما ارسال شد');
      dispatch({ type: 'SET_AUTH_MODE', payload: 'login' });

    } catch (error: any) {
      alert(error.message);
    }
  };

  const isPasswordStrong = (password: string) => {
    return password.length >= 8 && 
           /[A-Z]/.test(password) && 
           /[a-z]/.test(password) && 
           /[0-9]/.test(password) && 
           /[!@#$%^&*]/.test(password);
  };

  // Fetch stats on component mount
  // In your AuthPage.tsx, replace the useEffect with:
React.useEffect(() => {
  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/stats`);
      const data = await response.json();
      
      if (response.ok) {
        // Update local state instead of context
        // You can set state for stats or just use the data directly
        console.log('Stats:', data);
        // If you want to display stats, you might need to add local state for them
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  fetchStats();
}, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 p-4">
      <div className="w-full max-w-md">
        <motion.div 
          className="text-center mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={isAwake ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : { y: [0, -5, 0] }}
            transition={{ duration: isAwake ? 0.6 : 2, repeat: isAwake ? 0 : Infinity }}
            className="inline-block mb-4"
          >
            <BridgeLogo size={100} className="drop-shadow-2xl" />
          </motion.div>
          <h1 className="text-3xl lg:text-4xl font-bold center-text mb-2 bg-gradient-to-r from-[#9933CC] to-[#CC33FF] bg-clip-text text-transparent">پل</h1>
          <p className="text-muted-foreground center-text text-base lg:text-lg">
            {isAwake ? 'خوش آمدید! 🎉' : 'پلتفرم دوستانه گفت‌وگوی آنلاین'}
          </p>
        </motion.div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-right">
            {error}
          </div>
        )}

        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-lg rounded-2xl overflow-hidden">
          <CardHeader className="text-center pb-4 bg-gradient-to-r from-purple-50 to-pink-50">
            <CardTitle className="text-right text-purple-700 text-lg lg:text-xl">
              {state.authMode === 'login' && 'ورود به پل'}
              {state.authMode === 'signup' && 'عضویت در پل'}
              {state.authMode === 'reset' && 'بازیابی رمز عبور'}
            </CardTitle>
            <CardDescription className="text-right text-gray-600 text-sm lg:text-base">
              {state.authMode === 'login' && 'برای ورود اطلاعات خود را وارد کنید'}
              {state.authMode === 'signup' && 'برای عضویت فرم زیر را تکمیل کنید'}
              {state.authMode === 'reset' && 'ایمیل خود را برای دریافت لینک بازیابی وارد کنید'}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 lg:p-6">
            <Tabs value={state.authMode} onValueChange={(value) => dispatch({ type: 'SET_AUTH_MODE', payload: value as any })}>
              <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-100 rounded-xl p-1">
                <TabsTrigger value="login" className="rounded-lg font-medium">ورود</TabsTrigger>
                <TabsTrigger value="signup" className="rounded-lg font-medium">ثبت نام</TabsTrigger>
                <TabsTrigger value="reset" className="rounded-lg font-medium">فراموشی</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-right block font-medium text-gray-700">ایمیل</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="نشانی ایمیل خود را وارد کنید"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="text-right bg-gray-50 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder:text-right"
                      dir="rtl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-right block font-medium text-gray-700">رمز عبور</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="رمز عبور خود را وارد کنید"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                        className="pr-10 text-right bg-gray-50 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder:text-right"
                        dir="rtl"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl py-3 text-lg font-medium shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
                    disabled={isLoading}
                  >
                    {isLoading ? 'در حال ورود...' : 'ورود به پل ✨'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-right block font-medium text-gray-700">نام و نام خانوادگی</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="نام کامل خود را وارد کنید"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                      className="text-right bg-gray-50 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder:text-right"
                      dir="rtl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-signup" className="text-right block font-medium text-gray-700">ایمیل</Label>
                    <Input
                      id="email-signup"
                      type="email"
                      placeholder="نشانی ایمیل خود را وارد کنید"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="text-right bg-gray-50 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder:text-right"
                      dir="rtl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-signup" className="text-right block font-medium text-gray-700">رمز عبور</Label>
                    <div className="relative">
                      <Input
                        id="password-signup"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="رمز عبور قوی انتخاب کنید"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                        className="pr-10 text-right bg-gray-50 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder:text-right"
                        dir="rtl"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {formData.password && (
                      <div className="mt-2 text-sm text-right">
                        <span className={isPasswordStrong(formData.password) ? 'text-green-600' : 'text-red-500'}>
                          {isPasswordStrong(formData.password) ? '✓ رمز عبور قوی است' : '✗ رمز عبور باید حداقل ۸ کاراکتر شامل حروف بزرگ، کوچک، عدد و علامت باشد'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-right block font-medium text-gray-700">تأیید رمز عبور</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="رمز عبور را مجدد وارد کنید"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      required
                      className="text-right bg-gray-50 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder:text-right"
                      dir="rtl"
                    />
                  </div>
                  <div className="flex items-start space-x-2 space-x-reverse">
                    <Checkbox
                      id="terms"
                      checked={formData.termsAccepted}
                      onCheckedChange={(checked) => setFormData({ ...formData, termsAccepted: !!checked })}
                      className="mt-1"
                    />
                    <Label htmlFor="terms" className="text-sm text-right leading-relaxed">
                      <Dialog>
                        <DialogTrigger asChild>
                          <button type="button" className="text-purple-600 hover:underline font-medium">
                            شرایط و ضوابط و خط مشی حریم خصوصی
                          </button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="text-center text-xl font-bold text-purple-700">شرایط و ضوابط پل</DialogTitle>
                            <DialogDescription className="text-center">
                              لطفاً موارد زیر را با دقت مطالعه کنید
                            </DialogDescription>
                          </DialogHeader>
                          <ScrollArea className="h-96">
                            <div className="space-y-4 p-4 text-right">
                              <h3 className="text-lg font-bold text-purple-600">۱. قوانین عمومی</h3>
                              <p>• احترام به سایر کاربران الزامی است</p>
                              <p>• استفاده از کلمات نامناسب ممنوع می‌باشد</p>
                              <p>• اشتراک‌گذاری اطلاعات شخصی توصیه نمی‌شود</p>
                              
                              <h3 className="text-lg font-bold text-purple-600">۲. حریم خصوصی</h3>
                              <p>• اطلاعات شما محفوظ نگهداری می‌شود</p>
                              <p>• پیام‌های خصوصی رمزنگاری می‌شوند</p>
                              <p>• هیچ اطلاعاتی با اشخاص ثالث به اشتراک گذاشته نمی‌شود</p>
                              
                              <h3 className="text-lg font-bold text-purple-600">۳. مسئولیت کاربران</h3>
                              <p>• هر کاربر مسئول محتوای ارسالی خود است</p>
                              <p>• گزارش رفتارهای نامناسب الزامی است</p>
                              <p>• استفاده از پلتفرم برای اهداف قانونی</p>
                              
                              <h3 className="text-lg font-bold text-purple-600">۴. خط مشی امنیت</h3>
                              <p>• رمز عبور خود را در امان نگه دارید</p>
                              <p>• از حساب کاربری خود در مکان‌های عمومی خارج شوید</p>
                              <p>• موارد مشکوک را فوراً گزارش کنید</p>
                            </div>
                          </ScrollArea>
                        </DialogContent>
                      </Dialog>
                      را مطالعه کرده و می‌پذیرم
                    </Label>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl py-3 text-lg font-medium shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
                    disabled={!formData.termsAccepted || !isPasswordStrong(formData.password) || isLoading}
                  >
                    {isLoading ? 'در حال ثبت نام...' : 'عضویت در پل 🚀'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="reset">
                <form onSubmit={handlePasswordReset} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email-reset" className="text-right block font-medium text-gray-700">ایمیل</Label>
                    <Input
                      id="email-reset"
                      type="email"
                      placeholder="نشانی ایمیل خود را وارد کنید"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="text-right bg-gray-50 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder:text-right"
                      dir="rtl"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl py-3 text-lg font-medium shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
                  >
                    ارسال لینک بازیابی 📧
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="text-center text-xs lg:text-sm text-gray-600 mt-6 bg-white/50 backdrop-blur-sm rounded-lg p-3">
          پل - پلتفرم دوستانه گفت‌وگوی آنلاین 💬<br />
          <span className="text-xs">
            کل کاربران: {formatPersianNumber(state.totalUsers)} | آنلاین: {formatPersianNumber(state.totalOnlineUsers)}
          </span>
        </p>
      </div>
    </div>
  );
}