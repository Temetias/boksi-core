import { safely } from "../utils/patterns";
import Link from "./Link";

/**
 * A hook, which is the main structure of the way Boksi communicates with a blok. Hooks can be linked to and unlinked to
 * by the bloks. Core handles triggering the lifecycle-hooks.
 */
export default class Hook<T> {

	/**
	 * The links to this hook.
	 */
	public links: Link<T>[] = [];

	/**
	 * @constructor
	 */
	public constructor(

		/**
		 * Name of the hook.
		 */
		public readonly name: string,
	) {}

	/**
	 * Link a callback-function to the hook.
	 *
	 * @param callback The callback-function to link to the hook.
	 */
	public handleLink(link: Link<T>): void {
		this.links.push(link);
	}

	/**
	 * Unlink a callback function from the hook.
	 *
	 * @param callback The callback-function to unlink from the hook.
	 */
	public unlink(link: Link<T>): void {
		this.links = this.links.filter(linkedLink => linkedLink.id !== link.id);
	}

	/**
	 * Fires the hook, calling all the callbacks linked to it.
	 *
	 * TODO: Research possibilities for "fireSafe" and "fireUnsafe".
	 *
	 * @param data The data to pass down to the callbacks.
	 *
	 * @returns An empty promise
	 */
	public async fire(data: T): Promise<void> {
		const [error, _] = await safely(Promise.all(this.links.map(link => link.callBack(data))));
		if (error) {
			throw error;
		}
	}
}
