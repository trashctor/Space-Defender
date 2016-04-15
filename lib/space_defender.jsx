var Game = require("./game");
var React = require("react");
var ReactDOM = require("react-dom");

var SpaceDefender = React.createClass({
	getInitialState: function () {
		return { current: "MENU" };
	},

	componentDidMount: function () {
		var canvasEl = $("#canvas")[0];
		window.SpaceDefender = {};
		this.game = window.SpaceDefender.game = new Game(canvasEl);
	},

	_handleNewGame: function () {
		this.setState({ current: "NEW_GAME" });
	},

	_startGame: function (isTwoPlayers) {
		this.game.start(isTwoPlayers);
		this.setState({ current: "LOOPING" });

		var gameOverCheck = setInterval(function () {
			if(this.game.engine.gameOver()) {
				clearInterval(gameOverCheck);
				this.setState({ current: "GAME_OVER" });
			}
		}.bind(this), 1000);
	},

	_handleMenu: function () {
		this.game.stop();
		this.setState({ current: "MENU" });
	},

	render: function () {
		switch(this.state.current) {
			case "MENU":
				return (
					<button id="start-game" onClick={this._handleNewGame}>
						Start Game
					</button>
				);
			case "NEW_GAME":
				return (
					<div id="select-players">
						<button id="one-player" onClick={this._startGame.bind(this, false)}>
							One Player
						</button>
						<button id="two-player" onClick={this._startGame.bind(this, true)}>
							Two Player
						</button>
					</div>
				);
			case "LOOPING":
				return null;
			case "GAME_OVER":
				return (
					<button id="menu-button" onClick={this._handleMenu}>
						Menu
					</button>
				);
			default:
				throw "Unknown render state in SpaceDefender!";
		}
	}
});

$(function () {
	ReactDOM.render(<SpaceDefender/>, $("#react-content")[0]);
});
