const GITHUB_API_URL = "https://api.github.com";

export interface Repository {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  description: string | null;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  html_url: string;
}

export interface SearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: Repository[];
}

export async function searchRepositories(
  query: string,
  page: number = 1
): Promise<SearchResponse> {
  try {
    const response = await fetch(
      `${GITHUB_API_URL}/search/repositories?q=${encodeURIComponent(
        query
      )}&per_page=10&page=${page}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch repositories:", error);
    throw error;
  }
}

export async function getRepository(
  owner: string,
  repo: string
): Promise<Repository> {
  try {
    const response = await fetch(`${GITHUB_API_URL}/repos/${owner}/${repo}`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch repository details:", error);
    throw error;
  }
}
