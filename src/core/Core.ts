import { createServer, IncomingMessage , Server, ServerResponse } from "http";
import { configs } from "../../types/configs/configs";
import BloksHandler from "../blok-handler/BloksHandler";
import LogMember from "../log/LogMember";

/**
 * 
 */
export default class Core extends LogMember {

	/**
	 * 
	 */
	private readonly config: configs.BoksiCoreConfig;

	/**
	 * 
	 */
	private readonly bloksHandler: BloksHandler;

	/**
	 * 
	 */
	private readonly server: Server;


	/**
	 * 
	 */
	public constructor(config: configs.BoksiConfig) {
		super("Core");
		this.log("Initializing core...");
		this.config = config.coreConfig;
		this.bloksHandler = new BloksHandler(config.bloksConfig);
		this.server = this.buildServer();
		this.startServer();
	}

	/**
	 * 
	 */
	private buildServer(): Server {
		const server = createServer(this.requestHandler);
		return server;
	}

	/**
	 * 
	 */
	private requestHandler = (request: IncomingMessage, response: ServerResponse): void => {
		response.end(
			`Hello from Boksi!\n\nCurrently available bloks:\n${
				this.bloksHandler.getBloks().map(blok =>
					`${blok.name} - ${blok.isEnabled ? "Enabled" : "Disabled"}`,
				)
			}`,
		);
	}

	/**
	 * 
	 */
	private startServer(): void {
		const port = process.env.NODE_ENV === "production"
			? this.config.port
			: this.config.devPort
		;
		this.server.listen(port);
		this.log(`Boksi is listening on port ${port} in ${process.env.NODE_ENV} mode.`);
	}
}