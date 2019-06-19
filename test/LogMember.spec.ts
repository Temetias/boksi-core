import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { existsSync, rmdirSync } from "fs";
import "mocha";
import { join } from "path";
import LogMember from "../src/log/LogMember";
import { clearDir, lookFromFile } from "./utils/utils";

const expect = chai.expect;
chai.use(chaiAsPromised);

describe("LogMember", () => {
	const logDir = join(__dirname, "/tmp");
	const logFile = `${new Date().toLocaleDateString()}.txt`;
	const nonExistingLogDir = join(__dirname, "/tmp-tmp");
	after(() => {
		clearDir(logDir);
		clearDir(nonExistingLogDir);
		rmdirSync(nonExistingLogDir);
	});
	class BaseClass extends LogMember {}

	it("should create the log directory if it doesn't exist", () => {
		// tslint:disable-next-line:no-unused-expression
		new BaseClass("test-class", nonExistingLogDir);
		if (!existsSync(nonExistingLogDir)) {
			// tslint:disable-next-line:no-string-throw
			throw (`Expected the log directory "${nonExistingLogDir}" to be created, but it was not!`);
		}
	});

	it("should create a log file if it doesn't exist", () => {
		const logger = new BaseClass("test-class", logDir);
		logger.log("Test message.");
		if (!existsSync(join(logDir, logFile))) {
			// tslint:disable-next-line:no-string-throw
			throw (`Expected the log directory "${nonExistingLogDir}" to be created, but it was not!`);
		}
	});

	it("should log to the file in the expected format", () => {
		const source = "test-class";
		const logger = new BaseClass(source, logDir);
		const error = new Error("Test error.");
		const message = "Test message to look for.";
		logger.log(message, error);

		const title = `${new Date().toLocaleString()} - from ${source}:`;
		const formattedMessage = `${message} ${error ? "Trace below:\n----\n" + error + "\n----" : ""}\n`;
		const expectedOutput = `\n${title}\n${formattedMessage}`;
		expect(lookFromFile(join(logDir, logFile), expectedOutput)).to.equal(true);
	});
});
