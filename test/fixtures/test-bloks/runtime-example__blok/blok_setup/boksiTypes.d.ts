import { IncomingMessage } from "http";

/**
 *
 */
export default interface Boksi {

	/**
	 *
	 */
	hooks: {

		/**
		 *
		 */
		native: {
			/**
			 *
			 */
			launch: Hook<string>;
	
			/**
			 *
			 */
			request: Hook<IncomingMessage>;

			/**
			 *
			 */
			[ name: string ]: Hook<any>;
		},

		/**
		 *
		 */
		custom: {

			/**
			 *
			 */
			[ name: string ]: Hook<any>;
		}
	},
}

/**
 *
 */
interface Hook<T> {

	/**
	 *
	 */
	link(callBack: ((data: T) => Promise<void>)): void;
	
	/**
	 *
	 */
	unlink(callBack: (() => Promise<void>)): void;
}
