import { getRepository, type Repository } from "@/app/services/github";
import { notFound } from "next/navigation";
import { RepositoryDetailView } from "./RepositoryDetailView";

interface RepositoryDetailProps {
  owner: string;
  repo: string;
}

export default async function RepositoryDetail({
  owner,
  repo,
}: RepositoryDetailProps) {
  let repository: Repository;

  try {
    repository = await getRepository(owner, repo);
  } catch (error) {
    console.error("Error fetching repository:", error);
    notFound();
  }

  return <RepositoryDetailView repository={repository} />;
}
