
var request = require('request');
var NodeHelper = require("node_helper");

module.exports = NodeHelper.create({

	start: function() {
		console.log("Starting my node helper: " + this.name);
	},

	socketNotificationReceived: function(notification, payload) {
		var self = this;
		//console.log("Notification: " + notification + " Payload: " + payload);

		if(notification === "GET_SOLAR") {
			var enlightenUrl = payload.config.url + "site/" + payload.config.siteId + "/overview.jason?&api_key=" + payload.config.apiKey;
            request(enlightenUrl, function (error, response, body) {
                if (!error && response.statusCode == 200) {
					var jsonData = JSON.parse(body);
				    self.sendSocketNotification("SOLAR_DATA", jsonData);
				}
			});
		}
	},
});
