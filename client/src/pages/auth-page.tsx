import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { user, loginMutation } = useAuth();

  const form = useForm({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  if (user) {
    setLocation("/admin");
    return null;
  }

  const onSubmit = form.handleSubmit((data) => {
    loginMutation.mutate(data);
  });

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Access</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={onSubmit} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Username</Label>
                      <FormControl>
                        <Input {...field} placeholder="username" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Password</Label>
                      <FormControl>
                        <Input type="password" {...field} placeholder="••••••••" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? "Logging in..." : "Login"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div 
        className="hidden md:block bg-cover bg-center" 
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1454165804606-c3d57bc86b40")'
        }}
      >
        <div className="h-full w-full bg-black/50 p-12 flex items-center">
          <div className="text-white">
            <h1 className="text-4xl font-bold mb-4">Welcome to the Admin Panel</h1>
            <p className="text-lg">Manage your portfolio content with ease.</p>
          </div>
        </div>
      </div>
    </div>
  );
}