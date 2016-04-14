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
	},

	randRGB: function(initial, colorDelta) {
		var red = parseInt(initial.slice(1, 3), 16);
		var green = parseInt(initial.slice(3, 5), 16);
		var blue = parseInt(initial.slice(5, 7), 16);

		var deltaRed = Math.round(Util.rand(colorDelta.red.min, colorDelta.red.max));
		var deltaGreen = Math.round(Util.rand(colorDelta.green.min, colorDelta.green.max));
		var deltaBlue = Math.round(Util.rand(colorDelta.blue.min, colorDelta.blue.max));
		red = this.clamp(red + deltaRed, 0, 255);
		green = this.clamp(green + deltaGreen, 0, 255);
		blue = this.clamp(blue + deltaBlue, 0, 255);
		return rgb = "rgb(" + [red.toString(), green.toString(), blue.toString()].join(",") + ")";
	}
};

module.exports = Util;
