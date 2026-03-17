// スマホボタン対応版「じゅんじゅん」決済アプリ
class MobileButtonPaymentApp {
    constructor() {
        this.audioContext = null;
        this.isPlaying = false;
        this.hasUserInteraction = false;
        this.init();
    }

    init() {
        console.log('📱 スマホ対応ボタンアプリ初期化開始');
        this.setupUserInteraction();
        this.setupEventListeners();
        this.setupQuickAmountButtons(); // ボタン設定を最優先
        this.initializeAudioContext();
        console.log('📱 スマホ対応ボタンアプリ初期化完了');
    }

    setupUserInteraction() {
        const enableInteraction = () => {
            if (!this.hasUserInteraction) {
                this.hasUserInteraction = true;
                console.log('✅ ユーザー操作検出');
                
                document.removeEventListener('touchstart', enableInteraction);
                document.removeEventListener('click', enableInteraction);
            }
        };

        document.addEventListener('touchstart', enableInteraction, { once: true });
        document.addEventListener('click', enableInteraction, { once: true });
    }

    setupEventListeners() {
        const confirmBtn = document.getElementById('confirm-btn');
        const amountInput = document.getElementById('amount-input');

        console.log('🎯 イベントリスナー設定中');

        // 決定ボタン - スマホ最適化
        const handleConfirmClick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('🎯 決定ボタン clicked/touched');
            this.handleConfirm();
        };

        confirmBtn.addEventListener('click', handleConfirmClick);
        confirmBtn.addEventListener('touchstart', handleConfirmClick);

        // 金額入力
        amountInput.addEventListener('input', (e) => {
            this.validateInput(e.target);
        });
    }

    setupQuickAmountButtons() {
        const quickButtons = document.querySelectorAll('.quick-amount-btn');
        const amountInput = document.getElementById('amount-input');

        console.log('💰 クイック金額ボタン設定中');

        quickButtons.forEach((button, index) => {
            const amount = button.getAttribute('data-amount');
            
            console.log(`ボタン${index + 1}設定: ¥${amount}`);

            // 🎯 スマホ対応: 複数のイベントを設定
            const handleButtonClick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                console.log(`💰 ボタンクリック検出: ¥${amount}`);
                
                // 金額を入力欄にセット
                amountInput.value = amount;
                
                // ビジュアルフィードバック
                this.addPulseEffect(button);
                
                // 軽い振動（対応デバイス）
                if ('vibrate' in navigator) {
                    navigator.vibrate(20);
                }
                
                // 入力欄にフォーカス
                amountInput.focus();
                
                console.log(`✅ 金額設定完了: ¥${amount}`);
            };

            // 複数のイベントを設定（スマホ対策）
            button.addEventListener('click', handleButtonClick);
            button.addEventListener('touchstart', handleButtonClick, { passive: false });
            button.addEventListener('touchend', handleButtonClick, { passive: false });

            // ボタンのスタイルを変更（押しやすくする）
            button.style.minHeight = '48px'; // タップ領域確保
            button.style.fontSize = '14px';
            button.style.fontWeight = '600';
            
            // タッチフィードバック
            button.addEventListener('touchstart', () => {
                button.style.transform = 'scale(0.95)';
                button.style.opacity = '0.8';
            });

            button.addEventListener('touchend', () => {
                setTimeout(() => {
                    button.style.transform = '';
                    button.style.opacity = '';
                }, 100);
            });
        });

        console.log('✅ クイック金額ボタン設定完了');
    }

    validateInput(input) {
        // 数字のみを許可
        let value = input.value.replace(/[^0-9]/g, '');
        value = value.replace(/^0+/, '') || '0';
        
        if (parseInt(value) > 999999999) {
            value = '999999999';
        }
        
        input.value = value;
        console.log('入力値:', value);
    }

    handleConfirm() {
        const amount = document.getElementById('amount-input').value;
        
        console.log('🎯 handleConfirm called, amount:', amount);
        
        if (!amount || parseInt(amount) <= 0) {
            this.showError('金額を入力してください');
            return;
        }

        console.log('🎵 音声再生開始');
        this.playJunJunSound();
        this.addPulseEffect(document.getElementById('confirm-btn'));
        this.showSuccess(amount);
    }

    initializeAudioContext() {
        if (this.audioContext) return;
        
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext();
            console.log('✅ AudioContext initialized');
        } catch (error) {
            console.warn('❌ Web Audio API not supported:', error);
        }
    }

    playJunJunSound() {
        if (!this.hasUserInteraction) {
            console.log('⚠️ ユーザー操作が必要です');
            return;
        }

        console.log('🎵 音声再生開始: じゅんじゅん');

        // Speech Synthesisを優先
        if ('speechSynthesis' in window) {
            try {
                const utterance = new SpeechSynthesisUtterance('じゅんじゅん');
                utterance.lang = 'ja-JP';
                utterance.pitch = 1.2;
                utterance.rate = 1.3;
                utterance.volume = 1.0;

                utterance.onstart = () => {
                    console.log('🗣️ Speech synthesis started');
                    this.animateVisualizer();
                };

                utterance.onerror = (event) => {
                    console.log('🚨 Speech error:', event);
                    this.playWebAudioJunJun();
                };

                window.speechSynthesis.speak(utterance);
            } catch (error) {
                console.log('🚨 Speech synthesis error:', error);
                this.playWebAudioJunJun();
            }
        } else {
            this.playWebAudioJunJun();
        }
    }

    playWebAudioJunJun() {
        if (!this.audioContext) {
            this.initializeAudioContext();
            if (!this.audioContext) return;
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
                oscillator.frequency.setValueAtTime(523.25, now + (i * 0.2));

                gainNode.gain.setValueAtTime(0, now + (i * 0.2));
                gainNode.gain.linearRampToValueAtTime(0.4, now + (i * 0.2) + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + (i * 0.2) + 0.15);

                oscillator.start(now + (i * 0.2));
                oscillator.stop(now + (i * 0.2) + 0.15);
            }

            console.log('🎵 Web Audio junjun sound played');
            this.animateVisualizer();

        } catch (error) {
            console.log('🚨 Web Audio error:', error);
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
        console.log('✅ Success:', message);
        
        if ('vibrate' in navigator) {
            navigator.vibrate([50, 100, 50]);
        }
    }
}

// アプリケーション初期化
document.addEventListener('DOMContentLoaded', () => {
    console.log('📱 DOMContentLoaded - アプリ初期化開始');
    
    if (typeof SOUND_CONFIG !== 'undefined') {
        new MobileButtonPaymentApp();
        console.log('📱 モバイル対応アプリ起動完了');
    } else {
        console.error('❌ 設定ファイルが見つかりません');
    }
});

// グローバルエラーハンドリング
window.addEventListener('error', (event) => {
    console.error('💥 グローバルエラー:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('💥 未処理のプロミス拒否:', event.reason);
});