import config from "../boksi-conf.json";
import Core from "./core/Core";
import HookHandler from "./hooks/HookHandler";

/**
 * Boksi is a backend-solution for building modular cross-process application with an aim for high uptime.
 *
 * @packageDocumentation
 */

/**
 * The root Boksi-instance that gets exposed to runtime-bloks via nodejs global -object.
 */
class Boksi {

	/**
	 * Boksi's hook system which exposes multiple triggers in which the bloks can attach to to trigger different actions.
	 */
	public hooks = new HookHandler();

	/**
	 * The core functionality handler of Boksi.
	 */
	private core = new Core(config, this.hooks);

}

// @ts-ignore
global["Boksi"] = {};
// @ts-ignore
global["Boksi"]["hooks"] = new Boksi().hooks;
