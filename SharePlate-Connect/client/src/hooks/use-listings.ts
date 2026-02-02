import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/auth-utils";

// Types derived from the schema via shared routes
export type Listing = z.infer<typeof api.listings.get.responses[200]>;
export type CreateListingInput = z.infer<typeof api.listings.create.input>;

export function useListings() {
  return useQuery({
    queryKey: [api.listings.list.path],
    queryFn: async () => {
      const res = await fetch(api.listings.list.path);
      if (!res.ok) throw new Error("Failed to fetch listings");
      const data = await res.json();
      return api.listings.list.responses[200].parse(data);
    },
  });
}

export function useListing(id: number) {
  return useQuery({
    queryKey: [api.listings.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.listings.get.path, { id });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch listing");
      const data = await res.json();
      return api.listings.get.responses[200].parse(data);
    },
    enabled: !!id,
  });
}

export function useCreateListing() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateListingInput) => {
      // Ensure date is properly serialized if needed, though JSON.stringify handles Date -> ISO string
      const validated = api.listings.create.input.parse(data);
      
      const res = await fetch(api.listings.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 401) throw new Error("Unauthorized");
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create listing");
      }

      const responseData = await res.json();
      return api.listings.create.responses[201].parse(responseData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.listings.list.path] });
      toast({
        title: "Success!",
        description: "Your food listing has been posted.",
        variant: "default",
        className: "bg-primary text-primary-foreground border-none",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Please log in",
          description: "You need to be logged in to post food.",
          variant: "destructive",
        });
        setTimeout(() => window.location.href = "/api/login", 1000);
      } else {
        toast({
          title: "Error",
          description: (error as Error).message,
          variant: "destructive",
        });
      }
    },
  });
}
