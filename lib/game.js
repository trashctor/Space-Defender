var Engine = require("./engine");

var Game = function (canvasEl) {
	this.canvasEl = canvasEl;

	this.canvasEl.width = 640;
	this.canvasEl.height = 480;
	this.ctx = this.canvasEl.getContext("2d");
	this.engine = new Engine(this.canvasEl.width, this.canvasEl.height);
};

Game.prototype.start = function (twoPlayer) {
	this.engine.setupGame(twoPlayer);

	var gameLoop = function () {
		this.engine.update();
		this.engine.render(this.ctx);
	};

	this.gameLoopInterval = setInterval(gameLoop.bind(this), 20);
};

Game.prototype.stop = function () {
	if(this.gameLoopInterval) {
		clearInterval(this.gameLoopInterval);
		this.engine.reset();
		this.ctx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
	}
};

module.exports = Game;
