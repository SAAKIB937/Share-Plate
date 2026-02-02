import { Request } from "@/hooks/use-requests";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RequestCardProps {
  request: Request;
}

export function RequestCard({ request }: RequestCardProps) {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    approved: "bg-green-100 text-green-800 border-green-200",
    rejected: "bg-red-100 text-red-800 border-red-200",
    completed: "bg-gray-100 text-gray-800 border-gray-200",
  };

  return (
    <div className="bg-card rounded-2xl p-5 border border-border hover:border-primary/30 transition-colors shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-display font-bold text-lg">{request.listing.title}</h4>
        <Badge variant="outline" className={cn("capitalize border", statusColors[request.status as keyof typeof statusColors])}>
          {request.status}
        </Badge>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        Requested on {format(new Date(request.createdAt), "MMM d, yyyy")}
      </p>

      {request.message && (
        <div className="bg-muted/50 p-3 rounded-xl text-sm text-muted-foreground italic mb-4">
          "{request.message}"
        </div>
      )}

      <div className="flex items-center gap-2">
        <img 
          src={request.listing.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=100"} 
          alt={request.listing.title}
          className="w-10 h-10 rounded-lg object-cover"
        />
        <div className="text-xs text-muted-foreground">
          <p className="font-medium text-foreground">Pickup Location</p>
          <p>{request.listing.location}</p>
        </div>
      </div>
    </div>
  );
}
