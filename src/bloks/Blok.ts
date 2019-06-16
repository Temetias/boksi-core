import { configs } from "../../types/configs/configs";
import HookHandler from "../hooks/HookHandler";
import LogMember from "../log/LogMember";

/**
 * A blok, which is a member of Boksi "module" -system. A blok is the main way of building functionality on top
 * of Boksi.
 *
 * @abstract
 * @extends LogMember
 */
export default abstract class Blok extends LogMember {

	/**
	 * The name of the blok.
	 */
	public name: string;

	/**
	 * The type of the blok. The type determines the way the blok communicates with Boksi.
	 *
	 * @readonly
	 */
	public readonly type: string;

	/**
	 * The blok enabled-state. Prefixed to limit direct access.
	 */
	private _isEnabled: boolean = false;

	/**
	 * @returns The blok enabled-state.
	 */
	get isEnabled(): boolean {
		return this._isEnabled;
	}

	/**
	 * @constructor
	 *
	 * @param config The configuration for the blok.
	 * @param dirPath The absolute directory path for the blok.
	 */
	public constructor(

		/**
		 * The configuration-data of the blok. Usually from {blokname__blok}/blok_setup/blok-conf.json.
		 *
		 * @readonly
		 */
		protected readonly config: configs.BlokConfig,

		/**
		 * The absolute directory path of the blok.
		 *
		 * @readonly
		 */
		public readonly dirPath: string,

		/**
		 * Reference to the Boksis hook-system.
		 *
		 * @readonly
		 */
		protected readonly hookHandler: HookHandler,
	) {
		super(config.name!);
		this.name = config.name!;
		this.type = config.type!;
	}

	/**
	 * The function that builds the blok. "Build" in this context means reading the configuration files and entrypoint
	 * scripts without calling any initialization triggers or functions.
	 *
	 * @returns A promise of the blok build status. True for success, false for fail.
	 *
	 * @abstract
	 */
	public abstract async build(): Promise<boolean>;

	/**
	 * The enable function for the blok. Runs the main entry-point function or file of the blok and toggles the
	 * enabled-state if successful.
	 */
	public enable(): void {
		this._isEnabled = this.launch();
	}

	/**
	 * The disable function for the blok.
	 */
	public disable(): void {
		// TODO
		this._isEnabled = false;
	}

	/**
	 * Termination handling procedures of the blok. This gets called when the Boksi-core process gets terminated
	 * via "SIGINT".
	 *
	 * @abstract
	 */
	public abstract handleTermination(): Promise<void>;

	/**
	 * The launch function for the blok. Runs the main entry-point funtion or forks the file of the blok.
	 *
	 * @returns The success-state for the launch operation.
	 *
	 * @abstract
	 */
	protected abstract launch(): boolean;
}
