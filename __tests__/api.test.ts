import { NextRequest } from "next/server";
import { GET } from "../app/api/search/route";

// GitHubのAPIをモック
jest.mock("../app/services/github", () => ({
  searchRepositories: jest.fn().mockImplementation((query) => {
    if (query === "react") {
      return Promise.resolve({
        total_count: 1,
        incomplete_results: false,
        items: [
          {
            id: 1,
            name: "react",
            full_name: "facebook/react",
            owner: {
              login: "facebook",
              avatar_url: "https://example.com/avatar.png",
            },
            description: "A JavaScript library for building user interfaces",
            stargazers_count: 100,
            watchers_count: 100,
            forks_count: 50,
            open_issues_count: 10,
            language: "JavaScript",
            html_url: "https://github.com/facebook/react",
          },
        ],
      });
    } else if (query === "error") {
      return Promise.reject(new Error("API Error"));
    } else {
      return Promise.resolve({
        total_count: 0,
        incomplete_results: false,
        items: [],
      });
    }
  }),
}));

describe("Search API Route", () => {
  const createMockRequest = (query: string, page: number = 1) => {
    const url = new URL(
      `https://example.com/api/search?q=${query}&page=${page}`
    );
    return {
      nextUrl: url,
    } as unknown as NextRequest;
  };

  test("有効なクエリが提供された場合、検索結果を返す", async () => {
    const req = createMockRequest("react");
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.items.length).toBe(1);
    expect(data.items[0].name).toBe("react");
  });

  test("クエリが提供されていない場合、400エラーを返す", async () => {
    const req = createMockRequest("");
    const res = await GET(req);

    expect(res.status).toBe(400);
  });

  test("APIエラーが発生した場合、500エラーを返す", async () => {
    const req = createMockRequest("error");
    const res = await GET(req);

    expect(res.status).toBe(500);
  });
});
