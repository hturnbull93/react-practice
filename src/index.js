import React from 'react';
import ReactDOM from 'react-dom';

class ThisLogger extends React.Component {

  // The constructor method binds this in the shoot method to the component
  constructor(props) {
    super(props)
    this.logWithRegularBound = this.logWithRegularBound.bind(this)
  }


  // Arrow Method for event handler. This will be the 
  logWithArrow = () => {
    console.log(this);
    //  ThisLogger, as arrow functions this is the object the method is defined on.
  }
  
  //  Regular Method for event handler
  logWithRegular() {
    console.log(this);
    // undefined, as the regular function this is not defined by default.
  }
  
  //  Regular Method for event handler, but its this is bound in the constructor.
  logWithRegularBound() {
    console.log(this);
    //  ThisLogger, the binding of this has been set in the constructor.
  }

  render() {
    // ThisLogger renders buttons which run methods on click
    return (
      <>
        <button onClick={this.logWithArrow}>This with arrow function!</button>
        <button onClick={this.logWithRegular}>This with regular function!</button>
        <button onClick={this.logWithRegularBound}>This bound with regular function!</button>
      </>
    );
  }
}

ReactDOM.render(<ThisLogger />, document.getElementById('root'));
