var Vector = function (options) {
	// default to the zero Vector
	var defaults = { x: 0, y: 0 };
	options = $.extend({}, defaults, options);

	// can either initialize via norm and dir or x and y components
	if(options.norm && options.dir) {
		this.x = options.dir.x * options.norm;
		this.y = options.dir.y * options.norm;
	}
	else {
		this.x = options.x;
		this.y = options.y;
	}
};

Vector.prototype.dot = function (rhsVec) {
	var dot = this.x * rhsVec.x + this.y * rhsVec.y;
	return dot;
};

Vector.prototype.norm = function () {
	return Math.sqrt(this.dot(this));
};

Vector.prototype.normalize = function () {
	var retVec = new Vector();
	var norm = this.norm();

	// if the current Vector is the zero Vector, return another zero Vector
	if(norm !== 0) {
		retVec.x = (this.x / norm);
		retVec.y = (this.y / norm);
	}

	return retVec;
};

Vector.prototype.add = function (rhsVec) {
	var retVec = new Vector();
	retVec.x = this.x + rhsVec.x;
	retVec.y = this.y + rhsVec.y;
	return retVec;
};

Vector.prototype.subtract = function (rhsVec) {
	var retVec = new Vector();
	retVec.x = this.x - rhsVec.x;
	retVec.y = this.y - rhsVec.y;
	return retVec;
};

Vector.prototype.distance = function (rhsVec) {
	var diffVec = rhsVec.subtract(this);
	return diffVec.norm();
};

Vector.prototype.dup = function () {
	return new Vector({ x: this.x, y: this.y });
};

Vector.prototype.scale = function (scalar) {
	return new Vector({ x: scalar * this.x, y: scalar * this.y });
};

module.exports = Vector;
