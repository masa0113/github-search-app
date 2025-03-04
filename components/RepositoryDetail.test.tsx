import { render, screen } from '@testing-library/react';
import RepositoryDetail from '@/components/RepositoryDetail';
import { getRepository } from '@/app/services/github';

// モックの設定
jest.mock('@/app/services/github', () => ({
    getRepository: jest.fn(),
}));

jest.mock('next/navigation', () => ({
    notFound: jest.fn(),
}));

describe('RepositoryDetail', () => {
    const mockRepository = {
        name: 'test-repo',
        description: 'Test repository description',
        owner: {
            login: 'test-user',
            avatar_url: 'https://example.com/avatar.png',
        },
        stargazers_count: 100,
        watchers_count: 50,
        forks_count: 25,
        open_issues_count: 10,
        language: 'TypeScript',
        html_url: 'https://github.com/test-user/test-repo',
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (getRepository as jest.Mock).mockResolvedValue(mockRepository);
    });

    it('renders repository details correctly', async () => {
        render(await RepositoryDetail({ owner: 'test-user', repo: 'test-repo' }));

        expect(screen.getByTestId('repository-name')).toHaveTextContent('test-repo');
        expect(screen.getByTestId('repository-owner')).toHaveTextContent('test-user');
        expect(screen.getByTestId('repository-description')).toHaveTextContent('Test repository description');
        expect(screen.getByTestId('star-count')).toHaveTextContent('100');
        expect(screen.getByTestId('watcher-count')).toHaveTextContent('50');
        expect(screen.getByTestId('fork-count')).toHaveTextContent('25');
        expect(screen.getByTestId('issue-count')).toHaveTextContent('10');
        expect(screen.getByTestId('repository-language')).toHaveTextContent('TypeScript');
        expect(screen.getByTestId('repository-link')).toHaveAttribute('href', 'https://github.com/test-user/test-repo');
    });

    it('displays "No description available" when description is null', async () => {
        (getRepository as jest.Mock).mockResolvedValue({
            ...mockRepository,
            description: null,
        });

        render(await RepositoryDetail({ owner: 'test-user', repo: 'test-repo' }));
        expect(screen.getByTestId('repository-description')).toHaveTextContent('No description available');
    });

    it('calls notFound when repository fetch fails', async () => {
        const notFound = jest.requireMock('next/navigation').notFound;
        (getRepository as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));

        await RepositoryDetail({ owner: 'test-user', repo: 'test-repo' });
        expect(notFound).toHaveBeenCalled();
    });
}); 