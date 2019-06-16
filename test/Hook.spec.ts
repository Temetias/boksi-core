import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import "mocha";
import Hook from "../src/hooks/Hook";
import Link from "../src/hooks/Link";
import { timeout } from "./utils/utils";

const expect = chai.expect;
chai.use(chaiAsPromised);

describe("Hook", () => {
	const hookName = "Test-Hook";
	const hook = new Hook<number>(hookName);
	const links = [
		new Link<number>(ms => timeout({ ms })),
		new Link<number>(ms => timeout({ ms })),
		new Link<number>(ms => timeout({ ms })),
	];

	it("should have the correct name", () => {
		expect(hook.name).to.equal(hookName);
	});

	it("should be able to receive links", () => {
		links.forEach(link => hook.handleLink(link));
		expect(hook.links.length).to.equal(3);
	});

	it("should be able to fire all of its links", async () => {
		await expect(hook.fire(100)).to.not.be.rejected;
	});

	it("should be able to unlink links", () => {
		links.forEach(link => hook.unlink(link));
		expect(hook.links.length).to.equal(0);
	});
});
