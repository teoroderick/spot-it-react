import React, { Component } from 'react';
import './App.css';

// // bring in react-router-comps
// import { Route, Redirect, Switch, NavLink } from 'react-router-dom';
// to send http request to backend
import axios from 'axios';
// bring in lower level components
import { Attribution } from './components/export'
import { Playarea } from './components/export'

//global variables
let cards = [];
let signs = [];
let serverUrl = "http://localhost:8080";  // config variable


class App extends Component {

  constructor() {
    super();
    
    // these may change at the top level in the future.
    //  for now, once they are retrieved from backend, 
    this.state = {
      gameStart : false,  // put in state because this changes to true when game starts
      playerName : ""   // put in state also for anticipating multiple players?
    };

  }

  // on change handler to update player name live
  getsName = (event) => {
    // console.log('onChange input handler fn passed up');
    this.setState({
      // the below evaluates to:
      // playerName : whatever value was entered onChange of the input
      [event.target.name] : event.target.value.trimLeft()
    })
  }

  // submit handler to end the game
  exitsGame = () => {
    // console.log('onClick form handler fn for ending game successfully passed up');
    this.setState({
      gameStart : false
    })

    // clear up the memory
    cards = [];
    signs = [];
    // console.log(cards);
    // console.log(signs);
  }

  // submit handler to kick off the game
  entersGame = () => {
    // console.log('onSubmit form handler fn passed up');
    // use axios to hit the backend to get the game data...
    //  promises used for api calls to backend
    let pGetCards = axios.get(`${serverUrl}/cards`);
    let pGetSigns = axios.get(`${serverUrl}/signs`);

    Promise.all([pGetCards, pGetSigns])
      .then(result => {
        // console.log(result);
        // console.log(`card data call success`);
        // console.log(result); // [{pGetCards result}, {pGetSigns result}] // data will be in result.data
        cards = result[0].data;
        signs = result[1].data;
        // console.log(cards);
        // console.log(signs);

        this.setState({
          gameStart : true
        })

      })
      .catch(error =>{
        console.log(`There was an error retrieving game data:\n ${error}`);
      });

  }

  // componentDidUpdate() {
  //   console.log(
  //   );
  // }

  render() {

    if (this.state.gameStart) {
      return (
        <div> 
          <Playarea cards={cards}
                    signs={signs}
                    gameStart={this.state.gameStart}
                    playerName={this.state.playerName} // pass down in anticipation of multiple players?
                    exitsGame={this.exitsGame}
          />
        </div>

      );
    }

    return (
      <div className="outer">
        <div className="middle">
          <div className="inner">

            <h1>Spot It in React</h1>
            <p>collapsible/modal section - How to Play: 
              Find a common object between your card and
              the dealer's card within 3 seconds and 20 cards.</p>
            <form onSubmit={ (event) => {
                                event.preventDefault();
                                this.entersGame();
                              }
                          }
            >
              <input  placeholder="Your name" 
                      value={this.state.playerName}
                      onChange={ (event) => this.getsName(event) } 
                      name='playerName'
              />
              <button type="submit"
                      disabled={ !this.state.playerName }
              >
                      Let's Play!
              </button>
            </form>

            {/* Timer */}

            <Attribution />

          </div>
        </div>
      </div>
    );
  }

}

export default App;