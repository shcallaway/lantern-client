import React, { Component } from 'react'

class Slider extends Component {
  constructor() {
    super()
    this.state = {
      value: 60    
    }
    this.handleChange = this.handleChange.bind(this)
  }

  // wraps parent method
  handleChange(event) {

    // set state is not synchronous, so we need to use callbacks
    this.setState({ 
      value: event.target.value 
    }, () => {
      this.props.setVolume(this.state.value)
    })
  }

  render() {
    return (
      <div className='Slider'>
        <input type='range' value={this.state.value} 
        onChange={this.handleChange} min='0' max='100' step='1' />
      </div>
    )
  }
}

export default Slider