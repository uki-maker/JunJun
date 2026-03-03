# じゅんじゅん決済音アプリ

## 概要

「じゅんじゅん決済音アプリ」は、数値（金額）を入力してボタンを押すと機械音声で「じゅんじゅん」と読み上げるシンプルなWebアプリケーションです。

## 主な機能

- 💰 金額入力（数値のみ）
- 🔊 **機械音声で「じゅんじゅん」と読み上げ**
- 🎵 **複数の「じゅんじゅん」音声バリエーション**
- ⚡ クイック金額ボタン（1,000円、2,000円、5,000円、10,000円）
- 🎨 モダンでレスポンシブなデザイン
- 🔊 音楽ビジュアライザーアニメーション
- ⌨️ Enterキー対応
- 📱 モバイル対応

## 技術スタック

- HTML5
- CSS3（Flexbox、Grid、CSSアニメーション）
- JavaScript（ES6+）
- **Speech Synthesis API（機械音声）**
- Web Audio API（合成音フォールバック）
- Google Fonts（Noto Sans JP）
- Font Awesome（アイコン）

## ファイル構造

```
├── index.html          # メインHTMLファイル
├── css/
│   └── style.css      # スタイルシート
├── js/
│   ├── config.js      # じゅんじゅん音声設定
│   └── app.js         # JavaScriptアプリケーション
└── README.md          # プロジェクト説明
```

## 使用方法

### 基本的な使い方

1. 金額を入力欄に入力するか、クイックボタンから選択
2. 支払い音を選択（ノーマル、高速、低速、高ピッチ、低ピッチ、ロボット、エコー、機械音など）
3. 「じゅんじゅん」ボタンをクリックするか、Enterキーを押す
4. 機械音声で「じゅんじゅん」と読み上がり、成功メッセージが表示される

### 音声の種類

- **じゅんじゅん ノーマル**: 標準的な音声
- **じゅんじゅん 高速**: 早口バージョン
- **じゅんじゅん 低速**: ゆっくりバージョン
- **じゅんじゅん 高ピッチ**: 高い声バージョン
- **じゅんじゅん 低ピッチ**: 低い声バージョン
- **じゅんじゅん ロボット**: ロボットっぽい声
- **じゅんじゅん エコー**: エコー効果付き
- **じゅんじゅん 機械**: 機械音風の合成音

## 音の仕組み

### Speech Synthesis API（推奨）
ブラウザ内蔵の音声合成APIを使用して、「じゅんじゅん」と読み上げます。ピッチ、速度、声の種類を調整可能。

### Web Audio APIフォールバック
Speech Synthesis APIが利用できない場合は、Web Audio APIで電子的な合成音を生成します。

## デザインの特徴

- グラデーション背景でモダンな印象
- カード型レイアウトで使いやすいUI
- 音声選択UI：ドロップダウンセレクトボックスとテスト再生ボタン
- ホバーエフェクトやアニメーションで操作性を向上
- レスポンシブデザインでスマートフォンでも快適に使用可能

## ブラウザ対応

- Chrome 33+（Speech Synthesis対応）
- Firefox 49+
- Safari 7+
- Edge 14+

## カスタマイズ

### 音声の変更
`js/config.js`の`text`パラメータを変更することで、読み上げるテキストを変更できます。

```javascript
params: {
    text: 'じゅんじゅん',  // ここを変更
    lang: 'ja-JP',
    pitch: 1.0,
    rate: 1.0,
    volume: 1.0
}
```

### デザインの変更
`css/style.css`のCSS変数やグラデーション、色を変更することで、見た目をカスタマイズできます。

### クイック金額の変更
HTMLファイルのクイック金額ボタン部分を変更することで、よく使う金額を変更できます。

## 設定オプション

```javascript
SOUND_CONFIG = {
    defaultSound: 'junjun1',           // デフォルト音声
    playback: {
        volume: 1.0,                   // 音量（0.0-1.0）
        preload: false,              // プリロード不要（機械音声）
        loop: false                  // ループ再生
    },
    speech: {
        enabled: true,               // Speech Synthesis有効
        maxTextLength: 10           // 最大文字数
    }
};
```

## 🌐 本番環境でのホスティング

### 推奨ホスティングサービス
- **GitHub Pages**: 無料、カスタムドメイン対応、HTTPS対応
- **Netlify**: ドラッグ&ドロップで簡単デプロイ
- **Vercel**: 高速配信、自動デプロイ
- **Firebase Hosting**: Googleのインフラストラクチャ

### カスタムドメイン設定
GitHub Pagesでカスタムドメインを使う場合：
1. Settings → Pages → Custom domain
2. ドメインを入力して保存
3. DNS設定でCNAMEレコードを追加

## 使用上の注意

- 初回クリック時にブラウザに音声再生の許可が必要な場合があります
- 一部のブラウザではSpeech Synthesis APIが無効になっている場合があります
- モバイル端末では、ユーザー操作なしに音声が再生されない場合があります
- **iPhoneではサイレントモードをオフにしてください**

## 🚀 GitHub Pagesで公開する

### 最も簡単な方法（ブラウザだけ）

1. **GitHubで新規リポジトリを作成**
   - [GitHub](https://github.com)にログイン
   - 右上の「＋」→「New repository」
   - リポジトリ名を入力（例：`junjun-payment-app`）
   - 「Public」に設定
   - 「Create repository」

2. **ファイルをアップロード**
   - リポジトリページで「uploading an existing file」をクリック
   - 以下のファイルをドラッグ&ドロップ：
     - `index.html`
     - `css/style.css`
     - `js/app.js`
     - `js/config.js`
     - `.github/workflows/deploy.yml`
   - 「Commit changes」

3. **GitHub Pagesを有効化**
   - 「Settings」→「Pages」
   - Source: Deploy from a branch
   - Branch: `main` / `/(root)`
   - 「Save」

4. **完了！**
   - 数分後に以下のようなURLで公開される：
     `https://[your-username].github.io/[repository-name]/`

### スマホで使う
1. 発行されたURLをスマホのブラウザで開く
2. ホーム画面に追加してPWAとして使える

詳細な手順は `GITHUB_PAGES_GUIDE.md` を参照してください。

## 📱 PWAとしてインストール

iPhone: Safariで開く → シェアボタン → 「ホーム画面に追加」
Android: Chromeで開く → メニュー → 「ホーム画面に追加」

## 今後の改善案

- [ ] 声の種類を増やす（男性、女性、子供など）
- [ ] 言語切り替え（日本語、英語、中国語など）
- [ ] カスタムテキスト入力機能
- [ ] 音量スライダー
- [ ] 音程調整スライダー
- [ ] 履歴機能（過去の支払い金額を記録）
- [ ] 統計機能（合計金額、回数など）
- [x] **GitHub Pages対応** ✅

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 作者

じゅんじゅん決済音アプリ - 2024

---

**Special Feature**: このアプリは「じゅんじゅん」という決済音を機械音声で読み上げることが最大の特徴です！