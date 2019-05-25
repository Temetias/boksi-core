/**
 * 
 */
export const safely = async <T>(promise: Promise<T>): Promise<[Error, null] | [null, T]> => {
	try {
		return [null, await promise];
	} catch (error) {
		return [error, null]
	}
};
