import { IncomingMessage } from "http";
import { Socket } from "net";
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
		 * A hook that triggers when Boksi has launched.
		 */
		launch: new Hook<void>("launch"),

		/**
		 * A hook that triggers when Boksi's server receives a request. (If a server is setup).
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
			// Handle hook registers.
			this.IPC.server.on("boksi-hook-ipc-register", (request: string) => {
				this.handleIPCLink(request);
			});
			// Handle hook triggers.
			this.IPC.server.on("boksi-hook-ipc-trigger", (request: string) => {
				this.handleIPCTrigger(request);
			});
		});
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
		const registrationBundle = JSON.parse(request) as hookCommunications.IPCHookLinkMessage;
		if (this.native[registrationBundle.hookName]) {
			const callback = this.buildIPCCallback();
			this.native[registrationBundle.hookName].linkIPCCallback(callback);
		} else if (this.custom[registrationBundle.hookName]) {
			const callback = this.buildIPCCallback();
			this.custom[registrationBundle.hookName].linkIPCCallback(callback);
		} else {
			this.log(
				`Blok "${registrationBundle.blokName}" attempted to register to an unknown
				hook "${registrationBundle.hookName}"!`,
			);
		}

	}

	/**
	 *
	 */
	private handleIPCTrigger(request: string): void {
		const triggerBundle = JSON.parse(request) as hookCommunications.IPCHookMessage;
		if (this.native[triggerBundle.hookName]) {
			this.native[triggerBundle.hookName].fire(triggerBundle.data);
		} else if (this.custom[triggerBundle.hookName]) {
			this.custom[triggerBundle.hookName].fire(triggerBundle.data);
		} else {
			this.log(
				`Blok "${triggerBundle.blokName}" attempted to trigger an unknown
				hook "${triggerBundle.hookName}"!`,
			);
		}
	}

	/**
	 *
	 */
	private buildIPCCallback(): (data: any) => void {
		const server = this.IPC.server;
		return (data: any) => {
			const stringifiedData = typeof data === "string" ? data : JSON.stringify(data);
			server.emit("boksi-hook-ipc-trigger", stringifiedData);
		};
	}
}
