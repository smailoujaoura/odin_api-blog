import pino from "pino";
import ENV from "./secrets.js";

export default pino(
	{
		level: ENV.NODE_ENV === "development" ? "debug" : "info",
	},
	pino.transport({
		target: "pino-pretty",
		options: {
			colorize: true,
			translateTime: "yyyy-mm-dd HH:MM:ss",
			ignore: "pid,hostname",
		},
	})
);

