import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import "mocha";
import Hook from "../src/hooks/Hook";
import Link from "../src/hooks/Link";
import { timeout } from "./utils/utils";

const expect = chai.expect;
chai.use(chaiAsPromised);

interface ITestBundle {
	ms: number;
	forceFail?: boolean;
}

describe("Hook", () => {
	const hookName = "Test-Hook";
	const hook = new Hook<ITestBundle>(hookName);
	const links = [
		new Link<ITestBundle>(bundle => timeout(bundle)),
		new Link<ITestBundle> (bundle => timeout(bundle)),
		new Link<ITestBundle>(bundle => timeout(bundle)),
	];

	it("should have the correct name", () => {
		expect(hook.name).to.equal(hookName);
	});

	it("should be able to receive links", () => {
		links.forEach(link => hook.handleLink(link));
		expect(hook.links.length).to.equal(3);
	});

	it("should be able to fire all of its links", async () => {
		await expect(hook.fire({ ms: 100 })).to.not.be.rejected;
	});

	it("should throw an error if a link fire fails", async () => {
		await expect(hook.fire({ ms: 100, forceFail: true })).to.be.rejected;
	});

	it("should be able to unlink links", () => {
		links.forEach(link => hook.unlink(link));
		expect(hook.links.length).to.equal(0);
	});
});
