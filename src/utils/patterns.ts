/**
 * A safety-wrapped to use with async-await -syntax for cleaner and more consistent error-handling.
 */
export const safely = async <T>(promise: Promise<T>): Promise<[Error, null] | [null, T]> => {
	try {
		return [null, await promise];
	} catch (error) {
		return [error, null]
	}
};
