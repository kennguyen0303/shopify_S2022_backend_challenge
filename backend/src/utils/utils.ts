/**
 * Put the process in sleep for the given milliseconds
 * @param milliseconds the amount of time in miliseconds
 * @returns
 */
export const sleep = (milliseconds: number) => {
	return new Promise((resolve) => setTimeout(resolve, milliseconds));
};
