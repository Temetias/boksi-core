import { IncomingMessage } from "http";
import Hook from "./Hook";

/**
 * 
 */
export default class HookHandler {

	/**
	 * 
	 */
	public launch: Hook<void> = new Hook();

	/**
	 * 
	 */
	public request: Hook<IncomingMessage> = new Hook<IncomingMessage>();
}
