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
var EnemyDestroyer = require("./enemy_destroyer");

var Engine = function (width, height) {
	// space above the top of the screen to spawn in new enemy objects
	this.heightSpawn = -(height / 4);

	this.width = width;
	this.height = height;

	this.enemyObjects = {};
	this.friendlyObjects = {};
	this.playerObjects = {};
	this.backgroundObjects = {};
	this.powerupObjects = {};

	this.score = 0;

	// used for generating unique object ids (first two are reserved for players)
	this.currId = 3;

	// used for getting the current iteration (used for time)
	this.currIter = 0;
};

Engine.prototype.gameOver = function () {
	return Object.keys(this.playerObjects).length === 0;
};

Engine.prototype.setupGame = function (isTwoPlayers) {
	// create player ship
	var ship1 = new PlayerShip(1, new Vector({ x: this.width / 3, y: this.height / 2 }));
	this.insertObject(ship1);

	if(isTwoPlayers) {
		var ship2 = new PlayerShip(2, new Vector({ x: 2 * (this.width / 3), y: this.height / 2 }));
		this.insertObject(ship2);
	}
};

Engine.prototype.allObjects = function () {
	return $.extend({}, this.backgroundObjects, this.powerupObjects, this.enemyObjects, this.friendlyObjects, this.playerObjects);
};

Engine.prototype.getUniqueId = function () {
	return this.currId++;
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
		case "ENEMY_DESTROYER":
		case "ENEMY_MISSILE":
			this.enemyObjects[obj.id] = obj;
			break;
		case "HP_POWERUP":
		case "SUPER_POWERUP":
		case "BOMB_POWERUP":
			this.powerupObjects[obj.id] = obj;
			break;
		case "PLAYER_SHOT":
		case "PLAYER_MISSILE":
		case "PLAYER_MICRO_MISSILE":
		case "PLAYER_BOMB":
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
	switch(obj.type) {
		case "SPACE_ROCK":
		case "ENEMY_SHIP":
		case "ENEMY_SHIP_SHOT":
		case "ENEMY_TURRET":
		case "ENEMY_TURRET_SHOT":
		case "ENEMY_DESTROYER":
		case "ENEMY_MISSILE":
			delete this.enemyObjects[obj.id];
			break;
		case "HP_POWERUP":
		case "SUPER_POWERUP":
		case "BOMB_POWERUP":
			delete this.powerupObjects[obj.id];
			break;
		case "PLAYER_SHOT":
		case "PLAYER_MISSILE":
		case "PLAYER_MICRO_MISSILE":
		case "PLAYER_BOMB":
			delete this.friendlyObjects[obj.id];
			break;
		case "PLAYER_SHIP":
			delete this.playerObjects[obj.id];
			break;
		case "PARTICLE":
			delete this.backgroundObjects[obj.id];
			break;
		default:
			throw "Unknown object type in Engine.prototype.removeObject";
	}
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

Engine.prototype.spawnDestroyer = function () {
	var randPos = new Vector({ x: Util.rand(0, this.width), y: this.heightSpawn });
	var enemyTurret = new EnemyDestroyer(this.getUniqueId(), randPos);
	this.insertObject(enemyTurret);
};

Engine.prototype.updateCollision = function () {
	var collidedObjects = [];

	var allyObjects = $.extend({}, this.friendlyObjects, this.playerObjects);
	var enemyObjects = this.enemyObjects;
	var playerObjects = this.playerObjects;
	var powerupObjects = this.powerupObjects;

	$.each(enemyObjects, function (id, enemyObj) {
		$.each(allyObjects, function (id, allyObj) {
			if(enemyObj.collidedWith(allyObj)) {
				collidedObjects.push([enemyObj, allyObj]);
			}
		});
	});

	$.each(powerupObjects, function (id, powerupObj) {
		$.each(playerObjects, function (id, playerObj) {
			if(powerupObj.collidedWith(playerObj)) {
				collidedObjects.push([powerupObj, playerObj]);
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
	if(this.currIter % Math.round(iterPerSec * 10 / multiplier) === 0) {
		this.spawnEnemyShip();
	}
	if(this.currIter % Math.round(iterPerSec * 18 / multiplier) === 0) {
		this.spawnEnemyTurret();
	}
};

Engine.prototype.spawnFinal = function (multiplier) {
	var iterPerSec = 1000 / SpaceDefender.game.loopTime;

	if(this.currIter % Math.round(iterPerSec * 1 / multiplier) === 0) {
		this.spawnSpaceRock();
	}
	if(this.currIter % Math.round(iterPerSec * 6 / multiplier) === 0) {
		this.spawnEnemyShip();
	}
	if(this.currIter % Math.round(iterPerSec * 10 / multiplier) === 0) {
		this.spawnEnemyShip();
	}
	if(this.currIter % Math.round(iterPerSec * 12 / multiplier) === 0) {
		this.spawnEnemyTurret();
	}
	if(this.currIter % Math.round(iterPerSec * 24 / multiplier) === 0) {
		this.spawnDestroyer();
	}
};

Engine.prototype.spawnObjects = function () {
	var iterPerSec = 1000 / SpaceDefender.game.loopTime;

	if(this.currIter % Math.round(iterPerSec * 0.1) === 0) {
		this.spawnBackgroundParticle();
	}

	if(this.currIter >= iterPerSec * 220) {
		this.spawnFinal(1.5);
	}
	else if(this.currIter >= iterPerSec * 140) {
		this.spawnFinal(1);
	}
	else if(this.currIter >= iterPerSec * 100) {
		this.spawnHard(1.5);
	}
	else if(this.currIter >= iterPerSec * 60) {
		this.spawnHard(1);
	}
	else if(this.currIter >= iterPerSec * 40) {
		this.spawnMedium(1.5);
	}
	else if(this.currIter >= iterPerSec * 20) {
		this.spawnMedium(1);
	}
	else if(this.currIter >= iterPerSec * 10) {
		this.spawnEasy(2);
	}
	else {
		this.spawnEasy(1);
	}
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

Engine.prototype.renderHealthBars = function (ctx) {
	var marginTop = this.height / 9;
	var marginLeftRight = this.width / 64;
	var barWidth = this.width / 64;
	var barHeight = this.height / 2;
	var player1 = this.playerObjects[1];
	var player2 = this.playerObjects[2];
	var lostPercent;

	if(player1) {
		lostPercent = 1 - (player1.currHealth / player1.maxHealth);

		ctx.fillStyle = "rgba(250,10,10,0.5)";
		ctx.fillRect(marginLeftRight, marginTop, barWidth, barHeight);
		ctx.fillStyle = "rgba(0,0,0,0.5)";
		ctx.fillRect(marginLeftRight, marginTop, barWidth, barHeight * lostPercent);
	}

	if(player2) {
		lostPercent = 1 - (player2.currHealth / player2.maxHealth);

		ctx.fillStyle = "rgba(250,10,10,0.5)";
		ctx.fillRect(this.width - marginLeftRight - barWidth, marginTop, barWidth, barHeight);
		ctx.fillStyle = "rgba(0,0,0,0.5)";
		ctx.fillRect(this.width - marginLeftRight - barWidth, marginTop, barWidth, barHeight * lostPercent);
	}
};

Engine.prototype.renderSuperBars = function (ctx) {
	var marginTop = this.height / 9;
	var marginLeftRight = 2 * this.width / 64;
	var barWidth = this.width / 128;
	var barHeight = this.height / 2;
	var player1 = this.playerObjects[1];
	var player2 = this.playerObjects[2];
	var lostPercent;

	if(player1) {
		lostPercent = 1 - (player1.currSuper / player1.maxSuper);

		ctx.fillStyle = "rgba(150, 0, 210, 0.5)";
		ctx.fillRect(marginLeftRight, marginTop, barWidth, barHeight);
		ctx.fillStyle = "rgba(0,0,0,0.5)";
		ctx.fillRect(marginLeftRight, marginTop, barWidth, barHeight * lostPercent);
	}

	if(player2) {
		lostPercent = 1 - (player2.currSuper / player2.maxSuper);

		ctx.fillStyle = "rgba(150, 0, 210, 0.5)";
		ctx.fillRect(this.width - marginLeftRight - barWidth, marginTop, barWidth, barHeight);
		ctx.fillStyle = "rgba(0,0,0,0.5)";
		ctx.fillRect(this.width - marginLeftRight - barWidth, marginTop, barWidth, barHeight * lostPercent);
	}
};

Engine.prototype.renderBombs = function (ctx) {
	var textWidth = this.width / 4;
	var marginTop = this.height / 18;
	var marginLeftRight = this.width / 5;
	var player1 = this.playerObjects[1];
	var player2 = this.playerObjects[2];

	ctx.font = "22px serif";
	ctx.textAlign = "center";
	ctx.fillStyle = "rgba(220,220,220,0.75)";

	if(player1) {
		ctx.fillText("Player 1 Bombs: " + player1.currBombs, marginLeftRight, marginTop, textWidth);
	}
	if(player2) {
		ctx.fillText("Player 2 Bombs: " + player2.currBombs, this.width - marginLeftRight, marginTop, textWidth);
	}
};

Engine.prototype.renderScore = function (ctx) {
	var textWidth = this.width / 4;
	var marginTop = this.height / 18;

	ctx.font = "bold 24px serif";
	ctx.textAlign = "center";
	ctx.fillStyle = "rgba(220,220,220,0.75)";
	ctx.fillText("Score: " + this.score, this.width / 2, marginTop, textWidth);
};

Engine.prototype.render = function (ctx) {
	// draw the background
	ctx.fillStyle = "#08051c";
	ctx.fillRect(0, 0, this.width, this.height);

	// draw the objects, order matters
	var renderArr = [this.backgroundObjects, this.powerupObjects, this.enemyObjects, this.friendlyObjects, this.playerObjects];

	$.each(renderArr, function (idx, objects) {
		$.each(objects, function (id, obj) {
			obj.draw(ctx);
		});
	});

	// draw the health bars and score
	this.renderHealthBars(ctx);
	this.renderSuperBars(ctx);
	this.renderBombs(ctx);
	this.renderScore(ctx);
};

Engine.prototype.reset = function () {
	this.enemyObjects = {};
	this.friendlyObjects = {};
	this.playerObjects = {};
	this.backgroundObjects = {};
	this.powerupObjects = {};
	this.currId = 3;
	this.currIter = 0;
	this.score = 0;
};

module.exports = Engine;
