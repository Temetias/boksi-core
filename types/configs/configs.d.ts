/**
 * 
 */
export declare namespace configs {

	/**
	 * 
	 */
	interface BoksiConfig {


		/**
		 * 
		 */
		bloksDir?: string;

		/**
		 * 
		 */
		port?: number;
	
		/**
		 * 
		 */
		devPort?: number;
	}

	/**
	 * 
	 */
	interface BlokConfig {
		
		/**
		 * 
		 */
		name?: string;

		/**
		 *
		 */
		type?: "IPC" | "ipc" | "runtime";

		/**
		 * 
		 */
		entryPoint?: string;

		/**
		 * 
		 */
		version?: string;

	}
}