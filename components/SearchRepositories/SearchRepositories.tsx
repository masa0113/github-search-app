"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { useSearchRepositories } from "./useSearchRepositories";
import { useRouter } from "next/navigation";

export default function SearchRepositories() {
  const router = useRouter();
  const { query,
    setQuery,
    repositories,
    loading,
    error,
    totalCount,
    handleSearch,
    handleLoadMore,
    handleRepoClick, } = useSearchRepositories(router)

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

      {repositories.length > 0 &&
        totalCount &&
        repositories.length < totalCount && (
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

      {repositories.length === 0 && !loading && query && totalCount === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-8">
          リポジトリが見つかりませんでした。別のキーワードで試してください。
        </p>
      )}
    </>
  );
}
