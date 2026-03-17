// モバイル対応版「じゅんじゅん」音声アプリ
class JunJunPaymentApp {
    constructor() {
        this.audioContext = null;
        this.isPlaying = false;
        this.hasUserInteraction = false;
        this.isMobile = this.detectMobile();
        this.init();
    }

    init() {
        console.log('モバイル対応アプリ初期化開始...');
        this.setupUserInteraction();
        this.setupEventListeners();
        this.setupQuickAmountButtons();
        this.setupMobileAudio();
        console.log('モバイル対応アプリ初期化完了');
    }

    detectMobile() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
    }

    setupUserInteraction() {
        // 最初のユーザー操作を待つ
        const enableAudio = () => {
            if (!this.hasUserInteraction) {
                this.hasUserInteraction = true;
                this.initializeAudioContext();
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

        // 決定ボタン - モバイル用に最適化
        confirmBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleConfirm();
        });

        confirmBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            confirmBtn.style.transform = 'scale(0.95)';
        });

        confirmBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            confirmBtn.style.transform = '';
            this.handleConfirm();
        });

        // 金額入力
        amountInput.addEventListener('input', (e) => {
            this.validateInput(e.target);
        });
    }

    setupQuickAmountButtons() {
        const quickButtons = document.querySelectorAll('.quick-amount-btn');
        const amountInput = document.getElementById('amount-input');

        console.log('クイック金額ボタン設定中...');

        quickButtons.forEach(button => {
            const amount = button.getAttribute('data-amount');
            
            // モバイル用に最適化されたクリックイベント
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                console.log('クイックボタン clicked:', amount);
                amountInput.value = amount;
                this.addPulseEffect(button);
                
                // 軽い振動
                if ('vibrate' in navigator) {
                    navigator.vibrate(30);
                }
            });

            // タッチイベントも追加
            button.addEventListener('touchstart', (e) => {
                e.preventDefault();
                button.style.transform = 'scale(0.95)';
            });

            button.addEventListener('touchend', (e) => {
                e.preventDefault();
                button.style.transform = '';
            });
        });
    }

    initializeAudioContext() {
        try {
            if (!this.audioContext) {
                window.AudioContext = window.AudioContext || window.webkitAudioContext;
                this.audioContext = new AudioContext();
                console.log('AudioContext initialized');
            }
        } catch (error) {
            console.warn('Web Audio API not supported');
        }
    }

    setupMobileAudio() {
        // iOS Safari対策 - ユーザーインタラクション後にAudioContextを作成
        if (this.isMobile) {
            console.log('モバイルデバイス検出 - 特殊対応実施');
            
            // Web Audio APIの初期化を遅延
            setTimeout(() => {
                this.initializeAudioContext();
            }, 100);
        }
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

        // 音を再生
        this.playJunJunSound();
        this.addPulseEffect(document.getElementById('confirm-btn'));
        this.showSuccess(amount);
    }

    playJunJunSound() {
        console.log('playJunJunSound called, hasUserInteraction:', this.hasUserInteraction);

        if (!this.hasUserInteraction) {
            console.log('ユーザー操作が必要です');
            return;
        }

        // まずSpeech Synthesisを試す
        if ('speechSynthesis' in window) {
            this.playSpeechJunJun();
        } else {
            // フォールバック: Web Audio API
            this.playWebAudioJunJun();
        }
    }

    playSpeechJunJun() {
        try {
            const utterance = new SpeechSynthesisUtterance('じゅんじゅん');
            utterance.lang = 'ja-JP';
            utterance.pitch = 1.2;
            utterance.rate = 1.3;
            utterance.volume = 1.0;

            // モバイル対策: 音声の準備ができるまで待つ
            utterance.onstart = () => {
                console.log('Speech started: じゅんじゅん');
                this.animateVisualizer();
            };

            utterance.onend = () => {
                console.log('Speech ended');
            };

            utterance.onerror = (event) => {
                console.log('Speech error:', event);
                // エラー時はWeb Audio APIにフォールバック
                this.playWebAudioJunJun();
            };

            window.speechSynthesis.speak(utterance);
            console.log('Speech synthesis started');

        } catch (error) {
            console.log('Speech synthesis error:', error);
            this.playWebAudioJunJun();
        }
    }

    playWebAudioJunJun() {
        if (!this.audioContext) {
            console.log('AudioContext not available, trying to initialize...');
            this.initializeAudioContext();
            
            if (!this.audioContext) {
                console.log('Web Audio API not available');
                return;
            }
        }

        try {
            const now = this.audioContext.currentTime;
            
            // 「じゅんじゅん」風の音を2回作成
            for (let i = 0; i < 2; i++) {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);

                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(523.25, now + (i * 0.2)); // C5

                gainNode.gain.setValueAtTime(0, now + (i * 0.2));
                gainNode.gain.linearRampToValueAtTime(0.4, now + (i * 0.2) + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + (i * 0.2) + 0.15);

                oscillator.start(now + (i * 0.2));
                oscillator.stop(now + (i * 0.2) + 0.15);
            }

            console.log('Web Audio junjun sound played');
            this.animateVisualizer();

        } catch (error) {
            console.log('Web Audio error:', error);
        }
    }

    animateVisualizer() {
        const visualizer = document.getElementById('sound-visualizer');
        if (!visualizer) return;
        
        const waves = visualizer.querySelectorAll('.sound-wave');
        
        waves.forEach((wave, index) => {
            wave.style.animationDuration = '0.3s';
            wave.style.background = '#28a745';
            wave.style.height = Math.random() * 20 + 10 + 'px';
        });

        setTimeout(() => {
            waves.forEach((wave, index) => {
                wave.style.animationDuration = '1.2s';
                wave.style.background = 'var(--paypay-primary)';
                wave.style.height = '';
            });
        }, 1000);
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
        new JunJunPaymentApp();
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