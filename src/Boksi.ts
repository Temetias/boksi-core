import config from "../boksi-conf.json";
import Core from "./core/Core";
import HookHandler from "./hooks/HookHandler";

/**
 * 
 */
class Boksi {

	/**
	 *
	 */
	public hooks = new HookHandler();

	/**
	 *
	 */
	private core = new Core(config, this.hooks);

}

// @ts-ignore
global["Boksi"] = {};
// @ts-ignore
global["Boksi"]["hooks"] = new Boksi().hooks;
