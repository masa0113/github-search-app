"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Repository } from "@/app/services/github";

export default function SearchRepositories() {
  const [query, setQuery] = useState("");
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(query)}&page=1`
      );

      if (!response.ok) {
        throw new Error("検索に失敗しました");
      }

      const result = await response.json();
      setRepositories(result.items);
      setTotalCount(result.total_count);
      setPage(1);
    } catch (err) {
      setError(
        "リポジトリの検索中にエラーが発生しました。もう一度お試しください。"
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(query)}&page=${page + 1}`
      );

      if (!response.ok) {
        throw new Error("追加データの取得に失敗しました");
      }

      const result = await response.json();
      setRepositories((prev) => [...prev, ...result.items]);
      setPage((prev) => prev + 1);
    } catch (err) {
      setError("追加のリポジトリのロード中にエラーが発生しました。");
      console.error(err);
    } finally {
      setLoading(false);
    }
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
                <img
                  src={repo.owner.avatar_url}
                  alt={`${repo.owner.login}'s avatar`}
                  className="h-full w-full object-cover"
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

      {repositories.length > 0 && repositories.length < totalCount && (
        <div className="mt-6 text-center">
          <Button
            onClick={handleLoadMore}
            disabled={loading}
            variant="outline"
            data-testid="load-more-button"
          >
            {loading ? "Loading..." : "さらに読み込む"}
          </Button>
        </div>
      )}

      {repositories.length === 0 && !loading && query && (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-8">
          リポジトリが見つかりませんでした。別のキーワードで試してください。
        </p>
      )}
    </>
  );
}
