import { Express } from "express";
import path from "path";
import { itemRoute } from "../../modules/Item/Item.route";
import { middlewareLoader } from "./MiddlewareLoader";

export const routes = (app: Express) => {
	// load middleware
	middlewareLoader(app);

	// item route
	itemRoute(app);

	// hosted static front-end file
	app.get("/", function (req, res) {
		res.sendFile(path.join(__dirname, "../../../../../frontend/index.html"));
	});
};
