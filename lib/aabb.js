var Vector = require("./vector");
var Circle = require("./circle");

var AABB = function (pos, size) {
	this.type = "AABB";
	this.pos = pos;
	this.size = size;
};

AABB.prototype.getCenter = function () {
	var center = new Vector();
	center.x = this.pos.x + this.size.x / 2;
	center.y = this.pos.y + this.size.y / 2;
	return center;
};

AABB.prototype.collidedWith = function (rhs) {
	// AABB and circle collision (use the circle's version)
	if(rhs.type === "CIRCLE") {
		return rhs.collidedWith(this);
	}
	// AABB and AABB collision
	else if(rhs.type === "AABB") {
		var collisionX;
		var collisionY;
		collisionX = this.pos.x + this.size.x >= rhs.pos.x && rhs.pos.x + rhs.size.x >= this.pos.x;
		collisionY = this.pos.y + this.size.y >= rhs.pos.y && rhs.pos.y + rhs.size.y >= this.pos.y;
		return collisionX && collisionY;
	}
	else {
		throw "Error in AABB.prototype.collidedWith()!";
	}
};

module.exports = AABB;
