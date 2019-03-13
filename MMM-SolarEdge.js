/*
* Magic Mirror module for displaying SolarEdge data
* By Rex Markesteijn
* MIT Licensed

Updated for newer Solaredge API
* Chris Weiss 2019-03
*/

Module.register("MMM-SolarEdge",{
    // Default module config.
    defaults: {
        url: "https://monitoringapi.solaredge.com/",
        apiKey: "", //Enter API key
        siteId: "", //site id
	    refInterval: 1000 * 60 * 10, //10 minutes leaves some requests open on the 5 minute API limit
        basicHeader: false,
    },

    start: function() {
        Log.info("Starting module: " + this.name);
        this.titles = ["Current Power:", "Daily Energy:", "Montly Energy:", "Yearly Energy:", "Lifetime Energy:"];
	      this.suffixes = ["Watts", "kWh", "kWh", "MWh", "MWh"];
	      this.results = ["Loading", "Loading", "Loading", "Loading", "Loading"];
        this.loaded = false;
        this.getSolarData();

        if (this.config.basicHeader) {
            this.data.header = 'SolarEdge';
        }

        var self = this;
        //Schedule updates
        setInterval(function() {
            self.getSolarData();
            self.updateDom();
        }, this.config.refInterval);
    },



    //Import additional CSS Styles
    getStyles: function() {
        return ['solar.css']
    },

    //Contact node helper for solar data
    getSolarData: function() {
        this.sendSocketNotification("GET_SOLAR", {
            config: this.config
          });
    },

    //Handle node helper response
    socketNotificationReceived: function(notification, payload) {
        if (notification === "SOLAR_DATA") {
            console.log("got Solar data");
            //{"overview":{"lastUpdateTime":"2019-03-10 16:54:51","lifeTimeData":{"energy":38513.0},"lastYearData":{"energy":38376.0},"lastMonthData":{"energy":38376.0},"lastDayData":{"energy":18138.0},"currentPower":{"power":833.86755},"measuredBy":"INVERTER"}}
            this.results[0] = payload.overview.currentPower.power.toFixed(2);
            this.results[1] = payload.overview.lastDayData.energy.toFixed(2);
  		    this.results[2] = (payload.overview.lastMonthData.energy / 1000).toFixed(2);
            this.results[3] = (payload.overview.lastYearData.energy / 1000).toFixed(1);
  		    this.results[4] = (payload.overview.lifeTimeData.energy / 1000).toFixed(1);

            this.loaded = true;
          	this.updateDom(1000);
        }
    },

    // Override dom generator.
    getDom: function() {

        var wrapper = document.createElement("div");
        if (this.config.apiKey === "" || this.config.userId === "" || this.config.systemId === "") {
            wrapper.innerHTML = "Missing configuration.";
            return wrapper;
        }

        //Display loading while waiting for API response
        if (!this.loaded) {
      	    wrapper.innerHTML = "Loading...";
            return wrapper;
      	}

        var tb = document.createElement("table");

        if (!this.config.basicHeader) {
            var imgDiv = document.createElement("div");
            var img = document.createElement("img");
            img.src = "/modules/MMM-SolarEdge/solar_white.png";

            var sTitle = document.createElement("p");
            sTitle.innerHTML = "SolarEdge";
            sTitle.className += " thin normal";
            imgDiv.appendChild(img);
    	      imgDiv.appendChild(sTitle);

            var divider = document.createElement("hr");
            divider.className += " dimmed";
            wrapper.appendChild(imgDiv);
            wrapper.appendChild(divider);
        }

      	for (var i = 0; i < this.results.length; i++) {
        		var row = document.createElement("tr");

        		var titleTr = document.createElement("td");
        		var dataTr = document.createElement("td");

        		titleTr.innerHTML = this.titles[i];
        		dataTr.innerHTML = this.results[i] + " " + this.suffixes[i];

        		titleTr.className += " medium regular bright";
        		dataTr.classname += " medium light normal";

        		row.appendChild(titleTr);
        		row.appendChild(dataTr);

        		tb.appendChild(row);
      	}
        wrapper.appendChild(tb);

        //Enphase API attribution requirements
        var attrib = document.createElement("p");
        attrib.innerHTML = "Powered by SolarEdge Monitoring";
	      attrib.id = "attribution";
	      attrib.className += "light";
        wrapper.appendChild(attrib);

        return wrapper;
    }
});
