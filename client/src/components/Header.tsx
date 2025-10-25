import { Zap, Menu, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";

export function Header() {
  const [location] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  const isAccountPage = location === '/account';

  const handleLogin = () => {
    window.location.href = '/api/login';
  };

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

        {!isLoading && (
          <>
            {isAccountPage && isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline text-sm text-muted-foreground">
                  Earn $50
                </span>
                <Button variant="outline" size="sm" data-testid="button-add-team">
                  Add Team
                </Button>
                <Button variant="ghost" size="sm" className="gap-2" data-testid="button-free-plan">
                  <Badge variant="secondary" className="rounded-full">
                    Free plan
                  </Badge>
                  <Menu className="w-4 h-4" />
                </Button>
                <Button 
                  size="sm" 
                  className="gap-2"
                  data-testid="button-upgrade"
                >
                  Upgrade
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {isAuthenticated ? (
                  <>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      data-testid="button-account"
                      onClick={() => window.location.href = '/account'}
                    >
                      My Sites
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      data-testid="button-logout"
                      onClick={handleLogout}
                    >
                      Log out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      data-testid="button-login"
                      onClick={handleLogin}
                    >
                      Log in
                    </Button>
                    <Button 
                      size="sm" 
                      className="gap-2"
                      data-testid="button-signup"
                      onClick={handleLogin}
                    >
                      Sign up free
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </header>
  );
}
