// SoundManager.js - Retro sound effects using Web Audio API
export class SoundManager {
  constructor() {
    this.audioContext = null;
    this.enabled = true;
this.masterVolume = 0.3;
  }

  init() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API not supported');
      this.enabled = false;
    }
  }

  playBeep(frequency, duration = 0.1) {
    if (!this.enabled || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'square';

    gainNode.gain.setValueAtTime(this.masterVolume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  paddleHit(hitPosition) {
    // Vary pitch based on paddle hit position (-1 to 1)
    const basePitch = 440;
    const pitch = basePitch + hitPosition * 100;
    this.playBeep(pitch, 0.05);
  }

  brickHit(points) {
    // Higher points = higher pitch
    const pitch = 200 + points * 3;
    this.playBeep(pitch, 0.08);
  }

  powerUpCollect() {
    this.playBeep(800, 0.1);
    setTimeout(() => this.playBeep(1000, 0.1), 50);
  }

  ballLost() {
    this.playBeep(200, 0.3);
    setTimeout(() => this.playBeep(150, 0.3), 150);
  }

  levelComplete() {
    const notes = [523, 659, 784, 1047]; // C, E, G, C
    notes.forEach((note, i) => {
      setTimeout(() => this.playBeep(note, 0.15), i * 100);
    });
  }

  gameOver() {
    const notes = [392, 330, 294, 247]; // G, E, D, B
    notes.forEach((note, i) => {
      setTimeout(() => this.playBeep(note, 0.2), i * 150);
    });
  }
}
