import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ShieldCheck,
  Leaf,
  IndianRupee,
  Star,
  Clock,
  ChefHat,
  Users,
  MapPin,
  ChevronRight,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';

const trustBadges = [
  { icon: ShieldCheck, label: 'Verified Kitchens', desc: 'Every kitchen is inspected & approved' },
  { icon: Leaf, label: 'Hygienic & Fresh', desc: 'Prepared with care daily' },
  { icon: IndianRupee, label: 'Affordable Plans', desc: 'Starting from ₹80/meal' },
];

const vendors = [
  { name: "Amma's Kitchen", type: 'Pure Veg', rating: 4.8, reviews: 234, price: '₹3,500/mo', location: 'Andheri West', image: '🍱', hygiene: 4.5 },
  { name: 'Spice Route Tiffins', type: 'Veg & Non-Veg', rating: 4.6, reviews: 189, price: '₹4,200/mo', location: 'Bandra East', image: '🥘', hygiene: 4.3 },
  { name: 'Green Bowl Co.', type: 'Jain Friendly', rating: 4.9, reviews: 312, price: '₹3,800/mo', location: 'Powai', image: '🥗', hygiene: 4.8 },
  { name: 'Desi Dabba Express', type: 'North Indian', rating: 4.5, reviews: 156, price: '₹3,200/mo', location: 'Thane', image: '🍛', hygiene: 4.2 },
];

const testimonials = [
  { name: 'Priya Sharma', role: 'Working Professional', text: "Finally found tiffin that tastes like home! The weekly menu variety keeps things exciting.", rating: 5 },
  { name: 'Rahul Patel', role: 'Student', text: "Affordable, hygienic, and always on time. Best decision I made after moving to Mumbai.", rating: 5 },
  { name: 'Sneha Iyer', role: 'Freelancer', text: "Love the pause feature — I travel often and can manage my subscription easily.", rating: 4 },
];

const faqs = [
  { q: 'How does the subscription work?', a: 'Choose a vendor, pick a weekly or monthly plan, set your delivery address, and enjoy fresh home-style meals delivered daily.' },
  { q: 'Can I pause my subscription?', a: 'Yes! You can pause and resume your subscription anytime from your dashboard — no penalties.' },
  { q: 'Are the kitchens verified?', a: 'Every kitchen on our platform goes through a verification process including FSSAI compliance and hygiene checks.' },
  { q: 'What payment methods are accepted?', a: 'We accept all major payment methods including UPI, cards, net banking, and wallets via our secure payment gateway.' },
  { q: 'Can I change my vendor mid-subscription?', a: 'Yes, you can switch vendors when your current billing cycle ends, or cancel and start a new subscription anytime.' },
];

const plans = [
  { name: 'Weekly', price: '₹999', period: '/week', features: ['7 lunches delivered', 'Pause anytime', 'Change vendor weekly', 'Free delivery'], popular: false },
  { name: 'Monthly', price: '₹3,499', period: '/month', features: ['30 lunches delivered', '2 free meals bonus', 'Priority delivery', 'Pause anytime', 'Menu customization'], popular: true },
  { name: 'Monthly+', price: '₹5,999', period: '/month', features: ['30 lunches + 30 dinners', '5 free meals bonus', 'Premium vendors', 'Priority support', 'Custom diet plans'], popular: false },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-lg">
        <div className="container max-w-7xl mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🍱</span>
            <span className="font-display text-xl font-bold text-foreground">TiffinFresh</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
            <a href="#vendors" className="hover:text-foreground transition-colors">Vendors</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/auth/login">
              <Button variant="ghost" size="sm">Log In</Button>
            </Link>
            <Link to="/auth/signup">
              <Button size="sm" className="gap-1">Get Started <ArrowRight className="w-3.5 h-3.5" /></Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="container max-w-7xl mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Leaf className="w-4 h-4" /> Trusted by 10,000+ happy customers
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground leading-tight mb-6">
              Get Fresh Home-Style{' '}
              <span className="text-primary">Tiffin</span> Delivered Daily
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto font-body">
              Subscribe to verified home kitchens near you. Hygienic, affordable, and delicious — just like mom's cooking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth/signup">
                <Button size="lg" className="text-base px-8 gap-2 shadow-elevated">
                  <ChefHat className="w-5 h-5" /> Browse Tiffin Makers
                </Button>
              </Link>
              <Link to="/auth/signup?role=vendor">
                <Button size="lg" variant="outline" className="text-base px-8 gap-2">
                  Register as Vendor <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 border-y border-border bg-card/50">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trustBadges.map((badge) => (
              <div key={badge.label} className="flex items-center gap-4 justify-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <badge.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground font-body">{badge.label}</p>
                  <p className="text-sm text-muted-foreground">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">How It Works</h2>
            <p className="text-muted-foreground text-lg">Three simple steps to home-cooked happiness</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: '1', icon: MapPin, title: 'Find Nearby Kitchens', desc: 'Enter your area and discover verified tiffin makers near you' },
              { step: '2', icon: ChefHat, title: 'Choose Your Plan', desc: 'Pick weekly or monthly subscription based on your budget' },
              { step: '3', icon: Clock, title: 'Get Daily Deliveries', desc: 'Fresh tiffin delivered to your doorstep every day, on time' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold font-body text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Vendors */}
      <section id="vendors" className="py-20 bg-muted/50">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">Top Rated Tiffin Makers</h2>
            <p className="text-muted-foreground text-lg">Handpicked kitchens delivering excellence daily</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {vendors.map((v) => (
              <Card key={v.name} className="overflow-hidden border-border/50 shadow-soft hover:shadow-elevated transition-all duration-300 cursor-pointer group">
                <div className="h-36 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-5xl group-hover:scale-105 transition-transform">
                  {v.image}
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center gap-1.5 mb-1">
                    <ShieldCheck className="w-4 h-4 text-secondary" />
                    <span className="text-xs font-medium text-secondary">Verified</span>
                  </div>
                  <h3 className="font-semibold text-foreground font-body">{v.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{v.type} · {v.location}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-warning fill-warning" />
                      <span className="text-sm font-medium">{v.rating}</span>
                      <span className="text-xs text-muted-foreground">({v.reviews})</span>
                    </div>
                    <span className="text-sm font-semibold text-primary">{v.price}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/auth/signup">
              <Button variant="outline" size="lg" className="gap-2">
                View All Vendors <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">Simple, Transparent Pricing</h2>
            <p className="text-muted-foreground text-lg">Choose a plan that fits your appetite and budget</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <Card key={plan.name} className={`relative overflow-hidden border-border/50 shadow-soft ${plan.popular ? 'ring-2 ring-primary shadow-elevated scale-105' : ''}`}>
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-bl-lg">
                    Most Popular
                  </div>
                )}
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold font-body text-foreground mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-3xl font-bold font-display text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground text-sm">{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-secondary flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link to="/auth/signup">
                    <Button className="w-full" variant={plan.popular ? 'default' : 'outline'}>
                      Get Started
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/50">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">What Our Customers Say</h2>
            <p className="text-muted-foreground text-lg">Join thousands of satisfied tiffin subscribers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((t) => (
              <Card key={t.name} className="border-border/50 shadow-soft">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-warning fill-warning" />
                    ))}
                  </div>
                  <p className="text-muted-foreground text-sm mb-4 italic">"{t.text}"</p>
                  <div>
                    <p className="font-semibold text-foreground text-sm font-body">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '10,000+', label: 'Happy Customers' },
              { value: '500+', label: 'Verified Vendors' },
              { value: '50+', label: 'Cities Covered' },
              { value: '2M+', label: 'Meals Delivered' },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl md:text-4xl font-display font-bold">{s.value}</p>
                <p className="text-sm opacity-80 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20">
        <div className="container max-w-3xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <details key={faq.q} className="group bg-card rounded-xl border border-border/50 shadow-soft">
                <summary className="flex items-center justify-between p-5 cursor-pointer font-medium text-foreground font-body">
                  {faq.q}
                  <ChevronRight className="w-4 h-4 text-muted-foreground transition-transform group-open:rotate-90" />
                </summary>
                <div className="px-5 pb-5 text-sm text-muted-foreground">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Ready for Hassle-Free Meals?
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Join thousands who've said goodbye to cooking stress. Start your tiffin subscription today.
          </p>
          <Link to="/auth/signup">
            <Button size="lg" className="text-base px-10 gap-2 shadow-elevated">
              Start Your Subscription <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-card">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">🍱</span>
                <span className="font-display font-bold text-foreground">TiffinFresh</span>
              </div>
              <p className="text-sm text-muted-foreground">Fresh, hygienic, home-style tiffin delivered to your doorstep daily.</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3 font-body text-sm">For Customers</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Browse Vendors</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3 font-body text-sm">For Vendors</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/auth/signup?role=vendor" className="hover:text-foreground transition-colors">Register Kitchen</Link></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Vendor Guidelines</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3 font-body text-sm">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2026 TiffinFresh. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
