import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import "mocha";
import { join } from "path";
import IPCBlok from "../src/bloks/IPCBlok";
import HookHandler from "../src/hooks/HookHandler";
import { configs } from "../types/configs/configs";
import config from "./fixtures/test-bloks/IPC-example__blok/blok_setup/blok-conf.json";
import { clearDir } from "./utils/utils";

const expect = chai.expect;
chai.use(chaiAsPromised);

describe("IPCBlok", () => {
	const logDir = join(__dirname, "/tmp");
	after(() => clearDir(logDir));

	const blok = new IPCBlok(
		config as configs.BlokConfig,
		"D:/Git-projects/boksi/boksi-core/test/fixtures/test-bloks/IPC-example__blok",
		new HookHandler(logDir),
		logDir,
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
