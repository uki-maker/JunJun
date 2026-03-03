# 📱 ジュンジュン決済アプリ - スマホ設定ガイド

## 🚀 すぐに使いたい方へ

### 1. ブラウザで直接開く（30秒）
1. スマホのブラウザでアプリのURLを開く
2. 完了！すぐに使えます

### 2. ホーム画面に追加（1分）
#### iPhone/Safari:
1. Safariでアプリを開く
2. 画面下から上にスワイプしてシェアボタン（↑）をタップ
3. 「ホーム画面に追加」を選択
4. 「追加」をタップ
5. ホーム画面にアプリアイコンが追加される

#### Android/Chrome:
1. Chromeでアプリを開く
2. 右上のメニュー（⋮）をタップ
3. 「ホーム画面に追加」を選択
4. 「追加」をタップ
5. アプリがインストールされる

## 🛠️ 開発者向け詳細設定

### 必要な環境
- Webサーバー（ローカルでも可）
- モダンなブラウザ（Chrome, Safari, Firefox, Edge）
- HTTPS対応（本番環境推奨）

### ファイル構成
```
ジュンジュン決済アプリ/
├── index.html          # メインHTMLファイル
├── css/
│   └── style.css       # スタイルシート
├── js/
│   ├── app.js          # メインJavaScript
│   └── config.js       # 音声設定
├── audio/              # 音声ファイルフォルダ（必要に応じて）
└── manifest.json     # PWA設定ファイル
```

### ローカルサーバーでの動作確認

#### Pythonを使う場合：
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

#### Node.jsを使う場合：
```bash
# http-serverをインストール
npm install -g http-server

# サーバーを起動
http-server -p 8000
```

#### VS Codeを使う場合：
1. "Live Server"拡張機能をインストール
2. index.htmlを右クリック
3. "Open with Live Server"を選択

### スマホからローカルサーバーにアクセス

#### 同じWi-Fiネットワークを使用：
1. コマンドプロンプトでIPアドレスを確認
   - Windows: `ipconfig`
   - Mac: `ifconfig`
   - Linux: `ip addr`

2. スマホのブラウザで `http://[IPアドレス]:8000` にアクセス

例: `http://192.168.1.100:8000`

### PWA設定のカスタマイズ

`manifest.json`を編集してアプリ情報を変更：

```json
{
    "name": "ジュンジュン決済",
    "short_name": "ジュンジュン",
    "description": "PayPay風の決済アプリ",
    "theme_color": "#FF6B35",
    "background_color": "#FFFFFF",
    "display": "standalone",
    "orientation": "portrait"
}
```

### トラブルシューティング

#### 音が鳴らない場合：
1. **iPhone/Safari**: サイレントモードを確認
2. **音量**: 端末の音量を確認
3. **ブラウザ**: 別のブラウザで試す
4. **再起動**: ブラウザを再起動

#### 画面が小さい場合：
1. 画面をダブルタップしてズーム
2. ピンチアウトでズーム
3. ブラウザの設定で「デスクトップサイト」をオフ

#### 動作が遅い場合：
1. 他のアプリを閉じる
2. ブラウザのキャッシュをクリア
3. 端末を再起動

### 高度な設定

#### カスタム音声ファイルの追加：
1. `audio/`フォルダに音声ファイルを配置
2. `config.js`に設定を追加

```javascript
{
    id: 'custom1',
    name: 'カスタム音声1',
    description: 'オリジナルの決済音',
    type: 'audio',
    params: {
        src: 'audio/custom-payment.mp3',
        volume: 0.8
    }
}
```

#### 音声のカスタマイズ：
`config.js`のパラメータを調整：
- `pitch`: 高さ（0.1-2.0）
- `rate`: 速さ（0.1-10.0）
- `volume`: 音量（0.0-1.0）

### セキュリティに関する注意
- 本番環境ではHTTPSを使用
- 個人情報は保存しない
- 公共のWi-Fiでは注意して使用

## 📞 サポート

問題が発生した場合：
1. ブラウザのコンソールを確認（F12）
2. エラーメッセージをメモ
3. 使用環境（端末/OS/ブラウザ）を確認

---

**お楽しみください！** 🎉