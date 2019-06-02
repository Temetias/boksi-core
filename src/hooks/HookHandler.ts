import { IncomingMessage } from "http";
import { IPC } from "node-ipc";
import { hookCommunications } from "../../types/hookCommunications";
import LogMember from "../log/LogMember";
import Hook from "./Hook";

/**
 * The class-instance that handles the hook-system of Boksi.
 */
export default class HookHandler extends LogMember {

	/**
	 *
	 */
	public native: { [name: string]: Hook<any> } = {

		/**
		 * A hook that fires when Boksi has launched.
		 */
		launch: new Hook<void>("launch"),

		/**
		 * A hook that fires when Boksi's server receives a request. (If a server is setup).
		 *
		 * @remarks
		 * To enable Boksi-server, specify that in the boksi-conf.json.
		 */
		request: new Hook<IncomingMessage>("request"),
	};

	/**
	 *
	 */
	public readonly custom: { [name: string]: Hook<any> } = {};

	/**
	 *
	 */
	private readonly IPC = new IPC();

	/**
	 *
	 */
	public constructor() {
		super("Hook-handler");
		this.IPC.config.id = "boksi-hook-ipc";
		this.IPC.config.retry = 1500;
		this.IPC.config.silent = true;
		this.IPC.serve(() => {
			// Handle hook creation.
			this.IPC.server.on("boksi-hook-ipc-create", (request: string) => {
				this.handleIPCHookCreation(request);
			});
			// Handle hook links.
			this.IPC.server.on("boksi-hook-ipc-link", (request: string) => {
				console.log("Link!");
				this.handleIPCLink(request);
			});
			// Handle hook fires.
			this.IPC.server.on("boksi-hook-ipc-fire", (request: string) => {
				this.handleIPCFire(request);
			});
		});
		this.IPC.server.start();
	}

	/**
	 *
	 */
	private handleIPCHookCreation(request: string): void {
		const creationBundle = JSON.parse(request) as hookCommunications.IPCHookCreationMessage;
		if (!this.custom[creationBundle.hookName]) {
			this.custom[creationBundle.hookName] = new Hook<any>(creationBundle.hookName);
		} else {
			this.log(
				`A blok attempted to re-create an already assigned hook "${creationBundle.hookName}"!`,
			);
		}
	}

	/**
	 *
	 */
	private handleIPCLink(request: string): void {
		const linkBundle = JSON.parse(request) as hookCommunications.IPCHookLinkMessage;
		if (this.native[linkBundle.hookName]) {
			const callback = this.buildIPCCallback();
			this.native[linkBundle.hookName].linkIPCCallback(callback);
		} else if (this.custom[linkBundle.hookName]) {
			const callback = this.buildIPCCallback();
			this.custom[linkBundle.hookName].linkIPCCallback(callback);
		} else {
			this.log(
				`Blok "${linkBundle.blokName}" attempted to link to an unknown
				hook "${linkBundle.hookName}"!`,
			);
		}

	}

	/**
	 *
	 */
	private handleIPCFire(request: string): void {
		const fireBundle = JSON.parse(request) as hookCommunications.IPCHookMessage;
		if (this.native[fireBundle.hookName]) {
			this.native[fireBundle.hookName].fire(fireBundle.data);
		} else if (this.custom[fireBundle.hookName]) {
			this.custom[fireBundle.hookName].fire(fireBundle.data);
		} else {
			this.log(
				`Blok "${fireBundle.blokName}" attempted to fire an unknown
				hook "${fireBundle.hookName}"!`,
			);
		}
	}

	/**
	 *
	 */
	private buildIPCCallback(): (data: any) => void {
		return (data: any) => {
			const stringifiedData = typeof data === "string" || !data ? data : JSON.stringify(data, this.getCircularReplacer);
			this.IPC.server.emit("boksi-hook-ipc-fire", stringifiedData);
		};
	}

	/**
	 *
	 */
	private getCircularReplacer(): (key: any, value: any) => any {
		const seen = new WeakSet();
		return (key, value) => {
			if (typeof value === "object" && value !== null) {
				if (seen.has(value)) {
					return;
				}
				seen.add(value);
			}
			return value;
		};
	}
}
