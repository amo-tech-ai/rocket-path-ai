import { useState } from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ProfileSettings } from '@/components/settings/ProfileSettings';
import { StartupSettings } from '@/components/settings/StartupSettings';
import { TeamSettings } from '@/components/settings/TeamSettings';
import { AppearanceSettings } from '@/components/settings/AppearanceSettings';
import { NotificationSettings } from '@/components/settings/NotificationSettings';
import { AccountSettings } from '@/components/settings/AccountSettings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { 
  User, 
  Building2, 
  Users, 
  Bell,
  Palette,
  Shield
} from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-semibold mb-1">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account, startup profile, and preferences
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 lg:w-auto lg:inline-flex mb-6">
              <TabsTrigger value="profile" className="gap-2">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="gap-2">
                <Palette className="w-4 h-4" />
                <span className="hidden sm:inline">Appearance</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2">
                <Bell className="w-4 h-4" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="startup" className="gap-2">
                <Building2 className="w-4 h-4" />
                <span className="hidden sm:inline">Startup</span>
              </TabsTrigger>
              <TabsTrigger value="team" className="gap-2">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Team</span>
              </TabsTrigger>
              <TabsTrigger value="account" className="gap-2">
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Account</span>
              </TabsTrigger>
            </TabsList>

            <div className="space-y-6">
              <TabsContent value="profile" className="mt-0 space-y-6">
                <ProfileSettings />
              </TabsContent>

              <TabsContent value="appearance" className="mt-0 space-y-6">
                <AppearanceSettings />
              </TabsContent>

              <TabsContent value="notifications" className="mt-0 space-y-6">
                <NotificationSettings />
              </TabsContent>

              <TabsContent value="startup" className="mt-0 space-y-6">
                <StartupSettings />
              </TabsContent>

              <TabsContent value="team" className="mt-0 space-y-6">
                <TeamSettings />
              </TabsContent>

              <TabsContent value="account" className="mt-0 space-y-6">
                <AccountSettings />
              </TabsContent>
            </div>
          </Tabs>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
