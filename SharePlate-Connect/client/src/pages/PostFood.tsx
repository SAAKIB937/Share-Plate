import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@shared/routes";
import { useCreateListing } from "@/hooks/use-listings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Camera, MapPin, Calendar, Package } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";

// Helper to coerce dates from string input
const formSchema = api.listings.create.input.extend({
  expiresAt: z.string().transform((str) => new Date(str).toISOString()),
});

type FormValues = z.input<typeof formSchema>;

export default function PostFood() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { mutate, isPending } = useCreateListing();

  useEffect(() => {
    if (!isAuthLoading && !user) {
      window.location.href = "/api/login";
    }
  }, [user, isAuthLoading]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      quantity: "",
      location: "",
      imageUrl: "",
      expiresAt: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    mutate(values as any, {
      onSuccess: () => setLocation("/"),
    });
  };

  if (isAuthLoading) return null;

  return (
    <div className="min-h-screen bg-background pb-24 pt-20">
      <div className="container max-w-2xl mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-display font-bold mb-2">Donate Food</h1>
          <p className="text-muted-foreground">Fill in the details to share surplus food with your neighbors.</p>
        </div>

        <Card className="border-border shadow-lg rounded-3xl overflow-hidden">
          <CardContent className="p-6 sm:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                {/* Image URL */}
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL (Optional)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Camera className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                          <Input placeholder="https://..." {...field} className="pl-10 rounded-xl bg-muted/30 border-border h-12" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Fresh Sourdough Bread" {...field} className="rounded-xl bg-muted/30 border-border h-12 text-lg font-medium" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the food, ingredients, and condition..." 
                          {...field} 
                          className="rounded-xl bg-muted/30 border-border min-h-[100px] resize-none" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Quantity */}
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Package className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                            <Input placeholder="e.g. 2 loaves" {...field} className="pl-10 rounded-xl bg-muted/30 border-border h-12" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Expires At */}
                  <FormField
                    control={form.control}
                    name="expiresAt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expires At</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                            <Input type="datetime-local" {...field} className="pl-10 rounded-xl bg-muted/30 border-border h-12" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Location */}
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pickup Location</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                          <Input placeholder="e.g. 123 Main St, Lobby" {...field} className="pl-10 rounded-xl bg-muted/30 border-border h-12" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  disabled={isPending}
                  className="w-full h-14 rounded-xl text-lg font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 mt-4"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    "Post Listing"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
