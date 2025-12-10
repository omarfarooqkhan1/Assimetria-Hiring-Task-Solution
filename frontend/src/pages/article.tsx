import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import type { Article } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { ArticleHeader } from "@/components/pages/ArticleHeader";
import { ArticleContent } from "@/components/pages/ArticleContent";
import { ArticleSkeleton } from "@/components/pages/ArticleSkeleton";
import { NotFound } from "@/components/pages/NotFound";

function generateGradient(id?: string): string {
  if (!id) {
    return "from-blue-500/20 via-purple-500/20 to-pink-500/20";
  }
  const hash = id.split("").reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);

  const gradients = [
    "from-blue-500/20 via-purple-500/20 to-pink-500/20",
    "from-emerald-500/20 via-teal-500/20 to-cyan-500/20",
    "from-orange-500/20 via-amber-500/20 to-yellow-500/20",
    "from-rose-500/20 via-pink-500/20 to-fuchsia-500/20",
    "from-violet-500/20 via-purple-500/20 to-indigo-500/20",
    "from-cyan-500/20 via-sky-500/20 to-blue-500/20",
  ];

  return gradients[Math.abs(hash) % gradients.length];
}

function getCategoryColor(category?: string): string {
  const colors: Record<string, string> = {
    technology: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    science: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    innovation: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    business: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    health: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    default: "bg-muted text-muted-foreground",
  };
  if (!category) return colors.default;
  return colors[category.toLowerCase()] || colors.default;
}

export default function ArticlePage() {
  const [, params] = useRoute("/article/:id");
  const { toast } = useToast();

  const {
    data: article,
    isLoading,
    isError,
  } = useQuery<Article>({
    queryKey: ["/api/articles", params?.id],
    enabled: !!params?.id,
  });

  const handleShare = async () => {
    if (navigator.share && article) {
      try {
        await navigator.share({
          title: article.title,
          text: article.summary,
          url: window.location.href,
        });
      } catch {
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied",
      description: "Article link has been copied to clipboard.",
    });
  };

  if (isLoading) {
    return <ArticleSkeleton />;
  }

  if (isError || !article) {
    return <NotFound />;
  }

  const gradient = generateGradient(article.id);
  const categoryColor = getCategoryColor(article.category);

  return (
    <div className="min-h-screen" data-testid={`page-article-${article.id}`}>
      <ArticleHeader
        id={article.id}
        title={article.title}
        category={article.category}
        createdAt={article.createdAt}
        readingTime={article.readingTime}
        aiModel={article.aiModel}
        gradient={gradient}
        categoryColor={categoryColor}
      />
      <ArticleContent
        summary={article.summary}
        content={article.content}
        onShare={handleShare}
      />
    </div>
  );
}
