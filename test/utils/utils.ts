import { readdir, unlink } from "fs";
import { join } from "path";

/**
 * A timeout function with option to fail to simulate async.
 *
 * @param opts The amount of time to await and the boolean to enable force-fail.
 *
 * @returns An empty promise.
 */
export const timeout = (opts: { ms: number, forceFail?: boolean }): Promise<void> => (
	new Promise((resolve, reject) => setTimeout(opts.forceFail ? () => reject(new Error("Error")) : resolve, opts.ms))
);

/**
 * Provides a way to await for a manipulated string.
 * The format is always the following: `Tested with value "${base}"`
 *
 * @param ms The time to wait for the value
 * @param base The value to manipulate
 * @param errorToThrow The error to throw if we want to force-fail the function.
 *
 * @returns A promise returns `Tested with value "${base}"`
 *
 * @async
 */
export const asyncValue = async (ms: number, base: string, errorToThrow?: Error): Promise<string> => {
	try {
		const forceFail = errorToThrow ? true : undefined;
		await timeout({ ms, forceFail });
		return `Tested with value: "${base}"`;
	} catch (_) {
		throw errorToThrow;
	}
};

/**
 * Utility cleanup function to clear tmp files used in testing.
 *
 * @param dirPath The directory to clear.
 */
export const clearDir = (dirPath: string) => {
	readdir(dirPath, (err1, files) => {
		if (err1) {
			throw err1;
		}
		files.forEach(file => {
			unlink(join(dirPath, file), err2 => {
				if (err2) {
					throw err2;
				}
			});
		});
	});
};
