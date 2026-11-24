/**
 * Procedural Web Audio API sound synthesizer for tactile studio wood chess SFX.
 * Zero external audio assets — works 100% offline with instant playback.
 */
class ChessSoundEngine {
  private ctx: AudioContext | null = null;
  private enabled = true;

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  private getContext(): AudioContext | null {
    if (!this.enabled || typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private playWoodTap(timeOffset: number, pitchHz: number, gainPeak: number, duration: number): void {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime + timeOffset;

    // Resonant hardwood body thud
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(pitchHz * 1.35, now);
    osc.frequency.exponentialRampToValueAtTime(pitchHz * 0.62, now + duration);

    oscGain.gain.setValueAtTime(0.0001, now);
    oscGain.gain.linearRampToValueAtTime(gainPeak, now + 0.004);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.01);

    // Crisp filtered transient click (felt-and-wood contact)
    const bufferSize = Math.max(1, Math.floor(ctx.sampleRate * 0.025));
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.28));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(pitchHz * 4.2, now);
    filter.Q.setValueAtTime(1.8, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(gainPeak * 0.55, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.024);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);
  }

  public playMove(): void {
    this.playWoodTap(0, 210, 0.22, 0.075);
  }

  public playCapture(): void {
    this.playWoodTap(0, 290, 0.24, 0.055);
    this.playWoodTap(0.045, 175, 0.28, 0.09);
  }

  public playCastle(): void {
    this.playWoodTap(0, 215, 0.2, 0.07);
    this.playWoodTap(0.09, 190, 0.22, 0.08);
  }

  public playCheck(): void {
    this.playWoodTap(0, 240, 0.22, 0.075);
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime + 0.05;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(660, now);
    osc.frequency.exponentialRampToValueAtTime(520, now + 0.16);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.11, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  public playGameOver(isDraw: boolean): void {
    const ctx = this.getContext();
    if (!ctx) return;
    const notes = isDraw ? [392, 349.23] : [392, 493.88, 587.33];
    notes.forEach((freq, idx) => {
      const now = ctx.currentTime + idx * 0.09;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.1, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.45);
    });
  }

  public dispose(): void {
    if (this.ctx) {
      this.ctx.close().catch(() => {});
      this.ctx = null;
    }
  }
}

export const soundEngine = new ChessSoundEngine();
