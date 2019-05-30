import { IncomingMessage } from "http";
import Hook from "./Hook";

/**
 * The class-instance that handles the hook-system of Boksi.
 */
export default class HookHandler {

	/**
	 * A hook that triggers when Boksi has launched.
	 */
	public launch: Hook<void> = new Hook();

	/**
	 * A hook that triggers when Boksi's server receives a request. (If a server is setup).
	 *
	 * @remarks
	 * To enable Boksi-server, specify that in the boksi-conf.json.
	 */
	public request: Hook<IncomingMessage> = new Hook<IncomingMessage>();
}
