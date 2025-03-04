import type { Meta, StoryObj } from "@storybook/react";
import RepositoryDetail from "./RepositoryDetail";
import { http, HttpResponse } from 'msw';

const meta: Meta<typeof RepositoryDetail> = {
    title: "Components/RepositoryDetail",
    component: RepositoryDetail,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof RepositoryDetail>;

// 基本的なリポジトリデータ
const mockRepository = {
    name: 'react',
    description: 'A JavaScript library for building user interfaces',
    owner: {
        login: 'facebook',
        avatar_url: 'https://avatars.githubusercontent.com/u/69631?v=4',
    },
    stargazers_count: 212000,
    watchers_count: 6500,
    forks_count: 44000,
    open_issues_count: 1200,
    language: 'JavaScript',
    html_url: 'https://github.com/facebook/react',
};

export const Default: Story = {
    args: {
        owner: 'facebook',
        repo: 'react',
    },
    parameters: {
        msw: {
            handlers: [
                http.get('https://api.github.com/repos/facebook/react', () => {
                    return HttpResponse.json(mockRepository);
                }),
            ],
        },
    },
};

export const NoDescription: Story = {
    args: {
        owner: 'example',
        repo: 'no-description',
    },
    parameters: {
        msw: {
            handlers: [
                http.get('https://api.github.com/repos/example/no-description', () => {
                    return HttpResponse.json({
                        ...mockRepository,
                        name: 'no-description',
                        owner: {
                            login: 'example',
                            avatar_url: 'https://avatars.githubusercontent.com/u/12345?v=4',
                        },
                        description: null,
                    });
                }),
            ],
        },
    },
};

export const NoLanguage: Story = {
    args: {
        owner: 'example',
        repo: 'no-language',
    },
    parameters: {
        msw: {
            handlers: [
                http.get('https://api.github.com/repos/example/no-language', () => {
                    return HttpResponse.json({
                        ...mockRepository,
                        name: 'no-language',
                        owner: {
                            login: 'example',
                            avatar_url: 'https://avatars.githubusercontent.com/u/12345?v=4',
                        },
                        language: null,
                    });
                }),
            ],
        },
    },
};

export const HighNumbers: Story = {
    args: {
        owner: 'popular',
        repo: 'project',
    },
    parameters: {
        msw: {
            handlers: [
                http.get('https://api.github.com/repos/popular/project', () => {
                    return HttpResponse.json({
                        ...mockRepository,
                        name: 'project',
                        owner: {
                            login: 'popular',
                            avatar_url: 'https://avatars.githubusercontent.com/u/54321?v=4',
                        },
                        stargazers_count: 1000000,
                        watchers_count: 50000,
                        forks_count: 250000,
                        open_issues_count: 10000,
                    });
                }),
            ],
        },
    },
};