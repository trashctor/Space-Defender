var Util = require("./util");
var Circle = require("./circle");
var Vector = require("./vector");
var DynamicObject = require("./dynamic_object");
var Color = require("./color");

var Particle = function (id, pos, vel, radius, color, lifetime, fade) {
	var collision = new Circle(pos, radius);

	this.type = "PARTICLE";
	this.color = color;

	// allows the fading or shrinking of particles based on their lifetime (in iterations)
	if(lifetime) {
		this.lifetime = lifetime;
		this.fade = fade;

		this.startIter = SpaceDefender.game.engine.currIter;
		this.endIter = this.startIter + this.lifetime;
	}

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
	// if(this.lifetime) {
	// 	var currIter = SpaceDefender.game.engine.currIter;
	// 	var currPercent = (currIter - startIter) / this.lifetime;
	//
	// 	if(this.fade) {
	// 		currPercent
	//
	// 	}
	// 	else {
	//
	// 	}
	// }

	DynamicObject.prototype.update.call(this);
};

module.exports = Particle;
