import React from 'react'

class Garage extends React.Component {
  render() {
    return (
      <div>
        <h1>This is my {this.props.size} Garage</h1>
        <Car />
      </div>
    )
  }
}

export default Garage
