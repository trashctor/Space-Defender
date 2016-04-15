var Util = require("./util");
var VectorHelper = require("./vector_helper");

var Circle = require("./circle");
var Vector = require("./vector");
var DynamicObject = require("./dynamic_object");

var ParticleHelper = require("./particle_helper");

var SpaceRock = function (id, pos, vel, radius) {
	var collision = new Circle(pos, radius);
	var options = { image: imageRock = $("#space-rock")[0], rotation: 0 };

	this.type = "SPACE_ROCK";
	this.color = "#332e29";
	this.rpi = Util.rand(-0.25, 0.25);

	this.maxHealth = Math.ceil(radius / 10);
	this.currHealth = this.maxHealth;

	DynamicObject.call(this, id, collision, vel, options);
};

Util.inherits(DynamicObject, SpaceRock);

SpaceRock.prototype.handleCollision = function (rhs) {
	// generate some particle effects
	ParticleHelper.createExplosion(this.collision.pos, this.color);

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
			throw "Unrecognized rhs type in SpaceRock.prototype.handleCollision!";
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
