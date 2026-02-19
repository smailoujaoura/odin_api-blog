import express from "express"
import ENV from "./config/secrets.js";
import logger from "./config/logger.js";

const app = express();

app.listen(ENV.PORT, () => {
	logger.info(`listening on port ${ENV.PORT}`);
})