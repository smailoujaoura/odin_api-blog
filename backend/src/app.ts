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

const allowedOrigins = [
  'https://blog-api-amber-theta.vercel.app',
  'https://blog-api-frontend-topaz.vercel.app',
  'http://localhost:5173'
];

app.use(cors({
	origin: (origin, callback) => {
		if (!origin || allowedOrigins.includes(origin)) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},
	credentials: true
}));

app.use('/api', router);
app.use(errorsHandler);

app.listen(ENV.PORT, () => {
	logger.info(`listening on port ${ENV.PORT}`);
})
