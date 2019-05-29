/**
 * 
 */
export default class Hook<T> {

	/**
	 * 
	 */
	private callbacks: ((data: T) => void)[] = [];

	/**
	 * 
	 */
	public constructor() {
		// TODO
	}

	public link(callback: ((data: T) => void)): void {
		this.callbacks.push(callback);
	}

	public unlink(callback: ((data: T) => void)): void {
		// TODO:
	}

	public fire(data: T): void {
		this.callbacks.forEach(callback => callback(data));
	}
}
