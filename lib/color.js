var Util = require("./util");

var Color = function (colorString) {
	this.red = 0;
	this.green = 0;
	this.blue = 0;
	this.trans = 1;

	var elementArr;

	if(colorString) {
		if(colorString.search("#") !== -1) {
			this.red = parseInt(colorString.slice(1, 3), 16);
			this.green = parseInt(colorString.slice(3, 5), 16);
			this.blue = parseInt(colorString.slice(5, 7), 16);
		}
		else if(colorString.search("rgba(") !== -1) {
			elementArr = colorString.substring(5, colorString.length - 1).split(",");

			this.red = parseInt(elementArr[0], 10);
			this.green = parseInt(elementArr[1], 10);
			this.blue = parseInt(elementArr[2], 10);
			this.trans = parseInt(elementArr[3], 10);
		}
		else if(colorString.search("rgb(") !== -1) {
			elementArr = colorString.substring(4, colorString.length - 1).split(",");

			this.red = parseInt(elementArr[0], 10);
			this.green = parseInt(elementArr[1], 10);
			this.blue = parseInt(elementArr[2], 10);
		}
		else {
			throw "Invalid color format!";
		}
	}
};

Color.prototype.combine = function (rhsColor) {
	var newColor = new Color();
	newColor.red = this.red + rhsColor.red;
	newColor.green = this.green + rhsColor.green;
	newColor.blue = this.blue + rhsColor.blue;
	newColor.trans = (this.trans + rhsColor.trans) / 2;
	return newColor;
};

Color.prototype.toString = function (RGBString) {
	var red = Util.clamp(this.red, 0, 255);
	var green = Util.clamp(this.green, 0, 255);
	var blue = Util.clamp(this.blue, 0, 255);
	var trans = Util.clamp(this.trans, 0, 1);

	return "rgba(" + [red.toString(), green.toString(), blue.toString(), trans.toString()].join(",") + ")";
};

module.exports = Color;
