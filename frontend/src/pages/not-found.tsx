import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { FileQuestion, Home } from "lucide-react";
import { NotFound } from "@/components/pages/NotFound";

export default function NotFoundPage() {
  return <NotFound title="Page not found" message="The page you're looking for doesn't exist." />;
}
