import { server } from "@/mocks/server";
import { rest } from "msw";
import { getRepository } from "@/app/services/github";

describe("Repository Detail Component", () => {
  test("GitHub APIサービスがリポジトリ詳細を適切に取得できること", async () => {
    server.use(
      rest.get("https://api.github.com/repos/facebook/react", (req, res, ctx) => {
        return res(
          ctx.json({
            name: "react",
            stargazers_count: 200000,
          })
        );
      })
    );

    const data = await getRepository("facebook", "react");

    expect(data).toBeDefined();
    expect(data.name).toBe("react");
    expect(data.stargazers_count).toBe(200000);
  });

  test("存在しないリポジトリを取得しようとするとエラーがスローされること", async () => {
    server.use(
      rest.get("https://api.github.com/repos/nonexistent/repo", (req, res, ctx) => {
        return res(ctx.status(404));
      })
    );

    await expect(getRepository("nonexistent", "repo")).rejects.toThrow();
  });
});
