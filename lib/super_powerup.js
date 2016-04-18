var Util = require("./util");
var Circle = require("./circle");
var Vector = require("./vector");
var DynamicObject = require("./dynamic_object");

var SuperPowerup = function (id, pos) {
	var imageSuperPowerup = $("#super-powerup")[0];
	var options = { image: imageSuperPowerup, rotation: 0 };

	var collision = new Circle(pos, imageSuperPowerup.width / 2);
	var vel = new Vector({ x: 0, y: 3 });

	this.type = "SUPER_POWERUP";

	DynamicObject.call(this, id, collision, vel, options);
};

Util.inherits(DynamicObject, SuperPowerup);

SuperPowerup.prototype.handleCollision = function () {
	SpaceDefender.game.engine.removeObject(this);
};

SuperPowerup.prototype.update = function () {
	DynamicObject.prototype.update.call(this);
};

module.exports = SuperPowerup;
