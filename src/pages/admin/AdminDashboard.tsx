import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import {
  LayoutDashboard, Users, ShieldCheck, BarChart3,
  LogOut, CheckCircle, XCircle, AlertTriangle
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [vendors, setVendors] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [vendorRes, profileRes, ticketRes] = await Promise.all([
      supabase.from('vendors').select('*'),
      supabase.from('profiles').select('*'),
      supabase.from('support_tickets').select('*'),
    ]);
    setVendors(vendorRes.data || []);
    setUsers(profileRes.data || []);
    setTickets(ticketRes.data || []);
  };

  const handleApproveVendor = async (vendorId: string, approve: boolean) => {
    const { error } = await supabase
      .from('vendors')
      .update({ is_approved: approve, is_verified: approve })
      .eq('id', vendorId);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: approve ? 'Vendor approved' : 'Vendor rejected' });
      fetchData();
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const tabs = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'vendors', label: 'Vendors', icon: ShieldCheck },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'tickets', label: 'Disputes', icon: AlertTriangle },
  ];

  const pendingVendors = vendors.filter(v => !v.is_approved);
  const activeSubscriptionsCount = 0; // Would come from subscriptions query

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-lg">
        <div className="container max-w-7xl mx-auto flex items-center justify-between h-14 px-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl">🍱</span>
            <span className="font-display font-bold text-foreground">TiffinFresh</span>
            <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full font-medium">Admin</span>
          </Link>
          <div className="flex items-center gap-3">
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
              {tab.id === 'vendors' && pendingVendors.length > 0 && (
                <span className="bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {pendingVendors.length}
                </span>
              )}
            </Button>
          ))}
        </div>

        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-display font-bold text-foreground">Admin Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Users', value: users.length, icon: Users },
                { label: 'Total Vendors', value: vendors.length, icon: ShieldCheck },
                { label: 'Pending Approvals', value: pendingVendors.length, icon: AlertTriangle },
                { label: 'Open Tickets', value: tickets.filter(t => t.status === 'open').length, icon: AlertTriangle },
              ].map((stat) => (
                <Card key={stat.label} className="border-border/50 shadow-soft">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <stat.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'vendors' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-display font-bold text-foreground">Manage Vendors</h2>
            {vendors.length === 0 ? (
              <Card className="border-border/50"><CardContent className="p-8 text-center text-muted-foreground">No vendors registered yet.</CardContent></Card>
            ) : (
              vendors.map((v) => (
                <Card key={v.id} className="border-border/50 shadow-soft">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{v.business_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {v.food_type} · {v.city || 'N/A'} · FSSAI: {v.fssai_license || 'Not provided'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {v.is_approved ? (
                          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-secondary/10 text-secondary">Approved</span>
                        ) : (
                          <>
                            <Button size="sm" className="gap-1" onClick={() => handleApproveVendor(v.id, true)}>
                              <CheckCircle className="w-3.5 h-3.5" /> Approve
                            </Button>
                            <Button size="sm" variant="outline" className="gap-1" onClick={() => handleApproveVendor(v.id, false)}>
                              <XCircle className="w-3.5 h-3.5" /> Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-display font-bold text-foreground">All Users</h2>
            {users.map((u) => (
              <Card key={u.id} className="border-border/50 shadow-soft">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{u.full_name || 'No name'}</p>
                    <p className="text-xs text-muted-foreground">{u.phone || 'No phone'}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'tickets' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-display font-bold text-foreground">Support Tickets</h2>
            {tickets.length === 0 ? (
              <Card className="border-border/50"><CardContent className="p-8 text-center text-muted-foreground">No tickets.</CardContent></Card>
            ) : (
              tickets.map((t) => (
                <Card key={t.id} className="border-border/50 shadow-soft">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{t.subject}</p>
                        <p className="text-sm text-muted-foreground">{t.description}</p>
                      </div>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${t.status === 'open' ? 'bg-warning/10 text-warning' : 'bg-secondary/10 text-secondary'}`}>
                        {t.status}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
