var Util = require("./util");
var Circle = require("./circle");
var Vector = require("./vector");
var DynamicObject = require("./dynamic_object");
var Color = require("./color");

var Particle = function (id, pos, vel, radius, color, options) {
	var lifetime = options.lifetime;
	var fade = options.fade;
	var shrink = options.shrink;

	var collision = new Circle(pos, radius);

	this.initialRadius = radius;
	this.type = "PARTICLE";
	this.color = color;

	// allows the fading or shrinking of particles based on their lifetime (in iterations)
	if(lifetime) {
		this.lifetime = lifetime;
		this.fade = fade || false;
		this.shrink = shrink || false;

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

Particle.prototype.handleLifetime = function () {
	var lifetime = this.lifetime;
	var startIter = this.startIter;
	var endIter = this.endIter;
	var currIter = SpaceDefender.game.engine.currIter;

	if(lifetime) {
		var currPercent = (endIter - currIter) / lifetime;
		// is it still alive?
		if(currPercent > 0) {
			// fade it out
			if(this.fade) {
				// add in the transparency
				var tempColorObj = new Color(this.color);
				tempColorObj.trans = currPercent;
				this.color = tempColorObj.toString();
			}
			// shrink it out of existence
			if(this.shrink) {
				this.collision.radius = this.initialRadius * currPercent;
			}
		}
		else {
			SpaceDefender.game.engine.removeObject(this);
		}
	}
};

Particle.prototype.update = function () {
	this.handleLifetime();
	DynamicObject.prototype.update.call(this);
};

module.exports = Particle;
