import { ChildProcess, fork } from "child_process";
import { existsSync } from "fs";
import { join } from "path";
import { configs } from "../../types/configs/configs";
import Blok from "./Blok";

/**
 *
 */
export default class IPCBlok extends Blok {

	/**
	 *
	 */
	private process: ChildProcess | null = null;

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
		if (!this.config.entryPoint) {
			this.log(`No entrypoint given for runtime-blok in blok-conf.json for ${this.config.name}!`);
			return false;
		}
		return existsSync(join(this.dirPath, this.config.entryPoint));
	}

	/**
	 *
	 */
	public launch(): boolean {
		fork(this.config.entryPoint!);
		return true;
	}
}
