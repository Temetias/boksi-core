/**
 * 
 */
export default abstract class LogMember {

	/**
	 * 
	 */
	private readonly source: string;

	/**
	 * 
	 */
	public constructor(source: string) {
		this.source = source;
		// TODO: Init logging file.
	}

	/**
	 * 
	 */
	public log(message: string, error?: Error | string): void {
		// TODO: Log to file.
		console.log(`${new Date().toLocaleString()}`, `- from ${this.source}:`);
		console.log(message, error ? `Trace below:\n---\n${error}\n----` : "", "\n");
	}
}
