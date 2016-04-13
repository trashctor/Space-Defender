var Util = require("./util");
var AABB = require("./aabb");
var Vector = require("./vector");
var DynamicObject = require("./dynamic_object");

var PlayerShip = function (id, pos) {
	if(id === 1) {
		var imageShip = $("#ship-1")[0];
	}
	else if(id === 2) {
		var imageShip = $("#ship-2")[0];
	}
	else {
		throw "Invalid ship id!";
	}

	var size = new Vector({ x: imageShip.width, y: imageShip.height });
	var collision = new AABB(pos, size);
	var vel = new Vector();

	DynamicObject.call(this, id, collision, vel, imageShip);
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

PlayerShip.prototype.handleControls = function () {
	if(this.id === 1) {
		if(key.isPressed("w")) {
			this.vel.y -= .75;
		}
		if(key.isPressed("s")) {
			this.vel.y += .75;
		}
		if(key.isPressed("a")) {
			this.vel.x -= .75;
		}
		if(key.isPressed("d")) {
			this.vel.x += .75;
		}
	}
	else if(this.id === 2) {
		if(key.isPressed("8")) {
			this.vel.y -= .75;
		}
		if(key.isPressed("5")) {
			this.vel.y += .75;
		}
		if(key.isPressed("4")) {
			this.vel.x -= .75;
		}
		if(key.isPressed("6")) {
			this.vel.x += .75;
		}
	}
};

PlayerShip.prototype.update = function () {
	this.vel = this.vel.scale(.9);

	this.handleControls();

	// only move if the move will not clip with the game boundary
	var movePos = this.collision.pos.add(this.vel);
	var collisionObj = this.outsideBoundary(movePos, this.collision.size);
	this.handleBoundaryCollision(collisionObj);
	this.move();
};

module.exports = PlayerShip;
