var Util = require("./util");
var Circle = require("./circle");
var Vector = require("./vector");
var DynamicObject = require("./dynamic_object");

var SpaceRock = function (id, pos, vel, radius) {
	var collision = new Circle(pos, radius);

	this.type = "SPACE_ROCK";

	this.maxHealth = Math.ceil(radius / 10);
	this.currHealth = this.maxHealth;

	DynamicObject.call(this, id, collision, vel);
};

Util.inherits(DynamicObject, SpaceRock);

SpaceRock.prototype.handleCollision = function (rhs) {
	switch(rhs.type) {
		case "PLAYER_SHIP":
			this.currHealth--;
			break;
		case "PLAYER_SHOT":
			this.currHealth--;
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
			var vel =	Util.randVec(1, 2);

			var rock = new SpaceRock(id, pos, vel, this.collision.radius / (numNewRocks + 1));
			SpaceDefender.game.engine.insertObject(rock);
		}
		SpaceDefender.game.engine.removeObject(this);
	}

	DynamicObject.prototype.update.call(this);
};


SpaceRock.prototype.move = function () {
	var randVec = Util.randVec(.1, .2);
	this.vel = this.vel.add(randVec);

	DynamicObject.prototype.move.call(this);
};

module.exports = SpaceRock;
