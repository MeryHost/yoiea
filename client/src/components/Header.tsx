import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b">
      <div className="max-w-7xl mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-6 h-6 text-primary fill-primary" />
          <span className="text-xl font-bold">MeryHost</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Blog
          </a>
          <a href="#" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            API
          </a>
          <a href="#" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Help
          </a>
          <a href="#" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Pricing
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" data-testid="button-login">
            Log in
          </Button>
          <Button size="sm" data-testid="button-signup">
            Sign up free
          </Button>
        </div>
      </div>
    </header>
  );
}
