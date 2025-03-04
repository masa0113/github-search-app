import { Suspense } from "react";
import Link from "next/link";
import RepositoryDetail from "@/components/RepositoryDetail/RepositoryDetail";

interface RepositoryDetailPageProps {
  params: Promise<{
    owner: string;
    repo: string;
  }>;
}

export default async function RepositoryDetailPage(props: RepositoryDetailPageProps) {
  const params = await props.params;
  const { owner, repo } = params;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/"
          className="text-blue-500 hover:underline flex items-center gap-2"
        >
          <span>&#8592;</span> トップページへ戻る
        </Link>
      </div>

      <Suspense
        fallback={
          <div className="container mx-auto px-4 py-16 text-center">
            <p className="text-lg">Loading...</p>
          </div>
        }
      >
        <RepositoryDetail owner={owner} repo={repo} />
      </Suspense>
    </div>
  );
}
