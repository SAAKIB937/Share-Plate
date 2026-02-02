import { useListings } from "@/hooks/use-listings";
import { ListingCard } from "@/components/ListingCard";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const { data: listings, isLoading, error } = useListings();
  const [search, setSearch] = useState("");

  const filteredListings = listings?.filter(l => 
    l.title.toLowerCase().includes(search.toLowerCase()) || 
    l.location.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 text-center p-4">
        <h2 className="text-2xl font-display font-bold text-destructive">Oops!</h2>
        <p className="text-muted-foreground">Failed to load listings. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 md:pt-20 pt-20">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-8 space-y-4">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl md:text-5xl font-display font-extrabold text-foreground"
          >
            Share Food, <span className="text-primary">Spread Love.</span>
          </motion.h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Connect with your community to reduce food waste and help those in need.
          </p>
          
          <div className="relative max-w-md mt-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input 
              placeholder="Search by food or location..." 
              className="pl-12 py-6 rounded-2xl border-2 border-border focus:border-primary text-base shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Listings Grid */}
        {filteredListings?.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-border">
            <h3 className="text-xl font-bold text-muted-foreground">No listings found</h3>
            <p className="text-muted-foreground mt-2">Try adjusting your search or check back later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredListings?.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
