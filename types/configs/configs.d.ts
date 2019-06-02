/**
 * The namespace containing configuration related types.
 */
export declare namespace configs {

	/**
	 * The configuration for Boksi.
	 */
	interface BoksiConfig {

		/**
		 * The directory where Boksi looks for bloks.
		 */
		bloksDir?: string;

		/**
		 * The Boksi-server related configuration.
		 */
		server: {

			/**
			 * If Boksi should start a web-server.
			 */
			enable: boolean;

			/**
			 * The port Boksi should serve the web-server to, in production mode.
			 */
			port?: number;
			
			/**
			 * 
			 * The port Boksi should serve the web-server to, in development mode.
			 */
			devPort?: number;
		}

		/**
		 * The Boksi web-ui related configuration.
		 */
		ui: {

			/**
			 * If Boksi should start the web-ui.
			 */
			enable?: boolean;

			/**
			 * The port the web-ui runs in.
			 */
			port?: number;
		}
	}

	/**
	 * Configuration of a blok.
	 */
	interface BlokConfig {
		
		/**
		 * The name of a blok. Boksi requires this to be _unique_.
		 */
		name?: string;

		/**
		 * The type of the blok. This determines the way Boksi and the blok communicate with each other.
		 */
		type?: "IPC" | "ipc" | "runtime";

		/**
		 * The entry-point for the blok. Boksi expects this to be a _relative path to the main file_ from the
		 * blok-directory root.
		 */
		entryPoint?: string;

		/**
		 * The version number of the blok.
		 */
		version?: string;
	}
}