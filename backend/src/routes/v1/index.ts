import { Express } from "express";
import path from "path";
import { middlewareLoader } from "./MiddlewareLoader";

export const routes = (app: Express) => {
	// load middleware
	middlewareLoader(app);

	// download
	app.get("/download", function (req, res) {
		res.download("../data/hello.txt", function (error) {
			console.log("Error : ", error);
		});
	});

	// hosted static front-end file
	app.get("/", function (req, res) {
		res.sendFile(path.join(__dirname, "../../../../../frontend/index.html"));
	});
};
