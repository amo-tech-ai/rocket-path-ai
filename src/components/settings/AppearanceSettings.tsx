import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Palette, Monitor, Moon, Sun, Type, Layout, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function AppearanceSettings() {
  const { toast } = useToast();
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [fontSize, setFontSize] = useState([16]);
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate save - in production, this would update profiles.preferences
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Apply theme
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }

    setIsSaving(false);
    toast({
      title: "Appearance updated",
      description: "Your preferences have been saved.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Appearance
        </CardTitle>
        <CardDescription>
          Customize how StartupAI looks and feels
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Theme Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Theme</Label>
          <RadioGroup
            value={theme}
            onValueChange={(value) => setTheme(value as 'light' | 'dark' | 'system')}
            className="grid grid-cols-3 gap-3"
          >
            <Label
              htmlFor="theme-light"
              className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                theme === 'light' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
              }`}
            >
              <RadioGroupItem value="light" id="theme-light" className="sr-only" />
              <Sun className="w-5 h-5" />
              <span className="text-sm">Light</span>
              {theme === 'light' && <Check className="w-4 h-4 text-primary" />}
            </Label>
            <Label
              htmlFor="theme-dark"
              className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                theme === 'dark' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
              }`}
            >
              <RadioGroupItem value="dark" id="theme-dark" className="sr-only" />
              <Moon className="w-5 h-5" />
              <span className="text-sm">Dark</span>
              {theme === 'dark' && <Check className="w-4 h-4 text-primary" />}
            </Label>
            <Label
              htmlFor="theme-system"
              className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                theme === 'system' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
              }`}
            >
              <RadioGroupItem value="system" id="theme-system" className="sr-only" />
              <Monitor className="w-5 h-5" />
              <span className="text-sm">System</span>
              {theme === 'system' && <Check className="w-4 h-4 text-primary" />}
            </Label>
          </RadioGroup>
        </div>

        {/* Font Size */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Type className="w-4 h-4" />
              Font Size
            </Label>
            <span className="text-sm text-muted-foreground">{fontSize[0]}px</span>
          </div>
          <Slider
            value={fontSize}
            onValueChange={setFontSize}
            min={12}
            max={20}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Small</span>
            <span>Medium</span>
            <span>Large</span>
          </div>
        </div>

        {/* Density */}
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Layout className="w-4 h-4" />
            Density
          </Label>
          <RadioGroup
            value={density}
            onValueChange={(value) => setDensity(value as 'comfortable' | 'compact')}
            className="grid grid-cols-2 gap-3"
          >
            <Label
              htmlFor="density-comfortable"
              className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                density === 'comfortable' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
              }`}
            >
              <RadioGroupItem value="comfortable" id="density-comfortable" className="sr-only" />
              <span className="text-sm">Comfortable</span>
            </Label>
            <Label
              htmlFor="density-compact"
              className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                density === 'compact' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
              }`}
            >
              <RadioGroupItem value="compact" id="density-compact" className="sr-only" />
              <span className="text-sm">Compact</span>
            </Label>
          </RadioGroup>
        </div>

        {/* Sidebar Default */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-sm font-medium">Collapsed Sidebar</Label>
            <p className="text-sm text-muted-foreground">
              Start with sidebar collapsed by default
            </p>
          </div>
          <Switch
            checked={sidebarCollapsed}
            onCheckedChange={setSidebarCollapsed}
          />
        </div>

        <Button onClick={handleSave} disabled={isSaving} className="w-full">
          {isSaving ? "Saving..." : "Save Preferences"}
        </Button>
      </CardContent>
    </Card>
  );
}
