var Vector = require("./vector");

var Util = {
	inherits: function (Base, Derived) {
		var Surrogate = function () {};
		Surrogate.prototype = Base.prototype;

		Derived.prototype = new Surrogate();
		Derived.prototype.constructor = Base;
	},

	rand: function(min, max) {
		var interval = max - min;
		return Math.random() * interval + min;
	},

	randPos: function (width, height) {
		return new Vector({ x: Math.random() * width, y: Math.random() * height });
	},

	randDir: function () {
		var randX = Util.rand(-1, 1);
		var randY = Util.rand(-1, 1);

		return new Vector({ x: randX, y: randY }).normalize();
	},

	randVec: function (minNorm, maxNorm) {
		var randNorm = Util.rand(minNorm, maxNorm);
		var randDir = Util.randDir();
		return new Vector({ norm: randNorm, dir: randDir });
	},

	clamp: function (value, min, max) {
		return Math.max(min, Math.min(max, value));
	}
};

module.exports = Util;
