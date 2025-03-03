import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h2 className="text-2xl font-bold mb-4">
        リポジトリが見つかりませんでした
      </h2>
      <p className="mb-8">
        お探しのリポジトリは存在しないか、アクセスできません。
      </p>
      <Link href="/">
        <Button>トップページへ戻る</Button>
      </Link>
    </div>
  );
}
