var Util = require("./util");
var AABB = require("./aabb");
var Vector = require("./vector");
var DynamicObject = require("./dynamic_object");

var EnemyShipShot = function (id, pos) {
	var imageEnemyShipShot = $("#enemy-ship-shot")[0];
	var options = { image: imageEnemyShipShot, rotation: 0 };

	var size = new Vector({ x: imageEnemyShipShot.width, y: imageEnemyShipShot.height });
	var collision = new AABB(pos, size);
	var vel = new Vector({ x: 0, y: 10 });

	this.type = "ENEMY_SHIP_SHOT";

	DynamicObject.call(this, id, collision, vel, options);
};

Util.inherits(DynamicObject, EnemyShipShot);

EnemyShipShot.prototype.handleCollision = function () {
	SpaceDefender.game.engine.removeObject(this);
};

EnemyShipShot.prototype.update = function () {
	DynamicObject.prototype.update.call(this);
};

module.exports = EnemyShipShot;
