import express, { Express } from "express";
import dotenv from "dotenv";
import { routes } from "./routes/v1";
import postgresInstance from "./database/postgres/db.instance";

dotenv.config();

const app: Express = express();
const corsOption = {
	origin: "*",
};

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "http://localhost";

// register api v1
routes(app);

// if api not found
app.get("*", (req, res) => {
	return res.status(404).send("API not found");
});

// app starts
app.listen(PORT, async () => {
	console.log(`Running on ${HOST}:${PORT}/ || ${process.env.NODE_ENV} mode`);

	// connect to db
	await postgresInstance.testConnectivity(5, 10000);
	await postgresInstance.initiateTables();
});
