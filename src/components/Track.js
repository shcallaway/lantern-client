import React, { Component } from 'react'

class Track extends Component {
  constructor() {
    super()
    this.handleClick = this.handleClick.bind(this)
  }

  // wraps parent method
  handleClick() {
    this.props.clickRouter(this.props.id)
  }

  render() {
    return (
      <div className='Track' onClick={this.handleClick}>
        <div>
          {this.props.title}
        </div>
        <div className='Artist'>
          {this.props.artist}
        </div>
      </div>
    )
  }
}

export default Track
