// This module has been replaced by Howler

const AudioContext = window.AudioContext || window.webkitAudioContext

class WebAudio {
  constructor() {
    this.ctx = new AudioContext()
    this.gain = this.ctx.createGain()
    this.src = null
    this.offset = 0
    this.start = 0
  }

  adjustGain(value) {
    if (value > 1) value = value / 100
    this.gain.gain.value = value
  }

  play(data, callback) {
    this.decodeData(data)
    .then(buffer => {
      this.setBuffer(buffer)
      this.connectNodes()
      this.setCompletionCallback(callback)
      this.startSource()
    })    
  }

  stop() {
    this.stopSource()
    this.clearSourceVars()
  }

  pause() {
    this.stopSource()
    this.updateOffset()  
  }


  resume(callback) {
    this.updateStart()
    this.setBuffer()
    this.connectNodes()
    this.setCompletionCallback(callback)
    this.startSource()
  }

  // PRIVATE METHODS

  setCompletionCallback(callback) {
    this.src.onended = callback
  }

  decodeData(data) {
    return this.ctx.decodeAudioData(data)
  }

  setBuffer(buffer = this.src.buffer) {
    this.src = this.ctx.createBufferSource()
    this.src.buffer = buffer
  }

  connectNodes() {
    this.src.connect(this.gain)
    this.gain.connect(this.ctx.destination)    
  }

  startSource() {
    if (this.offset > 0) {
      this.src.start(this.ctx.currentTime, this.offset % this.src.buffer.duration)
    } else {
      this.src.start(this.ctx.currentTime)
    }
    this.start = this.ctx.currentTime
  }

  stopSource() {
    if (!this.src) return
    this.src.stop()
  }

  clearSourceVars() {
    this.src = null
    this.start = 0
    this.offset = 0
  }

  updateOffset() {
    this.offset += this.ctx.currentTime - this.start
  }

  updateStart() {
    if (!this.src) return
    this.start = this.ctx.currentTime
  }
}

export default new WebAudio