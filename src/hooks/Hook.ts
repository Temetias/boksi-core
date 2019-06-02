import IPC from "node-ipc";

/**
 * A hook, which is the main structure of the way Boksi communicates with a blok. Hooks can be linked to and unlinked to
 * by the bloks. Core handles triggering the lifecycle-hooks.
 */
export default class Hook<T> {

	/**
	 *
	 */
	public readonly name: string;

	/**
	 *
	 */
	private IPCCallback: null | ((data: T) => void) = null;

	/**
	 * A list of the callback-functions that are linked to this hook.
	 */
	private callbacks: ((data: T) => void)[] = [];

	/**
	 * @constructor
	 */
	public constructor(name: string) {
		this.name = name;
	}

	/**
	 * Link a callback-function to the hook.
	 *
	 * @param callback The callback-function to link to the hook.
	 */
	public link(callback: ((data: T) => void)): void {
		this.callbacks.push(callback);
	}

	/**
	 *
	 */
	public linkIPCCallback(callback: ((data: T) => void)): void {
		if (!this.IPCCallback) {
			this.IPCCallback = callback;
		}
	}

	/**
	 * Unlink a callback function from the hook.
	 *
	 * @param callback The callback-function to link to the hook.
	 */
	public unlink(callback: ((data: T) => void)): void {
		// TODO:
	}

	/**
	 * Fires the hook, calling all the callbacks linked to it.
	 *
	 * @param data The data to pass down to the callbacks.
	 */
	public fire(data: T): void {
		this.callbacks.forEach(callback => callback(data));
		if (this.IPCCallback) {
			this.IPCCallback(data);
		}
	}

	/**
	 *
	 */
	public hasIPCCallback(): boolean {
		return this.IPCCallback === null;
	}
}