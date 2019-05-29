import { join } from "path";
import { configs } from "../../types/configs/configs";
import { safely } from "../utils/patterns";
import Blok from "./Blok";

/**
 *
 */
export default class RuntimeBlok extends Blok {

	/**
	 *
	 */
	public constructor(config: configs.BlokConfig, dirPath: string) {
		super(config, dirPath);
	}

	/**
	 *
	 */
	public async build(): Promise<boolean> {
		const entryPoint = join(this.dirPath, this.config.entryPoint);
		const [error, blokInit] = await safely<{ default: () => void }>(import(entryPoint));
		if (error) {
			this.log("Failed to build runtime-blok!", error);
			return false;
		}
		this.blokLaunchCallback = blokInit!.default;
		return true;
	}

	/**
	 *
	 */
	public launch(): Promise<boolean> {
		return new Promise<boolean>((resolve) => {
			if (!this.blokLaunchCallback) {
				this.log("Attempted to call blok-init without blok-init being assigned thus blok not intialized!");
				resolve(false);
			}
			try {
				this.log(`Initializing blok "${this.name}"...`);
				this.blokLaunchCallback();
				resolve(true);
			} catch (initError) {
				this.log("Failed to initialize blok!", initError);
				resolve(false);
			}
		});
	}

	/**
	 *
	 */
	private blokLaunchCallback: () => void = () => { /* noop */ };
}
