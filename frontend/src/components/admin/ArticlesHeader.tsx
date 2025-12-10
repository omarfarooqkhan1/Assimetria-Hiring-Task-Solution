import { Button } from "@/components/ui/button";
import { RefreshCw, Plus } from "lucide-react";

interface ArticlesHeaderProps {
  articleCount: number;
  onRefresh: () => void;
  onGenerate: () => void;
  isRefreshing?: boolean;
  isGenerating?: boolean;
}

export function ArticlesHeader({ 
  articleCount, 
  onRefresh, 
  onGenerate, 
  isRefreshing = false, 
  isGenerating = false 
}: ArticlesHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
      <div>
        <h2 className="text-2xl font-semibold">Articles</h2>
        <p className="text-muted-foreground">{articleCount} total articles</p>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          variant="outline"
          onClick={onRefresh}
          disabled={isRefreshing}
          data-testid="button-refresh-articles"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
        <Button
          onClick={onGenerate}
          disabled={isGenerating}
          data-testid="button-generate"
        >
          <Plus className="w-4 h-4 mr-2" />
          {isGenerating ? "Generating..." : "Generate Article"}
        </Button>
      </div>
    </div>
  );
}