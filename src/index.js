import React from 'react';
import ReactDOM from 'react-dom';

class HelloLogger extends React.Component {

  // Arrow Method for event handler.
  logWithArrow = (message) => {
    console.log(message);
  }

  //  Regular Method for event handler.
  logWithRegular(message) {
    console.log(message);
  }

  // HelloLogger renders buttons which run methods on click.
  render() {
    return (
      <>
        {/* When clicked, an anonymous arrow function calls either arrow or regular function passing in the argument */}
        <button onClick={() => this.logWithArrow("Hello")}>Log "Hello" with arrow function!</button>
        <button onClick={() => this.logWithRegular("Hello")}>Log "Hello" with arrow function!</button>
        {/* When clicked, either is bound to this (HelloLogger), and passed the argument */}
        <button onClick={this.logWithArrow.bind(this,"Hello")}>Log "Hello" with regular function!</button>
        <button onClick={this.logWithRegular.bind(this,"Hello")}>Log "Hello" with regular function!</button>
      </>
    );
  }
}

ReactDOM.render(<HelloLogger />, document.getElementById('root'));