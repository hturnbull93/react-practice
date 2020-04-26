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

  // The constructor method must call its parents cpnstructor method (i.e. React.Component).
  // state can be set in the constructor.
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

  // The constructor method binds this in the shoot method to the component.
  constructor(props) {
    super(props)
    this.logWithRegularBound = this.logWithRegularBound.bind(this)
  }

  // Arrow Method for event handler.
  logWithArrow = () => {
    console.log(this);
    //  ThisLogger, as arrow functions this is the object the method is defined on.
  }

  //  Regular Method for event handler.
  logWithRegular() {
    console.log(this);
    // undefined, as the regular function this is not defined by default.
  }

  //  Regular Method for event handler, but its this is bound in the constructor.
  logWithRegularBound() {
    console.log(this);
    //  ThisLogger, the binding of this has been set in the constructor.
  }

  // ThisLogger renders buttons which run methods on click.
  render() {
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

## Passing Arguments to React Event Handlers

There are two ways to pass args to event handlers

1. Make an anonymous arrow function.
   - Much easier
2. Bind the event handler to this.
   - Harder, avoid if you can

```js
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
```

## The React Event Object

Event handlers have access to the React event that triggered the function.

In the previous example the event is a "click".

```js
import React from 'react';
import ReactDOM from 'react-dom';

class HelloLogger extends React.Component {

  // Arrow Method for event handler.
  logWithArrow = (message, event) => {
    console.log(message);
    console.log(event.type);
    // click
  }
  
  //  Regular Method for event handler.
  logWithRegular(message, event) {
    console.log(message);
    console.log(event.type);
    // click
  }

  // HelloLogger renders buttons which run methods on click.
  render() {
    return (
      <>
        {/* Anonymous arrow function need to have the event passed in manually */}
        <button onClick={(event) => this.logWithArrow("Hello", event)}>Anonymous function calls arrow function!</button>
        <button onClick={(event) => this.logWithRegular("Hello", event)}>Anonymous function calls regular function!</button>
        {/* Bind passes event automatically, no need to pass manually */}
        <button onClick={this.logWithArrow.bind(this,"Hello")}>Binding calls arrow function!</button>
        <button onClick={this.logWithRegular.bind(this,"Hello")}>Binding calls regular function!</button>
      </>
    );
  }
}

ReactDOM.render(<HelloLogger />, document.getElementById('root'));
```

## Forms in React

Forms can be rendered in JSX just like in HTML.

Where HTML handles form data with the DOM, in React it is handled by the component.

As the component handles the data it can be stored in the state.

Changes can be tracked by event handlers called `onChange`.

As elements can be rendered conditionally based on state, and forms can update and alter state, therefore forms can control rendering.

Submitting forms can be controlled as well, as can multiple input fields.

```js
import React from 'react';
import ReactDOM from 'react-dom';

class MyForm extends React.Component {

  // constructor sets state with username as empty string and age as null
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      age: null,
    };
  }

  // myChangeHandler accesses the input field name and value.
  // It then sets state of whichever state property with the value.
  // As this changes state, it causes an update.
  myChangeHandler = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    this.setState({[name]: value});
  }

  mySubmitHandler = (event) => {
    // Default behaviour of the form is prevented
    event.preventDefault();
    // alternate behaviour implemented
    alert(`You are ${this.state.username} ${this.state.age}`);
  }

  render() {
    // The h1 element can be rendered conditionally based on state.
    // It only appears if the state username or age resolve to true (an empty string or null does not).
    let header = '';
    if (this.state.username || this.state.age) {
      header = <h1>Hello {this.state.username} {this.state.age}</h1>;
    } else {
      header = '';
    }

    // render returns JSX embedding the state username and age.
    // As the input fields call myChangeHandler on change, it updates any time their values are edited.
    // The form onSubmit attribute calls mySubmitHandler, alerting with the entered name and age.
    return (
      <form onSubmit={this.mySubmitHandler}> 
        {header}
        <p>Enter your name:</p>
        <input type='text' name='username' onChange={this.myChangeHandler} />
        <p>Enter your age:</p>
        <input type='number' name='age' onChange={this.myChangeHandler} />
        <input type="submit"/>
      </form>
    );
  }
}

ReactDOM.render(<MyForm />, document.getElementById('root'));
```

Validating user input can also be achieved.

```js
import React from 'react';
import ReactDOM from 'react-dom';

class MyForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      age: null,
      // errormessage constructed as empty string
      errormessage: ''
    };
  }
  myChangeHandler = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    let err = '';
    if (nam === "age") {
      // if val is not empty and not a number assign err
      if (val !== "" && !Number(val)) {
        err = <strong>Your age must be a number</strong>;
      }
    }
    // set state with err and username/age with val
    this.setState({errormessage: err});
    this.setState({[nam]: val});
  }
  render() {
    return (
      <form>
      <h1>Hello {this.state.username} {this.state.age}</h1>
      <p>Enter your name:</p>
      <input type='text' name='username' onChange={this.myChangeHandler} />
      <p>Enter your age:</p>
      <input type='text' name='age' onChange={this.myChangeHandler} />
      {this.state.errormessage}
      </form>
    );
  }
}

ReactDOM.render(<MyForm />, document.getElementById('root'));
```

Textarea is handled slightly differently to regular HTML.

```js
import React from 'react';
import ReactDOM from 'react-dom';

class MyForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      description: 'The content of a textarea goes in the value attribute'
    };
  }
  render() {
    // textarea is a single tag with a value, like an input, rather than in HTML where it is a paired tag with content between.
    return (
      <form>
        <textarea value={this.state.description} />
      </form>
    );
  }
}

ReactDOM.render(<MyForm />, document.getElementById('root'));
```

Select boxes also works slightly differently.

In HTML the chosen option would have an attribute of `selected`.

In JSX the chosen option is set with a value attr on the select tag

```js
import React from 'react';
import ReactDOM from 'react-dom';

class MyForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mycar: 'Volvo'
    };
  }
  render() {
    return (
      <form>
        <select value={this.state.mycar}>
          <option value="Ford">Ford</option>
          <option value="Volvo">Volvo</option>
          <option value="Fiat">Fiat</option>
        </select>
      </form>
    );
  }
}

ReactDOM.render(<MyForm />, document.getElementById('root'));
```

## CSS

Inline styling can be used by setting a style attr with an object containing styles, with property names in camelCase.

```js
import React from 'react';
import ReactDOM from 'react-dom';

class MyHeader extends React.Component {
  render() {
    return (
      <div>
        <h1 style={{backgroundColor: "red", color: "white"}}>Hello Style!</h1>
        <p>Add a little style!</p>
      </div>
    );
  }
}


ReactDOM.render(<MyHeader />, document.getElementById('root'));
```

The object can be declared elsewhere to make it easier to read and use in the render.

```js
import React from 'react';
import ReactDOM from 'react-dom';

class MyHeader extends React.Component {
  render() {
    const mystyle = {
      color: "white",
      backgroundColor: "DodgerBlue",
      padding: "10px",
      fontFamily: "Arial"
    };
    return (
      <div>
      <h1 style={mystyle}>Hello Style!</h1>
      <p>Add a little style!</p>
      </div>
    );
  }
}
ReactDOM.render(<MyHeader />, document.getElementById('root'));
```

CSS files can also be imported.

In `src/main.css`:

```css
body {
  background-color: #282c34;
  color: white;
  padding: 40px;
  font-family: Arial;
  text-align: center;
}

.blue {
  color: DodgerBlue;
}
```

In `src/index.js`:

As class is a reserved word in JavaScript, the HTML class attribute is called `className`. Classes can be assigned as normal

```js
import React from 'react';
import ReactDOM from 'react-dom';
import './main.css';

class MyHeader extends React.Component {
  render() {
    return (
      <div>
      <h1 className="blue">Hello Style!</h1>
      <p>Add a little style!</p>
      </div>
    );
   }
}

ReactDOM.render(<MyHeader />, document.getElementById('root'));
```

CSS modules can be used to style components that are placed in separate files.

The css in an imported module is only available to the component that imported it, so name conflicts do not matter.

In `src/tyle.module.css`:

```css
.bigblue {
  color: DodgerBlue;
  padding: 40px;
  font-family: Arial;
  text-align: center;
}
```

In `src/Car.js`:

```js
import React from 'react';
// Import the module.
import styles from './style.module.css'; 

export class Car extends React.Component {
  render() {
    // Access the styles.bigblue rules.
    return (
      <h2 className={styles.bigblue}>I am a car</h2>
    )
  }
}

export default Car
```

In `src/index.js`:

```js
import React from 'react';
import ReactDOM from 'react-dom';
// Import Car, its styles come withit.
import Car from './Car.js'

ReactDOM.render(<Car />, document.getElementById('root'));
```

## Sass in React

First install Sass

```bash
npm install node-sass
```

Sass can be written and is compiled by React for you.

In `src/styles.sass`:

```scss
$myColor: red;

h1 {
  color: $myColor;
}
```

In `src/index.js`:

```js
import React from 'react';
import ReactDOM from 'react-dom';
// Import the scss file
import './styles.scss';

class MyHeader extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello Style!</h1>
        <p>Add a little style!</p>
      </div>
    );
  }
}

ReactDOM.render(<MyHeader />, document.getElementById('root'));
```