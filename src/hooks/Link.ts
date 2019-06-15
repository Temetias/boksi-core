import { randomBytes } from "crypto";

/**
 *
 */
export default class Link<T = {}> {

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
