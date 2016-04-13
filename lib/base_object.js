var Circle = require("./circle");
var AABB = require("./aabb");
var Vector = require("./vector");

var BaseObject = function (id, collision) {
	this.id = id;
	this.collision = collision;
};

BaseObject.prototype.draw = function (ctx) {
	ctx.fillStyle = "#1d0ed0";

	if(this.collision instanceof Circle) {
		ctx.beginPath();
		ctx.arc(
			this.collision.pos.x,
			this.collision.pos.y,
			this.collision.radius,
			0,
			2 * Math.PI,
			false
		);
		ctx.fill();
	}
	else {
		var pos = this.collision.pos;
		var size = this.collision.size;

		ctx.fillRect(pos.x, pos.y, size.x, size.y);
	}
};

BaseObject.prototype.collidedWith = function (rhsObj) {
	return this.collision.collidedWith(rhsObj.collision);
};

BaseObject.prototype.handleCollision = function (rhs) {
	SpaceDefender.game.engine.removeObject(this);
};

BaseObject.prototype.update = function () {
	var topLeft = new Vector();
	var size = new Vector({ x: 640, y: 480 });
	var worldBox = new AABB(topLeft, size);

	// destroy any object that flies outside the world
	if(!this.collision.collidedWith(worldBox)) {
		SpaceDefender.game.engine.removeObject(this);
	}
};

module.exports = BaseObject;
