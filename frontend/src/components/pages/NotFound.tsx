import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { FileText, ArrowLeft } from "lucide-react";

interface NotFoundProps {
  title?: string;
  message?: string;
  showBackButton?: boolean;
}

export function NotFound({
  title = "Article not found",
  message = "The article you're looking for doesn't exist or has been removed.",
  showBackButton = true,
}: NotFoundProps) {
  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground mb-6">
          {message}
        </p>
        {showBackButton && (
          <Link href="/">
            <Button data-testid="button-back-home">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}