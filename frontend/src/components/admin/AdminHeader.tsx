import { Button } from "@/components/ui/button";
import { Shield, LogOut } from "lucide-react";

interface AdminHeaderProps {
  username: string;
  onViewSite: () => void;
  onLogout: () => void;
}

export function AdminHeader({ username, onViewSite, onLogout }: AdminHeaderProps) {
  return (
    <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Admin Panel</h1>
            <p className="text-sm text-muted-foreground">Logged in as {username}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            onClick={onViewSite}
            data-testid="button-view-site"
          >
            View Site
          </Button>
          <Button
            variant="ghost"
            onClick={onLogout}
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}