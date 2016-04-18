var Util = require("./util");
var Circle = require("./circle");
var Vector = require("./vector");
var DynamicObject = require("./dynamic_object");

var BombPowerup = function (id, pos) {
	var imageBombPowerup = $("#bomb-powerup")[0];
	var options = { image: imageBombPowerup, rotation: 0 };

	var collision = new Circle(pos, imageBombPowerup.width / 2);
	var vel = new Vector({ x: 0, y: 3 });

	this.type = "BOMB_POWERUP";

	DynamicObject.call(this, id, collision, vel, options);
};

Util.inherits(DynamicObject, BombPowerup);

BombPowerup.prototype.handleCollision = function () {
	SpaceDefender.game.engine.removeObject(this);
};

BombPowerup.prototype.update = function () {
	DynamicObject.prototype.update.call(this);
};

module.exports = BombPowerup;
