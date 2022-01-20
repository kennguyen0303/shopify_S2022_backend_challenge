import express, { Express } from "express";
import ItemController from "./Item.controller";

export const itemRoute = (app: Express) => {
	const controller = new ItemController();
	const router = express.Router();

	// Get some items
	router.get("/", async (req, res) => {
		controller.getItems(req, res);
	});

	// Find items by query
	router.post("/", async (req, res) => {
		controller.searchItems(req, res);
	});

	// Create some items
	router.post("/create", async (req, res) => {
		controller.createItems(req, res);
	});

	// Update an item
	router.put("/:id", async (req, res) => {
		controller.updateItem(req, res);
	});

	// Create some items
	router.delete("/", async (req, res) => {
		controller.deleteItems(req, res);
	});

	app.use("/items", router);
};
