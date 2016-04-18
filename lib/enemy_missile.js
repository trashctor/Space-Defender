var Util = require("./util");
var AABB = require("./aabb");
var Vector = require("./vector");
var DynamicObject = require("./dynamic_object");

var ParticleHelper = require("./particle_helper");
var EnemyHelper = require("./enemy_helper");

var EnemyMissile = function (id, pos, vel) {
	var imageEnemyMissile = $("#enemy-missile")[0];
	var options = { image: imageEnemyMissile, rotation: vel.rotation() };

	var size = new Vector({ x: imageEnemyMissile.width, y: imageEnemyMissile.height });
	var collision = new AABB(pos, size);

	this.type = "ENEMY_MISSILE";

	this.enemyMissileSeekCooldown = 5;
	this.lastEnemyMissileSeekIter = -1000000;

	DynamicObject.call(this, id, collision, vel, options);
};

Util.inherits(DynamicObject, EnemyMissile);

EnemyMissile.prototype.handleCollision = function () {
	// create explosion
	var options = {
		distanceMin: 20,
		distanceMax: 100,
		radiusMin: 2,
		radiusMax: 5,
		numParticles: 50,
		colorDelta: { red: {min: -100, max: 0}, green: {min: 0, max: 200}, blue: {min: 0, max: 0} }
	};

	ParticleHelper.createExplosion(this.collision.getCenter(), "#ff0000", options);
	SpaceDefender.game.engine.removeObject(this);
};

EnemyMissile.prototype.handleSeeking = function () {
	// track the nearest player, but not past a certain radius/distance
	var thisCenter = this.collision.getCenter();
	var closestTarget = EnemyHelper.getClosestPlayer(thisCenter, 200);
	var currIter = SpaceDefender.game.engine.currIter;
	var id, pos;

	if(closestTarget) {
		var currSpeed = this.vel.norm();
		var newAddVel = closestTarget.collision.getCenter().subtract(thisCenter).normalize().scale(3);
		this.vel = this.vel.add(newAddVel).normalize().scale(currSpeed);
	}
};

EnemyMissile.prototype.update = function () {
	var currIter = SpaceDefender.game.engine.currIter;

	if(currIter >= this.lastEnemyMissileSeekIter + this.enemyMissileSeekCooldown) {
		this.lastEnemyMissileSeekIter = currIter;
		this.handleSeeking();
	}

	DynamicObject.prototype.update.call(this);
	this.rotation = this.vel.rotation();
};

module.exports = EnemyMissile;
