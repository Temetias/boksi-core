import { createServer, Server } from "http";
import HookHandler from "../hooks/HookHandler";

/**
 *
 */
export default class BoksiServer {

	/**
	 *
	 */
	private readonly server: Server;

	/**
	 *
	 */
	private readonly hooks: HookHandler;

	/**
	 *
	 */
	public constructor(hooks: HookHandler, port: number) {
		this.hooks = hooks;
		this.server = createServer((req, res) => {
			this.hooks.native["request"].fire(req);
		}).listen(port);
	}
}
