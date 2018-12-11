

import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

var { GetPairString, GetSingleString, Nums2CardString } =  require('./utils.js');
//import 'EquityCalc';





//an object that represents all possible individual cards
//will be used to track specific 2 card hands as well as dead cards
class CardDeck {
  constructor (deckID) {

    //construct dict of possible cards
    let cardString;
    this.cards = {}
    for (let i = 0; i < 4; i++)
    {
      for (let j = 12; j>=0; j--)
      {
        cardString = GetSingleString(i,j);
        this.cards[cardString] = {
          suit: i,
          card: j,
          selected: false
        }
      }
    }

    //set deck id
    this.deckID = deckID;
  }

  //return all selected card keys
  getSelectedCards () {
    return this.cards.keys().filter((key) => this.cards[key].selected);
  }
}

//an object that represents a range of all possible hole cards
class CardRange {
  constructor (rangeID) {

    //construct dict of possible cards
    let cardString;
    this.cards = {}
    for (let i = 12; i >= 0; i--)
    {
      for (let j = 12; j >= 0; j--)
      {
        cardString = GetPairString(i,j);
        this.cards[cardString] = {
          card1: i,
          card2: j,
          p: 0, //frequency of combo in range
          selected: false
        }
      }
    }

    //set id of range
    this.rangeID = rangeID
  }

  //change card to be selected
  selectCards (cardString, p = 1) {
    this.cards[cardString].selected = true;
    this.cards[cardString].p = p;
  }

  //return all selected card keys
  getSelectedCards () {
    return this.cards.keys().filter((key) => this.cards[key].selected);
  }
}

class CardDeckDisplay extends Component {
  constructor (props) {
    super(props);
    this.state = {};
    this.state.cardDeck = props.cardDeck;
    this.handleSelect = props.handleselected;
  }

  //suit, num
  renderTile (i,j) {
    let labelString = GetSingleString(i,j);
    return (
      <div className="deck-card" key={labelString} isselected={this.props.cardDeck.cards[labelString].selected.toString()}>
        <button className="deck-card" onClick={() => this.handleSelect(labelString)}>{labelString}</button>
      </div>
    );
  }

  render () {
    return (
      <div className="deck">{this.createDeckTable()}</div>
    );
  }

  createDeckTable () {
    const cols = [];
    for (let j = 12; j>=0; j--)
    {
      const rows = [];
      for (let i = 0; i<4; i++)
      {
        rows.push(this.renderTile(i,j));
      }
      cols.push(<div key={j.toString()} className="deck-row">{rows}</div>);
    }

    return cols;
  }
}

class CardRangeDisplay extends Component {
    constructor (props) {
      super(props)
      this.state = {};
      this.handleSelect = props.handleselected;
    }

    renderTile (i,j) {

      //should change color on selection and pass click events up the dom tree
      let labelString = GetPairString(i,j);
	    return (
		         <div className="range-hands" key={labelString} isselected={this.props.cardRange.cards[labelString].selected.toString()}>
               <button className="range-hands" onClick={() => this.handleSelect(labelString)}>{labelString}</button>
            </div>
	    );
    }

    render () {
      return (
        <div className="range-table">{this.createCardTable()}</div>
    );
    }

    createCardTable () {
      const cols = []
      for (let i = 12; i>=0; i--)
      {
        const rows = []
        for (let j = 12; j>=0; j--)
        {
          rows.push(this.renderTile(i,j))
        }
        cols.push(<div key={i.toString()} className="range-row">{rows}</div>)
      }
      return cols;
    }
 }

class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      cardRange1: new CardRange("cardRange1"),
      cardRange2: new CardRange("cardRange2"),
      cardDeck1: new CardDeck("cardDeck1")
    }

    this.myHandleSelect = (cardRange) => ((cardString) => this.handleSelect(cardRange,cardString));
  }

  //toggle cards selected. cardRange is name of cardRange member of app, i.e. "cardRange1"
  handleSelect (cardRange, cardString) {

    //toggle selection status
    //unselect -> p=0, select -> p=1
    this.setState((state, props) => {
      return {[cardRange]: {
        ...state[cardRange],
        cards: {
          ...state[cardRange].cards,
          [cardString]: {
            ...state[cardRange].cards[cardString],
            selected: !state[cardRange].cards[cardString].selected,
            p: +(!state[cardRange].cards[cardString].selected)}}}};
    });
  }

  render() {
    return (
      <div className="App">
        <CardRangeDisplay cardRange={this.state.cardRange1} handleselected={this.myHandleSelect("cardRange1")}/>
        <CardRangeDisplay cardRange={this.state.cardRange2} handleselected={this.myHandleSelect("cardRange2")}/>
      <CardDeckDisplay cardDeck={this.state.cardDeck1} handleselected={this.myHandleSelect("cardDeck1")}/>
      </div>
    );
  }
}

export default App;
