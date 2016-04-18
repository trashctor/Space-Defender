var Util = require("./util");
var AABB = require("./aabb");
var Vector = require("./vector");
var DynamicObject = require("./dynamic_object");

var PlayerShot = require("./player_shot");
var PlayerMissile = require("./player_missile");
var PlayerMicroMissile = require("./player_micro_missile");

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

	this.maxSuper = 750;
	this.currSuper = 0;

	// weapon cooldowns
	this.playerTriShot = false;
	this.playerShotCooldown = 10;
	this.lastPlayerShotIter = -1000000;

	this.playerMissileCooldown = 50;
	this.lastPlayerMissileIter = -1000000;

	this.playerMicroMissile = false;
	this.playerMicroMissileCooldown = 7.5;
	this.lastPlayerMicroMissileIter = -1000000;

	this.playerSuperCooldown = 30;
	this.lastPlayerSuperIter = -1000000;

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
	var halfProjWidth = new projectile(0, new Vector(), new Vector()).collision.size.x / 2;
	return new Vector({ x: this.collision.pos.x + this.collision.size.x / 2 - halfProjWidth, y: this.collision.pos.y });
};

PlayerShip.prototype.playerFire = function () {
	var id, pos, vel;
	var currIter = SpaceDefender.game.engine.currIter;

	if(currIter >= this.lastPlayerShotIter + this.playerShotCooldown) {
		this.lastPlayerShotIter = currIter;

		if(this.currSuper > 0) {
			for(var i = -1; i <= 1; i++) {
				id = SpaceDefender.game.engine.getUniqueId();
				pos = this.getPlayerFirePosition(PlayerShot);
				vel = new Vector({ x: i, y: -3 }).normalize().scale(20);
				var shot = new PlayerShot(id, pos, vel, this.id);
				SpaceDefender.game.engine.insertObject(shot);
			}
		}
		else {
			id = SpaceDefender.game.engine.getUniqueId();
			pos = this.getPlayerFirePosition(PlayerShot);
			vel = new Vector({ x: 0, y: -20 });
			var shot = new PlayerShot(id, pos, vel, this.id);
			SpaceDefender.game.engine.insertObject(shot);
		}
	}

	if(currIter >= this.lastPlayerMissileIter + this.playerMissileCooldown) {
		this.lastPlayerMissileIter = currIter;
		id = SpaceDefender.game.engine.getUniqueId();

		pos = this.getPlayerFirePosition(PlayerMissile);
		var missile = new PlayerMissile(id, pos, this.id);

		SpaceDefender.game.engine.insertObject(missile);
	}

	if(this.currSuper > 0 && currIter >= this.lastPlayerMicroMissileIter + this.playerMicroMissileCooldown) {
		this.lastPlayerMicroMissileIter = currIter;
		id = SpaceDefender.game.engine.getUniqueId();

		pos = this.getPlayerFirePosition(PlayerMicroMissile);
		vel = new Vector({ x: Util.rand(-1, 1), y: -5 }).normalize().scale(15);
		var microMissile = new PlayerMicroMissile(id, pos, vel, this.id);

		SpaceDefender.game.engine.insertObject(microMissile);
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
		if(key.isPressed("]")) {
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
		case "HP_POWERUP":
			this.currHealth = Math.min(this.currHealth + 2, this.maxHealth);
			break;
		case "SUPER_POWERUP":
			this.currSuper = this.maxSuper;
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

	if(this.currSuper > 0) {
		this.currSuper--;
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
