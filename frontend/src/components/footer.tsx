import { Sparkles, Github, Heart } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card/30" data-testid="footer">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight">
                AutoBlog
              </span>
            </Link>
            <p className="text-sm text-muted-foreground text-center md:text-left">
              Articles on technology, science, and innovation.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-3">
            <div className="flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-footer-github"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/50 text-xs font-medium">
                <Sparkles className="w-3 h-3" />
                Generated with AI
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/50">
          <p className="text-center text-sm text-muted-foreground flex items-center justify-center gap-1 flex-wrap">
            <span>&copy; {currentYear} AutoBlog.</span>
            <span className="hidden sm:inline">Made with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 sm:mx-0" />
            <span className="hidden sm:inline">for the Assimetria challenge.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
