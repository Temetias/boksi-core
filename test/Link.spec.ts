import { expect } from "chai";
import "mocha";
import Link from "../src/hooks/Link";

describe("Link", () => {
	it("should have an id", () => {
		const result = new Link(async (_) => { /* noop */ });
		expect(result).to.haveOwnProperty("id");
	});

	it("should have an id which is a string", () => {
		const result = new Link(async (_) => { /* noop */ });
		expect(result.id).to.be.a("string");
	});

	it("should have an id of which length is 32", () => {
		const result = new Link(async (_) => { /* noop */ });
		expect(result.id).to.have.lengthOf(32);
	});
});
