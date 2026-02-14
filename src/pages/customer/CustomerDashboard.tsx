import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, Star, ShieldCheck, Clock, MapPin, Filter,
  Package, History, LogOut, User, Leaf
} from 'lucide-react';

export default function CustomerDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [vendors, setVendors] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [activeTab, setActiveTab] = useState('browse');

  useEffect(() => {
    fetchVendors();
    fetchSubscriptions();
  }, []);

  const fetchVendors = async () => {
    const { data } = await supabase.from('vendors').select('*').eq('is_approved', true);
    setVendors(data || []);
  };

  const fetchSubscriptions = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('subscriptions')
      .select('*, vendors(business_name, food_type, city)')
      .eq('customer_id', user.id);
    setSubscriptions(data || []);
  };

  const filteredVendors = vendors.filter((v) => {
    const matchSearch = v.business_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.city?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = filterType === 'all' || v.food_type === filterType;
    return matchSearch && matchType;
  });

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const tabs = [
    { id: 'browse', label: 'Browse', icon: Search },
    { id: 'subscriptions', label: 'My Subscriptions', icon: Package },
    { id: 'history', label: 'Order History', icon: History },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-lg">
        <div className="container max-w-7xl mx-auto flex items-center justify-between h-14 px-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl">🍱</span>
            <span className="font-display font-bold text-foreground">TiffinFresh</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">{user?.email}</span>
            <Button variant="ghost" size="icon" onClick={handleSignOut}><LogOut className="w-4 h-4" /></Button>
          </div>
        </div>
      </header>

      <div className="container max-w-7xl mx-auto px-4 py-6">
        {/* Tabs */}
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

        {activeTab === 'browse' && (
          <div className="space-y-6">
            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                  maxLength={100}
                />
              </div>
              <div className="flex gap-2">
                {['all', 'veg', 'nonveg', 'jain'].map((type) => (
                  <Button
                    key={type}
                    variant={filterType === type ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterType(type)}
                  >
                    {type === 'all' ? 'All' : type === 'nonveg' ? 'Non-Veg' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Vendor Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVendors.length === 0 ? (
                <div className="col-span-full text-center py-16 text-muted-foreground">
                  <Search className="w-10 h-10 mx-auto mb-3 opacity-50" />
                  <p>No vendors found. Check back soon!</p>
                </div>
              ) : (
                filteredVendors.map((v) => (
                  <Card key={v.id} className="overflow-hidden border-border/50 shadow-soft hover:shadow-elevated transition-all cursor-pointer">
                    <div className="h-32 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-4xl">
                      🍱
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-1.5 mb-1">
                        {v.is_verified && <ShieldCheck className="w-4 h-4 text-secondary" />}
                        {v.is_verified && <span className="text-xs font-medium text-secondary">Verified</span>}
                      </div>
                      <h3 className="font-semibold text-foreground">{v.business_name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {v.food_type === 'nonveg' ? 'Non-Veg' : v.food_type?.charAt(0).toUpperCase() + v.food_type?.slice(1)} · {v.city || 'N/A'}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-warning fill-warning" />
                          <span className="font-medium">{v.avg_rating || '0.0'}</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          {v.delivery_time_minutes}min
                        </div>
                        {v.monthly_price && (
                          <span className="font-semibold text-primary">₹{v.monthly_price}/mo</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'subscriptions' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-display font-bold text-foreground">Active Subscriptions</h2>
            {subscriptions.length === 0 ? (
              <Card className="border-border/50 shadow-soft">
                <CardContent className="p-8 text-center text-muted-foreground">
                  <Package className="w-10 h-10 mx-auto mb-3 opacity-50" />
                  <p>No active subscriptions yet.</p>
                  <Button className="mt-4" onClick={() => setActiveTab('browse')}>Browse Vendors</Button>
                </CardContent>
              </Card>
            ) : (
              subscriptions.map((sub) => (
                <Card key={sub.id} className="border-border/50 shadow-soft">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">{(sub.vendors as any)?.business_name || 'Vendor'}</h3>
                        <p className="text-sm text-muted-foreground">{sub.plan_type} plan · ₹{sub.amount}</p>
                      </div>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${sub.status === 'active' ? 'bg-secondary/10 text-secondary' : 'bg-muted text-muted-foreground'}`}>
                        {sub.status}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-display font-bold text-foreground">Order History</h2>
            <Card className="border-border/50 shadow-soft">
              <CardContent className="p-8 text-center text-muted-foreground">
                <History className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p>Your delivery history will appear here.</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
