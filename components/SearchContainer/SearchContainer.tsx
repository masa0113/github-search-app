"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import SearchRepositories from "@/components/SearchRepository/SearchRepository";
import { Repository } from "@/app/services/github";

export default function SearchContainer() {
    const [repositories, setRepositories] = useState<Repository[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState<number | undefined>(undefined);
    const [currentQuery, setCurrentQuery] = useState("");

    const searchParams = useSearchParams();
    const queryParam = searchParams.get("q") || "";

    // URLのクエリパラメータが変更されたときに検索を実行
    useEffect(() => {
        if (queryParam && queryParam !== currentQuery) {
            handleSearch(queryParam);
        }
    }, [queryParam, currentQuery]);

    const handleSearch = async (query: string) => {
        if (!query.trim()) return;

        setLoading(true);
        setError(null);
        setCurrentQuery(query);

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
                `/api/search?q=${encodeURIComponent(currentQuery)}&page=${page + 1}`
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

    const hasMore = totalCount ? repositories.length < totalCount : false;

    return (
        <SearchRepositories
            onSearch={handleSearch}
            onLoadMore={handleLoadMore}
            repositories={repositories}
            loading={loading}
            error={error}
            totalCount={totalCount}
            hasMore={hasMore}
            initialQuery={queryParam}
        />
    );
}