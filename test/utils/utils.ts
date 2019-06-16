/**
 * A timeout function with option to fail to simulate async.
 */
export const timeout = (opts: { ms: number, forceFail?: boolean }): Promise<void> => (
	new Promise((resolve, reject) => setTimeout(opts.forceFail ? reject : resolve, opts.ms))
);
