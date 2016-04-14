var BaseObject = require("./base_object");
var Util = require("./util");

var DynamicObject = function (id, collision, vel, options) {
	this.vel = vel;
	BaseObject.call(this, id, collision, options);
};

Util.inherits(BaseObject, DynamicObject);

DynamicObject.prototype.update = function () {
	this.move();
	BaseObject.prototype.update.call(this);
};

DynamicObject.prototype.move = function () {
	this.collision.pos = this.collision.pos.add(this.vel);
};

module.exports = DynamicObject;
