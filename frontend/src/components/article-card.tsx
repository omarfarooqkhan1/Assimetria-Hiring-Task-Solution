import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight, Tag } from "lucide-react";
import { format } from "date-fns";
import type { Article } from "@/types";

interface ArticleCardProps {
  article: Article;
  index?: number;
}

function generateGradient(id: string): string {
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

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    technology: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    science: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    innovation: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    business: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    health: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    default: "bg-muted text-muted-foreground",
  };
  return colors[category.toLowerCase()] || colors.default;
}

export function ArticleCard({ article, index = 0 }: ArticleCardProps) {
  const gradient = generateGradient(article.id);
  const categoryColor = getCategoryColor(article.category);
  const formattedDate = format(new Date(article.createdAt), "MMM d, yyyy");
  const tags = article.tags || [];

  return (
    <Link
      href={`/article/${article.id}`}
      className="block group"
      data-testid={`card-article-${article.id}`}
    >
      <Card className="overflow-visible border-border/50 bg-card hover-elevate active-elevate-2 transition-all duration-300">
        <div
          className={`aspect-video bg-gradient-to-br ${gradient} relative overflow-hidden rounded-t-lg`}
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-background/80 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl font-bold text-foreground/80">
                {article.title.charAt(0)}
              </span>
            </div>
          </div>
          <div className="absolute top-4 left-4">
            <Badge
              variant="secondary"
              className={`${categoryColor} border-0 text-xs font-medium`}
            >
              {article.category}
            </Badge>
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-xl md:text-2xl font-semibold leading-tight mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {article.title}
          </h2>

          <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-4 line-clamp-2">
            {article.summary}
          </p>

          {tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap mb-4">
              <Tag className="w-3.5 h-3.5 text-muted-foreground" />
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-xs font-normal"
                  data-testid={`badge-tag-${tag}`}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {formattedDate}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {article.readingTime} min read
              </span>
            </div>
            <span className="flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
              Read more
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export function ArticleCardSkeleton() {
  return (
    <Card className="overflow-hidden border-border/50">
      <div className="aspect-video bg-muted animate-pulse" />
      <div className="p-6 space-y-4">
        <div className="h-7 bg-muted rounded-md animate-pulse w-3/4" />
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded animate-pulse" />
          <div className="h-4 bg-muted rounded animate-pulse w-5/6" />
        </div>
        <div className="flex gap-2">
          <div className="h-5 bg-muted rounded animate-pulse w-12" />
          <div className="h-5 bg-muted rounded animate-pulse w-16" />
          <div className="h-5 bg-muted rounded animate-pulse w-14" />
        </div>
        <div className="flex gap-4">
          <div className="h-4 bg-muted rounded animate-pulse w-24" />
          <div className="h-4 bg-muted rounded animate-pulse w-20" />
        </div>
      </div>
    </Card>
  );
}
