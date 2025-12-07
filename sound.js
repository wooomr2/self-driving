function toDaa() {
  beep(400, "sawtooth");
  setTimeout(() => beep(600, "sawtooth"), 200);
}

function beep(freequency, waveType = "sine") {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  const osc = audioContext.createOscillator();
  const envelope = audioContext.createGain();

  osc.frequency.setValueAtTime(freequency, 0);
  osc.type = waveType;
  osc.connect(envelope);
  osc.start();
  osc.stop(0.4);

  envelope.gain.value = 0;
  envelope.gain.linearRampToValueAtTime(1, 0.1);
  envelope.gain.linearRampToValueAtTime(0, 0.4);
  // envelope.gain.exponentialRampToValueAtTime(1, 0.1);
  // envelope.gain.exponentialRampToValueAtTime(0.1, 0.4);
  envelope.connect(audioContext.destination);
}

function explode() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  const numOscillators = 10;

  for (let ii = 0; ii < numOscillators; ii++) {
    const osc = audioContext.createOscillator();
    const envelope = audioContext.createGain();

    osc.frequency.setValueAtTime(100 + Math.random() * 200, 0);
    osc.connect(envelope);
    osc.start();
    osc.stop(1);

    envelope.gain.value = 0;
    envelope.gain.linearRampToValueAtTime(1, 0.1);
    envelope.gain.linearRampToValueAtTime(0, 0.4);
    envelope.connect(audioContext.destination);
  }
}

class Engine {
  constructor() {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();

    const osc = audioContext.createOscillator();
    const masterGain = audioContext.createGain();

    osc.frequency.setValueAtTime(200, 0);
    osc.connect(masterGain);
    osc.start();

    masterGain.gain.value = 0.2;
    masterGain.connect(audioContext.destination);

    const lfo = audioContext.createOscillator();
    lfo.frequency.setValueAtTime(30, 0);
    const mod = audioContext.createGain();
    mod.gain.value = 60;
    lfo.connect(mod);
    mod.connect(osc.frequency);
    lfo.start();

    this.volume = masterGain.gain;
    this.frequency = osc.frequency;
  }

  setVolume(percent) {
    this.volume.value = percent;
  }

  setPitch(percent) {
    this.frequency.setValueAtTime(percent * 200 + 100, 0);
  }
}
