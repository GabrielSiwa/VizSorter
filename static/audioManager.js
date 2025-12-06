class AudioManager {
  constructor() {
    this.audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    this.enabled = true;
  }

  playNote(frequency, duration = 100) {
    if (!this.enabled) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + duration / 1000
    );

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration / 1000);
  }

  playComparison(value, max) {
    const frequency = 200 + (value / max) * 800;
    this.playNote(frequency, 50);
  }

  playSwap(value, max) {
    const frequency = 400 + (value / max) * 600;
    this.playNote(frequency, 80);
  }

  playComplete() {
    this.playNote(523.25, 200); // C5
    setTimeout(() => this.playNote(659.25, 200), 150); // E5
    setTimeout(() => this.playNote(783.99, 300), 300); // G5
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }
}

const audioManager = new AudioManager();
