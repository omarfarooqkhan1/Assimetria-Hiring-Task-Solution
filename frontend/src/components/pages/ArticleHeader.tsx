import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, Sparkles } from "lucide-react";
import { format } from "date-fns";

interface ArticleHeaderProps {
  id?: string;
  title: string;
  category: string;
  createdAt: string;
  readingTime: number;
  aiModel: string;
  gradient: string;
  categoryColor: string;
}

export function ArticleHeader({
  id,
  title,
  category,
  createdAt,
  readingTime,
  aiModel,
  gradient,
  categoryColor,
}: ArticleHeaderProps) {
  const formattedDate = format(new Date(createdAt), "MMMM d, yyyy");

  return (
    <div
      className={`relative pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-br ${gradient}`}
    >
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

      <div className="relative max-w-4xl mx-auto px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all articles
        </Link>

        <Badge
          variant="secondary"
          className={`${categoryColor} border-0 text-sm font-medium mb-4`}
          data-testid="badge-category"
        >
          {category}
        </Badge>

        <h1
          className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 leading-tight"
          data-testid="text-article-title"
        >
          {title}
        </h1>

        <div className="flex items-center gap-6 flex-wrap text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {formattedDate}
          </span>
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {readingTime} min read
          </span>
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            {aiModel}
          </span>
        </div>
      </div>
    </div>
  );
}