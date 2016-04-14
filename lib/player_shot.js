var Util = require("./util");
var AABB = require("./aabb");
var Vector = require("./vector");
var DynamicObject = require("./dynamic_object");

var PlayerShot = function (id, pos, owner) {
	var imagePlayerShot = $("#player-shot")[0];

	var size = new Vector({ x: imagePlayerShot.width, y: imagePlayerShot.height });
	var collision = new AABB(pos, size);
	var vel = new Vector({ x: 0, y: -10 });

	DynamicObject.call(this, id, collision, vel, imagePlayerShot);
};

Util.inherits(DynamicObject, PlayerShot);

PlayerShot.prototype.handleCollision = function () {
	SpaceDefender.game.engine.removeObject(this.id);
};

PlayerShot.prototype.update = function () {
	DynamicObject.prototype.update.call(this);
};

module.exports = PlayerShot;
