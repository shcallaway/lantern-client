import { Howl } from './Howler'

class AudioPlayer {
  constructor() {
    this.vol = 0.6
    this.track = null
  }

  setVolume(value) {
    this.vol = value

    if (!this.track) return
    this.track.volume(this.vol)
  }

  play(url, onLoad, onCompletion) {
    this.track = new Howl({ 
      src: [url],
      autoplay: true,
      volume: this.vol,
      onload: onLoad,
      onend: onCompletion
    })
  }

  stop() {
    if (!this.track) return
    this.track.stop()
  }

  pause() {
    if (!this.track) return
    this.track.pause()
  }

  resume() {
    if (!this.track) return
    this.track.play()
  }
}

export default new AudioPlayer()