import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { queryClient } from "@/lib/queryClient";
import type { Article } from "@/types";
import { HeroSection } from "@/components/pages/HeroSection";
import { FilterSection } from "@/components/pages/FilterSection";
import { ArticleList } from "@/components/pages/ArticleList";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");

  const {
    data: articles,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery<Article[]>({
    queryKey: ["/api/articles", { search: searchQuery, category: selectedCategory, tag: selectedTag }],
  });

  const { data: categories } = useQuery<string[]>({
    queryKey: ["/api/categories"],
  });

  const { data: tags } = useQuery<string[]>({
    queryKey: ["/api/tags"],
  });

  const filteredCount = articles?.length || 0;
  const hasActiveFilters = searchQuery !== "" || selectedCategory !== "all" || selectedTag !== "all";

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedTag("all");
  };

  return (
    <div className="min-h-screen">
      <HeroSection 
        title="Fresh Insights," 
        subtitle="Discover articles on technology, science, and innovation. New content automatically created daily to keep you informed and inspired." 
      />
      
      <section className="pb-20 md:pb-28">
        <div className="max-w-6xl mx-auto px-6">
          <FilterSection
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedTag={selectedTag}
            setSelectedTag={setSelectedTag}
            categories={categories}
            tags={tags}
            onRefresh={() => {
              queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
              refetch();
            }}
            isRefreshing={isFetching}
            articleCount={filteredCount}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFilters}
          />
          
          <ArticleList
            articles={articles}
            isLoading={isLoading}
            isError={isError}
            onRetry={() => refetch()}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFilters}
          />
        </div>
      </section>
    </div>
  );
}
