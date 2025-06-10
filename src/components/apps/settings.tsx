'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useOSStore, gradientPresets } from '@/lib/stores/os-store';
import { 
  Monitor, 
  Volume2, 
  Wifi, 
  Bluetooth, 
  Moon, 
  Palette,
  Image,
  Shield,
  Bell,
  User,
  Info,
  Sparkles,
  Upload,
  Check,
  X
} from 'lucide-react';

export function Settings() {
  const { 
    systemState, 
    toggleTheme, 
    setVolume, 
    setBrightness, 
    toggleWifi, 
    toggleBluetooth,
    backgroundImage,
    setBackgroundImage,
    accentHue,
    setAccentHue,
    notifications,
    addNotification,
    gradientPreset,
    customGradient,
    setGradientPreset,
    setCustomGradient,
    getGradientStyle
  } = useOSStore();
  
  const [wallpaperUrl, setWallpaperUrl] = useState(backgroundImage || '');
  const [customFromColor, setCustomFromColor] = useState(customGradient.from);
  const [customToColor, setCustomToColor] = useState(customGradient.to);
  const [wallpaperType, setWallpaperType] = useState<'gradient' | 'image'>(backgroundImage ? 'image' : 'gradient');
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleWallpaperChange = () => {
    if (wallpaperType === 'image' && wallpaperUrl) {
      setBackgroundImage(wallpaperUrl);
      addNotification({
        title: 'Settings',
        message: 'Wallpaper updated successfully',
        type: 'info'
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadError(null);
    
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('File size must be less than 5MB');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        setUploadError('Please select an image file');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setWallpaperUrl(result);
        setBackgroundImage(result);
        setWallpaperType('image');
        addNotification({
          title: 'Settings',
          message: 'Image uploaded successfully',
          type: 'success'
        });
      };
      reader.onerror = () => {
        setUploadError('Failed to read file');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCustomGradientChange = () => {
    setCustomGradient({
      from: customFromColor,
      to: customToColor,
      direction: 'to bottom right'
    });
    addNotification({
      title: 'Settings',
      message: 'Custom gradient applied',
      type: 'info'
    });
  };

  return (
    <div className="h-full flex flex-col bg-background/95 backdrop-blur-sm">
      <Tabs defaultValue="system" className="flex-1 flex flex-col">
        <div className="border-b">
          <div className="px-4 pt-4 pb-2">
            <h1 className="text-xl font-bold">Settings</h1>
            <p className="text-sm text-muted-foreground">Manage your system preferences</p>
          </div>
          <div className="px-4">
            <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-muted/30 backdrop-blur-sm">
              <TabsTrigger 
                value="system" 
                className="data-[state=active]:bg-background data-[state=active]:shadow-md data-[state=active]:text-foreground 
                          flex flex-col gap-1.5 h-auto py-3 px-2 transition-all duration-200
                          hover:bg-background/50 data-[state=inactive]:text-muted-foreground
                          data-[state=active]:border-b-2 data-[state=active]:border-[var(--system-accent)]"
              >
                <Moon className="h-4 w-4 transition-colors" />
                <span className="text-xs font-medium">System</span>
              </TabsTrigger>
              <TabsTrigger 
                value="display"
                className="data-[state=active]:bg-background data-[state=active]:shadow-md data-[state=active]:text-foreground 
                          flex flex-col gap-1.5 h-auto py-3 px-2 transition-all duration-200
                          hover:bg-background/50 data-[state=inactive]:text-muted-foreground
                          data-[state=active]:border-b-2 data-[state=active]:border-[var(--system-accent)]"
              >
                <Monitor className="h-4 w-4 transition-colors" />
                <span className="text-xs font-medium">Display</span>
              </TabsTrigger>
              <TabsTrigger 
                value="network"
                className="data-[state=active]:bg-background data-[state=active]:shadow-md data-[state=active]:text-foreground 
                          flex flex-col gap-1.5 h-auto py-3 px-2 transition-all duration-200
                          hover:bg-background/50 data-[state=inactive]:text-muted-foreground
                          data-[state=active]:border-b-2 data-[state=active]:border-[var(--system-accent)]"
              >
                <Wifi className="h-4 w-4 transition-colors" />
                <span className="text-xs font-medium">Network</span>
              </TabsTrigger>
              <TabsTrigger 
                value="notifications"
                className="data-[state=active]:bg-background data-[state=active]:shadow-md data-[state=active]:text-foreground 
                          flex flex-col gap-1.5 h-auto py-3 px-2 transition-all duration-200
                          hover:bg-background/50 data-[state=inactive]:text-muted-foreground
                          data-[state=active]:border-b-2 data-[state=active]:border-[var(--system-accent)]"
              >
                <Bell className="h-4 w-4 transition-colors" />
                <span className="text-xs font-medium">Notifications</span>
              </TabsTrigger>
              <TabsTrigger 
                value="about"
                className="data-[state=active]:bg-background data-[state=active]:shadow-md data-[state=active]:text-foreground 
                          flex flex-col gap-1.5 h-auto py-3 px-2 transition-all duration-200
                          hover:bg-background/50 data-[state=inactive]:text-muted-foreground
                          data-[state=active]:border-b-2 data-[state=active]:border-[var(--system-accent)]"
              >
                <Info className="h-4 w-4 transition-colors" />
                <span className="text-xs font-medium">About</span>
              </TabsTrigger>
            </TabsList>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto scrollbar-glass p-4">
          <div className="max-w-4xl mx-auto">
            <TabsContent value="system" className="mt-0 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Moon className="h-5 w-5" />
                    Appearance
                  </CardTitle>
                  <CardDescription>
                    Customize how your system looks
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="theme">Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Toggle between light and dark theme
                      </p>
                    </div>
                    <Switch
                      id="theme"
                      checked={systemState.theme === 'dark'}
                      onCheckedChange={toggleTheme}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="accent">Accent Color</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        id="accent"
                        min={0}
                        max={360}
                        step={1}
                        value={[accentHue]}
                        onValueChange={([value]) => setAccentHue(value)}
                        className="flex-1"
                      />
                      <div 
                        className="w-10 h-10 rounded-lg border"
                        style={{ backgroundColor: `hsl(${accentHue}, 70%, 50%)` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Gradient Theme
                  </CardTitle>
                  <CardDescription>
                    Choose a gradient theme for your desktop
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {gradientPresets.filter(p => p.id !== 'custom').map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => {
                          setGradientPreset(preset.id);
                          if (wallpaperType === 'gradient') {
                            setBackgroundImage(null);
                          }
                        }}
                        className={`relative h-24 rounded-lg overflow-hidden transition-all hover:scale-105 ${
                          gradientPreset === preset.id ? 'ring-2 ring-offset-2 ring-[var(--system-accent)]' : ''
                        }`}
                        style={{
                          background: `linear-gradient(${preset.direction}, ${preset.from}, ${preset.to})`
                        }}
                      >
                        <span className="absolute inset-x-0 bottom-0 p-2 bg-black/50 backdrop-blur-sm">
                          <span className="text-white text-xs font-medium">
                            {preset.name}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Palette className="h-4 w-4" />
                        Custom Gradient
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="from-color" className="text-sm">From Color</Label>
                          <div className="flex gap-2 mt-1">
                            <Input
                              id="from-color"
                              type="color"
                              value={customFromColor}
                              onChange={(e) => setCustomFromColor(e.target.value)}
                              className="w-14 h-9 p-1 cursor-pointer"
                            />
                            <Input
                              type="text"
                              value={customFromColor}
                              onChange={(e) => setCustomFromColor(e.target.value)}
                              className="flex-1 h-9"
                              placeholder="#000000"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="to-color" className="text-sm">To Color</Label>
                          <div className="flex gap-2 mt-1">
                            <Input
                              id="to-color"
                              type="color"
                              value={customToColor}
                              onChange={(e) => setCustomToColor(e.target.value)}
                              className="w-14 h-9 p-1 cursor-pointer"
                            />
                            <Input
                              type="text"
                              value={customToColor}
                              onChange={(e) => setCustomToColor(e.target.value)}
                              className="flex-1 h-9"
                              placeholder="#ffffff"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 items-center">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={handleCustomGradientChange}
                        >
                          Apply Custom Gradient
                        </Button>
                        <div 
                          className="w-24 h-9 rounded-md border"
                          style={{
                            background: `linear-gradient(to right, ${customFromColor}, ${customToColor})`
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Volume2 className="h-5 w-5" />
                    Sound
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="volume">System Volume</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        id="volume"
                        min={0}
                        max={100}
                        step={1}
                        value={[systemState.volume]}
                        onValueChange={([value]) => setVolume(value)}
                        className="flex-1"
                      />
                      <span className="w-12 text-sm text-right font-medium">{systemState.volume}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="display" className="mt-0 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="h-5 w-5" />
                    Display Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="brightness">Brightness</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        id="brightness"
                        min={0}
                        max={100}
                        step={1}
                        value={[systemState.brightness]}
                        onValueChange={([value]) => setBrightness(value)}
                        className="flex-1"
                      />
                      <span className="w-12 text-sm text-right font-medium">{systemState.brightness}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="h-5 w-5" />
                    Wallpaper
                  </CardTitle>
                  <CardDescription>
                    Choose between gradient or image wallpaper
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Button
                      variant={wallpaperType === 'gradient' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setWallpaperType('gradient');
                        setBackgroundImage(null);
                      }}
                    >
                      Use Gradient
                    </Button>
                    <Button
                      variant={wallpaperType === 'image' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setWallpaperType('image')}
                    >
                      Use Image
                    </Button>
                  </div>
                  
                  {wallpaperType === 'gradient' ? (
                    <Card>
                      <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground mb-3">
                          The selected gradient theme will be used as your wallpaper
                        </p>
                        <div 
                          className="w-full h-40 rounded-lg border"
                          style={{ background: getGradientStyle() }}
                        />
                      </CardContent>
                    </Card>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="wallpaper">Background Image URL</Label>
                        <div className="flex gap-2">
                          <Input
                            id="wallpaper"
                            type="url"
                            placeholder="https://example.com/image.jpg"
                            value={wallpaperUrl}
                            onChange={(e) => setWallpaperUrl(e.target.value)}
                          />
                          <Button 
                            onClick={handleWallpaperChange}
                            disabled={!wallpaperUrl}
                          >
                            Apply
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="upload">Or upload an image</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="upload"
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                          <Button
                            variant="outline"
                            onClick={() => document.getElementById('upload')?.click()}
                            className="gap-2"
                          >
                            <Upload className="h-4 w-4" />
                            Choose File
                          </Button>
                          <span className="text-sm text-muted-foreground">
                            Max 5MB, JPG/PNG/GIF
                          </span>
                        </div>
                        {uploadError && (
                          <p className="text-sm text-destructive flex items-center gap-1">
                            <X className="h-3 w-3" />
                            {uploadError}
                          </p>
                        )}
                      </div>
                      
                      {backgroundImage && (
                        <Card>
                          <CardContent className="pt-6">
                            <p className="text-sm text-muted-foreground mb-2">Current wallpaper:</p>
                            <div 
                              className="w-full h-40 rounded-lg bg-cover bg-center border"
                              style={{ backgroundImage: `url(${backgroundImage})` }}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2"
                              onClick={() => {
                                setBackgroundImage(null);
                                setWallpaperUrl('');
                                setWallpaperType('gradient');
                              }}
                            >
                              Remove Wallpaper
                            </Button>
                          </CardContent>
                        </Card>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="network" className="mt-0 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wifi className="h-5 w-5" />
                    Network Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-0.5">
                      <Label htmlFor="wifi" className="text-base">Wi-Fi</Label>
                      <p className="text-sm text-muted-foreground">
                        {systemState.wifi ? 'Connected to network' : 'Not connected'}
                      </p>
                    </div>
                    <Switch
                      id="wifi"
                      checked={systemState.wifi}
                      onCheckedChange={toggleWifi}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-0.5">
                      <Label htmlFor="bluetooth" className="text-base">Bluetooth</Label>
                      <p className="text-sm text-muted-foreground">
                        {systemState.bluetooth ? 'Enabled' : 'Disabled'}
                      </p>
                    </div>
                    <Switch
                      id="bluetooth"
                      checked={systemState.bluetooth}
                      onCheckedChange={toggleBluetooth}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications" className="mt-0 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          You have {notifications.filter(n => !n.read).length} unread notifications
                        </p>
                      </div>
                    </div>
                    {notifications.filter(n => !n.read).length > 0 && (
                      <div className="h-2 w-2 bg-red-500 rounded-full" />
                    )}
                  </div>
                  
                  <Button 
                    variant="outline"
                    onClick={() => {
                      addNotification({
                        title: 'Test Notification',
                        message: 'This is a test notification from Settings',
                        type: 'info'
                      });
                    }}
                    className="w-full"
                  >
                    Send Test Notification
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="about" className="mt-0 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    About This System
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { label: 'System Name', value: 'Portfolio OS' },
                      { label: 'Version', value: '1.0.0' },
                      { label: 'Developer', value: 'Ahsan Nayaz' },
                      { label: 'Framework', value: 'Next.js 15 + React 19' },
                      { label: 'UI Library', value: 'Shadcn UI + Tailwind CSS' },
                      { label: 'State Management', value: 'Zustand' },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between py-2 border-b last:border-0">
                        <span className="text-muted-foreground">{label}</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Card className="mt-4 bg-muted/50">
                    <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground">
                        This is an interactive portfolio designed to showcase my skills and projects
                        through an OS-like interface. Built with modern web technologies and 
                        featuring a glassmorphic design system with dynamic theming.
                      </p>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
} 