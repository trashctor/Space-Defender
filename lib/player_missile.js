var Util = require("./util");
var AABB = require("./aabb");
var Vector = require("./vector");
var DynamicObject = require("./dynamic_object");

var ParticleHelper = require("./particle_helper");

var PlayerMissile = function (id, pos, owner) {
	var imagePlayerMissile = $("#player-missile")[0];
	var options = { image: imagePlayerMissile, rotation: 0 };

	var size = new Vector({ x: imagePlayerMissile.width, y: imagePlayerMissile.height });
	var collision = new AABB(pos, size);
	var vel = new Vector({ x: 0, y: -10 });

	this.type = "PLAYER_MISSILE";

	DynamicObject.call(this, id, collision, vel, options);
};

Util.inherits(DynamicObject, PlayerMissile);

PlayerMissile.prototype.handleCollision = function () {
	// create explosion
	var options = {
		distanceMin: 20,
		distanceMax: 60,
		radiusMin: 2,
		radiusMax: 5,
		numParticles: 50,
		colorDelta: { red: {min: -100, max: 0}, green: {min: 0, max: 200}, blue: {min: 0, max: 0} }
	};

	ParticleHelper.createExplosion(this.collision.getCenter(), "#ff0000", options);
	SpaceDefender.game.engine.removeObject(this);
};

PlayerMissile.prototype.handleSeeking = function () {
	// track the nearest target, but not past a certain radius/distance
	var closestTarget;
	var closestTargetDist = 350;
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
		var newAddVel = closestTarget.collision.getCenter().subtract(thisCenter).normalize();
		this.vel = this.vel.add(newAddVel).normalize().scale(currSpeed);
	}
};

PlayerMissile.prototype.update = function () {
	this.handleSeeking();
	DynamicObject.prototype.update.call(this);
	this.rotation = this.vel.rotation();
};

module.exports = PlayerMissile;
