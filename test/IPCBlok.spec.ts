import { expect } from "chai";
import "mocha";
import IPCBlok from "../src/bloks/IPCBlok";
import HookHandler from "../src/hooks/HookHandler";
import { configs } from "../types/configs/configs";
import config from "./fixtures/IPCBlokConfig.json";

describe("IPCBlok", () => {
	const blok = new IPCBlok(
		config as configs.BlokConfig,
		"D:/Git-projects/boksi/boksi-core/test/fixtures/IPC-example__blok",
		new HookHandler(),
	);

	it("should have a name", () => {
		expect(blok).to.haveOwnProperty("name");
	});

	it("should have a name that is equal to the config", () => {
		expect(blok.name).to.equal(config.name);
	});

	it("should enable itself successfully", () => {
		expect(blok.launch()).to.equal(true);
	});

	it("should terminate successfully", async () => {
		await expect(blok.handleTermination()).to.not.be.rejected;
	});
});
