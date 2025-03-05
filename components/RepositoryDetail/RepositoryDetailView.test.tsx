import { render, screen } from '@testing-library/react';
import { RepositoryDetailView } from '@/components/RepositoryDetail/RepositoryDetailView';
import '@testing-library/jest-dom';

// モックリポジトリデータ
const mockRepository = {
    id: 123456789,
    name: 'test-repository',
    full_name: 'testuser/test-repository',
    description: 'This is a test repository description',
    owner: {
        login: 'testuser',
        avatar_url: 'https://example.com/avatar.png',
    },
    stargazers_count: 100,
    watchers_count: 50,
    forks_count: 25,
    open_issues_count: 10,
    language: 'TypeScript',
    html_url: 'https://github.com/testuser/test-repository',
};

describe('RepositoryDetailView', () => {
    it('リポジトリの基本情報が正しく表示されること', () => {
        render(<RepositoryDetailView repository={mockRepository} />);

        // リポジトリ名とオーナー情報の確認
        expect(screen.getByTestId('repository-name')).toHaveTextContent('test-repository');
        expect(screen.getByTestId('repository-owner')).toHaveTextContent('testuser');
        expect(screen.getByTestId('owner-avatar')).toBeInTheDocument();

        // 説明文の確認
        expect(screen.getByTestId('repository-description')).toHaveTextContent('This is a test repository description');
    });

    it('リポジトリの統計情報が正しく表示されること', () => {
        render(<RepositoryDetailView repository={mockRepository} />);

        // 各種カウントの確認
        expect(screen.getByTestId('star-count')).toHaveTextContent('100');
        expect(screen.getByTestId('watcher-count')).toHaveTextContent('50');
        expect(screen.getByTestId('fork-count')).toHaveTextContent('25');
        expect(screen.getByTestId('issue-count')).toHaveTextContent('10');
    });

    it('プログラミング言語が表示されること', () => {
        render(<RepositoryDetailView repository={mockRepository} />);

        expect(screen.getByTestId('repository-language')).toHaveTextContent('TypeScript');
    });

    it('プログラミング言語がnullの場合は言語タグが表示されないこと', () => {
        const repoWithoutLanguage = { ...mockRepository, language: null };
        render(<RepositoryDetailView repository={repoWithoutLanguage} />);

        expect(screen.queryByTestId('repository-language')).not.toBeInTheDocument();
    });

    it('説明文がない場合はデフォルトメッセージが表示されること', () => {
        const repoWithoutDescription = { ...mockRepository, description: null };
        render(<RepositoryDetailView repository={repoWithoutDescription} />);

        expect(screen.getByTestId('repository-description')).toHaveTextContent('No description available');
    });

    it('GitHubリンクが正しいURLを指していること', () => {
        render(<RepositoryDetailView repository={mockRepository} />);

        const link = screen.getByTestId('repository-link');
        expect(link).toHaveAttribute('href', 'https://github.com/testuser/test-repository');
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
        expect(link).toHaveTextContent('GitHubで表示');
    });
});