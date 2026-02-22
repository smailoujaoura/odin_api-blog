import express from "express"
import ENV from "./config/secrets.js";
import logger from "./config/logger.js";
import router from "./routes/router.js";
import { errorsHandler } from "./middlewares/errors.js";
import cookieParser from "cookie-parser";
import cors from 'cors'

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// const origins = [ENV.ORIGIN_ONE, ENV.ORIGIN_TWO];
app.use(cors({
    origin: (origin, callback) => {
        // If there is no origin (like a server-to-server request) 
        // or any origin at all, allow it and mirror it back.
        callback(null, true);
    },
    credentials: true,
}));

app.use('/api', router);
app.use(errorsHandler);

app.listen(ENV.PORT, () => {
	logger.info(`listening on port ${ENV.PORT}`);
})
