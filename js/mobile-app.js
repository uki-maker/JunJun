class JunJunPaymentApp {
    constructor() {
        this.audioContext = null;
        this.hasUserInteraction = false;
        this.init();
    }

    init() {
        console.log("JunJun App 初期化");

        this.initializeSpeech();
        this.setupQuickAmountButtons();
        this.setupUserInteraction();
        this.setupEventListeners();
    }

    initializeSpeech() {
        if ('speechSynthesis' in window) {
            this.speech = window.speechSynthesis;
            console.log("SpeechSynthesis OK");
        } else {
            console.warn("SpeechSynthesis 未対応");
        }
    }

    setupUserInteraction() {
        const enableAudio = () => {
            if (!this.hasUserInteraction) {
                this.hasUserInteraction = true;
                this.initializeAudioContext();
                console.log("ユーザー操作検出 → 音声有効");
            }
        };

        document.addEventListener("click", enableAudio, { once: true });
        document.addEventListener("touchstart", enableAudio, { once: true });
    }

    setupEventListeners() {
        const confirmBtn = document.getElementById("confirm-btn");

        confirmBtn.addEventListener("click", () => {
            this.playJunJun();
        });
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
            console.log("AudioContext 初期化");
        } catch (e) {
            console.warn("WebAudio 未対応");
        }
    }

    playJunJun() {

        if (!this.hasUserInteraction) {
            console.log("ユーザー操作が必要");
            return;
        }

        if (this.speech) {
            this.playSpeech();
        } else {
            this.playWebAudio();
        }
    }

    playSpeech() {

        try {

            this.speech.cancel();

            const utterance = new SpeechSynthesisUtterance("じゅんじゅん");

            utterance.lang = "ja-JP";
            utterance.pitch = 1.2;
            utterance.rate = 1.2;
            utterance.volume = 1;

            utterance.onstart = () => {
                console.log("じゅんじゅん 再生開始");
            };

            utterance.onerror = () => {
                console.log("speech error → web audio fallback");
                this.playWebAudio();
            };

            this.speech.speak(utterance);

        } catch (e) {
            console.log("speech error", e);
            this.playWebAudio();
        }
    }

    playWebAudio() {

        if (!this.audioContext) {
            this.initializeAudioContext();
            if (!this.audioContext) return;
        }

        const now = this.audioContext.currentTime;

        for (let i = 0; i < 2; i++) {

            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();

            osc.connect(gain);
            gain.connect(this.audioContext.destination);

            osc.type = "sine";
            osc.frequency.value = 523;

            gain.gain.setValueAtTime(0.4, now + i * 0.2);
            gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.2 + 0.15);

            osc.start(now + i * 0.2);
            osc.stop(now + i * 0.2 + 0.15);
        }

        console.log("WebAudio じゅんじゅん");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new JunJunPaymentApp();
});