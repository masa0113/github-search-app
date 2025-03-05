import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchRepositories from '@/components/SearchRepository/SearchRepository';
import { Repository } from '@/app/services/github';

// モックルーターの設定
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush
  })
}));

// テスト用のモックデータ
const mockRepositories: Repository[] = [
  {
    id: 1,
    name: 'test-repo-1',
    full_name: 'user1/test-repo-1',
    description: 'Test repository 1',
    owner: {
      login: 'user1',
      avatar_url: 'https://example.com/avatar1.png'
    },
    stargazers_count: 100,
    watchers_count: 100,
    forks_count: 50,
    open_issues_count: 10,
    language: 'TypeScript',
    html_url: 'https://github.com/user1/test-repo-1'
  },
  {
    id: 2,
    name: 'test-repo-2',
    full_name: 'user2/test-repo-2',
    description: 'Test repository 2',
    owner: {
      login: 'user2',
      avatar_url: 'https://example.com/avatar2.png'
    },
    stargazers_count: 100,
    watchers_count: 100,
    forks_count: 50,
    open_issues_count: 10,
    language: 'TypeScript',
    html_url: 'https://github.com/user2/test-repo-2'
  }
];

describe('SearchRepositories', () => {
  // 共通のモック関数
  const onSearchMock = vi.fn().mockResolvedValue(undefined);
  const onLoadMoreMock = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('初期状態で正しくレンダリングされること', () => {
    render(
      <SearchRepositories
        onSearch={onSearchMock}
        onLoadMore={onLoadMoreMock}
        repositories={[]}
        loading={false}
        error={null}
        hasMore={false}
        totalCount={0}
      />
    );

    expect(document.contains(screen.getByTestId('search-input'))).toBe(true);
    expect(document.contains(screen.getByTestId('search-button'))).toBe(true);
    expect(document.contains(screen.getByTestId('repository-list'))).toBe(true);
  });

  it('検索が実行されるとonSearchが呼ばれること', async () => {
    render(
      <SearchRepositories
        onSearch={onSearchMock}
        onLoadMore={onLoadMoreMock}
        repositories={[]}
        loading={false}
        error={null}
        hasMore={false}
        totalCount={0}
      />
    );

    const input = screen.getByTestId('search-input');
    const button = screen.getByTestId('search-button');

    fireEvent.change(input, { target: { value: 'react' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(onSearchMock).toHaveBeenCalledWith('react');
      expect(mockPush).toHaveBeenCalledWith('/?q=react', { scroll: false });
    });
  });

  it('リポジトリリストが正しく表示されること', () => {
    render(
      <SearchRepositories
        onSearch={onSearchMock}
        onLoadMore={onLoadMoreMock}
        repositories={mockRepositories}
        loading={false}
        error={null}
        hasMore={false}
        totalCount={2}
      />
    );

    expect(screen.getByTestId(`repository-item-${mockRepositories[0].id}`)).toBeInTheDocument();
    expect(screen.getByTestId(`repository-item-${mockRepositories[1].id}`)).toBeInTheDocument();
    expect(screen.getByText('test-repo-1')).toBeInTheDocument();
    expect(screen.getByText('test-repo-2')).toBeInTheDocument();
  });

  it('リポジトリをクリックするとルーターが正しく呼ばれること', () => {
    render(
      <SearchRepositories
        onSearch={onSearchMock}
        onLoadMore={onLoadMoreMock}
        repositories={mockRepositories}
        loading={false}
        error={null}
        hasMore={false}
        totalCount={2}
      />
    );

    const repoItem = screen.getByTestId(`repository-item-${mockRepositories[0].id}`);
    fireEvent.click(repoItem);

    expect(mockPush).toHaveBeenCalledWith('/repository/user1/test-repo-1');
  });

  it('エラーメッセージが表示されること', () => {
    const errorMessage = 'API error occurred';
    render(
      <SearchRepositories
        onSearch={onSearchMock}
        onLoadMore={onLoadMoreMock}
        repositories={[]}
        loading={false}
        error={errorMessage}
        hasMore={false}
        totalCount={0}
      />
    );

    expect(screen.getByTestId('error-message')).toHaveTextContent(errorMessage);
  });

  it('ローディング中は検索ボタンが無効化されること', () => {
    render(
      <SearchRepositories
        onSearch={onSearchMock}
        onLoadMore={onLoadMoreMock}
        repositories={[]}
        loading={true}
        error={null}
        hasMore={false}
        totalCount={0}
      />
    );

    expect(screen.getByTestId('search-button')).toBeDisabled();
    expect(screen.getByTestId('search-button')).toHaveTextContent('Loading...');
  });

  it('さらに読み込むボタンが表示され、クリックするとonLoadMoreが呼ばれること', async () => {
    render(
      <SearchRepositories
        onSearch={onSearchMock}
        onLoadMore={onLoadMoreMock}
        repositories={mockRepositories}
        loading={false}
        error={null}
        hasMore={true}
        totalCount={10}
      />
    );

    const loadMoreButton = screen.getByTestId('load-more-button');
    expect(loadMoreButton).toBeInTheDocument();

    fireEvent.click(loadMoreButton);

    await waitFor(() => {
      expect(onLoadMoreMock).toHaveBeenCalled();
    });
  });

  it('検索結果が0件の場合、適切なメッセージが表示されること', () => {
    render(
      <SearchRepositories
        onSearch={onSearchMock}
        onLoadMore={onLoadMoreMock}
        repositories={[]}
        loading={false}
        error={null}
        hasMore={false}
        totalCount={0}
        initialQuery="nonexistent-repo"
      />
    );

    expect(screen.getByText('リポジトリが見つかりませんでした。別のキーワードで試してください。')).toBeInTheDocument();
  });

  it('initialQueryが設定されている場合、検索フィールドに初期値が設定されること', () => {
    render(
      <SearchRepositories
        onSearch={onSearchMock}
        onLoadMore={onLoadMoreMock}
        repositories={[]}
        loading={false}
        error={null}
        hasMore={false}
        totalCount={0}
        initialQuery="initial-search"
      />
    );

    expect(screen.getByTestId('search-input')).toHaveValue('initial-search');
  });
});