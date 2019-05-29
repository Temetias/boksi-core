import { join } from "path";
import { configs } from "../../types/configs/configs";
import LogMember from "../log/LogMember";
import { safely } from "../utils/patterns";

/**
 * 
 */
export default class Blok extends LogMember {

	/**
	 * 
	 */
	public readonly name: string;

	/**
	 * 
	 */
	public readonly dirPath: string;

	/**
	 * 
	 */
	public isEnabled: boolean = false;

	/**
	 * 
	 */
	private blokInitCallback: (() => void) | null = null;

	/**
	 * 
	 */
	private readonly config: configs.BlokConfig;

	/**
	 * 
	 */
	public constructor(config: configs.BlokConfig, dirPath: string) {
		super(config.name);
		this.config = config;
		this.dirPath = dirPath;
		this.name = this.config.name;
	}

	/**
	 * 
	 */
	public async build(): Promise<boolean> {
		const entryPoint = join(this.dirPath, this.config.entryPoint);
		const [error, blokInit] = await safely<{default: () => void}>(import(entryPoint));
		if (error) {
			this.log("Failed to build blok!", error);
			return false;
		}
		this.blokInitCallback = blokInit!.default;
		return true;
	}

	/**
	 * 
	 */
	public enable(): void {
		this.init();
		this.isEnabled = true;
	}

	/**
	 * 
	 */
	public disable(): void {
		this.isEnabled = false;
	}

	/**
	 * 
	 */
	private init(): void {
		if (!this.blokInitCallback) {
			this.log("Attempted to call blok-init without blok-init being assigned thus blok not intialized!");
			return;
		}
		try {
			this.log(`Initializing blok "${this.name}"...`);
			this.blokInitCallback();
		} catch (initError) {
			this.log("Failed to initialize blok!", initError);
		}
	}
}
