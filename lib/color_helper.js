var Util = require("./util");
var Color = require("./color");

var ColorHelper = {
	randRGB: function(colorString, colorDelta) {
		var color = new Color(colorString);
		var randColor = new Color();

		randColor.red = Math.round(Util.rand(colorDelta.red.min, colorDelta.red.max));
		randColor.green = Math.round(Util.rand(colorDelta.green.min, colorDelta.green.max));
		randColor.blue = Math.round(Util.rand(colorDelta.blue.min, colorDelta.blue.max));

		return color.combine(randColor).toString();
	}
};

module.exports = ColorHelper;
