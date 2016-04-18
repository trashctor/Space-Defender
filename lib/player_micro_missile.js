var Util = require("./util");
var AABB = require("./aabb");
var Vector = require("./vector");
var DynamicObject = require("./dynamic_object");

var ParticleHelper = require("./particle_helper");

var PlayerMicroMissile = function (id, pos, vel, owner) {
	var imagePlayerMicroMissile = $("#player-micro-missile")[0];
	var options = { image: imagePlayerMicroMissile, rotation: vel.rotation() };

	var size = new Vector({ x: imagePlayerMicroMissile.width, y: imagePlayerMicroMissile.height });
	var collision = new AABB(pos, size);

	this.type = "PLAYER_MICRO_MISSILE";

	this.microMissileSeekCooldown = 10;
	this.lastMicroMissileSeekIter = -1000000;

	DynamicObject.call(this, id, collision, vel, options);
};

Util.inherits(DynamicObject, PlayerMicroMissile);

PlayerMicroMissile.prototype.handleCollision = function () {
	// create explosion
	var options = {
		distanceMin: 20,
		distanceMax: 80,
		radiusMin: 2,
		radiusMax: 4,
		numParticles: 25,
		colorDelta: { red: {min: -100, max: 0}, green: {min: 0, max: 150}, blue: {min: 0, max: 150} }
	};

	ParticleHelper.createExplosion(this.collision.getCenter(), "#ff0000", options);
	SpaceDefender.game.engine.removeObject(this);
};

PlayerMicroMissile.prototype.handleSeeking = function () {
	// track the nearest target, but not past a certain radius/distance
	var closestTarget;
	var closestTargetDist = 200;
	var enemyObjects = SpaceDefender.game.engine.enemyObjects;
	var thisCenter = this.collision.getCenter();

	$.each(enemyObjects, function (id, enemyObj) {
		var enemyCenter = enemyObj.collision.getCenter();
		var distFromEnemy = thisCenter.distance(new Vector({ x: enemyCenter.x, y: enemyCenter.y }));

		if(distFromEnemy < closestTargetDist) {
			closestTarget = enemyObj;
			closestTargetDist = distFromEnemy;
		}
	});

	if(closestTarget) {
		var currSpeed = this.vel.norm();
		var newAddVel = closestTarget.collision.getCenter().subtract(thisCenter).normalize().scale(3);
		this.vel = this.vel.add(newAddVel).normalize().scale(currSpeed);
	}
};

PlayerMicroMissile.prototype.update = function () {
	var currIter = SpaceDefender.game.engine.currIter;

	if(currIter >= this.lastMicroMissileSeekIter + this.microMissileSeekCooldown) {
		this.lastMicroMissileSeekIter = currIter;
		this.handleSeeking();
	}

	DynamicObject.prototype.update.call(this);
	this.rotation = this.vel.rotation();
};

module.exports = PlayerMicroMissile;
