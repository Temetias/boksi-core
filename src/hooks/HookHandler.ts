import { IncomingMessage } from "http";
import LogMember from "../log/LogMember";
import Hook from "./Hook";
import Link from "./Link";

/**
 * The class-instance that handles the hook-system of Boksi.
 */
export default class HookHandler extends LogMember {

	/**
	 * The native constant hooks that Boksi always has.
	 *
	 * TODO: Improve typings.
	 */
	public native: { [name: string]: Hook<any> } = {

		/**
		 * A hook that fires when Boksi has launched.
		 */
		launch: new Hook<void>("launch"),

		/**
		 * A hook that fires when Boksi's server receives a request. (If a server is setup).
		 *
		 * @remarks
		 * To enable Boksi-server, specify that in the boksi-conf.json.
		 */
		request: new Hook<IncomingMessage>("request"),

		/**
		 * A hook thath fires when boksi is getting terminated.
		 */
		termination: new Hook<void>("termination"),
	};

	/**
	 * Custom hooks that can be created by the bloks.
	 */
	public readonly custom: { [name: string]: Hook<any> } = {};

	/**
	 * @constructor
	 */
	public constructor() {
		super("hook-handler");
	}

	/**
	 * Returns a hook by name if one exists. Otherwice returns null.
	 *
	 * @param name The name of the hook
	 *
	 * @returns The hook matching to the name or null if none was found.
	 */
	public getHookByName(name: string): Hook<any> | null {
		if (this.native[name]) {
			return this.native[name];
		} else if (this.custom[name]) {
			return this.custom[name];
		} else {
			this.log("Received a request to get an unknown hook!");
			return null;
		}
	}

	/**
	 * Creates a new hook.
	 *
	 * @param hookName The name of the hook to create.
	 *
	 * @returns A succes state of the creation process.
	 */
	public createCustomHook<T>(hookName: string): boolean {
		if (Object.keys(this.native).includes(hookName)) {
			this.log(`Attempted to create a hook by name "${hookName}" which name is reserved to a native hook!`);
			return false;
		}
		if (this.custom[hookName]) {
			this.log(`Attempted to create an already declared hook "${hookName}"!`);
			return false;
		}
		this.custom[hookName] = new Hook<T>(hookName);
		return true;
	}

	/**
	 * Link to a hook by name.
	 *
	 * @param name The hook name.
	 */
	public linkToHookByName(hookName: string, link: Link): void {
		if (this.native[hookName]) {
			this.native[hookName].handleLink(link);
		} else if (this.custom[hookName]) {
			this.custom[hookName].handleLink(link);
		} else {
			this.log(`Attempted to link to an unknown hook "${hookName}"!`);
		}
	}
}
