import { EventEmitter } from "events";
import config from "../boksi-conf.json";
import Core from "./core/Core";

const core = new Core(config);
const emitter = new EventEmitter();
emitter.emit("test");

export default { emitter };
