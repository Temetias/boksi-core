import config from "../boksi-conf.json";
import Core from "./core/Core";
import HookHandler from "./hooks/HookHandler";

/**
 * Boksi is a backend-solution for building an agile and modular cross-process application.
 *
 * @packageDocumentation
 */

/**
 * The root Boksi-instance that gets exposed to runtime-bloks via NodeJS.global.
 */
class Boksi {

	/**
	 * Boksis hook system which exposes multiple triggers in which the bloks can attach to to trigger different actions.
	 */
	public hooks = new HookHandler(config.logDir);

	/**
	 * The core functionality of Boksi.
	 */
	private core = new Core(config, this.hooks);
}

// @ts-ignore
global["Boksi"] = {};
// @ts-ignore
global["Boksi"]["hooks"] = new Boksi().hooks;
