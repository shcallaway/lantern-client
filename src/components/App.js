import React, { Component } from 'react'
import List from './List'
import { BASE_URL } from '../utils/Constants'

class App extends Component {
  constructor() {
    super()
    this.state = {
      tracks: []
    }
  }

  componentDidMount() {
    const URL = BASE_URL + '/tracks'
    const options = { method: 'GET' }

    fetch(URL, options)
    .then(response => {
      if (response.status === 200) {
        return response.json()
      } else {
        throw new Error(response.statusText)
      }
    })
    .then(tracks => this.setState(tracks))
    .catch(error => alert(error))
  }

  render() {
    return (
      <div className="App">
        <List tracks={this.state.tracks} />
      </div>
    );
  }
}

export default App