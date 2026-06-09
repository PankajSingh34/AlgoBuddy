import Link from 'next/link';
import React from 'react';
import { 
  Code2, 
  Cpu, 
  Users, 
  GitPullRequest, 
  Sparkles, 
  Target, 
  BookOpen, 
  Zap, 
  Trophy, 
  GitMerge, 
  ArrowRight,
  BrainCircuit,
  Eye,
  Rocket
} from 'lucide-react';
import Footer from '@/app/components/footer';

const stats = [
  { label: 'Algorithms Covered', value: '50+', icon: <Cpu className="w-6 h-6" /> },
  { label: 'Visualizers Available', value: '20+', icon: <Eye className="w-6 h-6" /> },
  { label: 'Practice Problems', value: '100+', icon: <Code2 className="w-6 h-6" /> },
  { label: 'Open Source Contributors', value: '15+', icon: <Users className="w-6 h-6" /> },
];

const features = [
  {
    title: 'Interactive Visualizers',
    description: 'Watch algorithms come to life step-by-step. Understand complex data structures visually rather than memorizing code.',
    icon: <Sparkles className="w-6 h-6 text-udemy-purple dark:text-udemy-purple-light" />
  },
  {
    title: 'Coding Practice',
    description: 'Test your knowledge with hands-on practice. Write code, run tests, and get immediate feedback on your solutions.',
    icon: <Code2 className="w-6 h-6 text-udemy-purple dark:text-udemy-purple-light" />
  },
  {
    title: 'Competitive Programming',
    description: 'Prepare for interviews and contests in our Arena. Tackle challenging problems and optimize your solutions.',
    icon: <Trophy className="w-6 h-6 text-udemy-purple dark:text-udemy-purple-light" />
  },
  {
    title: 'Learning Paths',
    description: 'Follow structured roadmaps designed for beginners to advanced learners. Never wonder what to learn next.',
    icon: <GitMerge className="w-6 h-6 text-udemy-purple dark:text-udemy-purple-light" />
  },
  {
    title: 'Community Driven',
    description: 'Join a thriving community of learners. Share insights, ask questions, and grow together.',
    icon: <Users className="w-6 h-6 text-udemy-purple dark:text-udemy-purple-light" />
  },
  {
    title: 'Open Source',
    description: 'AlgoBuddy is open-source. Contribute to the platform, add new algorithms, and help others learn.',
    icon: <GitPullRequest className="w-6 h-6 text-udemy-purple dark:text-udemy-purple-light" />
  }
];

const timeline = [
  {
    year: 'Inception',
    title: 'The Idea Born',
    description: 'Realized the need for a truly interactive way to learn Data Structures and Algorithms without overwhelming text.'
  },
  {
    year: 'Version 1.0',
    title: 'Visualizers Launched',
    description: 'First set of sorting and graph algorithm visualizers released to the public.'
  },
  {
    year: 'Growth',
    title: 'Practice & Arena',
    description: 'Added the coding practice environment and competitive arena to test skills practically.'
  },
  {
    year: 'Future',
    title: 'AI & Beyond',
    description: 'Integrating AI-driven hints, broader algorithm coverage, and personalized learning paths.'
  }
];

const AboutSection = () => {
  return (
    <>
      <div className="bg-udemy-bg dark:bg-udemy-dark-bg min-h-screen font-sans selection:bg-udemy-purple/30 pb-10">
        
        {/* HERO SECTION */}
        <section className="relative py-24 md:py-32 overflow-hidden flex flex-col items-center justify-center text-center px-6">
          {/* Background Gradients */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[30rem] bg-udemy-purple/5 dark:bg-udemy-purple/10 blur-[100px] rounded-full pointer-events-none"></div>
          
          <div className="relative z-10 max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-udemy-purple/10 text-udemy-purple dark:text-udemy-purple-light font-medium text-sm mb-4 border border-udemy-purple/20">
              <Sparkles className="w-4 h-4" />
              <span>About AlgoBuddy</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold font-serif text-udemy-text dark:text-udemy-dark-text tracking-tight">
              Revolutionizing <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-udemy-purple to-udemy-purple-light">
                DSA Learning
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-udemy-muted dark:text-udemy-dark-muted max-w-2xl mx-auto leading-relaxed">
              We bridge the gap between complex theoretical concepts and practical understanding. Experience algorithms visually, practice interactively, and master computer science effortlessly.
            </p>
          </div>
        </section>

        {/* MISSION & VISION */}
        <section className="py-20 px-6 relative z-10">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Mission */}
              <div className="bg-white dark:bg-udemy-dark-surface p-8 md:p-10 rounded-3xl border border-udemy-border/50 dark:border-udemy-dark-border/50 shadow-sm hover:shadow-md transition duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Target className="w-32 h-32 text-udemy-purple" />
                </div>
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-udemy-purple/10 flex items-center justify-center mb-6">
                    <Target className="w-6 h-6 text-udemy-purple dark:text-udemy-purple-light" />
                  </div>
                  <h2 className="text-3xl font-bold text-udemy-text dark:text-udemy-dark-text mb-4">Our Mission</h2>
                  <p className="text-udemy-muted dark:text-udemy-dark-muted leading-relaxed text-lg">
                    To make data structures and algorithms accessible and intuitive for everyone. We believe that seeing concepts in action is the key to true mastery, moving beyond rote memorization to profound practical understanding.
                  </p>
                </div>
              </div>

              {/* Vision */}
              <div className="bg-white dark:bg-udemy-dark-surface p-8 md:p-10 rounded-3xl border border-udemy-border/50 dark:border-udemy-dark-border/50 shadow-sm hover:shadow-md transition duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Rocket className="w-32 h-32 text-udemy-purple" />
                </div>
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-udemy-purple/10 flex items-center justify-center mb-6">
                    <Rocket className="w-6 h-6 text-udemy-purple dark:text-udemy-purple-light" />
                  </div>
                  <h2 className="text-3xl font-bold text-udemy-text dark:text-udemy-dark-text mb-4">Our Vision</h2>
                  <p className="text-udemy-muted dark:text-udemy-dark-muted leading-relaxed text-lg">
                    To become the global standard platform for algorithmic education. We envision a future where every developer, regardless of their background, can confidently tackle complex computational problems.
                  </p>
                </div>
              </div>

              {/* Philosophy */}
              <div className="md:col-span-2 bg-gradient-to-br from-udemy-purple/5 to-transparent dark:from-udemy-purple/10 dark:to-transparent p-8 md:p-12 rounded-3xl border border-udemy-purple/20 dark:border-udemy-purple/30">
                <div className="max-w-3xl mx-auto text-center space-y-6">
                  <div className="w-16 h-16 mx-auto rounded-full bg-udemy-purple/20 flex items-center justify-center mb-6">
                    <BrainCircuit className="w-8 h-8 text-udemy-purple dark:text-udemy-purple-light" />
                  </div>
                  <h2 className="text-3xl font-bold text-udemy-text dark:text-udemy-dark-text">Our Learning Philosophy</h2>
                  <p className="text-udemy-muted dark:text-udemy-dark-muted leading-relaxed text-lg md:text-xl">
                    "Tell me and I forget, teach me and I may remember, involve me and I learn." <br/><br/>
                    We build on the principle that interactive visual feedback drastically reduces the cognitive load required to understand abstract computational models.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STATISTICS */}
        <section className="py-16 px-6 border-y border-udemy-border/50 dark:border-udemy-dark-border/50 bg-white/50 dark:bg-udemy-dark-surface/30">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, idx) => (
                <div key={idx} className="flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-udemy-purple/10 flex items-center justify-center text-udemy-purple dark:text-udemy-purple-light">
                    {stat.icon}
                  </div>
                  <h3 className="text-4xl font-bold text-udemy-text dark:text-udemy-dark-text tracking-tight">
                    {stat.value}
                  </h3>
                  <p className="text-sm font-medium text-udemy-muted dark:text-udemy-dark-muted uppercase tracking-wider">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURE HIGHLIGHTS */}
        <section className="py-24 px-6 relative z-10">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-4xl font-bold font-serif text-udemy-text dark:text-udemy-dark-text mb-4">Everything You Need to Master DSA</h2>
              <p className="text-lg text-udemy-muted dark:text-udemy-dark-muted">
                A comprehensive suite of tools designed to take you from a beginner to a confident problem solver.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, idx) => (
                <div key={idx} className="bg-white dark:bg-udemy-dark-surface p-8 rounded-2xl border border-udemy-border/40 dark:border-udemy-dark-border/50 hover:border-udemy-purple/50 transition-colors shadow-sm hover:shadow-md group">
                  <div className="w-12 h-12 rounded-lg bg-udemy-purple/5 dark:bg-udemy-purple/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-udemy-text dark:text-udemy-dark-text mb-3">{feature.title}</h3>
                  <p className="text-udemy-muted dark:text-udemy-dark-muted leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PLATFORM JOURNEY */}
        <section className="py-20 px-6">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-center text-udemy-text dark:text-udemy-dark-text mb-16">Our Journey</h2>
            
            <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-udemy-border dark:before:via-udemy-dark-border before:to-transparent">
              {timeline.map((item, idx) => (
                <div key={idx} className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active`}>
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-udemy-bg dark:border-udemy-dark-bg bg-udemy-purple text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                  
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white dark:bg-udemy-dark-surface p-6 rounded-2xl border border-udemy-border/40 dark:border-udemy-dark-border/50 shadow-sm hover:border-udemy-purple/30 transition-colors">
                    <span className="text-udemy-purple dark:text-udemy-purple-light font-bold text-sm tracking-wide uppercase mb-2 block">{item.year}</span>
                    <h3 className="text-xl font-bold text-udemy-text dark:text-udemy-dark-text mb-2">{item.title}</h3>
                    <p className="text-udemy-muted dark:text-udemy-dark-muted">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CALL TO ACTION */}
        <section className="py-24 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-udemy-purple/5 dark:bg-udemy-purple/10"></div>
          <div className="container mx-auto max-w-4xl relative z-10 text-center">
            <h2 className="text-4xl md:text-5xl font-bold font-serif text-udemy-text dark:text-udemy-dark-text mb-6">Ready to start your journey?</h2>
            <p className="text-lg md:text-xl text-udemy-muted dark:text-udemy-dark-muted mb-10 max-w-2xl mx-auto">
              Join thousands of learners who are mastering data structures and algorithms the visual way.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/visualizer" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-udemy-purple text-white font-bold hover:bg-udemy-purple-dark transition-colors flex items-center justify-center gap-2 shadow-lg shadow-udemy-purple/20">
                Explore Visualizers <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/practice" className="w-full sm:w-auto px-8 py-4 rounded-xl border border-udemy-border dark:border-udemy-dark-border bg-white dark:bg-udemy-dark-surface text-udemy-text dark:text-udemy-dark-text font-bold hover:border-udemy-purple dark:hover:border-udemy-purple-light transition-colors flex items-center justify-center gap-2">
                Start Practicing
              </Link>
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </>
  );
};

export default AboutSection;
