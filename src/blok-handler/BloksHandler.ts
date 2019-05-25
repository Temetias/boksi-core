import { lstatSync, readdirSync } from "fs";
import { join } from "path";
import { configs } from "../../types/configs/configs";
import LogMember from "../log/LogMember";
import { safely } from "../utils/patterns";
import Blok from "./Blok";

/**
 * 
 */
export default class BloksHandler extends LogMember {

	/**
	 * 
	 */
	private readonly config: configs.BloksHandlerConfig;

	/**
	 * 
	 */
	private readonly bloks: Blok[] = [];

	/**
	 * 
	 */
	public constructor(config: configs.BloksHandlerConfig) {
		super("BlokHandler");
		this.log("Initializing blok-handler...");
		this.config = config;
		const blokDirs = this.getBlokDirs();
		const blokBuildPromises = blokDirs.map(blokDir => this.buildBlok(blokDir));
		Promise.all<void>(blokBuildPromises).catch(buildError => this.log(
			`One or more of the blok builds failed! There is probably more information above.`,
			buildError,
		));
	}

	/**
	 * 
	 */
	public getBloks(): Blok[] {
		return this.bloks;
	}


	/**
	 * 
	 */
	private getBlokDirs(): string[] {
		if (this.config.bloksDir) {
			return this.getBlokDirsFromDir(this.config.bloksDir);
		} else {
			this.log("No blok-directory set in boksi-conf.json!");
			return [];
		}
	}

	/**
	 * 
	 */
	private getBlokDirsFromDir(dir: string): string[] {
		const isDirectory = (source: string) => lstatSync(source).isDirectory();
		const bloksDir = join(__dirname, "../../", dir); // TODO: Fix path on prod mode.
		return readdirSync(bloksDir)
			.map(name => join(bloksDir, name))
			.filter(isDirectory)
		;
	}

	/**
	 * 
	 */
	private async buildBlok(blokDir: string): Promise<void> {
		const blokConfigPath = join(blokDir, "blok-conf.json");
		const [confError, config] = await safely<configs.BlokConfig>(import(blokConfigPath));
		if (confError) {
			this.log(`Could not locate blok-conf.json from ${blokDir} thus blok not added to blok-runtime!`, confError);
			return;
		}
		if (!config!.name) {
			this.log(`No name given for blok in blok-conf.json at ${blokDir} thus blok not added to blok-runtime!`);
			return;
		}
		const blok = new Blok(config!, blokDir);
		const [buildError, status] = await safely<boolean>(blok.build());
		if (buildError || !status) {
			this.log(
				`Something went wrong building blok "${blok.name}" thus, blok not added to blok-runtime!`,
				buildError ? buildError : "",
			);
			return;
		}
		this.bloks.push(blok);
	}
}
