import React, { Component } from 'react';
import './App.scss';
import {BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './Homepage/homepage.component';
import TwoPlayerWindow from './Two Player Window/two-player.component';
import GameComponent from './Game Component/game.component';

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return ( <
      div className="App">
        <Router>
          <Route path="/home" component={Home}/>
          <Route path="/two_player_window" component={TwoPlayerWindow}/>
          <Route path="/game_board" component={GameComponent}/>
        </Router>
      </div>
    );
  }
}