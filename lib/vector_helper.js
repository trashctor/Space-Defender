var Util = require("./util");
var Vector = require("./vector");

var VectorHelper = {
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
		var randDir = VectorHelper.randDir();
		return new Vector({ norm: randNorm, dir: randDir });
	}
};

module.exports = VectorHelper;
