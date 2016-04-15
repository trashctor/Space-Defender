var Game = require("./game");
var React = require("react");
var ReactDOM = require("react-dom");

var SpaceDefender = React.createClass({
	getInitialState: function () {
		return { current: "MENU" };
	},

	componentDidMount: function () {
		var canvasEl = $("#space-defender-canvas")[0];
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
					<div id="react-content-main">
						<h1 id="space-defenders-title">Space Defender</h1>
						<button id="start-game-button" onClick={this._handleNewGame}>
							Start Game
						</button>
					</div>
				);
			case "NEW_GAME":
				return (
					<div id="react-content-main">
						<h1 id="space-defenders-title">Space Defender</h1>
						<div id="select-players" className="group">
							<button id="one-player-button" onClick={this._startGame.bind(this, false)}>
								One Player
							</button>
							<button id="two-player-button" onClick={this._startGame.bind(this, true)}>
								Two Player
							</button>
						</div>
					</div>
				);
			case "LOOPING":
				return null;
			case "GAME_OVER":
				return (
					<div id="react-content-main">
						<h1 id="game-over-title">Game Over</h1>
						<button id="menu-button" onClick={this._handleMenu}>
							Menu
						</button>
					</div>
				);
			default:
				throw "Unknown render state in SpaceDefender!";
		}
	}
});

$(function () {
	ReactDOM.render(<SpaceDefender/>, $("#react-content-dom")[0]);
});
