
// シンプルモバイル対応「じゅんじゅん」音声アプリ
class SimpleJunJunApp {
    constructor() {
        this.hasUserInteraction = false;
        this.isMobile = this.detectMobile();
        this.init();
    }

    detectMobile() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
    }

    init() {
        console.log('シンプルモバイルアプリ初期化開始...');
        this.setupUserInteraction();
        this.setupEventListeners();
        console.log('シンプルモバイルアプリ初期化完了');
    }

    setupUserInteraction() {
        // 最初のユーザー操作を待つ
        const enableAudio = () => {
            if (!this.hasUserInteraction) {
                this.hasUserInteraction = true;
                console.log('ユーザー操作検出 - 音声有効化');
                
                // 一度だけ実行
                document.removeEventListener('click', enableAudio);
                document.removeEventListener('touchstart', enableAudio);
            }
        };

        document.addEventListener('click', enableAudio, { once: true });
        document.addEventListener('touchstart', enableAudio, { once: true });
    }

    setupEventListeners() {
        const confirmBtn = document.getElementById('confirm-btn');
        const amountInput = document.getElementById('amount-input');

        console.log('イベントリスナー設定中...');

        // 決定ボタン - シンプルなクリックイベントのみ
        confirmBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('決定ボタン clicked');
            this.handleConfirm();
        });

        // 金額入力の検証
        amountInput.addEventListener('input', (e) => {
            this.validateInput(e.target);
        });

        // クイック金額ボタン
        this.setupQuickAmountButtons();
    }

    setupQuickAmountButtons() {
        const quickButtons = document.querySelectorAll('.quick-amount-btn');
        const amountInput = document.getElementById('amount-input');

        console.log('クイック金額ボタン設定中...');

        quickButtons.forEach(button => {
            // シンプルなクリックイベントのみ使用
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                // 最初のユーザー操作を検出
                if (!this.hasUserInteraction) {
                    this.hasUserInteraction = true;
                    console.log('初回ユーザー操作検出');
                }
                
                const amount = button.getAttribute('data-amount');
                console.log('クイックボタン clicked:', amount);
                amountInput.value = amount;
                this.addPulseEffect(button);
                
                // 軽い振動
                if ('vibrate' in navigator) {
                    navigator.vibrate(30);
                }
            });
        });
    }

    validateInput(input) {
        // 数字のみを許可
        let value = input.value.replace(/[^0-9]/g, '');
        value = value.replace(/^0+/, '') || '0';
        
        if (parseInt(value) > 999999999) {
            value = '999999999';
        }
        
        input.value = value;
    }

    handleConfirm() {
        const amount = document.getElementById('amount-input').value;
        
        console.log('決定ボタン pressed, amount:', amount);
        
        if (!amount || parseInt(amount) <= 0) {
            this.showError('金額を入力してください');
            return;
        }

        // 「じゅんじゅん」と読み上げ
        this.speakJunJun();
        this.addPulseEffect(document.getElementById('confirm-btn'));
        this.showSuccess(amount);
    }

    speakJunJun() {
        console.log('speakJunJun called, hasUserInteraction:', this.hasUserInteraction);

        if (!this.hasUserInteraction) {
            console.log('ユーザー操作が必要です');
            return;
        }

        // Speech Synthesisを使用
        if ('speechSynthesis' in window) {
            try {
                // 既存の音声をキャンセル
                window.speechSynthesis.cancel();
                
                const utterance = new SpeechSynthesisUtterance('じゅんじゅん');
                utterance.lang = 'ja-JP';
                utterance.pitch = 1.2;
                utterance.rate = 1.3;
                utterance.volume = 1.0;

                utterance.onstart = () => {
                    console.log('Speech started: じゅんじゅん');
                };

                utterance.onend = () => {
                    console.log('Speech ended');
                };

                window.speechSynthesis.speak(utterance);
                console.log('Speech synthesis started');

            } catch (error) {
                console.log('Speech synthesis error:', error);
                this.fallbackBeep();
            }
        } else {
            // Speech Synthesisが使えない場合のフォールバック
            this.fallbackBeep();
        }
    }

    fallbackBeep() {
        // Web Audio APIの簡易版フォールバック
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);

            console.log('Fallback beep played');
        } catch (error) {
            console.log('Fallback beep error:', error);
        }
    }

    addPulseEffect(element) {
        element.classList.add('pulse');
        setTimeout(() => {
            element.classList.remove('pulse');
        }, 600);
    }

    showError(message) {
        const input = document.getElementById('amount-input');
        input.style.border = '2px solid #ff6b6b';
        input.style.borderRadius = '8px';
        input.placeholder = message;
        
        if ('vibrate' in navigator) {
            navigator.vibrate([200]);
        }
        
        setTimeout(() => {
            input.style.border = 'none';
            input.style.borderRadius = '0';
            input.placeholder = '0';
        }, 2000);
    }

    showSuccess(amount) {
        const message = `¥${parseInt(amount).toLocaleString()} 決済完了！`;
        console.log('Success:', message);
        
        // 軽い成功振動
        if ('vibrate' in navigator) {
            navigator.vibrate([50, 100, 50]);
        }
    }
}

// アプリケーション初期化
document.addEventListener('DOMContentLoaded', () => {
    try {
        new SimpleJunJunApp();
        console.log('シンプルモバイルアプリ起動完了');
    } catch (error) {
        console.error('アプリ初期化エラー:', error);
    }
});

// グローバルエラーハンドリング
window.addEventListener('error', (event) => {
    console.error('グローバルエラー:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('未処理のプロミス拒否:', event.reason);
});