"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Repository } from "@/app/services/github";
import Image from "next/image";

export default function SearchRepositories({
  onSearch,
  onLoadMore,
  repositories,
  loading,
  error,
  totalCount,
  hasMore,
  initialQuery = "",
}: {
  onSearch: (query: string) => Promise<void>;
  onLoadMore: () => Promise<void>;
  repositories: Repository[];
  loading: boolean;
  error: string | null;
  totalCount?: number;
  hasMore: boolean;
  initialQuery?: string;
}) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  // クライアントサイドでのみ実行されるuseEffectで初期値を設定
  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // URLを更新して検索クエリを保存
    router.push(`/?q=${encodeURIComponent(query)}`, { scroll: false });
    await onSearch(query);
  };

  const handleRepoClick = (repo: Repository) => {
    const [owner, repoName] = repo.full_name.split("/");
    router.push(`/repository/${owner}/${repoName}`);
  };

  return (
    <>
      <form
        onSubmit={handleSearch}
        className="mb-8 flex gap-2 max-w-xl mx-auto"
      >
        <Input
          type="text"
          placeholder="リポジトリを検索してください"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow"
          data-testid="search-input"
        />
        <Button type="submit" disabled={loading} data-testid="search-button">
          {loading ? "Loading..." : "検索"}
        </Button>
      </form>

      {error && (
        <div
          className="text-red-500 mb-4 text-center"
          data-testid="error-message"
        >
          {error}
        </div>
      )}

      <div className="space-y-4" data-testid="repository-list">
        {repositories.map((repo) => (
          <Card
            key={repo.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleRepoClick(repo)}
            data-testid={`repository-item-${repo.id}`}
          >
            <CardContent className="p-4 flex items-center gap-4">
              <Avatar className="h-10 w-10">
                <Image
                  src={repo.owner.avatar_url}
                  alt={`${repo.owner.login}'s avatar`}
                  width={40}
                  height={40}
                  className="h-full w-full object-cover rounded-full"
                />
              </Avatar>
              <div className="flex-grow">
                <h3 className="font-medium">{repo.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {repo.description || "No description available"}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {repositories.length > 0 && hasMore && (
        <div className="mt-6 text-center">
          <Button
            onClick={onLoadMore}
            disabled={loading}
            variant="outline"
            data-testid="load-more-button"
          >
            {loading ? "Loading..." : "さらに読み込む"}
          </Button>
        </div>
      )}

      {repositories.length === 0 && !loading && query && totalCount === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-8">
          リポジトリが見つかりませんでした。別のキーワードで試してください。
        </p>
      )}
    </>
  );
}