import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { 
  Paperclip, 
  Image, 
  Camera, 
  Video, 
  Smile, 
  Upload,
  X 
} from 'lucide-react';
import { motion } from 'motion/react';

interface MediaAttachmentProps {
  onAttach: (type: 'image' | 'file' | 'sticker' | 'camera', data: any) => void;
  disabled?: boolean;
}

const stickers = [
  '😀', '😃', '😄', '😁', '😊', '😇', '🙂', '🙃', '😉', '😌',
  '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜',
  '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞',
  '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺',
  '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶',
  '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤐',
  '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲',
  '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧',
  '😷', '🤒', '🤕', '🤑', '🤠', '😈', '👿', '👹', '👺', '🤡',
  '💩', '👻', '💀', '☠️', '👽', '👾', '🤖', '🎃', '😺', '😸',
  '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '❤️', '🧡', '💛',
  '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💖',
  '💗', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️'
];

export function MediaAttachment({ onAttach, disabled = false }: MediaAttachmentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const handleFileUpload = (type: 'file' | 'image') => {
    const input = type === 'file' ? fileInputRef.current : imageInputRef.current;
    if (input) {
      input.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'file' | 'image') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onAttach(type, {
          file,
          url: event.target?.result,
          name: file.name,
          size: file.size
        });
        setIsOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStickerSelect = (sticker: string) => {
    onAttach('sticker', { emoji: sticker });
    setIsOpen(false);
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: false 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('دسترسی به دوربین مقدور نیست');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && stream) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            onAttach('camera', {
              blob,
              url: canvas.toDataURL('image/png'),
              name: `camera-${Date.now()}.png`
            });
            stopCamera();
            setIsOpen(false);
          }
        });
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsRecording(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={disabled}
            className="p-2"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="center-text">پیوست رسانه</DialogTitle>
            <DialogDescription className="center-text">
              فایل، تصویر، استیکر یا عکس انتخاب کنید
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="file" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="file">فایل</TabsTrigger>
              <TabsTrigger value="image">تصویر</TabsTrigger>
              <TabsTrigger value="sticker">استیکر</TabsTrigger>
              <TabsTrigger value="camera">دوربین</TabsTrigger>
            </TabsList>

            <TabsContent value="file" className="space-y-4">
              <div className="text-center py-8">
                <Upload className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="mb-2">انتخاب فایل</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  اسناد، PDF، فایل‌های صوتی و ویدیو
                </p>
                <Button onClick={() => handleFileUpload('file')}>
                  <Upload className="h-4 w-4 ml-2" />
                  انتخاب فایل
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, 'file')}
                  accept=".pdf,.doc,.docx,.txt,.mp3,.mp4,.avi,.mov"
                />
              </div>
            </TabsContent>

            <TabsContent value="image" className="space-y-4">
              <div className="text-center py-8">
                <Image className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="mb-2">انتخاب تصویر</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  JPG، PNG، GIF و سایر فرمت‌های تصویر
                </p>
                <Button onClick={() => handleFileUpload('image')}>
                  <Image className="h-4 w-4 ml-2" />
                  انتخاب تصویر
                </Button>
                <input
                  ref={imageInputRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, 'image')}
                  accept="image/*"
                />
              </div>
            </TabsContent>

            <TabsContent value="sticker" className="space-y-4">
              <div className="max-h-64 overflow-y-auto">
                <div className="grid grid-cols-8 gap-2 p-4">
                  {stickers.map((sticker, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleStickerSelect(sticker)}
                      className="text-2xl p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {sticker}
                    </motion.button>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="camera" className="space-y-4">
              <div className="text-center">
                {!isRecording ? (
                  <div className="py-8">
                    <Camera className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="mb-2">دوربین</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      با دوربین خود عکس بگیرید
                    </p>
                    <Button onClick={startCamera}>
                      <Camera className="h-4 w-4 ml-2" />
                      باز کردن دوربین
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative bg-black rounded-lg overflow-hidden">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-64 object-cover"
                      />
                    </div>
                    <div className="flex gap-2 justify-center">
                      <Button onClick={capturePhoto} className="bg-purple-600 hover:bg-purple-700">
                        <Camera className="h-4 w-4 ml-2" />
                        عکس بگیرید
                      </Button>
                      <Button variant="outline" onClick={stopCamera}>
                        <X className="h-4 w-4 ml-2" />
                        لغو
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}