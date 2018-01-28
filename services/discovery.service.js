"use strict";
const Discover = require("arp-discovery");

module.exports = {
	name: "discovery",
	/**
	 * Service settings
	 */
	settings: {

	},

	/**
	 * Service metadata
	 */
	metadata: {

	},

	/**
	 * Service dependencies
	 */
	//dependencies: ['miio'],

	/**
	 * Actions
	 */
	actions: {
	},

	/**
	 * Events
	 */
	events: {

	},

	/**
	 * Methods
	 */
	methods: {

	},

	/**
	 * Service created lifecycle event handler
	 */
	created() {
		this.options = {
			discover: {
				timeout:1000,
				flood_interval: 300
			},
			monitorInterval: 40000
		};

		this.devices = {};
		this.searchFor = ["kankun"];
	},

	/**
	 * Service started lifecycle event handler
	 */
	started() {

		let { discover, monitorInterval } = this.options;

		const arp = new Discover(discover);

		arp.on("success", (res) => {
			this.devices = {};
			if (!res) {
				return;
			}

			for(let key in res) {
				if(res.hasOwnProperty(key)) {
					this.searchFor.forEach((filter) => {
						let device = res[key];
						if (device.host.includes(filter)) {
							if (!this.devices[filter]) {
								this.devices[filter] = [];
							}
							this.devices[filter].push(device);
							this.broker.emit(`discovery.${filter}`, device);
						}
					});
				}
			}

			console.log(this.devices);

		});

		arp.on("error", function(err){
			console.log("Discovery Error:" + err);
		});

		// arp.discover();
		arp.monitor(monitorInterval);

	},

	/**
	 * Service stopped lifecycle event handler
	 */
	stopped() {

	}
};
