import React from 'react';
import ReactDOM from 'react-dom';

class Header extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {favouritecolour: "red"};
  }
  
  // After the mounting render, the state favouritecolour is set to yellow, causing an update.
  componentDidMount() {
    setTimeout(() => {
      this.setState({favouritecolour: "yellow"})
    }, 1000)
  }
  
  // After the update render, the state favouritecolour is sampled form the colours array
  // This causes another update, which causes the componentDidUpdate method to be called again in a loop.
  componentDidUpdate() {
    let colours = ["red", "blue", "green", "yellow", "orange", "purple"]
    setTimeout(() => {
      this.setState({favouritecolour: colours[Math.floor(Math.random() * colours.length)]})
    }, 1000)
  }

  // After the update render, the getSnapshotBeforeUpdate method saves the previous state.
  // The previous state is prepended as a new element, child of the div with id log.
  getSnapshotBeforeUpdate(prevProps, prevState) {
    let newDiv = document.createElement("DIV");
    newDiv.innerHTML = "Before the update, the favourite was " + prevState.favouritecolour;
    document.getElementById('log').prepend(newDiv)
  }

  render() {
    return (
      <div>
        <h1>My Favourite Colour is {this.state.favouritecolour}</h1>
        <div id="log"></div>
      </div>
    );
  }
}

ReactDOM.render(<Header />, document.getElementById('root'));