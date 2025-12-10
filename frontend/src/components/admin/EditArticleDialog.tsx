import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Article } from "@/types";

interface EditArticleDialogProps {
  article: Article | null;
  open: boolean;
  onClose: () => void;
  onSave: (data: { title: string; summary: string; content: string; category: string; tags: string }) => void;
  isSaving?: boolean;
}

export function EditArticleDialog({ 
  article, 
  open, 
  onClose, 
  onSave, 
  isSaving = false 
}: EditArticleDialogProps) {
  const [formData, setFormData] = useState({
    title: article?.title || "",
    summary: article?.summary || "",
    content: article?.content || "",
    category: article?.category || "",
    tags: (article?.tags || []).join(", ")
  });

  const handleSave = () => {
    onSave(formData);
  };

  // Reset form when article changes
  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title,
        summary: article.summary,
        content: article.content,
        category: article.category,
        tags: (article.tags || []).join(", ")
      });
    }
  }, [article]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Article</DialogTitle>
          <DialogDescription>Make changes to the article below.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title</Label>
            <Input
              id="edit-title"
              value={formData.title}
              onChange={(e) => setFormData(f => ({ ...f, title: e.target.value }))}
              data-testid="input-edit-title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-category">Category</Label>
            <Input
              id="edit-category"
              value={formData.category}
              onChange={(e) => setFormData(f => ({ ...f, category: e.target.value }))}
              data-testid="input-edit-category"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-tags">Tags (comma-separated)</Label>
            <Input
              id="edit-tags"
              value={formData.tags}
              onChange={(e) => setFormData(f => ({ ...f, tags: e.target.value }))}
              placeholder="AI, Technology, Innovation"
              data-testid="input-edit-tags"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-summary">Summary</Label>
            <Textarea
              id="edit-summary"
              value={formData.summary}
              onChange={(e) => setFormData(f => ({ ...f, summary: e.target.value }))}
              rows={2}
              data-testid="input-edit-summary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-content">Content</Label>
            <Textarea
              id="edit-content"
              value={formData.content}
              onChange={(e) => setFormData(f => ({ ...f, content: e.target.value }))}
              rows={8}
              data-testid="input-edit-content"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            data-testid="button-save-edit"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}