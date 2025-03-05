# GitHub リポジトリ検索アプリケーション

Next.js 15 を使用して作成された GitHub リポジトリ検索アプリケーションです。

## 機能

- キーワードによる GitHub リポジトリの検索
- 検索結果の一覧表示
- リポジトリの詳細表示（リポジトリ名、オーナーアイコン、プロジェクト言語、Star 数、Watcher 数、Fork 数、Issue 数）
- ページネーション

## 技術スタック

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Vitest & React Testing Library

## 開発環境のセットアップ

```bash
# リポジトリのクローン
git clone https://github.com/yourusername/github-repo-search.git

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

```

## 工夫ポイント
- [こちら](https://zenn.dev/buyselltech/articles/9460c75b7cd8d1)を意識してfetch部分とview部分を分けた構造を作成しました
- 見た目や操作感はかなりシンプルめに作成しております
- 普段のタスクの納期を真似る形でなるはやで実装し出しております
- ブランチを何個か作成しましたが、従来のテスト（jest）や今回のvitestなど一番構成を作るのが早いものを自分で探し採用しました
  - 今回で言うとvitest
- mswも視野にいれてmockを作成してますが、構成を作るのに時間を要したためいったん使用せず定数でmockを作る形で代用しました
- エラーなども明示しユーザーが使用する前提で諸々実装したつもりです

## AI 使用時レポート

- このREADMEの雛形を生成しました
- コミットメッセージが「first commit」のものに関して、今回のリポジトリを作成するに当たっての init の部分を生成してもらいそのまま使用しました
- デザインについてもAIに生成してもらい調整する形で実装しております
