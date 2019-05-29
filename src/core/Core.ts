import { configs } from "../../types/configs/configs";
import BloksHandler from "../bloks/BloksHandler";
import HookHandler from "../hooks/HookHandler";
import LogMember from "../log/LogMember";

/**
 *
 */
export default class Core extends LogMember {

	/**
	 *
	 */
	private readonly config: configs.BoksiCoreConfig;

	/**
	 *
	 */
	private readonly bloksHandler: BloksHandler;

	/**
	 *
	 */
	private hooks: HookHandler;

	/**
	 *
	 */
	public constructor(config: configs.BoksiConfig, hookHandler: HookHandler) {
		super("Core");
		this.log("Initializing core...");
		this.hooks = hookHandler;
		this.config = config.coreConfig;
		this.bloksHandler = new BloksHandler(config.bloksConfig);
		this.hooks.launch.fire();
	}
}
