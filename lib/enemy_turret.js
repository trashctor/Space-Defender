var Util = require("./util");
var VectorHelper = require("./vector_helper");
var EnemyHelper = require("./enemy_helper");

var AABB = require("./aabb");
var Vector = require("./vector");
var DynamicObject = require("./dynamic_object");

var ParticleHelper = require("./particle_helper");
var EnemyTurretShot = require("./enemy_turret_shot");

var EnemyTurret = function (id, pos) {
	var imageEnemyTurret = $("#enemy-turret")[0];
	var options = { image: imageEnemyTurret, rotation: 0 };

	this.type = "ENEMY_TURRET";

	this.maxHealth = 15;
	this.color = "#3a3a49";
	this.currHealth = this.maxHealth;
	this.ySpeed = 1;

	this.enemyTurretShotCooldown = 100;
	this.lastEnemyTurretShotIter = -1000000;

	var size = new Vector({ x: imageEnemyTurret.width, y: imageEnemyTurret.height });
	var collision = new AABB(pos, size);

	DynamicObject.call(this, id, collision, new Vector({ x: 0, y: this.ySpeed}), options);
};

Util.inherits(DynamicObject, EnemyTurret);

EnemyTurret.prototype.handleCollision = function (rhs) {
	// generate some particle effects
	ParticleHelper.createExplosion(this.collision.getCenter(), this.color);

	switch(rhs.type) {
		case "PLAYER_SHIP":
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

EnemyTurret.prototype.update = function () {
	this.enemyTurretFire();

	if(this.currHealth <= 0) {
		SpaceDefender.game.score += 80;
		SpaceDefender.game.engine.removeObject(this);
	}

	DynamicObject.prototype.update.call(this);
};

EnemyTurret.prototype.move = function () {
	DynamicObject.prototype.move.call(this);
};

module.exports = EnemyTurret;
