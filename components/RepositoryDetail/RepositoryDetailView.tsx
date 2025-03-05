import { type Repository } from "@/app/services/github";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

interface RepositoryDetailViewProps {
    repository: Repository;
}

export function RepositoryDetailView({ repository }: RepositoryDetailViewProps) {
    return (
        <Card className="max-w-3xl mx-auto">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Avatar className="h-16 w-16">
                    <Image
                        src={repository.owner.avatar_url}
                        alt={`${repository.owner.login}'s avatar`}
                        className="h-full w-full object-cover rounded-full"
                        data-testid="owner-avatar"
                        width={64}
                        height={64}
                    />
                </Avatar>
                <div>
                    <CardTitle data-testid="repository-name">{repository.name}</CardTitle>
                    <p
                        className="text-sm text-gray-500 dark:text-gray-400"
                        data-testid="repository-owner"
                    >
                        {repository.owner.login}
                    </p>
                </div>
            </CardHeader>
            <CardContent>
                <p className="mb-4" data-testid="repository-description">
                    {repository.description || "No description available"}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center">
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Stars</p>
                        <p className="text-xl font-bold" data-testid="star-count">
                            {repository.stargazers_count}
                        </p>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center">
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Watchers</p>
                        <p className="text-xl font-bold" data-testid="watcher-count">
                            {repository.watchers_count}
                        </p>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center">
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Forks</p>
                        <p className="text-xl font-bold" data-testid="fork-count">
                            {repository.forks_count}
                        </p>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center">
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Issues</p>
                        <p className="text-xl font-bold" data-testid="issue-count">
                            {repository.open_issues_count}
                        </p>
                    </div>
                </div>

                {repository.language && (
                    <div className="mt-6">
                        <span
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                            data-testid="repository-language"
                        >
                            {repository.language}
                        </span>
                    </div>
                )}

                <div className="mt-8">
                    <a
                        href={repository.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                        data-testid="repository-link"
                    >
                        GitHubで表示
                    </a>
                </div>
            </CardContent>
        </Card>
    );
}