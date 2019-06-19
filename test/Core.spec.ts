import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import "mocha";
import { join } from "path";
import Core from "../src/core/Core";
import HookHandler from "../src/hooks/HookHandler";
import coreConfig from "./fixtures/test-boksi-conf.json";

const expect = chai.expect;
chai.use(chaiAsPromised);

describe("Core", function() {
	this.timeout(6000);

	// Redirects to fixtures.
	coreConfig.bloksDir = join(__dirname, coreConfig.bloksDir);
	coreConfig.logDir = join(__dirname, "/tmp");

	const logDir = join(__dirname, "/tmp");
	const hookHandler = new HookHandler(logDir);
	let core: Core | null = null;

	it("should construct succesfully (TODO)", () => {
		/**
		 * TODO: Implement "SIGINT" simulation with SinonJS or similar alternative.
		 * expect(core = new Core(coreConfig, hookHandler));
		 */
	});
});
