import express, { Express } from "express";
import helmet from "helmet";
import cors from "cors";

export const middlewareLoader = (app: Express) => {
	const corsOption = {
		origin: "*",
	};

	// define middleware
	app.use(cors(corsOption));
	app.use(helmet());
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
};
