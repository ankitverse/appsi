import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  const [location] = useLocation();

  // Hide navigation on studio page
  if (location.startsWith("/studio")) {
    return null;
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <span className="font-inter font-bold text-2xl text-primary cursor-pointer">
                  Appsi
                </span>
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-8">
            <Link href="/">
              <a className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium">
                Templates
              </a>
            </Link>
            <a
              href="#features"
              className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium"
            >
              Pricing
            </a>
            <a
              href="#support"
              className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium"
            >
              Support
            </a>
          </div>
          <div className="flex items-center">
            <Button variant="outline" className="mr-2">
              Sign In
            </Button>
            <Button>Get Started</Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
