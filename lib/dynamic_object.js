var BaseObject = require("./base_object");
var Util = require("./util");

var DynamicObject = function (id, collision, vel, image) {
	BaseObject.call(this, id, collision, image);
	this.vel = vel;
};

Util.inherits(BaseObject, DynamicObject);

DynamicObject.prototype.update = function () {
	debugger
	this.move();
};

DynamicObject.prototype.move = function () {
	BaseObject.prototype.update.call(this);
	this.collision.pos = this.collision.pos.add(this.vel);
};

module.exports = DynamicObject;
