# 🖥️ ローカルGit操作ガイド - GitHub Pages編

## 前提条件
- Gitがインストールされていること
- GitHubアカウントを持っていること
- コマンドラインの基本知識

## 📦 セットアップ

### 1. GitHubで空のリポジトリを作成
1. [GitHub](https://github.com)にログイン
2. 新規リポジトリを作成（名前：例えば `junjun-payment-app`）
3. README.mdは**作成しない**（後で追加するため）
4. 作成されたリポジトリのURLをコピー（例：`https://github.com/yourusername/junjun-payment-app.git`）

### 2. ローカルでプロジェクトを初期化

```bash
# プロジェクトフォルダに移動
cd /path/to/your/junjun-payment-app

# Gitリポジトリを初期化
git init

# GitHubリポジトリをリモートとして追加
git remote add origin https://github.com/yourusername/junjun-payment-app.git

# 全ファイルをステージング
git add .

# 最初のコミットを作成
git commit -m "Initial commit: ジュンジュン決済アプリ"

# mainブランチにリネーム（古いGitの場合）
git branch -M main

# GitHubにプッシュ
git push -u origin main
```

### 3. GitHub Pagesを有効化
1. GitHubのリポジトリページで「Settings」→「Pages」
2. Source: Deploy from a branch
3. Branch: main / /(root)
4. Save

### 4. 自動デプロイの確認
`.github/workflows/deploy.yml`ファイルがあるため、プッシュするだけで自動的にGitHub Pagesにデプロイされます。

数分後に以下のURLでアクセス可能：
`https://yourusername.github.io/junjun-payment-app/`

## 🔄 更新方法

### ファイルを変更した後：

```bash
# 変更をステージング
git add .

# コミットメッセージを付けてコミット
git commit -m "更新内容の説明"

# GitHubにプッシュ（自動デプロイ）
git push origin main
```

### 定期的な更新：
```bash
# 現在の状態を確認
git status

# 差分を確認
git diff

# コミット履歴を確認
git log --oneline
```

## 🛠️ トラブルシューティング

### プッシュが失敗する場合：
```bash
# 認証情報を確認
git remote -v

# リモートURLを更新（必要な場合）
git remote set-url origin https://github.com/yourusername/junjun-payment-app.git

# 強制プッシュ（慎重に使用）
git push -f origin main
```

### コンフリクトが発生した場合：
```bash
# リモートの変更を取得
git pull origin main

# コンフリクトを解消してから再度コミット
git add .
git commit -m "Resolve conflicts"
git push origin main
```

### GitHub Actionsのワークフローが失敗する場合：
1. GitHubの「Actions」タブでエラーログを確認
2. `.github/workflows/deploy.yml`ファイルの構文を確認
3. リポジトリのSettings → Actions → Generalで権限を確認

## 📋 よく使うコマンド一覧

```bash
# 状態確認
git status

# 差分確認
git diff

# コミット履歴
git log --oneline

# ブランチ確認
git branch

# リモートリポジトリ確認
git remote -v

# 最新の変更を取得
git pull origin main

# プッシュ
git push origin main
```

## 🎯 ベストプラクティス

### コミットメッセージの書き方：
```
feat: 新機能の追加
fix: バグ修正
docs: ドキュメントの更新
style: フォーマットの変更
refactor: リファクタリング
test: テストの追加
chore: ビルドプロセスや補助ツールの変更
```

例：
```bash
git commit -m "feat: 新しい音声バリエーションを追加"
git commit -m "fix: モバイルでの表示バグを修正"
git commit -m "docs: READMEのGitHub Pages説明を更新"
```

## 🚀 高度な設定

### カスタムドメインを使う場合：
1. Settings → Pages → Custom domain
2. ドメインを設定
3. DNSプロバイダーでCNAMEレコードを設定

### 環境変数を使う場合：
GitHub Secretsで機密情報を管理：
- Settings → Secrets and variables → Actions
- New repository secretをクリック

---

これで、ローカル環境からGitHub Pagesへの自動デプロイが完了しました！