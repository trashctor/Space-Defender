var Engine = require("./engine");

var Game = function (canvasEl) {
	this.canvasEl = canvasEl;

	this.canvasEl.width = 640;
	this.canvasEl.height = 720 ;
	this.ctx = this.canvasEl.getContext("2d");
	this.engine = new Engine(this.canvasEl.width, this.canvasEl.height);
	this.engine.render(this.ctx);
	this.loopTime = 20;
};

Game.prototype.start = function (isTwoPlayers) {
	this.engine.setupGame(isTwoPlayers);

	var gameLoop = function () {
		this.engine.update();
		this.engine.render(this.ctx);
	};

	this.gameLoopInterval = setInterval(gameLoop.bind(this), this.loopTime);
};

Game.prototype.stop = function () {
	if(this.gameLoopInterval) {
		clearInterval(this.gameLoopInterval);
		this.engine.reset();
		this.engine.render(this.ctx);
	}
};

module.exports = Game;
