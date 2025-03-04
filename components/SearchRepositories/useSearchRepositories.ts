import { useState } from "react";
import type { Repository } from "@/app/services/github";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export function useSearchRepositories(router?: AppRouterInstance) {
  const [query, setQuery] = useState("");
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState<number | undefined>(undefined);

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
    if (router) {
      router.push(`/repository/${repo.owner.login}/${repo.name}`);
    }
  };

  return {
    query,
    setQuery,
    repositories,
    loading,
    error,
    totalCount,
    handleSearch,
    handleLoadMore,
    handleRepoClick,
  };
}
