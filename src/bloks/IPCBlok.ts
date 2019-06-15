import { ChildProcess, fork } from "child_process";
import { existsSync } from "fs";
import { join } from "path";
import { inspect } from "util";
import { configs } from "../../types/configs/configs";
import { hookCommunications } from "../../types/hookCommunications";
import HookHandler from "../hooks/HookHandler";
import Link from "../hooks/Link";
import { isInstanceOfInterface, safely } from "../utils/patterns";
import Blok from "./Blok";

/**
 * IPC-blok is a blok that communicates with Boksi via IPC.
 *
 * @remarks
 * IPC-blok relies on {@link https://www.npmjs.com/package/node-ipc | the node-ipc -package}
 *
 * @extends Blok
 */
export default class IPCBlok extends Blok {

	/**
	 * The process in which the blok runs.
	 */
	private process: ChildProcess | null = null;

	/**
	 *
	 */
	private firePromiseResults: {
		reject: ((value?: void | PromiseLike<void> | undefined) => void) | null,
		resolve: ((value?: void | PromiseLike<void> | undefined) => void) | null,
	} = {
		reject: null,
		resolve: null,
	};

	/**
	 * {@inheritdoc Blok.constructor}
	 */
	public constructor(config: configs.BlokConfig, dirPath: string, hookHandler: HookHandler) {
		super(config, dirPath, hookHandler);
	}

	/**
	 * {@inheritdoc Blok.build}
	 */
	public async build(): Promise<boolean> {
		if (!this.config.entryPoint) {
			this.log(`No entrypoint given for runtime-blok in blok-conf.json for ${this.config.name}!`);
			return false;
		}
		return existsSync(join(this.dirPath, this.config.entryPoint));
	}

	/**
	 * {@inheritdoc Blok.launch}
	 */
	public launch(): boolean {
		this.log("Initializing...");
		try {
			this.process = fork(join(this.dirPath, this.config.entryPoint!));
			this.startProcessListener(this.process);
			return true;
		} catch (error) {
			this.log("Failed to fork blok-process!", error);
			return false;
		}
	}

	/**
	 * {@inheritdoc Blok.handleTermination}
	 */
	public async handleTermination(): Promise<void> {
		if (this.process) {
			this.process.kill();
		}
	}

	/**
	 *
	 */
	private startProcessListener(process: ChildProcess): void {
		process.on("message", message => {
			const bundle = JSON.parse(message);
			if (isInstanceOfInterface<hookCommunications.IPCHookLinkMessage>(bundle, "isLinkMessage")) {
				if (this.hookHandler.getHookByName(bundle.hookName)) {
					this.hookHandler.linkToHookByName(
						bundle.hookName,
						new Link(this.generateCallbackForLink(this.process!, bundle.hookName)),
					);
				}
			} else if (isInstanceOfInterface<hookCommunications.IPCHookCreationMessage>(bundle, "isCreationMessage")) {
				this.hookHandler.createCustomHook(bundle.hookName);
			} else if (isInstanceOfInterface<hookCommunications.IPCFireHookMessage>(bundle, "isFireMessage")) {
				const hook = this.hookHandler.getHookByName(bundle.hookName);
				if (hook) {
					hook.fire(bundle.data);
				}
			} else if (isInstanceOfInterface<hookCommunications.IPCSuccessMessage>(bundle, "isSuccessMessage")) {
				if (this.firePromiseResults.resolve) {
					this.firePromiseResults.resolve();
					this.firePromiseResults = { resolve: null, reject: null };
				}
			} else if (isInstanceOfInterface<hookCommunications.IPCFailureMessage>(bundle, "isFailureMessage")) {
				if (this.firePromiseResults.reject) {
					this.firePromiseResults.reject();
					this.firePromiseResults = { resolve: null, reject: null };
				}
			}
		});
	}

	/**
	 *
	 */
	private generateCallbackForLink<T>(process: ChildProcess, hookName: string): (data: T) => Promise<void> {
		const blokName = this.name;
		return (d: T) => new Promise<void>((resolve, reject) => {
			this.firePromiseResults = { resolve, reject };
			const bundle: hookCommunications.IPCFireHookMessage = {
				blokName,
				data: inspect(d),
				hookName,
				isFireMessage: true,
			};
			process.send(JSON.stringify(bundle));
		});
	}
}
