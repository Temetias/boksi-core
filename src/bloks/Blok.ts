import { configs } from "../../types/configs/configs";
import LogMember from "../log/LogMember";

/**
 *
 */
export default abstract class Blok extends LogMember {

	/**
	 *
	 */
	public name: string;

	/**
	 *
	 */
	public readonly dirPath: string;

	/**
	 *
	 */
	protected readonly config: configs.BlokConfig;

	/**
	 *
	 */
	private _isEnabled: boolean = false;

	/**
	 *
	 */
	get isEnabled(): boolean {
		return this._isEnabled;
	}

	/**
	 *
	 */
	public constructor(config: configs.BlokConfig, dirPath: string) {
		super(config.name!);
		this.dirPath = dirPath;
		this.config = config;
		this.name = config.name!;
	}

	/**
	 *
	 */
	public abstract async build(): Promise<boolean>;

	/**
	 *
	 */
	public async enable(): Promise<void> {
		this._isEnabled = await this.launch();
	}

	/**
	 *
	 */
	public disable(): void {
		this._isEnabled = false;
	}

	/**
	 *
	 */
	protected abstract launch(): boolean;
}
