import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import "mocha";
import HookHandler from "../src/hooks/HookHandler";
import Link from "../src/hooks/Link";
import { timeout } from "./utils/utils";

const expect = chai.expect;
chai.use(chaiAsPromised);

describe("HookHandler", () => {
	const hookHandler = new HookHandler();
	const numberLinks = [
		new Link<number>(ms => timeout({ ms })),
		new Link<number>(ms => timeout({ ms })),
		new Link<number>(ms => timeout({ ms })),
	];
	const voidLinks = [
		new Link<void>(async () => await timeout({ ms: 100 })),
		new Link<void>(async () => await timeout({ ms: 100 })),
		new Link<void>(async () => await timeout({ ms: 100 })),
	];

	it("should have created native hooks on creation", async () => {
		expect(Object.keys(hookHandler.native).length).to.not.be.lessThan(1);
	});

	it("should be able to create a custom hook", async () => {
		expect(hookHandler.createCustomHook<number>("test-hook")).to.equal(true);
		expect(hookHandler.custom["test-hook"].name).to.equal("test-hook");
		await expect(hookHandler.custom["test-hook"].fire({})).to.not.be.rejected;
	});

	it("should be able to get a native hook by name", () => {
		expect(hookHandler.getHookByName("launch")!.name).to.equal("launch");
	});

	it("should be able to get a custom hook by name", () => {
		expect(hookHandler.getHookByName("test-hook")!.name).to.equal("test-hook");
	});

	it("should be able to create links to native hooks", () => {
		voidLinks.forEach(link => hookHandler.linkToHookByName("launch", link));
	});

	it("should be able to create links to custom hooks", () => {
		numberLinks.forEach(link => hookHandler.linkToHookByName("test-hook", link));
	});

	it("should have its hooks functioning after they have been linked to", async () => {
		const nativeHookFires = Object.keys(hookHandler.native).map(hook => hookHandler.native[hook].fire(100));
		const customHookFires = Object.keys(hookHandler.custom).map(hook => hookHandler.custom[hook].fire(100));
		await expect(Promise.all(nativeHookFires.concat(customHookFires))).to.not.be.rejected;
	});
});
