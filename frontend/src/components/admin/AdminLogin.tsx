import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";

interface AdminLoginProps {
  isLoginMode: boolean;
  setIsLoginMode: (mode: boolean) => void;
  onLogin: (username: string, password: string) => void;
  onSetup: (password: string) => void;
  isLoginPending?: boolean;
  isSetupPending?: boolean;
  setupComplete?: boolean;
}

export function AdminLogin({
  isLoginMode,
  setIsLoginMode,
  onLogin,
  onSetup,
  isLoginPending = false,
  isSetupPending = false,
  setupComplete = false,
}: AdminLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoginMode) {
      onLogin(username, password);
    } else {
      onSetup(password);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">{isLoginMode ? "Admin Login" : "Setup Admin Account"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isLoginMode && (
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  data-testid="input-username"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isLoginMode ? "Enter password" : "Create password (min 8 chars)"}
                data-testid="input-password"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoginPending || isSetupPending}
              data-testid="button-submit"
            >
              {isLoginPending || isSetupPending ? "Loading..." : isLoginMode ? "Login" : "Create Admin"}
            </Button>
          </form>
          {!setupComplete && (
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setIsLoginMode(!isLoginMode)}
                className="text-sm text-muted-foreground hover:text-foreground"
                data-testid="button-toggle-mode"
              >
                {isLoginMode ? "First time? Create admin account" : "Already have an account? Login"}
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}