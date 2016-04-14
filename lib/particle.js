var Util = require("./util");
var Circle = require("./circle");
var Vector = require("./vector");
var DynamicObject = require("./dynamic_object");

var Particle = function (id, pos, vel, radius, color) {
	var collision = new Circle(pos, radius);

	this.type = "PARTICLE";
	this.color = color;

	DynamicObject.call(this, id, collision, vel);
};

Util.inherits(DynamicObject, Particle);

Particle.prototype.draw = function(ctx) {
	ctx.fillStyle = this.color;

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
};

Particle.prototype.update = function () {
	DynamicObject.prototype.update.call(this);
};

module.exports = Particle;
