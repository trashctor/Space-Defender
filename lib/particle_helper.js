var Particle = require("./particle");

var Util = require("./util");
var ColorHelper = require("./color_helper");
var VectorHelper = require("./vector_helper");

var ParticleHelper = {
	createExplosion: function (pos, color, options) {
		var defaults = {
			distanceMin: 40,
			distanceMax: 100,
			radiusMin: 5,
			radiusMax: 15,
			speedMin: 5,
			speedMax: 10,
			numParticles: 35,
			colorDelta: { red: {min: -25, max: 25}, green: {min: -25, max: 25}, blue: {min: -25, max: 25} }
		};
		options = $.extend({}, defaults, options);

		for(var i = 0; i < options.numParticles; i++) {
			// choose random values
			var distance = Util.rand(options.distanceMin, options.distanceMax);
			var radius = Util.rand(options.radiusMin, options.radiusMax);
			var speed = Util.rand(options.speedMin, options.speedMax);
			var randColor = ColorHelper.randRGB(color, options.colorDelta);

			// calculate the lifetime
			var randVec = VectorHelper.randVec(options.speedMin, options.speedMax);
			var lifetime = (distance / randVec.norm());

			var id = SpaceDefender.game.engine.getUniqueId();
			var particleOptions = {lifetime: lifetime, fade: true, shrink: true};

			var particle = new Particle(id, pos, randVec, radius, randColor, particleOptions);

			// insert it
			SpaceDefender.game.engine.insertObject(particle);
		}
	}
};

module.exports = ParticleHelper;
