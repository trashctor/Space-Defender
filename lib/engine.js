var Vector = require("./vector");
var Circle = require("./circle");
var AABB = require("./aabb");
var BaseObject = require("./base_object");
var DynamicObject = require("./dynamic_object");
var Util = require("./util");
var PlayerShip = require("./player_ship");

var Engine = function (width, height) {
	this.width = width;
	this.height = height;
	this.enemyObjects = {};
	this.friendlyObjects = {};
	this.playerObjects = {}
	this.backgroundObjects = {};
	this.currId = 0;
};

Engine.prototype.setupGame = function (twoPlayer) {
	// create player ship
	var ship1 = new PlayerShip(1, new Vector({ x: this.width / 3, y: this.height / 2 }));
	this.insertObject(this.playerObjects, ship1);

	if(twoPlayer) {
		var ship2 = new PlayerShip(2, new Vector({ x: 2 * (this.width / 3), y: this.height / 2 }));
		this.insertObject(this.playerObjects, ship2);
	}
};

Engine.prototype.allObjects = function () {
	return $.extend({}, this.enemyObjects, this.friendlyObjects, this.backgroundObjects, this.playerObjects);
};

Engine.prototype.getUniqueId = function () {
	return ++this.currId;
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
	delete this.enemyObjects[obj.id];
	delete this.friendlyObjects[obj.id];
	delete this.backgroundObjects[obj.id];
	delete this.playerObjects[obj.id];
};

Engine.prototype.spawnObject = function (hash) {
	var randCollisionShape = this.createRandCollisionShape();
	var randPos = Util.randPos(this.width, this.height);
	var size = new Vector({ x: Util.rand(20, 40), y: Util.rand(20, 40) });

	var randVec = Util.randVec(1, 2);
	var randBaseObj = new DynamicObject(this.getUniqueId(), randCollisionShape, randVec);
	this.insertObject(hash, randBaseObj);
};

Engine.prototype.updateCollision = function () {
	var collidedObjects = [];

	var allyObjects = $.extend({}, this.friendlyObjects, this.playerObjects);
	var enemyObjects = this.enemyObjects;

	$.each(enemyObjects, function (id, enemyObj) {
		$.each(allyObjects, function (id, allyObj) {
			if(enemyObj.collidedWith(allyObj)) {
				collidedObjects.push([enemyObj, allyObj]);
			}
		});
	});

	for(var i = 0; i < collidedObjects.length; i++) {
		var enemyObj = collidedObjects[i][0];
		var allyObj = collidedObjects[i][1];

		enemyObj.handleCollision(allyObj);
		allyObj.handleCollision(enemyObj);
	}
};

Engine.prototype.updateObjects = function () {
	$.each(this.allObjects(), function (id, obj) {
		obj.update();
	});
};

Engine.prototype.update = function () {
	// this.spawnObject(this.enemyObjects);
	// this.spawnObject(this.friendlyObjects);
	this.updateCollision();
	this.updateObjects();
};

Engine.prototype.render = function (ctx) {
	ctx.clearRect(0, 0, this.width, this.height);

	// draw the background
	ctx.fillStyle = "#838fde";
	ctx.fillRect(0, 0, this.width, this.height);

	// draw the objects
	$.each(this.allObjects(), function (id, obj) {
		obj.draw(ctx);
	});
};

Engine.prototype.reset = function () {
	this.enemyObjects = {};
	this.friendlyObjects = {};
	this.playerObjects = {};
	this.backgroundObjects = {};
	this.currId = 0;
};

module.exports = Engine;
