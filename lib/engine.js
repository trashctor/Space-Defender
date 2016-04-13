var Vector = require("./vector");
var Circle = require("./circle");
var AABB = require("./aabb");
var BaseObject = require("./base_object");
var DynamicObject = require("./dynamic_object");
var Util = require("./util");

var Engine = function (width, height) {
	this.width = width;
	this.height = height;
	this.collisionObjects = {};
	this.backgroundObjects = {};
	this.currId = 0;
};

Engine.prototype.getUniqueId = function () {
	return ++this.currId;
};

Engine.prototype.objectsEach = function (hash, callback) {
	for(var id in hash) {
		if(hash.hasOwnProperty(id)) {
			var currObj = hash[id];
			callback(currObj);
		}
	}
};

Engine.prototype.createRandCollisionShape = function () {
	var randPos = Util.randPos(this.width, this.height);

	if(Util.rand(-1, 1) < 0) {
		var size = new Vector({ x: Util.rand(20, 40), y: Util.rand(20, 40) });
		return new AABB(randPos, size);
	}
	else {
		var radius = Util.rand(10, 20);
		return new Circle(randPos, radius);
	}
};

Engine.prototype.insertObject = function (hash, obj) {
	// use the object's unique id for quick object retrieval
	hash[obj.id] = obj;
};

Engine.prototype.removeObject = function (obj) {
	// only one object instance should exist across the collections
	delete this.collisionObjects[obj.id];
	delete this.backgroundObjects[obj.id];
};

Engine.prototype.spawnObjects = function () {
	var randCollisionShape = this.createRandCollisionShape();
	// var randCollisionShape = new Circle(Util.randPos(640, 480), 10);

	// var randBaseObj = new BaseObject(this.getUniqueId(), randCollisionShape);
	// this.insertObject(this.collisionObjects, randBaseObj);

	var randVec = Util.randVec(1, 2);
	var randDynamicObj = new DynamicObject(this.getUniqueId(), randCollisionShape, randVec);
	this.insertObject(this.collisionObjects, randDynamicObj);
};

Engine.prototype.updateCollision = function () {
	var collidedObjects = [];
	var collisionObjects = this.collisionObjects;
	var keys = Object.keys(collisionObjects).sort();

	for(var i = 0; i < keys.length; i++) {
		for(var j = i + 1; j < keys.length; j++) {
			var iKey = keys[i];
			var jKey = keys[j];

			var lhs = collisionObjects[iKey];
			var rhs = collisionObjects[jKey];

			if(lhs.collidedWith(rhs)) {
				collidedObjects.push({ lhs: lhs, rhs: rhs });
			}
		}
	}

	collidedObjects.forEach(function(pair) {
		pair.lhs.handleCollision(pair.rhs);
		pair.rhs.handleCollision(pair.lhs);
	});
};

Engine.prototype.updateObjects = function () {
	this.objectsEach(this.collisionObjects, function (obj) {
		obj.update();
	});
};

Engine.prototype.update = function () {
	this.spawnObjects();
	this.updateCollision();
	this.updateObjects();
};

Engine.prototype.render = function (ctx) {
	ctx.clearRect(0, 0, this.width, this.height);

	// draw the background
	ctx.fillStyle = "#78a2d9";
	ctx.fillRect(0, 0, this.width, this.height);

	// draw the objects
	this.objectsEach(this.collisionObjects, function (obj) {
		obj.draw(ctx);
	});
};

Engine.prototype.reset = function () {
	this.collisionObjects = {};
	this.currId = 0;
};

module.exports = Engine;
