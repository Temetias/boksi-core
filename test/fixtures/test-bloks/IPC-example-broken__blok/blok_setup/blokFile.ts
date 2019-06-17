import { IncomingMessage } from "http";
import blokConf from "./blok-conf.json";
import { hookCommunications } from "./boksiTypes.js";
import { isInstanceOfInterface } from "./patterns.js";

/**
 *
 */
class Hook<T> {

	/**
	 *
	 */
	private callbacks: ((data: T) => Promise<void>)[] = [];

	/**
	 *
	 */
	public constructor(

		/**
		 * 
		 */
		public name: string,
	) {}

	/**
	 *
	 */
	public link(callback: ((data: T) => Promise<void>)): void {
		const bundle: hookCommunications.IPCHookLinkMessage = {
			isLinkMessage: true,
			hookName: this.name,
			blokName: blokConf.name,
		};
		process.send!(JSON.stringify(bundle));
		this.callbacks.push(callback);
	}

	/**
	 *
	 */
	public fire(data: any): void {
		const bundle: hookCommunications.IPCFireHookMessage = {
			isFireMessage: true,
			hookName: this.name,
			blokName: blokConf.name,
			data,
		};
		process.send!(JSON.stringify(bundle));
	}

	/**
	 *
	 */
	public triggerCallbacks(data: any): void {
		Promise.all(this.callbacks.map(cb => cb(data)))
			.then(() => process.send!(JSON.stringify({ isSuccessMessage: true })))
			.catch(() => process.send!(JSON.stringify({ isFailureMessage: true })))
		;
	}
}

/**
 *
 */
class Boksi {

	/**
	 *
	 */
	public hooks: BoksiHooks = {
		native: {
			launch: new Hook<string>("launch"),
			request: new Hook<IncomingMessage>("request"),
			termination: new Hook<void>("termination"),
		},
		custom: {},
	};

	/**
	 *
	 */
	public constructor(_: void) {
		process.on("message", message => {
			const bundle = JSON.parse(message);
			if (isInstanceOfInterface<hookCommunications.IPCFireHookMessage>(bundle, "isFireMessage")) {
				if (this.hooks.native[bundle.hookName]) {
					this.hooks.native[bundle.hookName].triggerCallbacks(bundle.data);
				} else if (this.hooks.custom[bundle.hookName]) {
					this.hooks.native[bundle.hookName].triggerCallbacks(bundle.data);
				}
			} else if (isInstanceOfInterface<hookCommunications.IPCHookCreationMessage>(bundle, "isCreationMessage")) {
				if (!this.hooks.custom[bundle.hookName] && !this.hooks.native[bundle.hookName]) {
					this.hooks.custom[bundle.hookName] = new Hook(bundle.hookName);
				}
			}
		});
	}

	/**
	 *
	 */
	public createHook<T>(name: string): void {
		this.hooks.custom[name] = new Hook<T>(name);
		const bundle: hookCommunications.IPCHookCreationMessage = {
			isCreationMessage: true,
			hookName: name,
		}
		process.send!(JSON.stringify(bundle));
	}
}

interface BoksiHooks {
	native: {
		launch: Hook<string>;
		request: Hook<IncomingMessage>;
		termination: Hook<void>;

		// TypeScript dodge.
		[name: string]: Hook<any>;
	},
	custom: {
		[name: string]: Hook<any>;
	}
}

export default new Boksi();
