// シンプルな「じゅんじゅん」音声設定
const SOUND_CONFIG = {
    // デフォルト設定
    defaultSound: 'junjun',
    
    // 音声設定（シンプル化）
    sounds: [
        {
            id: 'junjun',
            name: 'じゅんじゅん',
            description: '決済音「じゅんじゅん」',
            type: 'speech',
            params: {
                text: 'じゅんじゅん',
                lang: 'ja-JP',
                pitch: 1.2,
                rate: 1.3,
                volume: 0.9
            }
        }
    ],
    
    // 音声再生設定
    playback: {
        volume: 0.9,
        preload: false,
        loop: false
    },
    
    // フォールバック設定
    fallback: {
        enabled: true,
        useGeneratedSound: true
    },
    
    // Speech Synthesis API設定
    speech: {
        enabled: true,
        defaultVoice: null,
        maxTextLength: 10
    }
};

// デバッグ用のログ
console.log('SOUND_CONFIG loaded:', SOUND_CONFIG);

// 設定をエクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SOUND_CONFIG;
}