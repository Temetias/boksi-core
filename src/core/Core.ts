import { existsSync, lstatSync, readdirSync } from "fs";
import { join } from "path";
import { createInterface } from "readline";
import { configs } from "../../types/configs/configs";
import Blok from "../bloks/Blok";
import IPCBlok from "../bloks/IPCBlok";
import RuntimeBlok from "../bloks/RuntimeBlok";
import HookHandler from "../hooks/HookHandler";
import LogMember from "../log/LogMember";
import BoksiServer from "../server/BoksiServer";
import { safely } from "../utils/patterns";

/**
 * The core of Boksi. Contains the main functionality of building, launching and managing bloks, and firing
 * different lifecycle and action -hooks.
 *
 * @extends LogMember
 */
export default class Core extends LogMember {

	/**
	 * The configuration for Boksi.
	 *
	 * @readonly
	 */
	private readonly config: configs.BoksiConfig;

	/**
	 * A container-array for the _enabled_ bloks.
	 *
	 * @readonly
	 */
	private readonly bloks: Blok[] = [];

	/**
	 * The Boksi hook system.
	 */
	private hooks: HookHandler;

	/**
	 * The boksi-ui server.
	 * 
	 * @readonly
	 */
	private readonly uiServer: BoksiServer | null = null;

	/**
	 * The boksi server.
	 * 
	 * @readonly
	 */
	private readonly server: BoksiServer | null = null;

	/**
	 * @constructor
	 *
	 * @param config The Boksi configuration.
	 * @param hookHandler The hook-handling class-instance.
	 */
	public constructor(config: configs.BoksiConfig, hookHandler: HookHandler) {
		super("Core");
		this.log("Initializing core...");
		this.config = config;
		this.hooks = hookHandler;
		const blokDirs = this.getBlokDirs();
		const blokBuildPromises = blokDirs.map(blokDir => this.buildBlok(blokDir));
		// TODO: Boksi-ui server
		if (config.ui.enable) {
			if (config.ui.port) {
				this.uiServer = new BoksiServer(this.hooks, this.config.ui.port!);
				blokBuildPromises.push(this.buildBlok(join(__dirname, "../../../boksi-ui")));
			} else {
				this.log("Boksi-ui couldn't start because there was not a port specified in the config!");
			}
		}
		if (config.server.enable) {
			if (config.server.port) {
				this.server = new BoksiServer(this.hooks, this.config.server.port!);
			} else {
				this.log("Boksi couldn't start the server because there was not a port specified in the config!");
			}
		}
		Promise.all<void>(blokBuildPromises)
			.catch(buildError => this.log(
				`One or more of the blok builds failed! There is probably more information above.`,
				buildError,
			))
			// TODO: Remove the finally part. This is a test code-block.
			.finally(() => {
				this.bloks.forEach(blok => blok.enable());
				setTimeout(() => {
					this.hooks.native["launch"].fire(new Date().toLocaleString());
				}, 1000);
			})
		;
		this.attachTerminationHandler();
	}

	/**
	 * Gets the directories that have the "__blok"-suffix from the configured blok-folder.
	 *
	 * @returns The absolute paths to the bloks.
	 */
	private getBlokDirs(): string[] {
		if (!this.config.bloksDir) {
			this.log("No blok-directory set in boksi-conf.json!");
			return [];
		} else if (!existsSync(this.config.bloksDir)) {
			this.log("Blok-directory configuration points to a non-existing directory!");
			return [];
		} else {
			return readdirSync(this.config.bloksDir)
				.map(name => join(this.config.bloksDir!, name))
				.filter(this.isBlokDirectory)
			;
		}
	}

	/**
	 * Utility function for testing if a directory is a blok-directory or not.
	 *
	 * @param dir The absolute path to the tested directory.
	 *
	 * @returns The result of the test.
	 */
	private isBlokDirectory(dir: string): boolean {
		return lstatSync(dir).isDirectory() && dir.includes("__blok");
	}

	/**
	 * Handles building the blok from the specified configuration and directory.
	 *
	 * @param dir The absolute path to the blok-directory.
	 *
	 * @returns An empty promise.
	 *
	 * @async
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
			this.log(`No type given for blok in blok-conf.json at ${dir} thus blok not added!`);
			return;
		}
		switch (config!.type!.toLowerCase()) {
			case "ipc":
				const ipcBlok = new IPCBlok(config!, dir);
				if (await ipcBlok.build()) {
					this.bloks.push(ipcBlok);
				}
				break
			;
			case "runtime":
				const runtimeBlok = new RuntimeBlok(config!, dir);
				if (await runtimeBlok.build()) {
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

	/**
	 * Attaches termination listener to run termination handling on process exit.
	 */
	private attachTerminationHandler(): void {
		// Windows compatibility.
		if (process.platform === "win32") {
			const rl = createInterface({
				input: process.stdin,
				output: process.stdout,
			});
			rl.on("SIGINT", () => {
				// @ts-ignore - See issue: https://github.com/electron/electron/issues/9626
				process.emit("SIGINT");
			});
		}
		process.on("SIGINT", async () => {
			this.server!.terminate();
			const [err, _] = await safely(Promise.all(this.bloks.map(blok => blok.handleTermination())));
			if (err) {
				this.log("Error occured when executing termination handlers on bloks!", err);
				// Fallback to timeout to give bloks some time to attempt close handling.
				setTimeout(() => {
					this.log(`Boksi terminated.`);
					process.exit();
				}, this.config.terminationPostpone);
				this.log(`Boksi postponed termination by ${this.config.terminationPostpone}ms.`);
			} else {
				this.log(`Boksi terminated.`);
				process.exit();
			}
		});
	}
}
