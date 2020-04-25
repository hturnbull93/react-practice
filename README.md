# React Practice

## A Basic App

In `src/index.js`:

```js
import React from 'react';
import ReactDOM from 'react-dom';

// A Garage component that returns a single div containing the title and a Car component.
// It embeds a prop of size into the JSX it renders.
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

// A Car component that has a state object.
class Car extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      brand: "Ford",
      model: "Mustang",
      colour: "red",
      year: 1964
    };
  }

  // The changeColour method sets the state colour to blue.
  changeColour = () => {
    this.setState({colour: "blue"})
  }
  
  // The states are embedded in the JSX returned by the render method.
  // The button element runs this components changeColour method on click.
  render() {
    return (
      <div>
        <h3>My {this.state.brand} Car</h3>
        <p>It is a {this.state.colour} {this.state.model} from {this.state.year}.</p>
        <button type="button" onClick={this.changeColour}>Update Colour</button>
      </div>
    );
  }
}

// The react render method renders the Garage component with a size prop in index.html's root id div.
ReactDOM.render(<Garage size="large"/>, document.getElementById('root'));
```

## Importing Components

Importing Garage component from `Garage.js` into `index.js`:

```js
import React from 'react';
import ReactDOM from 'react-dom';
import Garage from './Garage.js'

// ... rest of file ...
```

In `Garage.js`:

```js
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

// Exportable module
export default Garage
```

## React Lifecycle

Each component in React has a lifecycle which you can monitor and manipulate during its three main phases.

The three phases are: Mounting, Updating, and Unmounting.

### Mounting

There are four built in methods that get called when mounting an element into the dom:

1. `constructor()` 
   - Run on creation of component, holds state.
2. `getDerivedStateFromProps()`
   - Run before render, updates state based on props.
3. `render()`
   - Always required
   - Renders the html to the DOM.
4. `componentDidMount()`
   - Run after render, for things that require the component already in DOM.

```js
import React from 'react';
import ReactDOM from 'react-dom';

class Header extends React.Component {
  // The constructor method is called by React every time a component is made.
  constructor(props) {
    super(props);
    this.state = {
      favouritecolour: "red",
      favouriteshape: "circle"
    };
  }

  // The getDerivedStateFromProps method is called right before rendering.
  // It takes state as an arg, returning an object with an updated state.
  // It allows the default state to be customised by props.
  // Here the state is derived from the prop favcol, updating the favouritecolour to yellow.
  static getDerivedStateFromProps(props, state) {
    return {favouritecolour: props.favcol };
  }

  // The componentDidMount method is called after rendering.
  // This is where statements can be run where the element must already be in the DOM.
  // Here, the state of favouriteshape is updated 1s after rendering.
  componentDidMount() {
    setTimeout(() => {
      this.setState({favouriteshape: "square"})
    }, 1000)
  }

  //  The render method updates the DOM with the returned JSX.
  render() {
    return (
      <>
        <h1>My Favourite Things</h1>
        <p>My Favourite Colour is {this.state.favouritecolour}</p>
        <p>My Favourite shape is {this.state.favouriteshape}</p>
      </>
    );
  }
}

ReactDOM.render(<Header favcol="yellow"/>, document.getElementById('root'));
```

### Updating

A component is updated any time there is a change in its state or props.

It has the following built in methods.

1. `getDerivedStateFromProps()`
   - As before, the props can influence the state. 
   - This occurs after anything that would change the state and cause the component to update, which could then overwrite the change made.
2. `shouldComponentUpdate()`
   - Can add this and return false to prevent the component from updating (default is true).
3. `render()`
   - Always called 
   - Re-renders the element with the new state and props.
4. `getSnapshotBeforeUpdate()`
   - Takes args for `prevProps`, `prevState`, which are objects for the pre re-render props and state.
5. `componentDidUpdate()`
   - Similar to `componentDidMount`, is called after the component is re-rendered in the DOM.
   - As this could change a state or prop, it may also cause an update to occur.

In `index.js`

```js
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
  // The previous state is prepended as a new element within the #log element.
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
```

### Unmounting

Unmounting is when a component is removed from the dom.

There is only one method:

1. `componentWillUnmount()`
   - This is called when the component is just about to be unmounted.

```js
import React from 'react';
import ReactDOM from 'react-dom';

// The Container has a state with show defaulting to true.
class Container extends React.Component {
  constructor(props) {
    super(props);
    this.state = {show: true};
  }

   // The delHeader method sets the state show to false.
  delHeader = () => {
    this.setState({show: false});
  }

   // The render method will only include the Child component in its returned JSX if show is true.
  render() {
    let myheader;
    if (this.state.show) {
      myheader = <Child />;
    };
    // The button runs delHeader on click, updating the state and causing an update.
    return (
      <div>
      {myheader}
      <button type="button" onClick={this.delHeader}>Delete Header</button>
      </div>
    );
  }
}

// The Child component is unmounted (caused not to be rendered when the button is clicked).
// Before this happens, componentWillUnmount is run, blocking the render with a synchronous alert call.
// After the alert is dismissed, the render will proceed and the Child is unmounted.
class Child extends React.Component {
  componentWillUnmount() {
    alert("The component named Header is about to be unmounted.");
  }
  render() {
    return (
      <h1>Hello World!</h1>
    );
  }
}

ReactDOM.render(<Container />, document.getElementById('root'));
```

## React Events

React events are written in camelCase.

React event handlers are written in curly braces.

React event handlers should be put as a method in the component class.

React event handler methods should most often be arrow functions, as they have `this` bound to the object the method is defined on by default.

```js
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
```