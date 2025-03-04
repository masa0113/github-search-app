import SearchContainer from "@/components/SearchContainer/SearchContainer";

export default function Home() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">GitHub Repository Search</h1>
      <SearchContainer />
    </div>
  );
} 