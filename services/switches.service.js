"use strict";
const http = require("http");

module.exports = {
	name: "switches",
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
		on: {
			handler(ctx) {
				this.toggle(ctx.params.switchNumber, "on");
			}
		},
		off: {
			handler(ctx) {
				this.toggle(ctx.params.switchNumber, "off");
			}
		}
	},

	/**
	 * Events
	 */
	events: {

		"discovery.kankun"(sw) {
			this.switches.push(sw);
		}

	},

	/**
	 * Methods
	 */
	methods: {

		toggle(switchNumber, onOff = "on") {
			let sw = (this.switches[switchNumber - 1]) ? this.switches[switchNumber - 1] : null;
			if (sw) {
				http.get(`http://${sw.ip}/cgi-bin/toggle.cgi?set=${onOff}`);
			} else {
				return "Switch Doesn't exist";
			}
		}

	},

	/**
	 * Service created lifecycle event handler
	 */
	created() {
		this.switches = [];
	},

	/**
	 * Service started lifecycle event handler
	 */
	started() {


	},

	/**
	 * Service stopped lifecycle event handler
	 */
	stopped() {

	}
};
