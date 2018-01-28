"use strict";
const miio = require('miio');

module.exports = {
	name: "lights",
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
		turnOn: {
			handler(ctx) {
				let lightId = ctx.params.lightId;
				if (lightId == "all"){
					for(let key in this.devices) {
						if(this.devices.hasOwnProperty(key)) {
							this.toggleLight(this.devices[key], true);
						}
					}
					return "All lights turned on";
				} else {
					this.toggleLight(this.devices[lightId], true);
					return `turning on light ${lightId}`;
				}
			}
		},
		turnOff: {
			handler(ctx) {
				let lightId = ctx.params.lightId;

				if (lightId == "all"){
					for(let key in this.devices) {
						if(this.devices.hasOwnProperty(key)) {
							this.toggleLight(this.devices[key], false);
						}
					}
					return "All lights turned off";
				} else {
					this.toggleLight(this.devices[lightId], false);
					return `turning off light ${lightId}`;
				}

			}
		}
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
		toggleLight(light, on = true) {
			light.power(on);
		}
	},

	/**
	 * Service created lifecycle event handler
	 */
	created() {
		this.devices = {};
	},

	/**
	 * Service started lifecycle event handler
	 */
	started() {

		const browser = miio.browse({
			cacheTime: 300 // 5 minutes. Default is 1800 seconds (30 minutes)
		});

		browser.on("available", reg => {
			console.log(reg);
			if(! reg.token) {
				console.log(reg.id, "hides its token");
				return;
			}

			// Directly connect to the device anyways - so use miio.devices() if you just do this
			miio
				.device(reg)
				.then(device => {
					this.devices[reg.id] = device;
				}).catch((error) => {
					console.error(error);
				});
		});

		browser.on("unavailable", reg => {
			const device = this.devices[reg.id];
			if(! device) return;

			device.destroy();
			delete this.devices[reg.id];
		});
	},

	/**
	 * Service stopped lifecycle event handler
	 */
	stopped() {

	}
};
