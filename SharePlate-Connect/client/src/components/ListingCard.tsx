import { Listing } from "@/hooks/use-listings";
import { formatDistanceToNow } from "date-fns";
import { MapPin, Clock, Package } from "lucide-react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useCreateRequest } from "@/hooks/use-requests";
import { useAuth } from "@/hooks/use-auth";

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const { mutate: createRequest, isPending } = useCreateRequest();
  const { isAuthenticated } = useAuth();

  const handleRequest = () => {
    createRequest(
      { listingId: listing.id, data: { message } },
      { onSuccess: () => setIsOpen(false) }
    );
  };

  const isExpired = new Date(listing.expiresAt) < new Date();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group bg-card rounded-2xl overflow-hidden shadow-sm border border-border hover:shadow-xl hover:border-primary/20 transition-all duration-300 flex flex-col h-full"
    >
      <div className="relative h-48 overflow-hidden bg-muted">
        {listing.imageUrl ? (
          <img 
            src={listing.imageUrl} 
            alt={listing.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-secondary">
            <Package className="w-12 h-12 opacity-20" />
          </div>
        )}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm">
          {listing.status}
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-xl font-display font-bold text-card-foreground mb-2 line-clamp-1">{listing.title}</h3>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-1">{listing.description}</p>
        
        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <span className="truncate">{listing.location}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span>Expires {formatDistanceToNow(new Date(listing.expiresAt), { addSuffix: true })}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
            <Package className="w-3.5 h-3.5 text-primary" />
            <span>{listing.quantity}</span>
          </div>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button 
              className="w-full rounded-xl bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
              disabled={isExpired || listing.status !== 'available'}
            >
              {isExpired ? 'Expired' : 'Request Food'}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">Request {listing.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {!isAuthenticated && (
                <div className="bg-yellow-50 text-yellow-800 p-4 rounded-xl text-sm mb-2">
                  Please log in to make a request. You will be redirected.
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium">Message to Donor (Optional)</label>
                <Textarea 
                  placeholder="Hi, I'd love to pick this up! When are you available?" 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="rounded-xl border-border focus:ring-primary min-h-[100px]"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={() => setIsOpen(false)} className="rounded-xl">Cancel</Button>
                <Button 
                  onClick={handleRequest} 
                  disabled={isPending}
                  className="rounded-xl bg-primary text-primary-foreground"
                >
                  {isPending ? "Sending..." : "Send Request"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </motion.div>
  );
}
