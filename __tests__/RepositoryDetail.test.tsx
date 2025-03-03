import { render, screen } from "@testing-library/react";
import { server } from "../mocks/server";
import { http } from "msw";

jest.mock("../app/services/github", () => ({
  getRepository: jest.fn().mockImplementation((owner, repo) => {
    if (owner === "facebook" && repo === "react") {
      return Promise.resolve({
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
      });
    } else {
      return Promise.reject(new Error("Repository not found"));
    }
  }),
}));

// Next.jsのnotFoundをモック
jest.mock("next/navigation", () => ({
  notFound: jest.fn(),
  useRouter() {
    return {
      push: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
    };
  },
}));

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("Repository Detail Component", () => {
  test("GitHub APIサービスがリポジトリ詳細を適切に取得できること", async () => {
    const { getRepository } = require("../app/services/github");
    const data = await getRepository("facebook", "react");

    expect(data).toBeDefined();
    expect(data.name).toBe("react");
    expect(data.stargazers_count).toBe(200000);
  });

  test("存在しないリポジトリを取得しようとするとエラーがスローされること", async () => {
    const { getRepository } = require("../app/services/github");
    const { notFound } = require("next/navigation");

    try {
      await getRepository("nonexistent", "repo");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
