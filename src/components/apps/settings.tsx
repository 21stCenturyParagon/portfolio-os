'use client';

import { FC, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Palette, 
  Monitor, 
  Volume2, 
  Wifi, 
  Bluetooth, 
  Bell,
  ChevronLeft,
  ChevronRight,
  Upload,
  Trash2,
  Check
} from 'lucide-react';
import { useOSStore, colorPresets } from '@/lib/stores/os-store';

const Settings: FC = () => {
  const { 
    systemState, 
    toggleTheme, 
    setVolume, 
    setBrightness, 
    toggleWifi, 
    toggleBluetooth,
    colorPreset,
    primaryAccent,
    secondaryAccent,
    setColorPreset,
    setPrimaryAccent,
    setSecondaryAccent,
    backgroundImage,
    setBackgroundImage
  } = useOSStore();

  const [localPrimary, setLocalPrimary] = useState(primaryAccent);
  const [localSecondary, setLocalSecondary] = useState(secondaryAccent);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const [selectedPreset, setSelectedPreset] = useState(colorPreset);

  const handlePresetChange = (presetId: string) => {
    setSelectedPreset(presetId);
    setColorPreset(presetId);
    
    const preset = colorPresets.find(p => p.id === presetId);
    if (preset) {
      setLocalPrimary(preset.primary);
      setLocalSecondary(preset.secondary);
    }
  };

  const handleCustomColorApply = () => {
    setPrimaryAccent(localPrimary);
    setSecondaryAccent(localSecondary);
    setSelectedPreset('custom');
  };

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBackgroundFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setBackgroundImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearBackground = () => {
    setBackgroundImage(null);
    setBackgroundFile(null);
  };

  return (
    <div className="h-full bg-neutral-900/50 text-white">
      <div className="h-full flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold">Settings</h2>
          <p className="text-neutral-400 mt-1">Customize your OS experience</p>
        </div>

        <Tabs defaultValue="appearance" className="flex-1 flex flex-col">
          <TabsList className="mx-6 grid w-[calc(100%-3rem)] grid-cols-6 bg-neutral-800/50">
            <TabsTrigger value="appearance" className="data-[state=active]:bg-white/10">
              <Palette className="w-4 h-4 mr-2" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="display" className="data-[state=active]:bg-white/10">
              <Monitor className="w-4 h-4 mr-2" />
              Display
            </TabsTrigger>
            <TabsTrigger value="sound" className="data-[state=active]:bg-white/10">
              <Volume2 className="w-4 h-4 mr-2" />
              Sound
            </TabsTrigger>
            <TabsTrigger value="network" className="data-[state=active]:bg-white/10">
              <Wifi className="w-4 h-4 mr-2" />
              Network
            </TabsTrigger>
            <TabsTrigger value="bluetooth" className="data-[state=active]:bg-white/10">
              <Bluetooth className="w-4 h-4 mr-2" />
              Bluetooth
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-white/10">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto">
            <TabsContent value="appearance" className="p-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Theme</h3>
                <div className="flex items-center justify-between p-4 bg-neutral-800/50 rounded-lg">
                  <div>
                    <Label htmlFor="theme-toggle" className="text-base">Dark Mode</Label>
                    <p className="text-sm text-neutral-400">Toggle between light and dark themes</p>
                  </div>
                  <Switch
                    id="theme-toggle"
                    checked={systemState.theme === 'dark'}
                    onCheckedChange={toggleTheme}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Accent Colors</h3>
                
                {/* Color Presets */}
                <div className="space-y-2">
                  <Label>Color Themes</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {colorPresets.filter(p => p.id !== 'custom').map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => handlePresetChange(preset.id)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          selectedPreset === preset.id 
                            ? 'border-white/50 bg-white/10' 
                            : 'border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div 
                          className="h-12 rounded-md mb-2"
                          style={{
                            background: `linear-gradient(to bottom right, ${preset.primary}, ${preset.secondary})`
                          }}
                        />
                        <p className="text-sm">{preset.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Colors */}
                <div className="space-y-4 p-4 bg-neutral-800/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Custom Colors</h4>
                    {selectedPreset === 'custom' && (
                      <span className="text-xs px-2 py-1 bg-white/10 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Active
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="primary-color">Primary Accent</Label>
                      <div className="flex gap-2">
                        <div 
                          className="w-12 h-10 rounded-md border border-white/20 flex-shrink-0"
                          style={{ backgroundColor: localPrimary }}
                        />
                        <Input
                          id="primary-color"
                          type="color"
                          value={localPrimary}
                          onChange={(e) => setLocalPrimary(e.target.value)}
                          className="h-10"
                        />
                        <Input
                          type="text"
                          value={localPrimary}
                          onChange={(e) => setLocalPrimary(e.target.value)}
                          className="h-10 font-mono text-sm"
                          placeholder="#000000"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="secondary-color">Secondary Accent</Label>
                      <div className="flex gap-2">
                        <div 
                          className="w-12 h-10 rounded-md border border-white/20 flex-shrink-0"
                          style={{ backgroundColor: localSecondary }}
                        />
                        <Input
                          id="secondary-color"
                          type="color"
                          value={localSecondary}
                          onChange={(e) => setLocalSecondary(e.target.value)}
                          className="h-10"
                        />
                        <Input
                          type="text"
                          value={localSecondary}
                          onChange={(e) => setLocalSecondary(e.target.value)}
                          className="h-10 font-mono text-sm"
                          placeholder="#000000"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Preview</Label>
                    <div 
                      className="h-20 rounded-lg border border-white/20"
                      style={{
                        background: `linear-gradient(to bottom right, ${localPrimary}, ${localSecondary})`
                      }}
                    />
                  </div>

                  <Button
                    onClick={handleCustomColorApply}
                    disabled={localPrimary === primaryAccent && localSecondary === secondaryAccent}
                    className="w-full"
                    variant={selectedPreset === 'custom' ? 'default' : 'outline'}
                  >
                    Apply Custom Colors
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Background</h3>
                <div className="p-4 bg-neutral-800/50 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Desktop Background</Label>
                    {backgroundImage && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={clearBackground}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Remove
                      </Button>
                    )}
                  </div>
                  
                  {backgroundImage ? (
                    <div 
                      className="h-32 rounded-lg bg-cover bg-center bg-no-repeat border border-white/20"
                      style={{ backgroundImage: `url(${backgroundImage})` }}
                    />
                  ) : (
                    <div className="h-32 rounded-lg bg-neutral-700/50 border-2 border-dashed border-white/20 flex items-center justify-center">
                      <p className="text-neutral-400">No background image</p>
                    </div>
                  )}
                  
                  <Label htmlFor="background-upload" className="cursor-pointer">
                    <div className="flex items-center justify-center gap-2 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                      <Upload className="w-4 h-4" />
                      <span>Upload Background Image</span>
                    </div>
                    <Input
                      id="background-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleBackgroundUpload}
                      className="hidden"
                    />
                  </Label>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="display" className="p-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Display Settings</h3>
                <div className="space-y-4 p-4 bg-neutral-800/50 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="brightness">Brightness</Label>
                      <span className="text-sm text-neutral-400">{systemState.brightness}%</span>
                    </div>
                    <Slider
                      id="brightness"
                      value={[systemState.brightness]}
                      onValueChange={([value]) => setBrightness(value)}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Night Light</Label>
                    <div className="flex items-center justify-between p-3 bg-neutral-700/50 rounded-lg">
                      <span className="text-sm">Reduce blue light</span>
                      <Switch />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 p-4 bg-neutral-800/50 rounded-lg">
                  <h4 className="font-medium">Resolution</h4>
                  <select className="w-full bg-neutral-700/50 border border-white/10 rounded-lg p-2">
                    <option>1920 x 1080 (Recommended)</option>
                    <option>2560 x 1440</option>
                    <option>3840 x 2160</option>
                  </select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="sound" className="p-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Sound Settings</h3>
                <div className="space-y-4 p-4 bg-neutral-800/50 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="volume">System Volume</Label>
                      <span className="text-sm text-neutral-400">{systemState.volume}%</span>
                    </div>
                    <Slider
                      id="volume"
                      value={[systemState.volume]}
                      onValueChange={([value]) => setVolume(value)}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Sound Output</Label>
                    <select className="w-full bg-neutral-700/50 border border-white/10 rounded-lg p-2">
                      <option>Speakers (Default)</option>
                      <option>Headphones</option>
                      <option>HDMI Audio</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>Notifications Sound</Label>
                    <div className="flex items-center justify-between p-3 bg-neutral-700/50 rounded-lg">
                      <span className="text-sm">Play sound for notifications</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="network" className="p-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Network Settings</h3>
                <div className="space-y-4 p-4 bg-neutral-800/50 rounded-lg">
                  <div className="flex items-center justify-between p-3 bg-neutral-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Wifi className="w-5 h-5" />
                      <div>
                        <p className="font-medium">Wi-Fi</p>
                        <p className="text-sm text-neutral-400">
                          {systemState.wifi ? 'Connected to Network' : 'Disconnected'}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={systemState.wifi}
                      onCheckedChange={toggleWifi}
                    />
                  </div>

                  {systemState.wifi && (
                    <div className="space-y-2">
                      <Label>Available Networks</Label>
                      <div className="space-y-2">
                        <div className="p-3 bg-neutral-700/50 rounded-lg flex items-center justify-between">
                          <span>Home Network</span>
                          <span className="text-sm text-green-400">Connected</span>
                        </div>
                        <div className="p-3 bg-neutral-700/50 rounded-lg flex items-center justify-between">
                          <span>Guest Network</span>
                          <span className="text-sm text-neutral-400">Available</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="bluetooth" className="p-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Bluetooth Settings</h3>
                <div className="space-y-4 p-4 bg-neutral-800/50 rounded-lg">
                  <div className="flex items-center justify-between p-3 bg-neutral-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Bluetooth className="w-5 h-5" />
                      <div>
                        <p className="font-medium">Bluetooth</p>
                        <p className="text-sm text-neutral-400">
                          {systemState.bluetooth ? 'On' : 'Off'}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={systemState.bluetooth}
                      onCheckedChange={toggleBluetooth}
                    />
                  </div>

                  {systemState.bluetooth && (
                    <div className="space-y-2">
                      <Label>Available Devices</Label>
                      <div className="space-y-2">
                        <div className="p-3 bg-neutral-700/50 rounded-lg">
                          <p>Searching for devices...</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="p-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Notification Settings</h3>
                <div className="space-y-4 p-4 bg-neutral-800/50 rounded-lg">
                  <div className="flex items-center justify-between p-3 bg-neutral-700/50 rounded-lg">
                    <div>
                      <p className="font-medium">Show Notifications</p>
                      <p className="text-sm text-neutral-400">Display system and app notifications</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-neutral-700/50 rounded-lg">
                    <div>
                      <p className="font-medium">Do Not Disturb</p>
                      <p className="text-sm text-neutral-400">Silence all notifications</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="space-y-2">
                    <Label>Notification Position</Label>
                    <select className="w-full bg-neutral-700/50 border border-white/10 rounded-lg p-2">
                      <option>Top Right</option>
                      <option>Top Left</option>
                      <option>Bottom Right</option>
                      <option>Bottom Left</option>
                    </select>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings; 