var Util = require("./util");
var VectorHelper = require("./vector_helper");
var EnemyHelper = require("./enemy_helper");

var AABB = require("./aabb");
var Vector = require("./vector");
var DynamicObject = require("./dynamic_object");

var ParticleHelper = require("./particle_helper");
var EnemyTurretShot = require("./enemy_turret_shot");

var HpPowerup = require("./hp_powerup");
var SuperPowerup = require("./super_powerup");

var EnemyTurret = function (id, pos) {
	var imageEnemyTurret = $("#enemy-turret")[0];
	var options = { image: imageEnemyTurret, rotation: 0 };

	this.type = "ENEMY_TURRET";

	this.maxHealth = 20;
	this.color = "#3a3a49";
	this.currHealth = this.maxHealth;
	this.ySpeed = 1;

	this.enemyTurretShotCooldown = 100;
	this.lastEnemyTurretShotIter = -1000000;

	this.explosionCooldown = 5;
	this.lastExplosionIter = -1000000;

	var size = new Vector({ x: imageEnemyTurret.width, y: imageEnemyTurret.height });
	var collision = new AABB(pos, size);

	DynamicObject.call(this, id, collision, new Vector({ x: 0, y: this.ySpeed}), options);
};

Util.inherits(DynamicObject, EnemyTurret);

EnemyTurret.prototype.createDamageExplosion = function () {
	var currIter = SpaceDefender.game.engine.currIter;
	if(currIter >= this.lastExplosionIter + this.explosionCooldown) {
		this.lastExplosionIter = currIter;
		ParticleHelper.createExplosion(this.collision.pos, this.color);
	}
}

EnemyTurret.prototype.handleCollision = function (rhs) {
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
			throw "Unrecognized rhs type in EnemyTurret.prototype.handleCollision!";
	}
};

EnemyTurret.prototype.getEnemyTurretFirePosition = function (projectile) {
	var thisCenter = this.collision.getCenter();
	var halfProjWidth = new projectile(0, new Vector(), new Vector()).collision.size.x / 2;
	return new Vector({ x: thisCenter.x - halfProjWidth, y: thisCenter.y - halfProjWidth});
};

EnemyTurret.prototype.enemyTurretFire = function () {
	// find the closest player
	var thisCenter = this.collision.getCenter();
	var closestTarget = EnemyHelper.getClosestPlayer(thisCenter);

	if(closestTarget) {
		var currIter = SpaceDefender.game.engine.currIter;

		if(currIter >= this.lastEnemyTurretShotIter + this.enemyTurretShotCooldown) {
			this.lastEnemyTurretShotIter = currIter;
			var	id = SpaceDefender.game.engine.getUniqueId();
			var vel = closestTarget.collision.getCenter().subtract(thisCenter).normalize().scale(5);
			var pos = this.getEnemyTurretFirePosition(EnemyTurretShot);

			var shot = new EnemyTurretShot(id, pos, vel);
			SpaceDefender.game.engine.insertObject(shot);
		}
	}
};

EnemyTurret.prototype.handlePowerups = function () {
	// chance to spawn powerup
	var chanceSpawnHp = 0.5;
	var chanceSpawnSuper = 0.25;
	var roll = Util.rand(0, 1);
	var powerup, id, pos;

	if(chanceSpawnSuper >= roll) {
		id = SpaceDefender.game.engine.getUniqueId();
		pos = this.collision.getCenter();
		powerup = new SuperPowerup(id, pos)

		SpaceDefender.game.engine.insertObject(powerup);
	}
	else if(chanceSpawnHp >= roll) {
		id = SpaceDefender.game.engine.getUniqueId();
		pos = this.collision.getCenter();
		powerup = new HpPowerup(id, pos)

		SpaceDefender.game.engine.insertObject(powerup);
	}
};

EnemyTurret.prototype.update = function () {
	this.enemyTurretFire();

	if(this.currHealth <= 0) {
		this.handlePowerups();
		SpaceDefender.game.engine.score += 80;
		SpaceDefender.game.engine.removeObject(this);
	}

	DynamicObject.prototype.update.call(this);
};

EnemyTurret.prototype.move = function () {
	DynamicObject.prototype.move.call(this);
};

module.exports = EnemyTurret;
