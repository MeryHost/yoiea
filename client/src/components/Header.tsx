import { Zap, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";

export function Header() {
  const [location, setLocation] = useLocation();
  const isAccountPage = location === '/account';

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b">
      <div className="max-w-7xl mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <button 
            onClick={() => setLocation('/')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Zap className="w-6 h-6 text-primary fill-primary" />
            <span className="text-xl font-bold">MeryHost</span>
          </button>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Help
            </a>
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Integrations
            </a>
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Contact Sales
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {isAccountPage && (
            <>
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
            </>
          )}
          <Button 
            variant={isAccountPage ? "default" : "ghost"} 
            size="sm" 
            onClick={() => setLocation('/account')}
            data-testid="button-account"
          >
            {isAccountPage ? 'Dashboard' : 'My Account'}
          </Button>
          {!isAccountPage && (
            <Button size="sm" data-testid="button-signup">
              Sign up free
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
