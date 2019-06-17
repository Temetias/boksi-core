import { IncomingMessage } from "http";

/**
 * The namespace containing hook-communication message types.
 */
export declare namespace hookCommunications {

	/**
	 * The basic IPC hook message that fires a hook.
	 */
	interface IPCFireHookMessage {

		/**
		 * Helper property, used to determine the message types.
		 */
		isFireMessage: true;

		/**
		 * The hook to fire.
		 */
		hookName: string;

		/**
		 * The blok that fire
		 */
		blokName: string;

		/**
		 * The data related to the event.
		 */
		data: any;
	}

	/**
	 * A message that indicates a request to link to a hook.
	 */
	interface IPCHookLinkMessage {

		/**
		 * Helper property, used to determine the message types.
		 */
		isLinkMessage: true;

		/**
		 * The name of the hook to link into.
		 */
		hookName: string;

		/**
		 * The name of the blok that requests the link.
		 */
		blokName: string;
	}

	/**
	 * A message that indicates a request to create a new custom hook.
	 */
	interface IPCHookCreationMessage {

		/**
		 * Helper property, used to determine the message types.
		 */
		isCreationMessage: true;

		/**
		 * The hook to create.
		 */
		hookName: string;
	}
}