import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/auth-utils";

// Types
export type Request = z.infer<typeof api.requests.list.responses[200]>[number];
export type CreateRequestInput = z.infer<typeof api.requests.create.input>;
export type UpdateRequestStatusInput = z.infer<typeof api.requests.updateStatus.input>;

export function useMyRequests() {
  return useQuery({
    queryKey: [api.requests.list.path],
    queryFn: async () => {
      const res = await fetch(api.requests.list.path, { credentials: "include" });
      if (res.status === 401) return null; // Handle auth gracefully
      if (!res.ok) throw new Error("Failed to fetch requests");
      const data = await res.json();
      return api.requests.list.responses[200].parse(data);
    },
  });
}

export function useCreateRequest() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ listingId, data }: { listingId: number; data: CreateRequestInput }) => {
      const url = buildUrl(api.requests.create.path, { listingId });
      const validated = api.requests.create.input.parse(data);

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 401) throw new Error("Unauthorized");
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create request");
      }

      return api.requests.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.requests.list.path] });
      toast({
        title: "Request Sent",
        description: "The donor will be notified of your interest.",
        variant: "default",
        className: "bg-primary text-primary-foreground border-none",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Please log in",
          description: "You need to be logged in to request food.",
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

export function useUpdateRequestStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: "approved" | "rejected" | "completed" }) => {
      const url = buildUrl(api.requests.updateStatus.path, { id });
      const validated = api.requests.updateStatus.input.parse({ status });

      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to update status");
      return api.requests.updateStatus.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.requests.list.path] });
      toast({
        title: "Status Updated",
        description: "The request status has been changed.",
      });
    },
  });
}
