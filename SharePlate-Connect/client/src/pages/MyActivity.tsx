import { useAuth } from "@/hooks/use-auth";
import { useListings } from "@/hooks/use-listings";
import { useMyRequests } from "@/hooks/use-requests";
import { ListingCard } from "@/components/ListingCard";
import { RequestCard } from "@/components/RequestCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, PackageOpen, Inbox } from "lucide-react";
import { useEffect } from "react";

export default function MyActivity() {
  const { user, isLoading: authLoading } = useAuth();
  
  // Fetch ALL listings then filter client-side (MVP approach)
  const { data: allListings, isLoading: listingsLoading } = useListings();
  const { data: myRequests, isLoading: requestsLoading } = useMyRequests();

  useEffect(() => {
    if (!authLoading && !user) {
      window.location.href = "/api/login";
    }
  }, [user, authLoading]);

  if (authLoading || listingsLoading || requestsLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Filter listings where donorId matches current user
  const myListings = allListings?.filter(l => l.donorId === user?.id) || [];

  return (
    <div className="min-h-screen bg-background pb-24 pt-20">
      <div className="container max-w-5xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-display font-bold mb-8">My Activity</h1>

        <Tabs defaultValue="listings" className="w-full">
          <TabsList className="w-full sm:w-auto grid grid-cols-2 mb-8 bg-muted/50 p-1 rounded-2xl h-14">
            <TabsTrigger 
              value="listings" 
              className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium"
            >
              My Listings
            </TabsTrigger>
            <TabsTrigger 
              value="requests" 
              className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium"
            >
              My Requests
            </TabsTrigger>
          </TabsList>

          <TabsContent value="listings" className="space-y-6">
            {myListings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-card rounded-3xl border border-dashed">
                <PackageOpen className="w-16 h-16 text-muted-foreground/30 mb-4" />
                <h3 className="text-xl font-bold text-muted-foreground">No listings yet</h3>
                <p className="text-muted-foreground mt-2 max-w-sm">You haven't posted any food yet. Start sharing to make a difference!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {myListings.map(listing => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="requests" className="space-y-6">
            {(!myRequests || myRequests.length === 0) ? (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-card rounded-3xl border border-dashed">
                <Inbox className="w-16 h-16 text-muted-foreground/30 mb-4" />
                <h3 className="text-xl font-bold text-muted-foreground">No requests yet</h3>
                <p className="text-muted-foreground mt-2 max-w-sm">You haven't requested any food yet. Browse the feed to find something!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myRequests.map(request => (
                  <RequestCard key={request.id} request={request} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
