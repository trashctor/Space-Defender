var Util = require("./util");
var AABB = require("./aabb");
var Vector = require("./vector");
var DynamicObject = require("./dynamic_object");

var SpaceRock = function (id, pos, vel) {
	var radius = Util.rand(20, 30);
	var collision = new Circle(pos, radius);

	this.type = "SPACE_ROCK";
	this.health = Math.ceil(radius / 10);
	DynamicObject.call(this, id, collision, vel);
};

Util.inherits(DynamicObject, SpaceRock);

SpaceRock.prototype.handleCollision = function (rhs) {
	switch(rhs.type) {
		case "PLAYER_SHIP":
			this.health--;
			break;
		case "PLAYER_SHOT":
			this.health--;
			break;
		default:
			throw "Unrecognized rhs type in SpaceRock.prototype.handleCollision!";
	}
};

SpaceRock.prototype.update = function () {
	if(this.health === 0) {
		SpaceDefenders.game.engine.removeObject(this.id);
	}

	DynamicObject.prototype.update.call(this);
};

module.exports = SpaceRock;
