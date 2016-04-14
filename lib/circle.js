var Vector = require("./vector");
var AABB = require("./aabb");
var Util = require("./util");

var Circle = function (pos, radius) {
	this.type = "CIRCLE";
	this.pos = pos;
	this.radius = radius;
};

Circle.prototype.getCenter = function () {
	return $.extend({}, this.pos);
};

Circle.prototype.collidedWith = function (rhs) {
	// AABB and circle collision
	if(rhs.type === "AABB") {
		// find the vector between the centers
		var currVec = this.pos.subtract(rhs.getCenter());

		// clamp that vector to the edge of the AABB
		var halfWidth = rhs.size.x / 2;
		var halfHeight = rhs.size.y / 2;

		currVec.x = Util.clamp(currVec.x, -halfWidth, halfWidth);
		currVec.y = Util.clamp(currVec.y, -halfHeight, halfHeight);
		currVec = currVec.add(rhs.getCenter());

		// find if the radius is less than that vector's norm
		var shortestDistance = currVec.subtract(this.pos).norm();
		if(shortestDistance < this.radius) {
			return true;
		}
		else {
			return false;
		}
	}
	// circle and circle collision
	else if(rhs.type === "CIRCLE") {
		var distanceBetween = this.pos.distance(rhs.pos);
		if(distanceBetween < (this.radius + rhs.radius)) {
			return true;
		}
		else {
			return false;
		}
	}
	else {
		throw "Error in Circle.prototype.collidedWith()!";
	}
};

module.exports = Circle;
