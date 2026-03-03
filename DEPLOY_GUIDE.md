# ジュンジュン決済アプリ - GitHub Pages デプロイガイド

## 🚀 超簡単デプロイ（3分で完了）

### 1. GitHubで新規リポジトリ作成
1. [GitHub](https://github.com/new) で新規リポジトリを作成
2. リポジトリ名: `junjun-payment` （何でもOK）
3. Publicを選択（無料）
4. 「Create repository」

### 2. ファイルをアップロード
1. 作成したリポジトリページで「uploading an existing file」リンクをクリック
2. 以下のファイルを**すべて**ドラッグ&ドロップ：

```
index.html
css/style.css
js/config.js
js/app.js
js/mobile-app.js  ← これが新しいモバイル対応版です
.github/workflows/deploy.yml
```

### 3. GitHub Pagesを有効化
1. リポジトripageで「Settings」→「Pages」
2. Source: 「Deploy from a branch」
3. Branch: 「main」 / 「/(root)」
4. 「Save」

### 4. 完了！🎉
数分後に以下のようなURLで公開されます：
`https://[your-username].github.io/junjun-payment/`

## 📱 スマホで使う
1. 公開されたURLをスマホのブラウザで開く
2. ホーム画面に追加してPWAとして使える

## 🔧 トラブルシューティング

### 音が鳴らない場合（スマホ）
1. **iPhone**: サイレントモードをオフにする
2. **音量**: 端末の音量を確認
3. **初回**: 最初にボタンを1回押して音声権限を許可

### ボタンが押せない場合
1. ページをリロード
2. ブラウザを再起動

## 🎯 成功のポイント
- ✅ モバイル対応済み（iPhone/Android）
- ✅ Speech Synthesis API対応
- ✅ Web Audio APIフォールバック
- ✅ ユーザーインタラクション検出
- ✅ 自動デプロイ設定済み

## 📞 サポート
問題がある場合：
1. F12でコンソールを開いてエラーを確認
2. 使用環境（iPhone/Android、ブラウザ）を教えてください