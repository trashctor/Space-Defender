var Util = require("./util");
var AABB = require("./aabb");
var Vector = require("./vector");
var DynamicObject = require("./dynamic_object");

var PlayerShot = require("./player_shot");
var PlayerMissile = require("./player_missile");

var ParticleHelper = require("./particle_helper");

var PlayerShip = function (id, pos) {
	var imageShip;

	if(id === 1) {
		imageShip = $("#ship-1")[0];
		this.color = "#202945";
	}
	else if(id === 2) {
		imageShip = $("#ship-2")[0];
		this.color = "#374612";
	}
	else {
		throw "Invalid ship id!";
	}

	var options = { image: imageShip, rotation: 0 };

	var size = new Vector({ x: imageShip.width, y: imageShip.height });
	var collision = new AABB(pos, size);
	var vel = new Vector();

	this.type = "PLAYER_SHIP";

	this.maxHealth = 15;
	this.currHealth = this.maxHealth;

	// weapon cooldowns
	this.playerShotCooldown = 10;
	this.lastPlayerShotIter = -1000000;

	this.playerMissileCooldown = 50;
	this.lastPlayerMissileIter = -1000000;

	DynamicObject.call(this, id, collision, vel, options);
};

Util.inherits(DynamicObject, PlayerShip);

PlayerShip.prototype.outsideBoundary = function (pos, size) {
	var width = SpaceDefender.game.engine.width;
	var height = SpaceDefender.game.engine.height;

	var leftSide = pos.x;
	var rightSide = pos.x + size.x;
	var topSide = pos.y;
	var bottomSide = pos.y + size.y;

	var collisionLeft = leftSide <= 0;
	var collisionRight = rightSide >= width;
	var collisionTop = topSide <= 0;
	var collisionBottom = bottomSide >= height;

	return { left: collisionLeft, right: collisionRight, top: collisionTop, bottom: collisionBottom };
};

PlayerShip.prototype.handleBoundaryCollision = function (collisionObj) {
	if(collisionObj.left || collisionObj.right) {
		this.vel.x = 0;
	}
	if(collisionObj.top || collisionObj.bottom) {
		this.vel.y = 0;
	}
};

PlayerShip.prototype.getPlayerFirePosition = function (projectile) {
	var halfProjWidth = new projectile().collision.size.x / 2;
	return new Vector({ x: this.collision.pos.x + this.collision.size.x / 2 - halfProjWidth, y: this.collision.pos.y });
};

PlayerShip.prototype.playerFire = function () {
	var id, pos;
	var currIter = SpaceDefender.game.engine.currIter;

	if(currIter >= this.lastPlayerShotIter + this.playerShotCooldown) {
		this.lastPlayerShotIter = currIter;
		id = SpaceDefender.game.engine.getUniqueId();

		pos = this.getPlayerFirePosition(PlayerShot);
		var shot = new PlayerShot(id, pos, this.id);
		SpaceDefender.game.engine.insertObject(shot);
	}

	if(currIter >= this.lastPlayerMissileIter + this.playerMissileCooldown) {
		this.lastPlayerMissileIter = currIter;
		id = SpaceDefender.game.engine.getUniqueId();

		pos = this.getPlayerFirePosition(PlayerMissile);
		var missile = new PlayerMissile(id, pos, this.id);

		SpaceDefender.game.engine.insertObject(missile);
	}
};

PlayerShip.prototype.handleControls = function () {
	if(this.id === 1) {
		// movement
		if(key.isPressed("w")) {
			this.vel.y -= 0.75;
		}
		if(key.isPressed("s")) {
			this.vel.y += 0.75;
		}
		if(key.isPressed("a")) {
			this.vel.x -= 0.75;
		}
		if(key.isPressed("d")) {
			this.vel.x += 0.75;
		}

		// fire
		if(key.isPressed("`")) {
			this.playerFire();
		}
	}
	else if(this.id === 2) {
		// movement
		if(key.isPressed("8")) {
			this.vel.y -= 0.75;
		}
		if(key.isPressed("5")) {
			this.vel.y += 0.75;
		}
		if(key.isPressed("4")) {
			this.vel.x -= 0.75;
		}
		if(key.isPressed("6")) {
			this.vel.x += 0.75;
		}

		// fire
		if(key.isPressed("\\")) {
			this.playerFire();
		}
	}
};

PlayerShip.prototype.handleCollision = function (rhs) {
	switch(rhs.type) {
		case "SPACE_ROCK":
		case "ENEMY_SHIP":
		case "ENEMY_TURRET":
			this.currHealth -= 3;
			break;
		case "ENEMY_SHIP_SHOT":
			this.currHealth--;
			break;
		case "ENEMY_TURRET_SHOT":
			this.currHealth -= 4;
			break;
		default:
			throw "Unrecognized rhs type in EnemyShip.prototype.handleCollision!";
	}
};

PlayerShip.prototype.createDeathExplosion = function () {
	// create explosion
	var options = {
		distanceMin: 80,
		distanceMax: 240,
		radiusMin: 8,
		radiusMax: 24,
		speedMin: 10,
		speedMax: 15,
		numParticles: 50,
	};

	ParticleHelper.createExplosion(this.collision.getCenter(), this.color, options);
};

PlayerShip.prototype.update = function () {
	if(this.currHealth <= 0) {
		this.createDeathExplosion();
		SpaceDefender.game.engine.removeObject(this);
	}

	this.vel = this.vel.scale(0.9);

	this.handleControls();

	// only move if the move will not clip with the game boundary
	var movePos = this.collision.pos.add(this.vel);
	var collisionObj = this.outsideBoundary(movePos, this.collision.size);
	this.handleBoundaryCollision(collisionObj);

	DynamicObject.prototype.update.call(this);
};

module.exports = PlayerShip;
