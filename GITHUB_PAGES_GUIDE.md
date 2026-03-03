# 🚀 GitHub Pages デプロイガイド - ブラウザだけで完結

## 前提条件
- GitHubアカウント（無料）
- Webブラウザ（Chrome推奨）
- 5分程度の時間

## 📋 ステップバイステップ

### 1. GitHubで新規リポジトリを作成

1. [GitHub](https://github.com)にログイン
2. 右上の「＋」ボタンをクリック → 「New repository」
3. リポジトリ名を入力（例：`junjun-payment-app`）
4. 「Public」に設定（無料）
5. 「Add a README file」にチェック
6. 「Create repository」をクリック

### 2. ファイルをアップロード

1. 作成したリポジトリページで「uploading an existing file」リンクをクリック
2. 以下のファイルをドラッグ&ドロップ：
   - `index.html`
   - `css/style.css`
   - `js/app.js`
   - `js/config.js`
3. 「Commit changes」ボタンをクリック

### 3. GitHub Pagesを有効化

1. リポジトripageで「Settings」タブをクリック
2. 左側のメニューから「Pages」を選択
3. 「Source」セクションで：
   - Branch: `main`
   - Folder: `/ (root)`
4. 「Save」ボタンをクリック
5. 数分待つと、以下のようなURLが発行される：
   `https://[your-username].github.io/[repository-name]/`

### 4. 完了！

発行されたURLをスマホのブラウザで開くと、アプリが使えます！

## 📱 スマホで使う

1. 発行されたURLをスマホのブラウザで開く
2. ホーム画面に追加してPWAとして使うことも可能

## 🔧 カスタマイズ方法

### タイトルを変更する場合：
`index.html`の以下の部分を編集：
```html
<title>ジュンジュン決済 - PayPay風決済アプリ</title>
<h1 class="app-title">ジュンジュン決済</h1>
```

### 色を変更する場合：
`css/style.css`のCSS変数を編集：
```css
:root {
    --paypay-primary: #FF6B35;
    --paypay-secondary: #F7931E;
}
```

## 🚨 トラブルシューティング

### 404エラーが出る場合：
1. 「Settings」→「Pages」でURLを確認
2. 数分待ってから再試行
3. リポジトリ名のスペルミスを確認

### スタイルが適用されない場合：
1. ファイルのパスを確認
2. ブラウザのキャッシュをクリア

### 音が鳴らない場合：
1. スマホの音量を確認
2. ブラウザの音声権限を確認

## 🎉 成功したら

ホーム画面に追加して、いつでも「ジュンジュン」決済が使えるようにしましょう！

---
**次のステップ**: カスタムドメインを設定する場合は、Settings → Pages → Custom domain で設定可能