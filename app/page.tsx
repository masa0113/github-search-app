import SearchRepositories from "@/components/SearchRepositories";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center dark:text-white">
        GitHub リポジトリ検索
      </h1>
      <SearchRepositories />
    </div>
  );
}
