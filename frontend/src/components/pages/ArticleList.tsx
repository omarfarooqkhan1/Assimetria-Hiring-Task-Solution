import { ArticleCard, ArticleCardSkeleton } from "@/components/article-card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import type { Article } from "@/types";

interface ArticleListProps {
  articles?: Article[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
}

export function ArticleList({
  articles = [],
  isLoading = false,
  isError = false,
  onRetry,
  hasActiveFilters = false,
  onClearFilters,
}: ArticleListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <ArticleCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-destructive" />
        </div>
        <h3 className="text-xl font-semibold mb-2">
          Failed to load articles
        </h3>
        <p className="text-muted-foreground mb-6">
          Something went wrong while fetching articles.
        </p>
        {onRetry && (
          <Button onClick={onRetry} data-testid="button-retry">
            Try Again
          </Button>
        )}
      </div>
    );
  }

  if (articles && articles.length > 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {articles.map((article, index) => (
          <ArticleCard key={article.id} article={article} index={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
        <FileText className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">
        {hasActiveFilters ? "No matching articles" : "No articles yet"}
      </h3>
      <p className="text-muted-foreground mb-6">
        {hasActiveFilters 
          ? "Try adjusting your search or filters." 
          : "Articles are being generated. Check back soon!"}
      </p>
      {hasActiveFilters && onClearFilters && (
        <Button onClick={onClearFilters} data-testid="button-clear-empty">
          Clear Filters
        </Button>
      )}
    </div>
  );
}