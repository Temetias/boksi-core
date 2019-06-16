import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import "mocha";
import Link from "../src/hooks/Link";
import { timeout } from "./utils/utils";

const expect = chai.expect;
chai.use(chaiAsPromised);

describe("Link", () => {
	const link = new Link(timeout);

	it("should have an id of which length is 32", () => {
		expect(link.id).to.have.lengthOf(32);
	});

	it("should be able to execute its asynchronous callback successfully", async () => {
		await expect(link.callBack({ ms: 100 })).to.not.be.rejected;
	});

	it("should reject asynchronous callback normally", async () => {
		await expect(link.callBack({ ms: 100, forceFail: true })).to.be.rejected;
	});
});
