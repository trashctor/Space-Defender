var Util = require("./util");
var AABB = require("./aabb");
var Vector = require("./vector");
var DynamicObject = require("./dynamic_object");

var ParticleHelper = require("./particle_helper");

var EnemyTurretShot = function (id, pos, vel) {
	var imageEnemyTurretShot = $("#enemy-turret-shot")[0];
	var options = { image: imageEnemyTurretShot, rotation: vel.rotation() };

	var size = new Vector({ x: imageEnemyTurretShot.width, y: imageEnemyTurretShot.height });
	var collision = new AABB(pos, size);

	this.type = "ENEMY_TURRET_SHOT";

	DynamicObject.call(this, id, collision, vel, options);
};

Util.inherits(DynamicObject, EnemyTurretShot);

EnemyTurretShot.prototype.createDeathExplosion = function () {
	// create explosion
	var options = {
		distanceMin: 20,
		distanceMax: 60,
		radiusMin: 2,
		radiusMax: 5,
		numParticles: 50,
		colorDelta: { red: {min: -100, max: 0}, green: {min: 0, max: 100}, blue: {min: 0, max: 0} }
	};

	ParticleHelper.createExplosion(this.collision.getCenter(), "#1a89be", options);
};

EnemyTurretShot.prototype.handleCollision = function () {
	this.createDeathExplosion();
	SpaceDefender.game.engine.removeObject(this);
};

EnemyTurretShot.prototype.update = function () {
	DynamicObject.prototype.update.call(this);
};

module.exports = EnemyTurretShot;
