var Game = require("./game");

$(function () {
	var canvasEl = $("#canvas")[0];

	// make the one Game instance globally available
	window.SpaceDefender = {};
	var game = window.SpaceDefender.game = new Game(canvasEl);

	var startGameButton = $("#start-game").prop("disabled", false);
	var stopGameButton = $("#stop-game").prop("disabled", true);

	startGameButton.on("click", function () {
		startGameButton.prop("disabled", true);
		stopGameButton.prop("disabled", false);
		game.start();
	});

	stopGameButton.on("click", function () {
		stopGameButton.prop("disabled", true);
		startGameButton.prop("disabled", false);
		game.stop();
	});

});
