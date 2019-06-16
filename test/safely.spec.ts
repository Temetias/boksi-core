import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import "mocha";
import { safely } from "../src/utils/patterns";
import { asyncValue } from "./utils/utils";

const expect = chai.expect;
chai.use(chaiAsPromised);

describe("safely", () => {
	it("should return a [null, value] when successful", async () => {
		await expect(safely(asyncValue(100, "foobar"))).to.become([null, `Tested with value: "foobar"`]);
	});

	it("should return [error, null] when not succesful", async () => {
		const expectedError = new Error("Expected");
		await expect(safely(asyncValue(100, "foobar", expectedError))).to.become([expectedError, null]);
	});
});
