import React, { Component } from 'react';

//global variables
let countdown;
let score = 0;
let serverUrl = "http://localhost:8080";  // config variable
let theAnswer; // will be assigned to an object, Set
let cardLimit = 10;
let timeChallenge = 3000;
let theAnswerName = "";

/**
* Using Fisher-Yates (aka Knuth) Shuffle algorithm. Array mutated.
* https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array?noredirect=1&lq=1
* shuffle card deck, image sequence, possibly image/text display
*/

const shuffle = function (array) {
  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

class Playarea extends Component {

  constructor() {
    super();
    
    // these may change at the top level in the future.
    //  for now, once they are retrieved from backend, 
    this.state = {
      outOfCards : false,
      pCardIndex : 0,  // shuffle will take place first, then pCardIndex can go in sequence in a randomized way
      sCardIndex : 0   // the order of appearance of the signs will be scrambled as well
    };

  }

  componentDidMount() {
    // console.log(this.props.cards);
    // console.log(this.props.signs);

    shuffle(this.props.cards);
    console.log("SHUFFLE-CARDS", this.props.cards);

  }

  componentWillUnmount() {
    // console.log(this.props.cards);
    // console.log(this.props.signs);
    clearTimeout(countdown);
    score=0; // clear score in anticipation of next game
  }

  replaysGame = () => {

    this.setState({
      outOfCards : false,
      pCardIndex : 0,
      sCardIndex : 0
    })
    score = 0; // clear score in anticipation of next game

    shuffle(this.props.cards);
    console.log("SHUFFLE-CARDS", this.props.cards);

  }

  submitsAnswer = (n) => {
    console.log(`are we out of cards? (${this.state.outOfCards}) ... if true, game already ended, no longer taking answers / no more points`);
    if(this.state.outOfCards) {
      console.log(`game already ended, no longer taking answers`);
    }
    else {
      console.log('answer submitted is: ', theAnswer.has(n))  // true means Player got it right. Use .has because theAnswer is a Set object
      if (theAnswer.has(n)) {
        clearTimeout(countdown); // clean up the timer that did not finish due to successful match
        console.log(`shut down current timer with id ${countdown}`);
        console.log(`\t earn a point!`);
        score = score + 1;
        if( this.state.sCardIndex < cardLimit ) {
          console.log(`dealing source card ${this.state.sCardIndex + 1}`);
          this.setState({
            sCardIndex : this.state.sCardIndex + 1,
            pCardIndex : this.state.sCardIndex // on match success, player takes source card
          });
        }
        else {
          this.setState({
            outOfCards : true
          })
        }

      }
      else {
        console.log(`wrong answer, timer id ${countdown} will continue running.`);
      }
    }
  }

  render() {

    //======== source card
    let activeSourceCard = this.props.cards.filter( (card, index) => {
      return (this.state.sCardIndex===index);
    });
    console.log(`active source card ${activeSourceCard[0].cid}`, activeSourceCard);
    console.log(activeSourceCard[0].sids);

    let activeSourceSigns = this.props.signs.filter( (sign) => {
      // console.log(sign.sid, activeSourceCard[0].sids.includes(sign.sid));
      return ( activeSourceCard[0].sids.includes(sign.sid) );
    });
    shuffle(activeSourceSigns); // this has been tested to work before onClick, shuffles the order of appearance of the signs in source card
    console.log(`scramble order of items in sCard`, activeSourceSigns);

    let activeSourceSignsJSX = activeSourceSigns.map ( (sign) => {
      return (
        <img src={serverUrl + sign.img} alt={sign.txt} key={sign.sid}/>
      );
    });

    //======== player card
    const activePlayerCard = this.props.cards.filter( (card, index) => {
      return (this.state.pCardIndex===index);
    });
    console.log(`active player card ${activePlayerCard[0].cid}`, activePlayerCard);
    console.log(activePlayerCard[0].sids);

    let activePlayerSigns = this.props.signs.filter( (sign) => {
      // console.log( sign.sid, activePlayerCard[0].sids.includes(sign.sid) );
      return ( activePlayerCard[0].sids.includes(sign.sid) );
    });
    shuffle(activePlayerSigns); // // this has been tested to work before onClick, shuffles the order of appearance of the signs in player card
    console.log(`scramble order of items in pCard`, activePlayerSigns);

    let activePlayerSignsJSX = activePlayerSigns.map ( (sign) => {
      return (
        <img src={serverUrl + sign.img} 
             onClick={()=>this.submitsAnswer(sign.sid)} 
             className="playercard"
             alt={sign.txt} key={sign.sid} 
        />
      );
    });

    //========= determine the answer
    let a = new Set(activePlayerCard[0].sids);
    let b = new Set(activeSourceCard[0].sids);
    theAnswer = new Set(
      [...a].filter(x => b.has(x))
    );
    console.log("ANSWER: ", theAnswer);
    // let work = theAnswer.values();
    // let wid = work.next().value;
    theAnswerName = activePlayerSigns.find( (sign) => sign.sid === theAnswer.values().next().value ).img;
    console.log(theAnswerName);


    //========= challenge player to find the match for active pair of cards in 3 seconds
    if(this.state.sCardIndex < cardLimit){  // until 4 cards dealt or until submitAnswer is true
      countdown = setTimeout( () => {
        console.log(`\t time elapsed! dealing source card ${this.state.sCardIndex + 1}`)
        this.setState({
          sCardIndex : this.state.sCardIndex + 1
          // pCardIndex : this.state.sCardIndex // on match success
        });
        console.log(`timer id ${countdown} has reached 0`); // The returned timeoutID is a positive integer value which identifies the timer created by the call to setTimeout(); this value can be passed to clearTimeout() to cancel the timeout. It is guaranteed that a timeout ID will never be reused by a subsequent call to setTimeout() or setInterval() on the same object (a window or a worker). However, different objects use separate pools of IDs.
      }, timeChallenge);
    } 
    else if(!this.state.outOfCards) {
      console.log(`\t all ${cardLimit} have been dealt, last countdown now`);
      countdown = setTimeout( () => {
        console.log(`\t time elapsed! dealt the last source card ${this.state.sCardIndex}`)
        this.setState({
          outOfCards : true
        });
        console.log(`timer id ${countdown} has reached 0`);
      }, timeChallenge);
    }


    


    return (
      <div>

        <h2>3, 2, 1, Go!</h2>

        <div>

          <div>
            <h3>Live Score: {score}/{cardLimit}</h3>
            <img className="answer" src={serverUrl + theAnswerName} alt="debug"/>
          </div>

          <div hidden={!this.state.outOfCards}>
            <h3>Thank you for playing!</h3>
          </div>

          <button type="submit"
                  onClick={ () => this.replaysGame()  }
                  name="resetMidGame" // restart the game session   
          >
            New Game
          </button>

          <button type="submit"
                  onClick={ () => this.props.exitsGame()  }
                  name="exitsGame"
          >
            Quit
          </button>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-6">
              <h3>Source</h3>
            </div>
            <div className="col-6">
              <h3>Player</h3>
            </div>
          </div>
        </div>

        <div hidden={!this.state.sCardIndex || this.state.outOfCards}>
          <div className="container">
            <div className="row">
              <div className="col-6">
                <div>{activeSourceSignsJSX}</div>
              </div>
              <div className="col-6">
                {/* <Playerpile /> */}
                <div>{activePlayerSignsJSX}</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

export default Playarea;
