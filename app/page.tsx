'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles,
  Briefcase,
  Users,
  TrendingUp,
  CheckCircle2,
  Zap,
  Shield,
  ArrowRight,
  Search,
  MapPin,
  Clock,
  Star,
  Award,
  Target,
  Rocket,
  Globe,
  Building2,
  GraduationCap,
  Heart,
  ChevronRight,
  Play,
} from 'lucide-react';
import { useState } from 'react';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');

  const features = [
    {
      icon: <Target className="h-6 w-6" />,
      title: 'Smart Matching',
      description: 'AI-powered algorithms match you with internships that align perfectly with your skills and career goals.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Verified Companies',
      description: 'All companies are thoroughly verified to ensure legitimate opportunities and safe experiences.',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Real-Time Updates',
      description: 'Get instant notifications about your application status. No more waiting in the dark.',
      gradient: 'from-yellow-500 to-orange-500',
    },
    {
      icon: <Rocket className="h-6 w-6" />,
      title: 'Fast Applications',
      description: 'Apply to multiple internships in seconds with our streamlined one-click application process.',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: 'Career Growth',
      description: 'Access resources and mentorship opportunities to accelerate your professional development.',
      gradient: 'from-indigo-500 to-purple-500',
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: 'Global Opportunities',
      description: 'Discover internships from companies worldwide, including remote and hybrid positions.',
      gradient: 'from-teal-500 to-blue-500',
    },
  ];

  const stats = [
    { value: '10K+', label: 'Active Internships', icon: <Briefcase className="h-5 w-5" /> },
    { value: '5K+', label: 'Companies', icon: <Building2 className="h-5 w-5" /> },
    { value: '50K+', label: 'Successful Placements', icon: <GraduationCap className="h-5 w-5" /> },
    { value: '100K+', label: 'Happy Students', icon: <Heart className="h-5 w-5" /> },
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Software Engineering Intern',
      company: 'TechCorp',
      image: '👩‍💻',
      quote: 'InternConnect made finding my dream internship so easy! The platform is intuitive and I got multiple offers within weeks.',
      rating: 5,
    },
    {
      name: 'Michael Rodriguez',
      role: 'Marketing Intern',
      company: 'Creative Agency',
      image: '👨‍💼',
      quote: 'The real-time tracking feature kept me informed throughout the entire process. Highly recommend!',
      rating: 5,
    },
    {
      name: 'Emily Johnson',
      role: 'Data Science Intern',
      company: 'DataViz Inc',
      image: '👩‍🔬',
      quote: 'I found the perfect remote internship through InternConnect. The search filters are incredibly helpful.',
      rating: 5,
    },
  ];

  const jobTypes = [
    { label: 'Remote', count: '3,200+' },
    { label: 'On-Site', count: '4,500+' },
    { label: 'Hybrid', count: '2,300+' },
  ];

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/* Hero Section with Animated Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container relative z-10 px-4 py-20 md:py-32">
          <div className="mx-auto max-w-5xl text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 animate-fade-in border border-primary/20">
              <Sparkles className="h-4 w-4 animate-pulse" />
              <span>Trusted by 100,000+ Students Worldwide</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight animate-fade-in">
              Launch Your Career{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-600 to-pink-600 animate-gradient">
                Today
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-slide-up">
              Connect with top companies, discover amazing opportunities, and land your dream internship with our
              AI-powered platform. Join thousands of successful students who've kickstarted their careers.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mt-12 animate-slide-up">
              <div className="relative flex items-center gap-2 bg-card/80 backdrop-blur-sm border-2 border-border rounded-2xl p-2 shadow-2xl">
                <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search internships by title, company, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-6 text-lg border-0 bg-transparent focus-visible:ring-0"
                />
                <Link href="/internships">
                  <Button size="lg" className="px-8 py-6 text-base">
                    Search
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="flex items-center justify-center gap-4 mt-4 flex-wrap">
                {jobTypes.map((type, index) => (
                  <Badge key={index} variant="secondary" className="px-4 py-1.5 text-sm">
                    {type.label}: {type.count}
                  </Badge>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 animate-slide-up">
              <Link href="/register">
                <Button size="lg" className="text-lg px-10 py-6 shadow-lg hover:shadow-xl transition-all">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/internships">
                <Button variant="outline" size="lg" className="text-lg px-10 py-6 border-2">
                  Browse Internships
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-8 pt-12 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Free Forever</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>100% Secure</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronRight className="h-6 w-6 text-muted-foreground rotate-90" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 bg-gradient-to-r from-primary/5 via-background to-purple-500/5 border-y">
        <div className="container px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center space-y-3 p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg"
              >
                <div className="flex justify-center text-primary mb-2">{stat.icon}</div>
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-24 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16 space-y-4">
            <Badge variant="outline" className="px-4 py-1">
              Why Choose InternConnect
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold">
              Everything You Need to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
                Succeed
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to make your internship search effortless and successful
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
                <CardHeader className="relative">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}
                  >
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <Badge variant="outline" className="px-4 py-1">
              Simple Process
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold">How It Works</h2>
            <p className="text-xl text-muted-foreground">Get started in just 3 simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Create Your Profile',
                description: 'Sign up in seconds and build your professional profile. Add your skills, education, and career interests.',
                icon: <Users className="h-8 w-8" />,
              },
              {
                step: '02',
                title: 'Discover Opportunities',
                description: 'Browse thousands of internships from verified companies. Use our smart filters to find the perfect match.',
                icon: <Search className="h-8 w-8" />,
              },
              {
                step: '03',
                title: 'Apply & Track',
                description: 'Apply with one click and track your application status in real-time. Get notified instantly when companies respond.',
                icon: <Rocket className="h-8 w-8" />,
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="absolute -top-4 -left-4 text-8xl font-black text-primary/10">{item.step}</div>
                <Card className="relative h-full border-2 hover:border-primary/50 transition-all hover:shadow-xl">
                  <CardHeader>
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
                      {item.icon}
                    </div>
                    <CardTitle className="text-2xl">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">{item.description}</CardDescription>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container py-24 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16 space-y-4">
            <Badge variant="outline" className="px-4 py-1">
              Success Stories
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold">
              Loved by{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
                Students
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">See what our users are saying</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 transition-all hover:shadow-xl">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-4xl">{testimonial.image}</div>
                    <div>
                      <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                      <CardDescription>
                        {testimonial.role} at {testimonial.company}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground italic">&ldquo;{testimonial.quote}&rdquo;</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10">
        <div className="container max-w-4xl mx-auto">
          <Card className="border-2 border-primary/20 bg-card/80 backdrop-blur-sm shadow-2xl">
            <CardHeader className="text-center space-y-4 pb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-purple-600 mx-auto mb-4">
                <Rocket className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-4xl md:text-5xl">
                Ready to Launch Your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
                  Career?
                </span>
              </CardTitle>
              <CardDescription className="text-lg">
                Join 100,000+ students who have found their dream internships through InternConnect. Start your journey
                today - it's completely free!
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4 justify-center pb-8">
              <Link href="/register">
                <Button size="lg" className="text-lg px-10 py-6 w-full sm:w-auto shadow-lg">
                  Create Free Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/internships">
                <Button variant="outline" size="lg" className="text-lg px-10 py-6 w-full sm:w-auto border-2">
                  Explore Internships
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
