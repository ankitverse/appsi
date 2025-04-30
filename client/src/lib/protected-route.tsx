import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

interface ProtectedRouteProps {
  path: string;
  component: React.ComponentType;
  adminOnly?: boolean;
}

export function ProtectedRoute({
  path,
  component: Component,
  adminOnly = false,
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Route>
    );
  }

  if (!user) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  // If route requires admin access, check if user is admin
  if (adminOnly && user.username !== "admin") {
    return (
      <Route path={path}>
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="text-lg text-muted-foreground mb-6">
            You don't have permission to access this page.
          </p>
          <a
            href="/"
            className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-md text-sm transition-colors"
          >
            Go back to home
          </a>
        </div>
      </Route>
    );
  }

  return (
    <Route path={path}>
      <Component />
    </Route>
  );
}