import express, { Express } from "express";
import helmet from "helmet";
import dotenv from "dotenv";
import cors from "cors";
import { routes } from "./routes/v1";

dotenv.config();

const app: Express = express();
const corsOption = {
	origin: "*",
};

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "http://localhost";

app.use(cors(corsOption));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// register api v1
routes(app);

app.listen(PORT, () => {
	console.log(`Running on ${HOST}:${PORT}/ || ${process.env.NODE_ENV} mode`);
});
