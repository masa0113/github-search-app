import { rest } from "msw";

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
  {
    id: 3,
    name: "react-native",
    full_name: "facebook/react-native",
    owner: {
      login: "facebook",
      avatar_url: "https://avatars.githubusercontent.com/u/69631?v=4",
    },
    description: "A framework for building native apps with React",
    stargazers_count: 150000,
    watchers_count: 150000,
    forks_count: 30000,
    open_issues_count: 1500,
    language: "JavaScript",
    html_url: "https://github.com/facebook/react-native",
  },
  {
    id: 4,
    name: "pagination-test-1",
    full_name: "testuser/pagination-test-1",
    owner: {
      login: "testuser",
      avatar_url: "https://avatars.githubusercontent.com/u/1?v=4",
    },
    description: "Test repository 1",
    stargazers_count: 100,
    watchers_count: 100,
    forks_count: 10,
    open_issues_count: 5,
    language: "JavaScript",
    html_url: "https://github.com/testuser/pagination-test-1",
  },
  {
    id: 5,
    name: "pagination-test-2",
    full_name: "testuser/pagination-test-2",
    owner: {
      login: "testuser",
      avatar_url: "https://avatars.githubusercontent.com/u/1?v=4",
    },
    description: "Test repository 2",
    stargazers_count: 200,
    watchers_count: 200,
    forks_count: 20,
    open_issues_count: 10,
    language: "TypeScript",
    html_url: "https://github.com/testuser/pagination-test-2",
  },
];

export const handlers = [
  rest.get("https://api.github.com/search/repositories", (req, res, ctx) => {
    const url = new URL(req.url);
    const query = url.searchParams.get("q");
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const per_page = parseInt(url.searchParams.get("per_page") || "30", 10);

    if (query === "error") {
      return res(ctx.status(500), ctx.json({ message: "Server error" }));
    }

    let filteredRepos = mockRepositories;
    if (query) {
      filteredRepos = mockRepositories.filter(
        (repo) =>
          repo.name.includes(query) ||
          repo.description?.includes(query) ||
          repo.full_name.includes(query)
      );
    }

    // ページネーション処理
    const startIndex = (page - 1) * per_page;
    const endIndex = startIndex + per_page;
    const paginatedRepos = filteredRepos.slice(startIndex, endIndex);

    return res(
      ctx.json({
        total_count: filteredRepos.length,
        incomplete_results: false,
        items: paginatedRepos,
      })
    );
  }),

  rest.get("https://api.github.com/repos/:owner/:repo", (req, res, ctx) => {
    const { owner, repo } = req.params as { owner: string; repo: string };

    const repository = mockRepositories.find(
      (r) => r.full_name === `${owner}/${repo}`
    );

    if (repository) {
      return res(ctx.json(repository));
    }

    return res(ctx.status(404), ctx.json({ message: "Not Found" }));
  }),
];
