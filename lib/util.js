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

	clamp: function (value, min, max) {
		return Math.max(min, Math.min(max, value));
	}
};

module.exports = Util;
