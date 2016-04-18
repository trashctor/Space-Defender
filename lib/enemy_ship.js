var Util = require("./util");
var VectorHelper = require("./vector_helper");
var EnemyHelper = require("./enemy_helper");

var AABB = require("./aabb");
var Vector = require("./vector");
var DynamicObject = require("./dynamic_object");

var ParticleHelper = require("./particle_helper");
var EnemyShipShot = require("./enemy_ship_shot");

var HpPowerup = require("./hp_powerup");
var SuperPowerup = require("./super_powerup");

var EnemyShip = function (id, pos) {
	var imageEnemyShip = $("#enemy-ship")[0];
	var options = { image: imageEnemyShip, rotation: 0 };

	this.type = "ENEMY_SHIP";

	this.maxHealth = 5;
	this.color = "#1e2a01";
	this.currHealth = this.maxHealth;
	this.ySpeed = Util.rand(2, 3);

	this.enemyShipShotCooldown = 30;
	this.lastEnemyShipShotIter = -1000000;

	this.explosionCooldown = 5;
	this.lastExplosionIter = -1000000;

	var size = new Vector({ x: imageEnemyShip.width, y: imageEnemyShip.height });
	var collision = new AABB(pos, size);

	DynamicObject.call(this, id, collision, new Vector({ x: 0, y: this.ySpeed}), options);
};

Util.inherits(DynamicObject, EnemyShip);

EnemyShip.prototype.createDamageExplosion = function () {
	var currIter = SpaceDefender.game.engine.currIter;
	if(currIter >= this.lastExplosionIter + this.explosionCooldown) {
		this.lastExplosionIter = currIter;
		ParticleHelper.createExplosion(this.collision.pos, this.color);
	}
}

EnemyShip.prototype.handleCollision = function (rhs) {
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
			throw "Unrecognized rhs type in EnemyShip.prototype.handleCollision!";
	}
};

EnemyShip.prototype.getEnemyShipFirePosition = function (projectile) {
	var halfProjWidth = new projectile().collision.size.x / 2;
	return new Vector({ x: this.collision.pos.x + this.collision.size.x / 2 - halfProjWidth, y: this.collision.pos.y + this.collision.size.y });
};

EnemyShip.prototype.enemyShipFire = function () {
	var currIter = SpaceDefender.game.engine.currIter;

	if(currIter >= this.lastEnemyShipShotIter + this.enemyShipShotCooldown) {
		this.lastEnemyShipShotIter = currIter;
		var	id = SpaceDefender.game.engine.getUniqueId();
		var pos = this.getEnemyShipFirePosition(EnemyShipShot);

		var shot = new EnemyShipShot(id, pos);
		SpaceDefender.game.engine.insertObject(shot);
	}
};

EnemyShip.prototype.handlePowerups = function () {
	// chance to spawn powerup
	var chanceSpawnHp = 0.2;
	var chanceSpawnSuper = 0.075;
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

EnemyShip.prototype.update = function () {
	this.enemyShipFire();

	if(this.currHealth <= 0) {
		this.handlePowerups();
		SpaceDefender.game.engine.score += 30;
		SpaceDefender.game.engine.removeObject(this);
	}

	DynamicObject.prototype.update.call(this);
};

EnemyShip.prototype.move = function () {
	// find the closest player
	var thisCenter = this.collision.getCenter();
	var closestTarget = EnemyHelper.getClosestPlayer(thisCenter);

	// get the vector to them
	if(closestTarget) {
		var yVel = new Vector({ x: 0, y: this.ySpeed });
		var xVel = new Vector({ x: 0, y: 0 });

		if(closestTarget.collision.getCenter().subtract(thisCenter).x > 0) {
			xVel.x = 1;
		}
		else {
			xVel.x = -1;
		}

		this.vel = yVel.add(xVel);
	}

	DynamicObject.prototype.move.call(this);
};

module.exports = EnemyShip;
