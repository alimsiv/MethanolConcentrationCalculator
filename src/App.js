import logo from './logo.svg';
import './App.css';
import MethanolConcInput from './MethanolConcInput';
import React from 'react';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleChildClick = this.handleChildClick.bind(this);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {
            // Inputs for psuedonym and weight}
          }
          <MethanolConcInput onSubmit={this.handleChildClick} />
        </header>
      </div>
    );
  }

  handleChildClick(event) {
    console.log('submitting');
    // TODO console.log("event: " + JSON.stringify(event));
    // You can access the prop you pass to the children 
    // because you already have it! 
    // Here you have it in state but it could also be
    //  in props, coming from another parent.
    // TODO console.log("The Child button text is: " + this.state.childText);
    // You can also access the target of the click here 
    // if you want to do some magic stuff
    console.log("The Child HTML is: " + event.target.outerHTML);
    this.setState({ childsName: event });
 }

  
}


export default App;
