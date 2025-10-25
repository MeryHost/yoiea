import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";

export function Header() {
  const [location] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  const isAccountPage = location === '/account';

  const handleLogout = () => {
    window.location.href = '/api/logout';
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b">
      <div className="max-w-7xl mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <button 
            onClick={() => window.location.href = '/'}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Zap className="w-6 h-6 text-primary fill-primary" />
            <span className="text-xl font-bold">MeryHost</span>
          </button>
        </div>

        {!isLoading && isAuthenticated && (
          <div className="flex items-center gap-3">
            {!isAccountPage && (
              <Button 
                variant="ghost" 
                size="sm" 
                data-testid="button-account"
                onClick={() => window.location.href = '/account'}
              >
                My Sites
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              data-testid="button-logout"
              onClick={handleLogout}
            >
              Log out
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
