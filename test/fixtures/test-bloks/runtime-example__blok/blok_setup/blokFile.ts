import Boksi from "./boksiTypes";
import { randomBytes } from "crypto";

/**
 *
 */
class Link<T = {}> {

	/**
	 *
	 */
	public readonly id: string = randomBytes(16).toString("hex");

	/**
	 * @constructor
	 */
	public constructor(

		/**
		 *
		 */
		public callBack: (data: T) => Promise<void>,
	) {

	}
}

const Boksi: Boksi = {
	// @ts-ignore
	hooks: global["Boksi"]["hooks"]
}

function link(callBack: (data: any) => Promise<void>): void {
	const newLink = new Link(callBack);
	// @ts-ignore
	this.links.push(newLink);
}

Object.keys(Boksi.hooks.native).forEach(hookName => Boksi.hooks.native[hookName].link = link.bind(Boksi.hooks.native[hookName]));
Object.keys(Boksi.hooks.custom).forEach(hookName => Boksi.hooks.custom[hookName].link = link.bind(Boksi.hooks.custom[hookName]));

export default Boksi;
