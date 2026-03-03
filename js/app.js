class SoundPaymentApp {
    constructor() {
        this.audioContext = null;
        this.isPlaying = false;
        this.currentSoundId = SOUND_CONFIG.defaultSound;
        this.speechSynthesis = null;
        this.touchStartY = 0;
        this.touchEndY = 0;
        this.isAudioInitialized = false; // 音声初期化フラグ
        this.hasUserInteraction = false; // ユーザー操作検出
        this.isMobile = this.detectMobile(); // モバイル判定
        this.init();
    }

    detectMobile() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
    }

    init() {
        console.log('アプリケーション初期化開始... モバイル:', this.isMobile);
        this.setupUserInteraction(); // ユーザー操作検出を最初に設定
        this.setupEventListeners();
        this.initializeAudioContext();
        this.initializeSpeechSynthesis(); // 追加
        this.setupQuickAmountButtons();
        this.initializeSoundSelection();
        this.setupTouchEvents();
        this.preventZoom();
        this.setupMobileOptimizations();
        console.log('アプリケーション初期化完了');
    }

    setupUserInteraction() {
        // ユーザー操作を待ってから音声を有効化
        const enableAudio = () => {
            if (!this.hasUserInteraction) {
                this.hasUserInteraction = true;
                this.initializeAudioContext();
                this.initializeSpeechSynthesis();
                console.log('ユーザー操作検出 - 音声システム有効化');
                
                // 一度だけ実行
                document.removeEventListener('click', enableAudio);
                document.removeEventListener('touchstart', enableAudio);
                document.removeEventListener('touchend', enableAudio);
            }
        };

        document.addEventListener('click', enableAudio, { once: true });
        document.addEventListener('touchstart', enableAudio, { once: true });
        document.addEventListener('touchend', enableAudio, { once: true });
    }

    setupEventListeners() {
        const confirmBtn = document.getElementById('confirm-btn');
        const amountInput = document.getElementById('amount-input');

        console.log('Setting up event listeners...');

        // 決定ボタンのクリックイベント
        confirmBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('決定ボタン clicked');
            this.handleConfirm();
        });

        confirmBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            confirmBtn.style.transform = 'scale(0.95)';
        });

        confirmBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            confirmBtn.style.transform = '';
            console.log('決定ボタン touched');
            this.handleConfirm();
        });

        // 金額入力のモバイル最適化
        amountInput.addEventListener('input', (e) => {
            this.validateMobileInput(e.target);
        });

        // 金額入力の初期値を設定
        if (!amountInput.value) {
            amountInput.value = '';
        }

        // オーディオコンテキストの初期化（ユーザー操作に基づく）
        document.addEventListener('click', () => {
            if (!this.audioContext) {
                this.initializeAudioContext();
            }
        }, { once: true });

        document.addEventListener('touchstart', () => {
            if (!this.audioContext) {
                this.initializeAudioContext();
            }
        }, { once: true });
    }

    setupQuickAmountButtons() {
        const quickButtons = document.querySelectorAll('.quick-amount-btn');
        const amountInput = document.getElementById('amount-input');

        console.log('Setting up quick amount buttons...');

        quickButtons.forEach(button => {
            // クリックイベント（タッチデバイスでも確実に動作）
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const amount = button.getAttribute('data-amount');
                console.log('Quick button clicked:', amount);
                amountInput.value = amount;
                this.addPulseEffect(button);
                
                // 振動フィードバック（対応デバイス）
                if ('vibrate' in navigator) {
                    navigator.vibrate(50);
                }
            });

            // タッチイベントを簡素化
            button.addEventListener('touchstart', (e) => {
                // デフォルトのタッチ動作を防止
                e.preventDefault();
            });
        });
    }

    initializeAudioContext() {
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext();
        } catch (error) {
            console.warn('Web Audio API is not supported in this browser');
        }
    }

    playJunJunSound() {
        if (!this.hasUserInteraction) {
            console.log('ユーザー操作が必要です');
            return;
        }

        if (!this.speechSynthesis) {
            console.log('Speech Synthesis not available, using Web Audio fallback');
            this.playSyntheticJunJunSound();
            return;
        }

        // 既存の音声をキャンセル
        this.speechSynthesis.cancel();

        // 「じゅんじゅん」と読み上げ
        const utterance = new SpeechSynthesisUtterance('じゅんじゅん');
        utterance.lang = 'ja-JP';
        utterance.pitch = 1.2;
        utterance.rate = 1.3;
        utterance.volume = 1.0;

        // モバイル対策
        utterance.onstart = () => {
            console.log('Speech started: じゅんじゅん');
            this.animateSoundVisualizer();
        };

        utterance.onerror = (event) => {
            console.log('Speech error, using Web Audio fallback:', event);
            this.playSyntheticJunJunSound();
        };

        console.log('Speaking: じゅんじゅん');
        
        // 再生開始
        this.speechSynthesis.speak(utterance);
    }

    playSyntheticJunJunSound() {
        if (!this.audioContext) {
            this.initializeAudioContext();
            if (!this.audioContext) return;
        }

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
            gainNode.gain.linearRampToValueAtTime(0.3, now + (i * 0.2) + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + (i * 0.2) + 0.15);

            oscillator.start(now + (i * 0.2));
            oscillator.stop(now + (i * 0.2) + 0.15);
        }

        console.log('Playing synthetic junjun sound');
    }

    getVoices() {
        if (!this.speechSynthesis) return [];
        
        const voices = this.speechSynthesis.getVoices();
        return voices;
    }

    // モバイル入力検証
    validateMobileInput(input) {
        // 数字のみを許可
        let value = input.value.replace(/[^0-9]/g, '');
        
        // 先頭の0を削除
        value = value.replace(/^0+/, '') || '0';
        
        // 最大値チェック
        if (parseInt(value) > 999999999) {
            value = '999999999';
        }
        
        input.value = value;
        
        // リアルタイムでの桁数制限
        if (value.length > 9) {
            input.value = value.substring(0, 9);
        }
    }

    // 入力フィールドへのスクロール
    scrollToInput(element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }

    // タッチイベントの設定
    setupTouchEvents() {
        const container = document.querySelector('.app-container');
        
        // スワイプジェスチャー対応
        container.addEventListener('touchstart', (e) => {
            this.touchStartY = e.touches[0].clientY;
        });

        container.addEventListener('touchend', (e) => {
            this.touchEndY = e.changedTouches[0].clientY;
            this.handleSwipeGesture();
        });

        // ダブルタップズーム防止
        let lastTap = 0;
        container.addEventListener('touchend', (e) => {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;
            if (tapLength < 500 && tapLength > 0) {
                e.preventDefault();
            }
            lastTap = currentTime;
        });
    }

    // スワイプジェスチャー処理
    handleSwipeGesture() {
        const swipeDistance = this.touchEndY - this.touchStartY;
        const minSwipeDistance = 50;

        if (Math.abs(swipeDistance) > minSwipeDistance) {
            if (swipeDistance > 0) {
                // 下スワイプ
                console.log('下スワイプ');
            } else {
                // 上スワイプ
                console.log('上スワイプ');
            }
        }
    }

    // ズーム防止
    preventZoom() {
        document.addEventListener('gesturestart', (e) => {
            e.preventDefault();
        });

        document.addEventListener('gesturechange', (e) => {
            e.preventDefault();
        });

        document.addEventListener('gestureend', (e) => {
            e.preventDefault();
        });
    }

    // モバイル最適化設定
    setupMobileOptimizations() {
        // ステータスバーの色を設定
        if ('theme' in document.documentElement) {
            document.documentElement.setAttribute('theme', 'dark');
        }

        // 画面の向き変更に対応
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.adjustLayoutForOrientation();
            }, 100);
        });

        // リサイズ対応
        window.addEventListener('resize', () => {
            this.adjustLayoutForScreenSize();
        });
    }

    adjustLayoutForOrientation() {
        const container = document.querySelector('.app-container');
        const orientation = window.orientation;
        
        if (orientation === 90 || orientation === -90) {
            // 横向き
            container.style.minHeight = '100vh';
        } else {
            // 縦向き
            container.style.minHeight = 'calc(100vh - 16px)';
        }
    }

    adjustLayoutForScreenSize() {
        // 画面サイズに応じた調整
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        if (width < 768) {
            // スマートフォン
            document.body.classList.add('mobile');
            document.body.classList.remove('tablet', 'desktop');
        } else if (width < 1024) {
            // タブレット
            document.body.classList.add('tablet');
            document.body.classList.remove('mobile', 'desktop');
        } else {
            // デスクトップ
            document.body.classList.add('desktop');
            document.body.classList.remove('mobile', 'tablet');
        }
    }

    initializeSoundSelection() {
        // 音声選択はシンプルに - 常に「じゅんじゅん」を使用
        this.currentSoundId = 'junjun';
        
        // テストボタンのイベントを設定
        const testSoundBtn = document.getElementById('test-sound-btn');
        if (testSoundBtn) {
            testSoundBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.playJunJunSound();
            });
        }

        // 音声選択UIを非表示にする（シンプルな実装のため）
        const soundSection = document.querySelector('.sound-section');
        if (soundSection) {
            soundSection.style.display = 'none';
        }
    }

    updateSoundDescription() {
        const soundDescription = document.getElementById('sound-description');
        const selectedSound = SOUND_CONFIG.sounds.find(sound => sound.id === this.currentSoundId);
        
        if (soundDescription && selectedSound) {
            soundDescription.textContent = selectedSound.description;
        }
    }

    playPreviewSound() {
        this.playPaymentSound(true);
    }

    handleConfirm() {
        const amount = document.getElementById('amount-input').value;
        
        console.log('handleConfirm called, amount:', amount);
        
        if (!amount || parseInt(amount) <= 0) {
            this.showMobileError('金額を入力してください');
            return;
        }

        // 音を即座に再生（ローディングなしで）
        this.playPaymentSound();
        this.addPulseEffect(document.getElementById('confirm-btn'));
        this.showSuccessMessage(amount);
    }

    showLoading() {
        const loadingOverlay = document.getElementById('loading-overlay');
        loadingOverlay.style.display = 'flex';
    }

    hideLoading() {
        const loadingOverlay = document.getElementById('loading-overlay');
        loadingOverlay.style.display = 'none';
    }

    showMobileError(message) {
        const input = document.getElementById('amount-input');
        input.style.border = '2px solid #ff6b6b';
        input.style.borderRadius = '8px';
        input.placeholder = message;
        
        // 振動フィードバック
        if ('vibrate' in navigator) {
            navigator.vibrate([200]);
        }
        
        setTimeout(() => {
            input.style.border = 'none';
            input.style.borderRadius = '0';
            input.placeholder = '0';
        }, 2000);
    }

    showSuccessMessage(amount) {
        const successMessage = document.getElementById('success-message');
        const successText = successMessage.querySelector('.success-text');
        
        successText.textContent = `¥${parseInt(amount).toLocaleString()} 決済完了！`;
        successMessage.classList.add('show');
        
        // 成功音（短い振動）
        if ('vibrate' in navigator) {
            navigator.vibrate([50, 100, 50]);
        }
        
        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 2000);
    }

    playPaymentSound(isPreview = false) {
        if (this.isPlaying && !isPreview) return;
        this.isPlaying = true;

        console.log('playPaymentSound called, isPreview:', isPreview);
        
        if (!this.hasUserInteraction) {
            console.log('ユーザー操作が必要です - 初回はクリック/タッチしてください');
            this.isPlaying = false;
            return;
        }

        // サウンドビジュアライザーのアニメーション
        this.animateSoundVisualizer();

        // まずSpeech Synthesisで「じゅんじゅん」と読み上げ
        if ('speechSynthesis' in window) {
            this.playJunJunSound();
        } else {
            // フォールバック：Web Audio API
            this.playSyntheticJunJunSound();
        }

        // 1秒後に再生フラグをリセット
        setTimeout(() => {
            this.isPlaying = false;
        }, 1000);
    }

    playSpeechSound(params) {
        if (!this.speechSynthesis) {
            console.warn('Speech Synthesis is not available');
            return;
        }

        // 既存の音声をキャンセル
        this.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(params.text);
        
        // パラメータを設定
        if (params.lang) utterance.lang = params.lang;
        if (params.pitch) utterance.pitch = params.pitch;
        if (params.rate) utterance.rate = params.rate;
        if (params.volume) utterance.volume = params.volume;

        // 再生開始
        this.speechSynthesis.speak(utterance);
    }

    playSyntheticSound(params) {
        if (!this.audioContext) {
            this.initializeAudioContext();
            if (!this.audioContext) return;
        }

        const now = this.audioContext.currentTime;
        const frequencies = params.frequencies || [523.25, 659.25, 783.99];
        const duration = params.duration || 0.3;
        const waveform = params.waveform || 'sine';

        frequencies.forEach((freq, index) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.type = waveform;
            oscillator.frequency.setValueAtTime(freq, now + (index * duration * 0.5));

            gainNode.gain.setValueAtTime(0, now + (index * duration * 0.5));
            gainNode.gain.linearRampToValueAtTime(0.3, now + (index * duration * 0.5) + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + (index * duration * 0.5) + duration);

            oscillator.start(now + (index * duration * 0.5));
            oscillator.stop(now + (index * duration * 0.5) + duration);
        });
    }

    animateSoundVisualizer() {
        const visualizer = document.getElementById('sound-visualizer');
        const waves = visualizer.querySelectorAll('.sound-wave');
        
        waves.forEach((wave, index) => {
            wave.style.animationDuration = '0.3s';
            wave.style.background = 'var(--paypay-success)';
        });

        setTimeout(() => {
            waves.forEach((wave, index) => {
                wave.style.animationDuration = '1.2s';
                wave.style.background = 'var(--paypay-primary)';
            });
        }, 1000);
    }

    addPulseEffect(element) {
        element.classList.add('pulse');
        setTimeout(() => {
            element.classList.remove('pulse');
        }, 600);
    }

    initializeSpeechSynthesis() {
        if ('speechSynthesis' in window) {
            this.speechSynthesis = window.speechSynthesis;
            console.log('Speech Synthesis initialized');
        } else {
            console.warn('Speech Synthesis API is not supported in this browser');
        }
    }
}

// アプリケーションの初期化
document.addEventListener('DOMContentLoaded', () => {
    if (typeof SOUND_CONFIG !== 'undefined') {
        new SoundPaymentApp();
    } else {
        console.error('設定ファイルが見つかりません');
    }
});

// ページの可視性が変わった時の処理
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // ページが非表示の時は音を停止
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
    }
});

// エラーハンドリング
window.addEventListener('error', (event) => {
    console.error('アプリケーションエラー:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('未処理のプロミス拒否:', event.reason);
});