import { ChildProcess, fork } from "child_process";
import { existsSync } from "fs";
import { join } from "path";
import { configs } from "../../types/configs/configs";
import Blok from "./Blok";

/**
 * IPC-blok is a blok that communicates with Boksi via IPC.
 *
 * @remarks
 * IPC-blok relies on {@link https://www.npmjs.com/package/node-ipc | the node-ipc -package}
 *
 * @extends Blok
 */
export default class IPCBlok extends Blok {

	/**
	 * The process in which the blok runs.
	 */
	private process: ChildProcess | null = null;

	/**
	 * {@inheritdoc Blok.constructor}
	 */
	public constructor(config: configs.BlokConfig, dirPath: string) {
		super(config, dirPath);
	}

	/**
	 * {@inheritdoc Blok.build}
	 */
	public async build(): Promise<boolean> {
		if (!this.config.entryPoint) {
			this.log(`No entrypoint given for runtime-blok in blok-conf.json for ${this.config.name}!`);
			return false;
		}
		return existsSync(join(this.dirPath, this.config.entryPoint));
	}

	/**
	 * {@inheritdoc Blok.launch}
	 */
	public launch(): boolean {
		this.log("Initializing...");
		try {
			this.process = fork(join(this.dirPath, this.config.entryPoint!));
			return true;
		} catch (error) {
			this.log("Failed to fork blok-process!", error);
			return false;
		}
	}
}
