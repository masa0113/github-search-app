// mocks/handlers.ts
import { http, HttpResponse } from "msw";

// モックデータ
const mockRepositories = [
  {
    id: 1,
    name: "react",
    full_name: "facebook/react",
    owner: {
      login: "facebook",
      avatar_url: "https://avatars.githubusercontent.com/u/69631?v=4",
    },
    description:
      "A declarative, efficient, and flexible JavaScript library for building user interfaces.",
    stargazers_count: 200000,
    watchers_count: 200000,
    forks_count: 40000,
    open_issues_count: 1000,
    language: "JavaScript",
    html_url: "https://github.com/facebook/react",
  },
  {
    id: 2,
    name: "next.js",
    full_name: "vercel/next.js",
    owner: {
      login: "vercel",
      avatar_url: "https://avatars.githubusercontent.com/u/14985020?v=4",
    },
    description: "The React Framework for Production",
    stargazers_count: 100000,
    watchers_count: 100000,
    forks_count: 20000,
    open_issues_count: 1200,
    language: "TypeScript",
    html_url: "https://github.com/vercel/next.js",
  },
];

export const handlers = [
  // リポジトリ検索APIのモック
  http.get(
    "https://api.github.com/search/repositories",
    ({ request, params }) => {
      const url = new URL(request.url);
      const query = url.searchParams.get("q");

      // 検索クエリによって結果をフィルタリング
      let filteredRepos = mockRepositories;
      if (query) {
        filteredRepos = mockRepositories.filter(
          (repo) =>
            repo.name.includes(query) ||
            repo.description?.includes(query) ||
            repo.full_name.includes(query)
        );
      }

      return HttpResponse.json({
        total_count: filteredRepos.length,
        incomplete_results: false,
        items: filteredRepos,
      });
    }
  ),

  // 単一リポジトリの詳細APIのモック
  http.get("https://api.github.com/repos/:owner/:repo", ({ params }) => {
    const { owner, repo } = params;

    const repository = mockRepositories.find(
      (r) => r.full_name === `${owner}/${repo}`
    );

    if (repository) {
      return HttpResponse.json(repository);
    }

    return HttpResponse.json({ message: "Not Found" }, { status: 404 });
  }),
];
