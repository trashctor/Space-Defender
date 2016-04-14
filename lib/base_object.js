var Circle = require("./circle");
var AABB = require("./aabb");
var Vector = require("./vector");

var BaseObject = function (id, collision, options) {
	this.id = id;
	this.collision = collision;

	if(options) {
		if(options.image) {
			this.image = options.image;
			this.rotation = options.rotation || 0;
		}
	}
};

BaseObject.prototype.draw = function (ctx) {
	ctx.fillStyle = this.color;

	if(this.image) {
		if(this.collision.type === "AABB") {
			// stretch the image to the collision size
			ctx.drawImage(this.image, this.collision.pos.x, this.collision.pos.y, this.collision.size.x, this.collision.size.y);
		}
		else if(this.collision.type === "CIRCLE") {
			ctx.save();
			ctx.translate(-this.collision.radius, -this.collision.radius);
			ctx.drawImage(this.image, this.collision.pos.x, this.collision.pos.y, this.collision.radius * 2, this.collision.radius * 2);
			ctx.restore();
		}
		else {
			throw "Unknown collision type in BaseObject.prototype.draw!";
		}
	}
	else if(this.collision instanceof Circle) {
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

BaseObject.prototype.update = function () {
	var width = SpaceDefender.game.engine.width;
	var height = SpaceDefender.game.engine.height;
	var topLeft = new Vector({ x: -width, y: -height });
	var size = new Vector({ x: width * 2, y: height * 2 });
	var worldBox = new AABB(topLeft, size);

	// destroy any object that flies outside the world
	if(!this.collision.collidedWith(worldBox)) {
		SpaceDefender.game.engine.removeObject(this);
	}
};

module.exports = BaseObject;
