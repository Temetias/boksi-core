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
		coreConfig: BoksiCoreConfig;

		/**
		 * 
		 */
		bloksConfig: BloksHandlerConfig;
	}

	/**
	 * 
	 */
	interface BoksiCoreConfig {

		/**
		 * 
		 */
		port: number;

		/**
		 * 
		 */
		devPort: number;
	}

	/**
	 * 
	 */
	interface BloksHandlerConfig {

		/**
		 * 
		 */
		bloksDir?: string;
	}

	/**
	 * 
	 */
	interface BlokConfig {
		
		/**
		 * 
		 */
		name: string;

		/**
		 * 
		 */
		version?: string;

		/**
		 * 
		 */
		entryPoint: string;
	}
}