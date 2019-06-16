import { randomBytes } from "crypto";

/**
 * The instance of a link between a blok and a hook. Handles the callback and ensures the link uniquity.
 */
export default class Link<T = {}> {

	/**
	 * The unique id of the link.
	 *
	 * @readonly
	 */
	public readonly id: string = randomBytes(16).toString("hex");

	/**
	 * @constructor
	 */
	public constructor(

		/**
		 * The callback function of the link. When the linked hook gets fired, this blok callback function gets
		 * executed.
		 */
		public callBack: (data: T) => Promise<void>,
	) {}
}
