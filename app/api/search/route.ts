import { searchRepositories } from "@/app/services/github";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");
  const page = searchParams.get("page")
    ? parseInt(searchParams.get("page") as string)
    : 1;

  if (!query) {
    return NextResponse.json(
      { error: "クエリパラメータが必要です" },
      { status: 400 }
    );
  }

  try {
    const data = await searchRepositories(query, page);
    return NextResponse.json(data);
  } catch (error) {
    console.error("GitHub API search error:", error);
    return NextResponse.json(
      { error: "リポジトリの検索中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
