import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { server } from "../mocks/server";
import { http, HttpResponse } from "msw";
import SearchRepositories from "../components/SearchRepositories";
import "@testing-library/jest-dom";

jest.mock("next/navigation", () => ({
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

const setupMockHandlers = () => {
  server.use(
    http.get("/api/search", ({ request }) => {
      const url = new URL(request.url);
      const query = url.searchParams.get("q");

      if (query === "react") {
        return HttpResponse.json({
          total_count: 2,
          incomplete_results: false,
          items: [
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
              name: "react-native",
              full_name: "facebook/react-native",
              owner: {
                login: "facebook",
                avatar_url: "https://avatars.githubusercontent.com/u/69631?v=4",
              },
              description:
                "A framework for building native applications using React",
              stargazers_count: 100000,
              watchers_count: 100000,
              forks_count: 20000,
              open_issues_count: 1200,
              language: "JavaScript",
              html_url: "https://github.com/facebook/react-native",
            },
          ],
        });
      } else if (query === "nonexistentrepository12345") {
        return HttpResponse.json({
          total_count: 0,
          incomplete_results: false,
          items: [],
        });
      } else {
        return HttpResponse.json({ error: "Server error" }, { status: 500 });
      }
    })
  );
};

describe("SearchRepositories Component", () => {
  beforeEach(() => {
    setupMockHandlers();
  });

  test("初期状態ではリポジトリリストが表示されていないこと", () => {
    render(<SearchRepositories />);
    const searchInput = screen.getByTestId("search-input");
    const searchButton = screen.getByTestId("search-button");

    expect(searchInput).toBeInTheDocument();
    expect(searchButton).toBeInTheDocument();
    expect(screen.queryByTestId("repository-item-1")).not.toBeInTheDocument();
  });

  test("検索を実行するとリポジトリが表示されること", async () => {
    render(<SearchRepositories />);

    const searchInput = screen.getByTestId("search-input");
    const searchButton = screen.getByTestId("search-button");

    // 検索を実行
    fireEvent.change(searchInput, { target: { value: "react" } });
    fireEvent.click(searchButton);

    // 検索結果が表示されるのを待つ
    await waitFor(() => {
      expect(screen.getByTestId("repository-item-1")).toBeInTheDocument();
    });

    // 検索結果の内容を確認
    expect(screen.getByText("react")).toBeInTheDocument();
    expect(screen.getByText(/A declarative, efficient/)).toBeInTheDocument();
  });

  test("存在しないリポジトリを検索すると適切なメッセージが表示されること", async () => {
    render(<SearchRepositories />);

    const searchInput = screen.getByTestId("search-input");
    const searchButton = screen.getByTestId("search-button");

    fireEvent.change(searchInput, {
      target: { value: "nonexistentrepository12345" },
    });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(
        screen.getByText(/リポジトリが見つかりませんでした/)
      ).toBeInTheDocument();
    });
  });

  test("API呼び出し中はボタンのテキストがLoadingに変わること", async () => {
    render(<SearchRepositories />);

    const searchInput = screen.getByTestId("search-input");
    const searchButton = screen.getByTestId("search-button");

    fireEvent.change(searchInput, { target: { value: "react" } });
    fireEvent.click(searchButton);

    // ボタンのテキストがLoadingになっているか確認
    expect(searchButton).toHaveTextContent("Loading...");

    // 結果が表示されるまで待つ
    await waitFor(() => {
      expect(screen.getByTestId("repository-item-1")).toBeInTheDocument();
    });

    // ロード後はボタンのテキストが元に戻っているか確認
    expect(searchButton).toHaveTextContent("検索");
  });
});
