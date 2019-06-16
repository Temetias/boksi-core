/**
 * A timeout function with option to fail to simulate async.
 */
export const timeout = (opts: { ms: number, forceFail?: boolean }): Promise<void> => (
	new Promise((resolve, reject) => setTimeout(opts.forceFail ? reject : resolve, opts.ms))
);

/**
 *
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
