import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Home, PlusCircle, User, LayoutGrid, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navigation() {
  const [location] = useLocation();
  const { isAuthenticated, user } = useAuth();

  const navItems = [
    { href: "/", label: "Feed", icon: Home },
    { href: "/my-activity", label: "Activity", icon: LayoutGrid },
    { href: "/post", label: "Post", icon: PlusCircle, isPrimary: true },
    { href: "/profile", label: "Profile", icon: User },
  ];

  if (!isAuthenticated) {
    return (
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b z-50 px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-display font-bold text-primary tracking-tight">ShareMeal</span>
        </Link>
        <a 
          href="/api/login"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-opacity text-sm"
        >
          <LogIn className="w-4 h-4" />
          Login
        </a>
      </header>
    );
  }

  // Desktop Navigation
  const DesktopNav = () => (
    <header className="hidden md:flex fixed top-0 w-full bg-white/80 backdrop-blur-md border-b z-50 px-6 h-20 items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
        <span className="text-2xl font-display font-bold text-primary tracking-tight">ShareMeal</span>
      </Link>
      
      <nav className="flex items-center gap-8">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex items-center gap-2 font-medium transition-colors hover:text-primary",
                isActive ? "text-primary" : "text-muted-foreground",
                item.isPrimary && "bg-primary text-primary-foreground px-4 py-2 rounded-full hover:text-primary-foreground hover:bg-primary/90"
              )}
            >
              <item.icon className={cn("w-5 h-5", item.isPrimary ? "" : "stroke-current")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-3">
         {user?.profileImageUrl && (
           <img src={user.profileImageUrl} alt="Profile" className="w-8 h-8 rounded-full border border-border" />
         )}
      </div>
    </header>
  );

  // Mobile Bottom Navigation
  const MobileNav = () => (
    <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-border z-50 pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full gap-1",
                isActive ? "text-primary" : "text-muted-foreground hover:text-primary/60"
              )}
            >
              {item.isPrimary ? (
                <div className="bg-primary text-primary-foreground p-3 rounded-full -mt-6 shadow-lg shadow-primary/30 border-4 border-background">
                  <item.icon className="w-6 h-6" />
                </div>
              ) : (
                <>
                  <item.icon className={cn("w-6 h-6 transition-transform", isActive && "scale-110")} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );

  return (
    <>
      <DesktopNav />
      <MobileNav />
    </>
  );
}
