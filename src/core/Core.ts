import { existsSync, lstatSync, readdirSync } from "fs";
import { join } from "path";
import { configs } from "../../types/configs/configs";
import Blok from "../bloks/Blok";
import IPCBlok from "../bloks/IPCBlok";
import RuntimeBlok from "../bloks/RuntimeBlok";
import HookHandler from "../hooks/HookHandler";
import LogMember from "../log/LogMember";
import { safely } from "../utils/patterns";

/**
 *
 */
export default class Core extends LogMember {

	/**
	 *
	 */
	private readonly config: configs.BoksiConfig;

	/**
	 *
	 */
	private readonly bloks: Blok[] = [];

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
		this.config = config;
		this.hooks = hookHandler;
		const blokDirs = this.getBlokDirs();
		const blokBuildPromises = blokDirs.map(blokDir => this.buildBlok(blokDir));
		Promise.all<void>(blokBuildPromises)
			.catch(buildError => this.log(
				`One or more of the blok builds failed! There is probably more information above.`,
				buildError,
			))
			.finally(() => {
				this.bloks.forEach(blok => blok.enable());
				this.hooks.launch.fire();
			})
		;

	}

	/**
	 *
	 */
	private getBlokDirs(): string[] {
		if (!this.config.bloksDir) {
			this.log("No blok-directory set in boksi-conf.json!");
			return [];
		} else if (!existsSync(join(__dirname, "../../../", this.config.bloksDir))) { // TODO: Fix path on prod mode.
			this.log("Blok-directory configuration points to a non-existing directory!");
			return [];
		} else {
			const bloksDir = join(__dirname, "../../../", this.config.bloksDir); // TODO: Fix path on prod mode.
			return readdirSync(bloksDir)
				.map(name => join(bloksDir, name))
				.filter(this.isBlokDirectory)
			;
		}
	}

	/**
	 * 
	 */
	private isBlokDirectory(dir: string): boolean {
		return lstatSync(dir).isDirectory() && dir.includes("__blok");
	}

	/**
	 *
	 */
	private async buildBlok(dir: string): Promise<void> {
		const configPath = join(dir, "blok_setup/blok-conf.json");
		const [configError, config] = await safely<configs.BlokConfig>(import(configPath));
		if (configError) {
			this.log(`Could not locate blok-conf.json from ${dir} thus blok not added!`, configError);
			return;
		}
		if (!config!.name) {
			this.log(`No name given for blok in blok-conf.json at ${dir} thus blok not added!`);
			return;
		}
		if (!config!.type) {
			this.log(`No type given for blok in blok-conf.json at ${dir} thus blok not added!`)
		}
		switch (config!.type!.toLowerCase()) {
			case "ipc":
				const ipcBlok = new IPCBlok(config!, dir);
				if (ipcBlok.build()) {
					this.bloks.push(ipcBlok);
				}
				break
			;
			case "runtime":
				const runtimeBlok = new RuntimeBlok(config!, dir);
				if (runtimeBlok.build()) {
					this.bloks.push(runtimeBlok);
				}
				break
			;
			default:
				this.log(`Unknown blok type ${config!.type!.toLowerCase()}`);
				break
			;
		}
	}
}
