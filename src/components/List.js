import React, { Component } from 'react'
import Track from './Track'
import Slider from './Slider'
// import WebAudio from '../utils/WebAudio'
import AudioPlayer from '../utils/AudioPlayer'

const PlayerStatus = {
  LOADING: 'LOADING',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED'
}

// inQueue should be made into
// a real queue, to handle scenario
// when user double-clicks the
// same track (currently, both
// callbacks come back and make
// it past the inQueue check)
let inQueue = null

class List extends Component {
  constructor() {
    super()
    this.state = {
      track: null,
      status: null
    }

    this.play = this.play.bind(this)
    this.pause = this.pause.bind(this)
    this.resume = this.resume.bind(this)
    this.onLoad = this.onLoad.bind(this)
    this.setVolume = this.setVolume.bind(this)
    this.clickRouter = this.clickRouter.bind(this)
    this.onCompletion = this.onCompletion.bind(this)
    this.playFirstTrack = this.playFirstTrack.bind(this)
  }

  clickRouter(id) {
    const noTrack = this.state.track === null
    if (noTrack) {
      this.play(id)
      return
    }

    const trackMatches = this.state.track.id === id
    const statusPlaying = this.state.status === PlayerStatus.PLAYING
    const statusPaused = this.state.status === PlayerStatus.PAUSED

    if (trackMatches && statusPlaying) {
      this.pause()
    } else if (trackMatches && statusPaused) {
      this.resume()
    } else {
      this.play(id)
    }
  }

  setVolume(value) {
    AudioPlayer.setVolume(value / 100)
  }

  playFirstTrack() {
    const id = this.props.tracks[0].id
    this.play(id)
  }

  getTrackFromId(id) {
    for (let i = 0; i < this.props.tracks.length; i++) {
      let current = this.props.tracks[i]
      if (current.id === id) return current
    }
  }

  play(id) {
    this.setState({ 
      status: PlayerStatus.LOADING,
      track: this.getTrackFromId(id)
    }, () => {
      AudioPlayer.stop()

      // Needs refactoring
      inQueue = id
    })

    const URL = `/tracks/${id}/stream`
    fetch(URL, { method: 'GET' })
    .then(response => response.json())
    .then(data => {

      // Protect against callbacks from out-of-date requests
      if (inQueue !== id) {
        return
      }

      AudioPlayer.play(data.url, this.onLoad, this.onCompletion)
    })
  }

  getFinalTrack() {
    return this.props.tracks[this.props.tracks.length - 1]
  }

  onFinalTrack() {
    const current = this.state.track
    const final = this.getFinalTrack()
    return current.id === final.id ? true : false
  }

  playNextTrack() {
    const index = this.props.tracks.indexOf(this.state.track)
    const next = this.props.tracks[index + 1]
    this.play(next.id)      
  }

  onLoad() {
    this.setState({ status: PlayerStatus.PLAYING })
  }

  onCompletion() {

    // Completion handler is called in two scenarios:
    // 1. The track finishes playing => Play next track
    // 2. A new track is loading => Do nothing

    if (this.state.status === PlayerStatus.LOADING) return

    if (this.onFinalTrack()) {
      this.setState({
        track: null,
        status: null
      })
    } else {
      this.playNextTrack()
    }
  }

  pause() {
    this.setState({ 
      status: PlayerStatus.PAUSED
    }, () => {
      AudioPlayer.pause()
    })
  }

  resume() {
    this.setState({
      status: PlayerStatus.PLAYING
    }, () => {
      AudioPlayer.resume()
    })
  }

  loadingButton() {
    return (
      <div>
        <i className='fa fa-pause-circle fa-3' aria-hidden='true'></i>
      </div>
    )
  }

  pauseButton() {
    return (
      <div>
        <i className='fa fa-pause-circle fa-3' 
        aria-hidden='true' onClick={this.pause}></i>
      </div>
    )
  }

  resumeButton() {
    return (
      <div>
        <i className='fa fa-play-circle fa-3' 
        aria-hidden='true' onClick={this.resume}></i>
      </div>
    )
  }

  defaultButton() {
    return (
      <div>
        <i className='fa fa-play-circle fa-3' 
        aria-hidden='true' onClick={this.playFirstTrack}></i>
      </div>
    )
  }

  assignButton() {
    switch (this.state.status) {
      case PlayerStatus.LOADING:
        return this.loadingButton()
      case PlayerStatus.PLAYING:
        return this.pauseButton()
      case PlayerStatus.PAUSED:
        return this.resumeButton()
      default:
        return this.defaultButton()
    }
  }

  assignInfo() {
    if (!this.state.status) return

    return (
      <div className='Info'>
        <div>{this.state.track.title} ({this.state.status})</div>
        <div className='Artist'>{this.state.track.artist}</div>
      </div>
    )
  }

  render() {
    let button = this.assignButton()
    let info = this.assignInfo()

    return (
      <div className='List'>
        <div className='Tracks'>
          {this.props.tracks.map((track, index) => 
            <Track {...track} key={index} clickRouter={this.clickRouter} />
          )}
        </div>
        <div className='Controls'>
          {button}
          {info}
          <Slider setVolume={this.setVolume} />
        </div>
      </div>
    )
  }
}

export default List