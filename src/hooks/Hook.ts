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

	}

	public attach(callback: ((data: T) => void)): void {
		this.callbacks.push(callback);
	}

	public detach(): void {
		// TODO:
	}

	public fire(data: T): void {
		this.callbacks.forEach(callback => callback(data));
	}
}