import { motion } from "motion/react";
import { useState } from "react";
import { User, Mail, Phone, Shield, Fingerprint, Globe, Bell, Lock, Eye, Download, Calendar, Award } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { toast } from "sonner@2.0.3";

export function ProfilePage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(true);

  const [profileData, setProfileData] = useState({
    name: "Rahul Sharma",
    email: "rahul.sharma@email.com",
    phone: "+91 98765 43210",
    dob: "1990-05-15",
    gender: "Male"
  });

  const handleSaveProfile = () => {
    toast.success("✅ Profile updated successfully!");
  };

  const handleDownloadData = () => {
    const dataStr = JSON.stringify(profileData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "my_irctc_data.json";
    link.click();
    toast.success("📥 Your data has been downloaded successfully!");
  };

  const handleAddPassenger = () => {
    toast.success("➕ Add new passenger form opened!");
  };

  const handleEditPassenger = (name: string) => {
    toast.success(`✏️ Editing passenger: ${name}`);
  };

  const handleChangePassword = () => {
    toast.success("🔒 Password change form opened. Please check your email for verification.");
  };

  const handleLanguageChange = () => {
    toast.success("🌐 Language preferences updated!");
  };

  const handleDeleteAccount = () => {
    const confirmed = confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (confirmed) {
      toast.error("⚠️ Account deletion request submitted. You'll receive a confirmation email.");
    }
  };

  const recentLogins = [
    { device: "Chrome on Windows", location: "Mumbai, India", time: "2 hours ago", current: true },
    { device: "Mobile App (Android)", location: "Mumbai, India", time: "1 day ago", current: false },
    { device: "Safari on MacOS", location: "Bangalore, India", time: "5 days ago", current: false }
  ];

  return (
    <div className="min-h-screen pb-20 bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="mb-2">Profile & Security</h2>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="profile">
              <TabsList className="grid w-full max-w-lg grid-cols-3">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile" className="mt-6">
                <Card className="p-6">
                  <h4 className="mb-6">Personal Information</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm mb-2 block">Full Name</label>
                      <Input defaultValue={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} />
                    </div>

                    <div>
                      <label className="text-sm mb-2 block">Email Address</label>
                      <div className="flex gap-2">
                        <Input defaultValue={profileData.email} className="flex-1" onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} />
                        <Badge variant="outline" className="px-3">
                          Verified
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm mb-2 block">Phone Number</label>
                      <div className="flex gap-2">
                        <Input defaultValue={profileData.phone} className="flex-1" onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} />
                        <Badge variant="outline" className="px-3">
                          Verified
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm mb-2 block">Date of Birth</label>
                      <Input type="date" defaultValue={profileData.dob} onChange={(e) => setProfileData({ ...profileData, dob: e.target.value })} />
                    </div>

                    <div>
                      <label className="text-sm mb-2 block">Gender</label>
                      <select className="w-full h-10 px-3 rounded-md border border-input bg-background" value={profileData.gender} onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}>
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                        <option>Prefer not to say</option>
                      </select>
                    </div>

                    <Separator className="my-6" />

                    <Button className="gradient-primary text-white border-0" onClick={handleSaveProfile}>
                      Save Changes
                    </Button>
                  </div>
                </Card>

                {/* Saved Passengers */}
                <Card className="p-6 mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4>Saved Co-Passengers</h4>
                    <Button size="sm" variant="outline" onClick={handleAddPassenger}>+ Add New</Button>
                  </div>

                  <div className="space-y-3">
                    {[
                      { name: "Priya Sharma", age: 28, relation: "Spouse" },
                      { name: "Amit Sharma", age: 8, relation: "Child" }
                    ].map((passenger, idx) => (
                      <div key={idx} className="p-4 rounded-lg border hover:bg-muted transition-colors">
                        <div className="flex items-center justify-between">
                          <div>
                            <p>{passenger.name}</p>
                            <p className="text-sm text-muted-foreground">{passenger.age} years • {passenger.relation}</p>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => handleEditPassenger(passenger.name)}>Edit</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="mt-6">
                <Card className="p-6 mb-6">
                  <h4 className="mb-6">Security Settings</h4>

                  <div className="space-y-6">
                    {/* Biometric Login */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                          <Fingerprint className="h-5 w-5" />
                        </div>
                        <div>
                          <p>Biometric Login</p>
                          <p className="text-sm text-muted-foreground">Use fingerprint or face ID</p>
                        </div>
                      </div>
                      <Switch defaultChecked={biometricEnabled} onChange={(e) => setBiometricEnabled(e.target.checked)} />
                    </div>

                    <Separator />

                    {/* Two-Factor Authentication */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 flex items-center justify-center">
                          <Shield className="h-5 w-5" />
                        </div>
                        <div>
                          <p>Two-Factor Authentication</p>
                          <p className="text-sm text-muted-foreground">Extra security layer with OTP</p>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <Separator />

                    {/* Change Password */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                          <Lock className="h-5 w-5" />
                        </div>
                        <div>
                          <p>Change Password</p>
                          <p className="text-sm text-muted-foreground">Last changed 45 days ago</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={handleChangePassword}>Change</Button>
                    </div>
                  </div>
                </Card>

                {/* Account Security Timeline */}
                <Card className="p-6">
                  <h4 className="mb-6">Recent Login Activity</h4>

                  <div className="space-y-4">
                    {recentLogins.map((login, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-start gap-4"
                      >
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                          <Eye className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p>{login.device}</p>
                            {login.current && (
                              <Badge variant="default" className="text-xs">Current</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{login.location}</p>
                          <p className="text-xs text-muted-foreground mt-1">{login.time}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              {/* Preferences Tab */}
              <TabsContent value="preferences" className="mt-6">
                <Card className="p-6 mb-6">
                  <h4 className="mb-6">Notification Preferences</h4>

                  <div className="space-y-4">
                    {[
                      { title: "Booking Confirmations", description: "Get notified when booking is confirmed" },
                      { title: "Train Delay Alerts", description: "Real-time notifications for delays" },
                      { title: "Fare Price Drops", description: "AI alerts when fares decrease" },
                      { title: "Platform Changes", description: "Updates on platform assignments" },
                      { title: "Promotional Offers", description: "Deals and discounts on bookings" }
                    ].map((pref, idx) => (
                      <div key={idx}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p>{pref.title}</p>
                            <p className="text-sm text-muted-foreground">{pref.description}</p>
                          </div>
                          <Switch defaultChecked={idx < 4} />
                        </div>
                        {idx < 4 && <Separator className="mt-4" />}
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <h4 className="mb-6">Language & Region</h4>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm mb-2 block">Preferred Language</label>
                      <select className="w-full h-10 px-3 rounded-md border border-input bg-background" onChange={handleLanguageChange}>
                        <option>English</option>
                        <option>हिन्दी (Hindi)</option>
                        <option>தமிழ் (Tamil)</option>
                        <option>বাংলা (Bengali)</option>
                        <option>తెలుగు (Telugu)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm mb-2 block">Time Zone</label>
                      <select className="w-full h-10 px-3 rounded-md border border-input bg-background">
                        <option>IST (UTC +5:30)</option>
                      </select>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 mt-6">
                  <h4 className="mb-6">Privacy Settings</h4>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p>Anonymized Analytics</p>
                        <p className="text-sm text-muted-foreground">Help us improve with usage data</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <p>Personalized Recommendations</p>
                        <p className="text-sm text-muted-foreground">AI-powered travel suggestions</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card className="p-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 rounded-full gradient-primary text-white flex items-center justify-center mx-auto mb-4 text-3xl">
                  RS
                </div>
                <h4>Rahul Sharma</h4>
                <p className="text-sm text-muted-foreground">Member since 2020</p>
              </div>

              <Separator className="my-4" />

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">rahul.sharma@email.com</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">+91 98765 43210</span>
                </div>
              </div>
            </Card>

            {/* Loyalty Status */}
            <Card className="p-6 gradient-accent text-white border-0">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm opacity-90">Loyalty Status</p>
                  <h4>Gold Member</h4>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Points</span>
                  <span>2,450</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: '65%' }} />
                </div>
                <p className="text-xs opacity-75">850 more points to Platinum</p>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h5 className="mb-4">Quick Actions</h5>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={handleDownloadData}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Data
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Globe className="mr-2 h-4 w-4" />
                  Language: English
                </Button>
                <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive" onClick={handleDeleteAccount}>
                  <Lock className="mr-2 h-4 w-4" />
                  Delete Account
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}