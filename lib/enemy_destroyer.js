var Util = require("./util");
var VectorHelper = require("./vector_helper");
var EnemyHelper = require("./enemy_helper");

var AABB = require("./aabb");
var Vector = require("./vector");
var DynamicObject = require("./dynamic_object");

var ParticleHelper = require("./particle_helper");
var EnemyTurretShot = require("./enemy_turret_shot");
var EnemyMissile = require("./enemy_missile");

var HpPowerup = require("./hp_powerup");
var SuperPowerup = require("./super_powerup");
var BombPowerup = require("./bomb_powerup");


var EnemyDestroyer = function (id, pos) {
	var imageEnemyDestroyer = $("#enemy-destroyer")[0];
	var options = { image: imageEnemyDestroyer, rotation: 0 };

	this.type = "ENEMY_DESTROYER";

	this.maxHealth = 35;
	this.color = "#9d4e0d";
	this.currHealth = this.maxHealth;
	this.ySpeed = 1.5;

	this.enemyDestroyerShotCooldown = 50;
	this.lastEnemyDestroyerShotIter = -1000000;

	this.enemyDestroyerMissileCooldown = 250;
	this.lastEnemyDestroyerMissileIter = -1000000;

	this.explosionCooldown = 5;
	this.lastExplosionIter = -1000000;

	var size = new Vector({ x: imageEnemyDestroyer.width, y: imageEnemyDestroyer.height });
	var collision = new AABB(pos, size);

	DynamicObject.call(this, id, collision, new Vector({ x: 0, y: this.ySpeed}), options);
};

Util.inherits(DynamicObject, EnemyDestroyer);

EnemyDestroyer.prototype.createDamageExplosion = function () {
	var currIter = SpaceDefender.game.engine.currIter;
	if(currIter >= this.lastExplosionIter + this.explosionCooldown) {
		this.lastExplosionIter = currIter;
		ParticleHelper.createExplosion(this.collision.getCenter(), this.color);
	}
};

EnemyDestroyer.prototype.handleCollision = function (rhs) {
	// generate some particle effects
	this.createDamageExplosion();

	switch(rhs.type) {
		case "PLAYER_SHIP":
		case "PLAYER_MICRO_MISSILE":
		case "PLAYER_BOMB":
			this.currHealth -= 3;
			break;
		case "PLAYER_SHOT":
			this.currHealth--;
			break;
		case "PLAYER_MISSILE":
			this.currHealth -= 5;
			break;
		default:
			throw "Unrecognized rhs type in EnemyDestroyer.prototype.handleCollision!";
	}
};

EnemyDestroyer.prototype.getEnemyDestroyerFirePosition = function (projectile) {
	var thisCenter = this.collision.getCenter();
	var halfProjWidth = new projectile(0, new Vector(), new Vector()).collision.size.x / 2;
	return new Vector({ x: thisCenter.x - halfProjWidth, y: thisCenter.y - halfProjWidth});
};

EnemyDestroyer.prototype.enemyDestroyerFire = function () {
	// find the closest player
	var thisCenter = this.collision.getCenter();
	var closestTarget = EnemyHelper.getClosestPlayer(thisCenter);
	var currIter = SpaceDefender.game.engine.currIter;
	var id, pos;

	if(closestTarget) {
		var vel = closestTarget.collision.getCenter().subtract(thisCenter).normalize();

		if(currIter >= this.lastEnemyDestroyerShotIter + this.enemyDestroyerShotCooldown) {
			this.lastEnemyDestroyerShotIter = currIter;
			id = SpaceDefender.game.engine.getUniqueId();

			// give the shot a random small random bias
			var randVel = new Vector({ x: Util.rand(-0.25, 0.25), y: Util.rand(-0.25, 0.25) });
			vel = vel.add(randVel).normalize().scale(5);

			pos = this.getEnemyDestroyerFirePosition(EnemyTurretShot);

			var shot = new EnemyTurretShot(id, pos, vel);
			SpaceDefender.game.engine.insertObject(shot);
		}

		if(currIter >= this.lastEnemyDestroyerMissileIter + this.enemyDestroyerMissileCooldown) {
			this.lastEnemyDestroyerMissileIter = currIter;
			id = SpaceDefender.game.engine.getUniqueId();
			pos = this.getEnemyDestroyerFirePosition(EnemyMissile);
			vel = vel.normalize().scale(10);

			missile = new EnemyMissile(id, pos, vel);
			SpaceDefender.game.engine.insertObject(missile);
		}
	}
};

EnemyDestroyer.prototype.handlePowerups = function () {
	// chance to spawn powerup
	var chanceSpawnHp = 0.75;
	var chanceSpawnBomb = 0.5;
	var chanceSpawnSuper = 0.25;
	var id = SpaceDefender.game.engine.getUniqueId();
	var pos = this.collision.getCenter();
	var powerup;

	if(chanceSpawnSuper >= Util.rand(0, 1)) {
		powerup = new SuperPowerup(id, pos);
		SpaceDefender.game.engine.insertObject(powerup);
	}
	else if(chanceSpawnBomb >= Util.rand(0, 1)) {
		powerup = new BombPowerup(id, pos);
		SpaceDefender.game.engine.insertObject(powerup);
	}
	else if(chanceSpawnHp >= Util.rand(0, 1)) {
		powerup = new HpPowerup(id, pos);
		SpaceDefender.game.engine.insertObject(powerup);
	}
};

EnemyDestroyer.prototype.update = function () {
	this.enemyDestroyerFire();

	if(this.currHealth <= 0) {
		this.handlePowerups();
		SpaceDefender.game.engine.score += 240;
		SpaceDefender.game.engine.removeObject(this);
	}

	DynamicObject.prototype.update.call(this);
};

EnemyDestroyer.prototype.move = function () {
	// find the closest player
	var thisCenter = this.collision.getCenter();
	var closestTarget = EnemyHelper.getClosestPlayer(thisCenter);

	// get the vector to them
	if(closestTarget) {
		var yVel = new Vector({ x: 0, y: this.ySpeed });
		var xVel = new Vector({ x: 0, y: 0 });

		if(closestTarget.collision.getCenter().subtract(thisCenter).x > 0) {
			xVel.x = 0.25;
		}
		else {
			xVel.x = -0.25;
		}

		this.vel = yVel.add(xVel);
	}

	DynamicObject.prototype.move.call(this);
};

module.exports = EnemyDestroyer;
