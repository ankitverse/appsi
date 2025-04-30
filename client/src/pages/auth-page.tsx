import { useState, useEffect } from "react";
import { useAuth, loginSchema } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Redirect } from "wouter";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  // Redirect if already logged in
  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="flex min-h-screen">
      {/* Left column - Auth form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "register")} className="w-full max-w-md">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Welcome back</CardTitle>
                <CardDescription>
                  Login to your account to manage templates and access the studio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LoginForm isLoading={loginMutation.isPending} onSubmit={loginMutation.mutate} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>
                  Register a new account to start building websites
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RegisterForm isLoading={registerMutation.isPending} onSubmit={registerMutation.mutate} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Right column - Hero section */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary to-primary-foreground">
        <div className="flex flex-col justify-center items-center text-white p-12 w-full">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-center">
            Website Builder Studio
          </h1>
          <p className="text-lg md:text-xl text-center mb-8 max-w-lg">
            Create stunning websites with our easy-to-use drag and drop builder.
            Choose from a variety of templates and customize them to fit your needs.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
            <FeatureCard 
              title="Modern Templates" 
              description="Beautiful, responsive templates for any type of website"
            />
            <FeatureCard 
              title="Easy Customization" 
              description="Intuitive drag and drop editor to create your perfect site"
            />
            <FeatureCard 
              title="Responsive Design" 
              description="Websites that look great on any device"
            />
            <FeatureCard 
              title="Free to use" 
              description="Start building your website at no cost"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-white/80 text-sm">{description}</p>
    </div>
  );
}

function LoginForm({ 
  onSubmit, 
  isLoading 
}: { 
  onSubmit: (data: z.infer<typeof loginSchema>) => void; 
  isLoading: boolean;
}) {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter your username" {...field} />
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter your password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </Button>
      </form>
    </Form>
  );
}

function RegisterForm({ 
  onSubmit, 
  isLoading 
}: { 
  onSubmit: (data: z.infer<typeof loginSchema>) => void; 
  isLoading: boolean;
}) {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Choose a username" {...field} />
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Create a password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Register"
          )}
        </Button>
      </form>
    </Form>
  );
}