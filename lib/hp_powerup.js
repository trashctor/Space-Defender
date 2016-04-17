var Util = require("./util");
var Circle = require("./circle");
var Vector = require("./vector");
var DynamicObject = require("./dynamic_object");

var HpPowerup = function (id, pos) {
	var imageHpPowerup = $("#hp-powerup")[0];
	var options = { image: imageHpPowerup, rotation: 0 };

	var collision = new Circle(pos, imageHpPowerup.width / 2);
	var vel = new Vector({ x: 0, y: 3 });

	this.type = "HP_POWERUP";

	DynamicObject.call(this, id, collision, vel, options);
};

Util.inherits(DynamicObject, HpPowerup);

HpPowerup.prototype.handleCollision = function () {
	SpaceDefender.game.engine.removeObject(this);
};

HpPowerup.prototype.update = function () {
	DynamicObject.prototype.update.call(this);
};

module.exports = HpPowerup;
