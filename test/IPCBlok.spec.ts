import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import "mocha";
import IPCBlok from "../src/bloks/IPCBlok";
import HookHandler from "../src/hooks/HookHandler";
import { configs } from "../types/configs/configs";
import config from "./fixtures/test-bloks/IPC-example__blok/blok_setup/blok-conf.json";

const expect = chai.expect;
chai.use(chaiAsPromised);

describe("IPCBlok", () => {
	const blok = new IPCBlok(
		config as configs.BlokConfig,
		"D:/Git-projects/boksi/boksi-core/test/fixtures/test-bloks/IPC-example__blok",
		new HookHandler(),
	);

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
