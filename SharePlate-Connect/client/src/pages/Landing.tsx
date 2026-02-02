import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Leaf, Heart, Users } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <header className="px-6 py-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <span className="text-2xl font-display font-bold text-primary tracking-tight">ShareMeal</span>
        <div className="flex gap-4">
          <Link href="/api/login">
            <Button variant="ghost" className="rounded-full font-medium">Log In</Button>
          </Link>
          <Link href="/api/login">
            <Button className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 container max-w-7xl mx-auto px-6 py-12 md:py-24 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <h1 className="text-5xl md:text-7xl font-display font-extrabold leading-[1.1] text-foreground">
            Reduce Waste.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">
              Share Food.
            </span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
            Connect with your neighbors to share surplus food. A simple way to build community and fight food waste together.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/api/login">
              <Button size="lg" className="rounded-full h-14 px-8 text-lg bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20">
                Join the Community
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          {/* Unsplash Image: Community food sharing table */}
          {/* Description: A warm, inviting table full of fresh food with diverse hands reaching for it, symbolizing community. */}
          <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white transform rotate-2 hover:rotate-0 transition-transform duration-500">
            <img 
              src="https://images.unsplash.com/photo-1599059813005-11265ba4b4ce?auto=format&fit=crop&q=80&w=1000" 
              alt="Community Food Sharing" 
              className="w-full h-auto object-cover"
            />
          </div>
          
          {/* Floating badge */}
          <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce-slow">
            <div className="bg-green-100 p-2 rounded-full text-green-600">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">100% Sustainable</p>
              <p className="text-xs text-muted-foreground">Zero food waste</p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Features */}
      <section className="bg-white py-20">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Leaf, title: "Eco-Friendly", desc: "Reduce your carbon footprint by preventing food from ending up in landfills." },
              { icon: Users, title: "Community Driven", desc: "Meet your neighbors and build a stronger, more connected local community." },
              { icon: Heart, title: "Help Others", desc: "Support those in need by sharing your surplus food effortlessly." }
            ].map((feature, i) => (
              <div key={i} className="bg-background p-8 rounded-3xl border border-border/50 hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-display font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
