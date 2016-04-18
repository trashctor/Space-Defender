var Util = require("./util");
var AABB = require("./aabb");
var Vector = require("./vector");
var DynamicObject = require("./dynamic_object");

var PlayerShot = function (id, pos, vel, owner) {
	var imagePlayerShot = $("#player-shot")[0];
	var options = { image: imagePlayerShot, rotation: vel.rotation() || 0 };

	var size = new Vector({ x: imagePlayerShot.width, y: imagePlayerShot.height });
	var collision = new AABB(pos, size);

	this.type = "PLAYER_SHOT";

	DynamicObject.call(this, id, collision, vel, options);
};

Util.inherits(DynamicObject, PlayerShot);

PlayerShot.prototype.handleCollision = function () {
	SpaceDefender.game.engine.removeObject(this);
};

PlayerShot.prototype.update = function () {
	DynamicObject.prototype.update.call(this);
};

module.exports = PlayerShot;
