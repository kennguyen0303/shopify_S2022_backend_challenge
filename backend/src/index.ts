import express, { Express } from "express";
import helmet from "helmet";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app: Express = express();
const corsOption = {
	origin: "*",
};

const PORT = process.env.PORT || 3000;
app.use(cors(corsOption));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
	console.log(`Running on ${PORT}/ || ${process.env.NODE_ENV} mode`);
});
