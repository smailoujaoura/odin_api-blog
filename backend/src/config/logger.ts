import pino from "pino";
import ENV from "./secrets.js";

const transport = process.env.NODE_ENV === 'production' 
	? undefined 
	: pino.transport({
		target: "pino-pretty",
		options: {
			colorize: true,
			translateTime: "yyyy-mm-dd HH:MM:ss",
			ignore: "pid,hostname",
		},
	});

export default pino(
	{
		level: ENV.NODE_ENV === "development" ? "debug" : "info",
	},
	transport
);
