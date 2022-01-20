import express, { Express } from "express";
import InventoryController from "./Inventory.controller";

export const inventoryRoute = (app: Express) => {
	const controller = new InventoryController();
	const router = express.Router();

	// Get some items
	router.get("/", async (req, res) => {
		controller.getItems(req, res);
	});

	// Get one
	router.get("/:id", async (req, res) => {
		controller.getItems(req, res);
	});

	// Find items by query
	router.post("/", async (req, res) => {
		controller.searchItems(req, res);
	});

	// Add some items
	router.post("/add", async (req, res) => {
		controller.addItems(req, res);
	});

	// Remove some items
	router.post("/remove", async (req, res) => {
		controller.removeItems(req, res);
	});

	// Delete some items
	router.delete("/", async (req, res) => {
		controller.deleteItems(req, res);
	});

	// Delete some items
	router.delete("/:id", async (req, res) => {
		controller.deleteItems(req, res);
	});

	app.use("/inventory", router);
};
