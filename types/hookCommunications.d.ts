import Hook from "../src/hooks/Hook";
import Blok from "../src/bloks/Blok";

/**
 *
 */
export declare namespace hookCommunications {

	/**
	 *
	 */
	interface IPCHookMessage {

		/**
		 *
		 */
		hookName: string;

		/**
		 *
		 */
		blokName: string;

		/**
		 *
		 */
		data: any;
	}

	/**
	 *
	 */
	interface IPCHookReturnBundle {

		/**
		 *
		 */
		hookName: string;

		/**
		 *
		 */
		data: {
			[ blok: string ]: string;
		}
	}

	/**
	 *
	 */
	interface IPCHookLinkMessage {

		/**
		 *
		 */
		hookName: string;

		/**
		 *
		 */
		blokName: string;
	}

	/**
	 *
	 */
	interface IPCHookCreationMessage {

		/**
		 *
		 */
		hookName: string;
	}
}