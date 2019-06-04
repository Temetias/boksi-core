import { IncomingMessage } from "http";
import { Socket } from "net";
import { IPC } from "node-ipc";
import { inspect } from "util";
import { hookCommunications } from "../../types/hookCommunications";
import LogMember from "../log/LogMember";
import Hook from "./Hook";

/**
 * The class-instance that handles the hook-system of Boksi.
 */
export default class HookHandler extends LogMember {

	/**
	 * The native constant hooks that Boksi always has.
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
	 * Custom hooks that can be created by the bloks.
	 */
	public readonly custom: { [name: string]: Hook<any> } = {};

	/**
	 * The IPC connection used to message hook-fires to the IPC bloks.
	 */
	private readonly IPC = new IPC();

	/**
	 * @constructor
	 */
	public constructor() {
		super("Hook-handler");
		this.IPC.config.id = "boksi-hook-ipc";
		this.IPC.config.retry = 1500;
		this.IPC.config.silent = true;
		this.IPC.serve(() => {
			// Handle hook creation.
			this.IPC.server.on("boksi-hook-ipc-create", (request: string, socket: Socket) => {
				this.handleIPCHookCreation(request);
			});
			// Handle hook links.
			this.IPC.server.on("boksi-hook-ipc-link", (request: string, socket: Socket) => {
				this.handleIPCLink(request, socket);
			});
			// Handle hook fires.
			this.IPC.server.on("boksi-hook-ipc-fire", (request: string, socket: Socket) => {
				this.handleIPCFire(request);
			});
		});
		this.IPC.server.start();
	}

	/**
	 * Handles the creation of a hook via IPC.
	 *
	 * @param request A stringified hook-creation message from an IPC blok.
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
	 * Handles linking a blok to a hook via IPC.
	 *
	 * @param request A stringified hook-linking message from an IPC blok.
	 * @param socket The IPC socket.
	 */
	private handleIPCLink(request: string, socket: Socket): void {
		const linkBundle = JSON.parse(request) as hookCommunications.IPCHookLinkMessage;
		if (this.native[linkBundle.hookName]) {
			const callback = this.buildIPCCallback(socket, linkBundle.hookName);
			this.native[linkBundle.hookName].linkIPCCallback(callback);
		} else if (this.custom[linkBundle.hookName]) {
			const callback = this.buildIPCCallback(socket, linkBundle.hookName);
			this.custom[linkBundle.hookName].linkIPCCallback(callback);
		} else {
			this.log(
				`Blok "${linkBundle.blokName}" attempted to link to an unknown
				hook "${linkBundle.hookName}"!`,
			);
		}

	}

	/**
	 * Handles a firing request from a IPC blok.
	 *
	 * @param request A stringified hook-firing message from a IPC blok.
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
	 * Builds a callback to link to a hook to enable it triggering via IPC. A hook only needs one IPC callback to be
	 * visible to all bloks that are linked to it.
	 *
	 * @param socket The IPC socket.
	 * @param hookName The name of the hook to bundle with the IPC message to distinguish the hook fire message.
	 *
	 * @returns The functioning IPC hook fire functionality callback.
	 */
	private buildIPCCallback(socket: Socket, hookName: string): (data: any) => void {
		return (data: any) => {
			const stringifiedData = JSON.stringify({ hookName, data: inspect(data) });
			this.IPC.server.emit(socket, "boksi-hook-ipc-fire", stringifiedData);
		};
	}
}
