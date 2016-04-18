var Util = require("./util");
var Circle = require("./circle");
var Vector = require("./vector");
var DynamicObject = require("./dynamic_object");

var ParticleHelper = require("./particle_helper");

var PlayerBomb = function (id, pos, owner) {
	var imagePlayerBomb = $("#player-bomb")[0];
	var options = { image: imagePlayerBomb, rotation: 0 };

	var radius = imagePlayerBomb.width / 2;
	var collision = new Circle(pos, radius);
	var vel = new Vector({ x: 0, y: -7.5});

	this.type = "PLAYER_BOMB";

	this.maxHealth = 5;
	this.currHealth = this.maxHealth;
	this.duration = 10;

	this.bombExplosionCooldown = 5;
	this.lastBombExplosionIter = -1000000;

	DynamicObject.call(this, id, collision, vel, options);
};

Util.inherits(DynamicObject, PlayerBomb);

PlayerBomb.prototype.createDeathExplosion = function () {
	// create explosion
	var options = {
		distanceMin: 150,
		distanceMax: 300,
		radiusMin: 8,
		radiusMax: 12,
		numParticles: 25,
		colorDelta: { red: {min: -150, max: 0}, green: {min: 0, max: 150}, blue: {min: 0, max: 0} }
	};

	ParticleHelper.createExplosion(this.collision.getCenter(), "#ff0000", options);
};

PlayerBomb.prototype.handleCollision = function (rhs) {
	switch(rhs.type) {
		case "SPACE_ROCK":
		case "ENEMY_SHIP":
		case "ENEMY_TURRET":
		case "ENEMY_TURRET_SHOT":
			this.currHealth -= 3;
			break;
		case "ENEMY_SHIP_SHOT":
			this.currHealth--;
			break;
		default:
			throw "Unrecognized rhs type in PlayerBomb.prototype.handleCollision!";
	}
};

PlayerBomb.prototype.update = function () {
	if(this.currHealth <= 0 || this.vel.norm() <= 0.5) {
		var currIter = SpaceDefender.game.engine.currIter;

		this.collision.radius = 200;
		this.image = null;
		this.color = "rgba(0,0,0,0)";

		if(this.duration > 0) {
			if(currIter >= this.lastBombExplosionIter + this.bombExplosionCooldown) {
				this.lastBombExplosionIter = currIter;
				this.createDeathExplosion();
			}
			this.duration--;
		}
		else {
			SpaceDefender.game.engine.removeObject(this);
		}
	}

	this.vel = this.vel.scale(0.975);

	DynamicObject.prototype.update.call(this);
};

module.exports = PlayerBomb;
