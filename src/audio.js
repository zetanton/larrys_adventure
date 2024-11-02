export class AudioManager {
  constructor() {
    this.sounds = {
      jump: new Audio('/sounds/jump.mp3'),
      coin: new Audio('/sounds/coin.mp3'),
      death: new Audio('/sounds/death.mp3'),
      stomp: new Audio('/sounds/stomp.mp3'),
      bgMusic: new Audio('/sounds/theme.mp3')
    };
    
    // Loop background music
    this.sounds.bgMusic.loop = true;
    // Reduce background music volume
    this.sounds.bgMusic.volume = 0.5;
  }

  play(soundName) {
    const sound = this.sounds[soundName];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(e => console.log('Audio play prevented'));
    }
  }

  stopMusic() {
    this.sounds.bgMusic.pause();
    this.sounds.bgMusic.currentTime = 0;
  }

  startMusic() {
    this.sounds.bgMusic.play().catch(e => console.log('Music play prevented'));
  }
}