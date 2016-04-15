var Util = require("./util");
var AABB = require("./aabb");
var Vector = require("./vector");
var DynamicObject = require("./dynamic_object");

var EnemyTurretShot = function (id, pos, vel) {
	var imageEnemyTurretShot = $("#enemy-turret-shot")[0];
	var options = { image: imageEnemyTurretShot, rotation: vel.rotation() };

	var size = new Vector({ x: imageEnemyTurretShot.width, y: imageEnemyTurretShot.height });
	var collision = new AABB(pos, size);

	this.type = "ENEMY_TURRET_SHOT";

	DynamicObject.call(this, id, collision, vel, options);
};

Util.inherits(DynamicObject, EnemyTurretShot);

EnemyTurretShot.prototype.handleCollision = function () {
	SpaceDefender.game.engine.removeObject(this);
};

EnemyTurretShot.prototype.update = function () {
	DynamicObject.prototype.update.call(this);
};

module.exports = EnemyTurretShot;
