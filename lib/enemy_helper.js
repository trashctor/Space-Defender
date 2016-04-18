var Util = require("./util");
var Vector = require("./vector");

var EnemyHelper = {
	getClosestPlayer: function(thisCenter, closestTargetDist) {
		var closestTarget = null;
		closestTargetDist = closestTargetDist || 1000000;
		var playerObjects = SpaceDefender.game.engine.playerObjects;

		$.each(playerObjects, function (id, playerObj) {
			var playerCenter = playerObj.collision.getCenter();
			var distFromPlayer = thisCenter.distance(new Vector({ x: playerCenter.x, y: playerCenter.y }));

			if(distFromPlayer < closestTargetDist) {
				closestTarget = playerObj;
				closestTargetDist = distFromPlayer;
			}
		});

		return closestTarget;
	}
};

module.exports = EnemyHelper;
