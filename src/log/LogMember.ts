/**
 * A class representation of a member in the Boksi logging system. Used to unify the logging procedure.
 *
 * @abstract
 */
export default abstract class LogMember {

	/**
	 * The source from which the loggin message will be marked to come from.
	 *
	 * @readonly
	 */
	private readonly source: string;

	/**
	 * @constructor
	 *
	 * @param source The source from which the loggin message will be marked to come from.
	 */
	public constructor(source: string) {
		this.source = source;
		// TODO: Init logging file.
	}

	/**
	 * Mark something into the log.
	 *
	 * @param message The message to mark into the log.
	 * @param error Optional. The error to relate with the message.
	 */
	public log(message: string, error?: Error | string): void {
		// TODO: Log to file.
		console.log(`${new Date().toLocaleString()}`, `- from ${this.source}:`);
		console.log(message, error ? `Trace below:\n---\n${error}\n----` : "", "\n");
	}
}
