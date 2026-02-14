import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import {
  LayoutDashboard, Users, Calendar, BarChart3, Settings,
  LogOut, Save, Package
} from 'lucide-react';

export default function VendorDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [vendor, setVendor] = useState<any>(null);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Form state
  const [businessName, setBusinessName] = useState('');
  const [description, setDescription] = useState('');
  const [foodType, setFoodType] = useState('veg');
  const [city, setCity] = useState('');
  const [monthlyPrice, setMonthlyPrice] = useState('');
  const [weeklyPrice, setWeeklyPrice] = useState('');
  const [fssaiLicense, setFssaiLicense] = useState('');

  useEffect(() => {
    fetchVendor();
  }, [user]);

  const fetchVendor = async () => {
    if (!user) return;
    const { data } = await supabase.from('vendors').select('*').eq('user_id', user.id).maybeSingle();
    if (data) {
      setVendor(data);
      setBusinessName(data.business_name || '');
      setDescription(data.description || '');
      setFoodType(data.food_type || 'veg');
      setCity(data.city || '');
      setMonthlyPrice(data.monthly_price?.toString() || '');
      setWeeklyPrice(data.weekly_price?.toString() || '');
      setFssaiLicense(data.fssai_license || '');
      // Fetch subscribers
      const { data: subs } = await supabase.from('subscriptions').select('*, profiles:customer_id(full_name)').eq('vendor_id', data.id);
      setSubscribers(subs || []);
    }
  };

  const handleSaveProfile = async () => {
    if (!user || !businessName.trim()) {
      toast({ title: 'Business name is required', variant: 'destructive' });
      return;
    }
    setLoading(true);
    const payload = {
      user_id: user.id,
      business_name: businessName.trim(),
      description: description.trim(),
      food_type: foodType,
      city: city.trim(),
      monthly_price: monthlyPrice ? parseFloat(monthlyPrice) : null,
      weekly_price: weeklyPrice ? parseFloat(weeklyPrice) : null,
      fssai_license: fssaiLicense.trim() || null,
    };

    try {
      if (vendor) {
        const { error } = await supabase.from('vendors').update(payload).eq('id', vendor.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('vendors').insert(payload);
        if (error) throw error;
      }
      toast({ title: 'Profile saved!' });
      fetchVendor();
    } catch (err: any) {
      toast({ title: 'Error saving', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'My Kitchen', icon: Settings },
    { id: 'subscribers', label: 'Subscribers', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-lg">
        <div className="container max-w-7xl mx-auto flex items-center justify-between h-14 px-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl">🍱</span>
            <span className="font-display font-bold text-foreground">TiffinFresh</span>
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Vendor</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">{user?.email}</span>
            <Button variant="ghost" size="icon" onClick={handleSignOut}><LogOut className="w-4 h-4" /></Button>
          </div>
        </div>
      </header>

      <div className="container max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className="gap-2 whitespace-nowrap"
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </Button>
          ))}
        </div>

        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-display font-bold text-foreground">
              Welcome, {vendor?.business_name || 'Vendor'} 👨‍🍳
            </h2>
            {!vendor && (
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-5">
                  <p className="text-sm text-foreground">Set up your kitchen profile to start receiving orders.</p>
                  <Button className="mt-3" size="sm" onClick={() => setActiveTab('profile')}>Set Up Profile</Button>
                </CardContent>
              </Card>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="border-border/50 shadow-soft">
                <CardContent className="p-5">
                  <p className="text-sm text-muted-foreground">Active Subscribers</p>
                  <p className="text-3xl font-display font-bold text-foreground mt-1">
                    {subscribers.filter(s => s.status === 'active').length}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border/50 shadow-soft">
                <CardContent className="p-5">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="text-lg font-semibold mt-1">
                    {vendor?.is_approved ? (
                      <span className="text-secondary">✅ Approved</span>
                    ) : vendor ? (
                      <span className="text-warning">⏳ Pending Approval</span>
                    ) : (
                      <span className="text-muted-foreground">Not Set Up</span>
                    )}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border/50 shadow-soft">
                <CardContent className="p-5">
                  <p className="text-sm text-muted-foreground">Rating</p>
                  <p className="text-3xl font-display font-bold text-foreground mt-1">
                    ⭐ {vendor?.avg_rating || '0.0'}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-2xl space-y-6">
            <h2 className="text-2xl font-display font-bold text-foreground">Kitchen Profile</h2>
            <Card className="border-border/50 shadow-soft">
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label>Business Name *</Label>
                  <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} maxLength={100} placeholder="e.g. Amma's Kitchen" />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input value={description} onChange={(e) => setDescription(e.target.value)} maxLength={500} placeholder="Tell customers about your kitchen..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Food Type</Label>
                    <select
                      value={foodType}
                      onChange={(e) => setFoodType(e.target.value)}
                      className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                    >
                      <option value="veg">Veg</option>
                      <option value="nonveg">Non-Veg</option>
                      <option value="both">Both</option>
                      <option value="jain">Jain</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Input value={city} onChange={(e) => setCity(e.target.value)} maxLength={50} placeholder="Mumbai" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Weekly Price (₹)</Label>
                    <Input type="number" value={weeklyPrice} onChange={(e) => setWeeklyPrice(e.target.value)} placeholder="999" />
                  </div>
                  <div className="space-y-2">
                    <Label>Monthly Price (₹)</Label>
                    <Input type="number" value={monthlyPrice} onChange={(e) => setMonthlyPrice(e.target.value)} placeholder="3499" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>FSSAI License</Label>
                  <Input value={fssaiLicense} onChange={(e) => setFssaiLicense(e.target.value)} maxLength={20} placeholder="License number" />
                </div>
                <Button onClick={handleSaveProfile} disabled={loading} className="gap-2">
                  <Save className="w-4 h-4" />
                  {loading ? 'Saving...' : 'Save Profile'}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'subscribers' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-display font-bold text-foreground">Subscribers</h2>
            {subscribers.length === 0 ? (
              <Card className="border-border/50 shadow-soft">
                <CardContent className="p-8 text-center text-muted-foreground">
                  <Users className="w-10 h-10 mx-auto mb-3 opacity-50" />
                  <p>No subscribers yet.</p>
                </CardContent>
              </Card>
            ) : (
              subscribers.map((sub) => (
                <Card key={sub.id} className="border-border/50 shadow-soft">
                  <CardContent className="p-5 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{sub.plan_type} plan</p>
                      <p className="text-sm text-muted-foreground">₹{sub.amount} · {sub.meal_type}</p>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${sub.status === 'active' ? 'bg-secondary/10 text-secondary' : 'bg-muted text-muted-foreground'}`}>
                      {sub.status}
                    </span>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-display font-bold text-foreground">Revenue Analytics</h2>
            <Card className="border-border/50 shadow-soft">
              <CardContent className="p-8 text-center text-muted-foreground">
                <BarChart3 className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p>Analytics will populate as you receive orders.</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
