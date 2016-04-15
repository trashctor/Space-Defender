var Vector = require("./vector");
var Circle = require("./circle");
var AABB = require("./aabb");
var BaseObject = require("./base_object");
var DynamicObject = require("./dynamic_object");
var Util = require("./util");
var VectorHelper = require("./vector_helper");
var ColorHelper = require("./color_helper");

var PlayerShip = require("./player_ship");
var SpaceRock = require("./space_rock");
var Particle = require("./particle");
var EnemyShip = require("./enemy_ship");
var EnemyTurret = require("./enemy_turret");

var Engine = function (width, height) {
	// space above the top of the screen to spawn in new enemy objects
	this.heightSpawn = -(height / 4);

	this.width = width;
	this.height = height;

	this.enemyObjects = {};
	this.friendlyObjects = {};
	this.playerObjects = {};
	this.backgroundObjects = {};

	// used for generating unique object ids
	this.currId = 0;

	// used for getting the current iteration
	this.currIter = 0;
};

Engine.prototype.gameOver = function () {
	return Object.keys(this.playerObjects).length === 0;
};

Engine.prototype.setupGame = function (twoPlayer) {
	// create player ship
	var ship1 = new PlayerShip(1, new Vector({ x: this.width / 3, y: this.height / 2 }));
	this.insertObject(ship1);

	if(twoPlayer) {
		var ship2 = new PlayerShip(2, new Vector({ x: 2 * (this.width / 3), y: this.height / 2 }));
		this.insertObject(ship2);
	}
};

Engine.prototype.allObjects = function () {
	return $.extend({}, this.backgroundObjects, this.enemyObjects, this.friendlyObjects, this.playerObjects);
};

Engine.prototype.getUniqueId = function () {
	return ++this.currId;
};

Engine.prototype.createRandCollisionShape = function () {
	var randPos = VectorHelper.randPos(this.width, this.height);

	if(Util.rand(-1, 1) < 0) {
		var size = new Vector({ x: Util.rand(20, 40), y: Util.rand(20, 40) });
		return new AABB(randPos, size);
	}
	else {
		var radius = Util.rand(10, 20);
		return new Circle(randPos, radius);
	}
};

Engine.prototype.insertObject = function (obj) {
	switch(obj.type) {
		// use the object's unique id for quick object retrieval
		case "SPACE_ROCK":
		case "ENEMY_SHIP":
		case "ENEMY_SHIP_SHOT":
		case "ENEMY_TURRET":
		case "ENEMY_TURRET_SHOT":
			this.enemyObjects[obj.id] = obj;
			break;
		case "PLAYER_SHOT":
		case "PLAYER_MISSILE":
			this.friendlyObjects[obj.id] = obj;
			break;
		case "PLAYER_SHIP":
			this.playerObjects[obj.id] = obj;
			break;
		case "PARTICLE":
			this.backgroundObjects[obj.id] = obj;
			break;
		default:
			throw "Unknown object type in Engine.prototype.insertObject";
	}
};

Engine.prototype.removeObject = function (obj) {
	// only one object instance should exist across the collections
	delete this.enemyObjects[obj.id];
	delete this.friendlyObjects[obj.id];
	delete this.backgroundObjects[obj.id];
	delete this.playerObjects[obj.id];
};

Engine.prototype.spawnSpaceRock = function () {
	var randPos = new Vector({ x: Util.rand(0, this.width), y: this.heightSpawn });
	var vel = new Vector({ x: 0, y: 2 });
	var radius = Util.rand(20, 30);
	var rock = new SpaceRock(this.getUniqueId(), randPos, vel, radius);
	this.insertObject(rock);
};

Engine.prototype.spawnBackgroundParticle = function () {
	var velArray = [4, 8, 16];
	var yComponent = velArray[Math.floor(Math.random() * velArray.length)];

	var id = this.getUniqueId();
	var randPos = new Vector({ x: Util.rand(0, this.width), y: this.heightSpawn });
	var vel = new Vector({ x: 0, y: yComponent });
	var radius = Util.rand(1, 3);

	var initialColor = "#e8cf27";
	var colorDelta = { red: {min: 0, max: 25}, green: {min: -200, max: 25}, blue: {min: 0, max: 0} };
	var color = ColorHelper.randRGB(initialColor, colorDelta);

	var options = { lifetime: 150, fade: true };

	var particle = new Particle(id, randPos, vel, radius, color, options);
	this.insertObject(particle);
};

Engine.prototype.spawnEnemyShip = function () {
	var randPos = new Vector({ x: Util.rand(0, this.width), y: this.heightSpawn });
	var enemyShip = new EnemyShip(this.getUniqueId(), randPos);
	this.insertObject(enemyShip);
};

Engine.prototype.spawnEnemyTurret = function () {
	var randPos = new Vector({ x: Util.rand(0, this.width), y: this.heightSpawn });
	var enemyTurret = new EnemyTurret(this.getUniqueId(), randPos);
	this.insertObject(enemyTurret);
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

Engine.prototype.spawnEasy = function (multiplier) {
	var iterPerSec = 1000 / SpaceDefender.game.loopTime;

	if(this.currIter % Math.round(iterPerSec * 1 / multiplier) === 0) {
		this.spawnSpaceRock();
	}
};

Engine.prototype.spawnMedium = function (multiplier) {
	var iterPerSec = 1000 / SpaceDefender.game.loopTime;

	if(this.currIter % Math.round(iterPerSec * 1 / multiplier) === 0) {
		this.spawnSpaceRock();
	}

	if(this.currIter % Math.round(iterPerSec * 6 / multiplier) === 0) {
		this.spawnEnemyShip();
	}
};

Engine.prototype.spawnHard = function (multiplier) {
	var iterPerSec = 1000 / SpaceDefender.game.loopTime;

	if(this.currIter % Math.round(iterPerSec * 1 / multiplier) === 0) {
		this.spawnSpaceRock();
	}

	if(this.currIter % Math.round(iterPerSec * 6 / multiplier) === 0) {
		this.spawnEnemyShip();
	}

	if(this.currIter % Math.round(iterPerSec * 18 / multiplier) === 0) {
		this.spawnEnemyTurret();
	}
};

Engine.prototype.spawnTest = function (multiplier) {
	var iterPerSec = 1000 / SpaceDefender.game.loopTime;

	if(this.currIter % Math.round(iterPerSec * 1 / multiplier) === 0) {
		this.spawnSpaceRock();
	}

	if(this.currIter % Math.round(iterPerSec * 6 / multiplier) === 0) {
		this.spawnEnemyShip();
	}

	if(this.currIter % Math.round(iterPerSec * 18 / multiplier) === 0) {
		this.spawnEnemyTurret();
	}
};

Engine.prototype.spawnObjects = function () {
	var iterPerSec = 1000 / SpaceDefender.game.loopTime;

	if(this.currIter % Math.round(iterPerSec * 0.1) === 0) {
		this.spawnBackgroundParticle();
	}

	this.spawnTest(1);
};

Engine.prototype.updateObjects = function () {
	$.each(this.allObjects(), function (id, obj) {
		obj.update();
	});
};

Engine.prototype.update = function () {
	if(!this.gameOver()) {
		this.spawnObjects();
		this.updateCollision();
	}

	this.updateObjects();
	this.currIter++;
};

Engine.prototype.render = function (ctx) {
	ctx.clearRect(0, 0, this.width, this.height);

	// draw the background
	ctx.fillStyle = "#08051c";
	ctx.fillRect(0, 0, this.width, this.height);

	// draw the objects, order matters
	var renderArr = [this.backgroundObjects, this.enemyObjects, this.friendlyObjects, this.playerObjects];

	$.each(renderArr, function (idx, objects) {
		$.each(objects, function (id, obj) {
			obj.draw(ctx);
		});
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
