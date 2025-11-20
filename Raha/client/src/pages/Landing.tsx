import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Wallet, Shield, TrendingDown, Star } from 'lucide-react';
import Navbar from '@/components/ui/Navbar';

export default function Landing() {
  const features = [
    {
      icon: <Users className="w-8 h-8 text-purple-600" />,
      title: 'Join Groups',
      description: 'Connect with others to share subscription costs and save money together.',
    },
    {
      icon: <Wallet className="w-8 h-8 text-pink-600" />,
      title: 'Digital Wallet',
      description: 'Manage your funds easily with our secure digital wallet system.',
    },
    {
      icon: <TrendingDown className="w-8 h-8 text-purple-600" />,
      title: 'Save Money',
      description: 'Pay only your share and reduce subscription costs by up to 75%.',
    },
    {
      icon: <Shield className="w-8 h-8 text-pink-600" />,
      title: 'Secure Payments',
      description: 'Your transactions are protected with bank-level security.',
    },
  ];

  const testimonials = [
    {
      name: 'Amina K.',
      role: 'Student',
      content: 'RahaSubs helped me afford Netflix while on a tight budget. Love it!',
      rating: 5,
    },
    {
      name: 'David M.',
      role: 'Freelancer',
      content: 'Finally, I can access premium tools without breaking the bank.',
      rating: 5,
    },
    {
      name: 'Grace W.',
      role: 'Designer',
      content: 'The group payment system is genius. Saved me so much money!',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-8 duration-700">
            Shared Subscriptions Made Easy
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
            Join groups, split costs, and enjoy premium subscriptions at a fraction of the price.
            Your digital wallet for smarter spending.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <Link to="/register">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8">
                Get Started Free
              </Button>
            </Link>
            <Link to="/browse">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Browse Subscriptions
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose RahaSubs?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 hover:border-purple-600 transition-colors duration-300">
                <CardContent className="p-6 space-y-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            How It Works
          </h2>
          <div className="space-y-8">
            {[
              { step: 1, title: 'Create Account', desc: 'Sign up in seconds with just your email' },
              { step: 2, title: 'Top Up Wallet', desc: 'Add funds to your digital wallet securely' },
              { step: 3, title: 'Join a Group', desc: 'Browse and join subscription groups' },
              { step: 4, title: 'Pay Your Share', desc: 'Split costs automatically with group members' },
            ].map((item) => (
              <div key={item.step} className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            What Our Users Say
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-6 space-y-4">
                  <div className="flex space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-white">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Start Saving?
          </h2>
          <p className="text-xl opacity-90">
            Join thousands of users already saving on their favorite subscriptions
          </p>
          <Link to="/register">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 RahaSubs. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}