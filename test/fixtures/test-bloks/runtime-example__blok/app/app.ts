import Boksi from "../blok_setup/blokFile";

/**
 * The builder function.
 */
const blokBuilder = (() => {
	
	// Example of a launch hook with timestamp data. Launch hook should be treated similarily to document.ready.
	Boksi.hooks.native.launch.link(async data => {
		console.log("Runtime-blok detected launch hook fire!", `Attached data: ${data}\n`);

		// Example of a request hook with the request as data.
		Boksi.hooks.native.request.link(async data => {
			console.log("Runtime-blok detected request hook fire!")
		});

		// Example of non-data hook with added demonstration of async behaviour
		Boksi.hooks.native.termination.link(async () => {
			console.log("Runtime-blok detected termination hook fire! Terminating...\n");
			await timeout(1500);
			console.log("Runtime-blok termination ready!\n");
		});
	});
});

/**
 * Timeout for demonstration purposes
 * 
 * @param ms The timeout in ms.
 */
function timeout(ms: number): Promise<{}> {
	return new Promise(resolve => setTimeout(resolve, ms));
}

// Exporting the builder function is mandatory for runtime blok to work!
export default blokBuilder;
