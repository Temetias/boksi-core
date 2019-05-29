import { configs } from "../../types/configs/configs";
import { safely } from "../utils/patterns";
import Blok from "./Blok";

/**
 *
 */
export default class IPCBlok extends Blok {

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
		return false;
	}
}
