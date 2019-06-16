import Boksi from "../blok_setup/blokFile";

// Example of a launch hook with timestamp data. Launch hook should be treated similarily to document.ready.
Boksi.hooks.native.launch.link(async data => {
	console.log("IPC-blok detected launch hook fire!", `Attached data: ${data}\n`);
	
	// Example of a request hook with the request as data.
	Boksi.hooks.native.request.link(async data => {
		console.log("IPC-blok detected request hook fire!\n");
	});
	
	// Example of non-data hook with added demonstration of async behaviour
	Boksi.hooks.native.termination.link(async () => {
		console.log("IPC-blok detected termination hook fire! Terminating...\n");
		await timeout(2000);
		console.log("IPC-blok termination ready!\n");
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