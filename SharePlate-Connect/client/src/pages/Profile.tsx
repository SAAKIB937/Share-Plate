import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut, Mail, User as UserIcon } from "lucide-react";
import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Profile() {
  const { user, isLoading, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      window.location.href = "/api/login";
    }
  }, [user, isLoading]);

  if (isLoading) return <Loader2 className="w-8 h-8 animate-spin mx-auto mt-20" />;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background pb-24 pt-20 flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <div className="bg-card rounded-3xl shadow-xl border border-border p-8 text-center">
          
          <div className="relative mx-auto w-24 h-24 mb-6">
            <Avatar className="w-full h-full border-4 border-background shadow-lg">
              <AvatarImage src={user.profileImageUrl || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-4 border-card rounded-full" />
          </div>

          <h2 className="text-2xl font-display font-bold text-foreground">
            {user.firstName} {user.lastName}
          </h2>
          <div className="flex items-center justify-center gap-2 mt-2 text-muted-foreground mb-8">
            <Mail className="w-4 h-4" />
            <span className="text-sm">{user.email}</span>
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-secondary/50 rounded-2xl flex items-center gap-3 text-left">
              <div className="bg-background p-2 rounded-xl">
                <UserIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Account Type</p>
                <p className="font-medium">Community Member</p>
              </div>
            </div>
            
            <Button 
              variant="destructive" 
              className="w-full rounded-xl h-12 mt-6 gap-2"
              onClick={() => logout()}
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>

        </div>
        
        <p className="text-center text-xs text-muted-foreground mt-8">
          ShareMeal v1.0.0 &copy; 2024
        </p>
      </div>
    </div>
  );
}
