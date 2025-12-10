import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Article } from "@/types";
import {
  AdminLogin,
  AdminHeader,
  HealthStats,
  ArticlesHeader,
  ArticlesTable,
  EditArticleDialog,
  DeleteArticleDialog
} from "@/components/admin";

interface User {
  id: string;
  username: string;
}

interface AuthState {
  user: User | null;
}

interface HealthData {
  status: string;
  timestamp: string;
  version: string;
  uptime: number;
  database: {
    connected: boolean;
    latencyMs: number;
    articleCount: number;
    userCount: number;
  };
  memory: {
    heapUsedMB: number;
    heapTotalMB: number;
    rssMB: number;
  };
}

export default function AdminPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [deleteArticleId, setDeleteArticleId] = useState<string | null>(null);

  const { data: authData, isLoading: authLoading, refetch: refetchAuth } = useQuery<AuthState>({
    queryKey: ["/api/auth/user"],
  });

  const { data: setupStatus } = useQuery<{ isSetupComplete: boolean }>({
    queryKey: ["/api/auth/setup-status"],
    enabled: !authData?.user,
  });

  const { data: articles, isLoading: articlesLoading, refetch: refetchArticles } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
    enabled: !!authData?.user,
  });

  const { data: healthData } = useQuery<HealthData>({
    queryKey: ["/api/health"],
    enabled: !!authData?.user,
    refetchInterval: 30000,
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const res = await apiRequest("POST", "/api/auth/login", credentials);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Login successful", description: "Welcome to the admin panel" });
      refetchAuth();
    },
    onError: (error: Error) => {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    },
  });

  const setupMutation = useMutation({
    mutationFn: async (password: string) => {
      const res = await apiRequest("POST", "/api/auth/setup", { password });
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Admin account created", description: "You can now log in with username 'admin'" });
      setIsLoginMode(true);
    },
    onError: (error: Error) => {
      toast({ title: "Setup failed", description: error.message, variant: "destructive" });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/auth/logout", {});
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Logged out" });
      refetchAuth();
    },
  });

  const generateMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/articles/generate", {});
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Article generated", description: "A new article has been created" });
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      refetchArticles();
    },
    onError: (error: Error) => {
      toast({ title: "Generation failed", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Article> }) => {
      const res = await apiRequest("PUT", `/api/articles/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Article updated" });
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      refetchArticles();
      setEditingArticle(null);
    },
    onError: (error: Error) => {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/articles/${id}`, {});
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Article deleted" });
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      refetchArticles();
      setDeleteArticleId(null);
    },
    onError: (error: Error) => {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    },
  });

  const handleLogin = (username: string, password: string) => {
    loginMutation.mutate({ username, password });
  };

  const handleSetup = (password: string) => {
    setupMutation.mutate(password);
  };

  const handleSaveEdit = (formData: { title: string; summary: string; content: string; category: string; tags: string }) => {
    if (!editingArticle) return;
    const tags = formData.tags.split(",").map(t => t.trim()).filter(t => t);
    updateMutation.mutate({
      id: editingArticle.id,
      data: {
        title: formData.title,
        summary: formData.summary,
        content: formData.content,
        category: formData.category,
        tags,
      },
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!authData?.user) {
    return (
      <AdminLogin
        isLoginMode={isLoginMode}
        setIsLoginMode={setIsLoginMode}
        onLogin={handleLogin}
        onSetup={handleSetup}
        isLoginPending={loginMutation.isPending}
        isSetupPending={setupMutation.isPending}
        setupComplete={setupStatus?.isSetupComplete}
      />
    );
  }

  return (
    <div className="min-h-screen">
      <AdminHeader
        username={authData.user.username}
        onViewSite={() => setLocation("/")}
        onLogout={() => logoutMutation.mutate()}
      />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {healthData && <HealthStats healthData={healthData} />}
        
        <ArticlesHeader
          articleCount={articles?.length || 0}
          onRefresh={() => refetchArticles()}
          onGenerate={() => generateMutation.mutate()}
          isRefreshing={articlesLoading}
          isGenerating={generateMutation.isPending}
        />
        
        {articlesLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          </div>
        ) : articles && articles.length > 0 ? (
          <ArticlesTable
            articles={articles}
            onEdit={(article) => setEditingArticle(article)}
            onDelete={(id) => setDeleteArticleId(id)}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No articles found</p>
          </div>
        )}
      </main>
      
      <EditArticleDialog
        article={editingArticle}
        open={!!editingArticle}
        onClose={() => setEditingArticle(null)}
        onSave={handleSaveEdit}
        isSaving={updateMutation.isPending}
      />
      
      <DeleteArticleDialog
        open={!!deleteArticleId}
        onClose={() => setDeleteArticleId(null)}
        onConfirm={() => deleteArticleId && deleteMutation.mutate(deleteArticleId)}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
