import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2 } from "lucide-react";

interface ArticleContentProps {
  summary: string;
  content: string;
  onShare: () => void;
}

export function ArticleContent({ summary, content, onShare }: ArticleContentProps) {
  const paragraphs = content.split("\n\n").filter((p) => p.trim());

  return (
    <article className="py-12 md:py-16">
      <div className="max-w-3xl mx-auto px-6">
        <div className="flex items-center justify-between gap-4 mb-8 pb-8 border-b border-border">
          <p
            className="text-lg text-muted-foreground italic"
            data-testid="text-article-summary"
          >
            {summary}
          </p>
          <Button
            variant="outline"
            size="icon"
            onClick={onShare}
            className="shrink-0"
            data-testid="button-share"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>

        <div
          className="prose prose-lg dark:prose-invert max-w-none"
          data-testid="text-article-content"
        >
          {paragraphs.map((paragraph, index) => {
            if (
              paragraph.startsWith("##") ||
              paragraph.startsWith("**") ||
              paragraph.startsWith("###")
            ) {
              const cleanedHeading = paragraph
                .replace(/^#+\s*/, "")
                .replace(/\*\*/g, "");
              return (
                <h2
                  key={index}
                  className="text-xl md:text-2xl font-semibold mt-8 mb-4"
                >
                  {cleanedHeading}
                </h2>
              );
            }
            return (
              <p
                key={index}
                className="text-base md:text-lg leading-relaxed mb-6 text-foreground/90"
              >
                {paragraph}
              </p>
            );
          })}
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Share2 className="w-4 h-4" />
              This article was automatically generated
            </div>
            <Link href="/">
              <Button variant="outline" data-testid="button-more-articles">
                <ArrowLeft className="w-4 h-4 mr-2" />
                More Articles
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}