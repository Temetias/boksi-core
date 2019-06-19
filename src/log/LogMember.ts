import fs from "fs";

/**
 * A class representation of a member in the Boksi logging system. Used to unify the logging procedure.
 *
 * @abstract
 */
export default abstract class LogMember {

	/**
	 * If the logmember is able to log to the file.
	 *
	 * @readonly
	 */
	private readonly isAbleToLogToFile: boolean;

	/**
	 * @constructor
	 *
	 * @param source The source from which the loggin message will be marked to come from.
	 */
	public constructor(

		/**
		 * The source from which the loggin message will be marked to come from.
		 *
		 * @readonly
		 */
		private readonly source: string,

		/**
		 * Absolute path to the directory where boksi is logging.
		 *
		 * @readonly
		 */
		private readonly dir: string,
	) {
		this.isAbleToLogToFile = this.initDirectory();
	}

	/**
	 * Mark something into the log. If there is no file for today, create one. If on development mode,
	 * also log to console.
	 *
	 * @param message The message to mark into the log.
	 * @param error Optional. The error to relate with the message.
	 */
	public log(message: string, error?: Error | string): void {
		const title = `${new Date().toLocaleString()} - from ${this.source}:`;
		const formattedMessage = `${message} ${error ? "Trace below:\n----\n" + error + "\n----" : ""}\n`;
		const file = `${this.dir}/${new Date().toLocaleDateString()}.txt`;
		if (process.env.NODE_ENV === "development") {
			console.log(title);
			console.log(formattedMessage);
		}
		if (!this.isAbleToLogToFile) {
			return;
		}
		if (!fs.existsSync(file)) {
			fs.writeFileSync(
				file,
				`\n${title}\n${formattedMessage}`,
			);
		} else {
			fs.appendFileSync(
				file,
				`\n${title}\n${formattedMessage}`,
			);
		}
	}

	/**
	 * Checks if the logging directory exists. If not, creates one.
	 *
	 * @returns The success state of the operation.
	 */
	private initDirectory(): boolean {
		if (!this.dir) {
			console.error("No logging directory specified in boksi-conf.json!");
			return false;
		}
		if (!fs.existsSync(this.dir)) {
			fs.mkdirSync(this.dir);
		}
		return true;
	}
}
