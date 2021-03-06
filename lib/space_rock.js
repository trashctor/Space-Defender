var Util = require("./util");
var VectorHelper = require("./vector_helper");

var Circle = require("./circle");
var Vector = require("./vector");
var DynamicObject = require("./dynamic_object");

var ParticleHelper = require("./particle_helper");

var HpPowerup = require("./hp_powerup");

var SpaceRock = function (id, pos, vel, radius) {
	var collision = new Circle(pos, radius);
	var options = { image: imageRock = $("#space-rock")[0], rotation: 0 };

	this.type = "SPACE_ROCK";
	this.color = "#332e29";
	this.rpi = Util.rand(-0.25, 0.25);

	this.maxHealth = Math.ceil(radius / 10);
	this.currHealth = this.maxHealth;

	this.explosionCooldown = 5;
	this.lastExplosionIter = -1000000;

	DynamicObject.call(this, id, collision, vel, options);
};

Util.inherits(DynamicObject, SpaceRock);

SpaceRock.prototype.createDamageExplosion = function () {
	var currIter = SpaceDefender.game.engine.currIter;
	if(currIter >= this.lastExplosionIter + this.explosionCooldown) {
		this.lastExplosionIter = currIter;
		ParticleHelper.createExplosion(this.collision.pos, this.color);
	}
};

SpaceRock.prototype.handleCollision = function (rhs) {
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
			throw "Unrecognized rhs type in SpaceRock.prototype.handleCollision!";
	}
};

SpaceRock.prototype.handlePowerups = function () {
	// chance to spawn powerup
	var chanceSpawnHp = 0.05;
	var roll = Util.rand(0, 1);
	var powerup, id, pos;

	if(chanceSpawnHp >= roll) {
		id = SpaceDefender.game.engine.getUniqueId();
		pos = this.collision.getCenter();
		powerup = new HpPowerup(id, pos);

		SpaceDefender.game.engine.insertObject(powerup);
	}
};

SpaceRock.prototype.update = function () {
	if(this.currHealth <= 0) {
		var numNewRocks = this.maxHealth - 1;

		for(var i = 0; i < numNewRocks; i++) {
			var id = SpaceDefender.game.engine.getUniqueId();
			var pos = this.collision.pos;
			var vel =	VectorHelper.randVec(1, 2);

			var rock = new SpaceRock(id, pos, vel, this.collision.radius / (numNewRocks + 1));
			SpaceDefender.game.engine.insertObject(rock);
		}

		this.handlePowerups();
		SpaceDefender.game.engine.score += 5;
		SpaceDefender.game.engine.removeObject(this);
	}

	this.rotation += this.rpi;

	DynamicObject.prototype.update.call(this);
};


SpaceRock.prototype.move = function () {
	var randVec = VectorHelper.randVec(0.1, 0.2);
	this.vel = this.vel.add(randVec);

	DynamicObject.prototype.move.call(this);
};

module.exports = SpaceRock;
