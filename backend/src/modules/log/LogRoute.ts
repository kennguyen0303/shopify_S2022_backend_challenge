import express, { Express } from "express";
import LogController from "./LogController";

export const logRoute = (app: Express) => {
	const controller = new LogController();
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

	// Delete some items
	router.delete("/", async (req, res) => {
		controller.deleteItems(req, res);
	});

	// Delete some items
	router.delete("/:id", async (req, res) => {
		controller.deleteItems(req, res);
	});

	// Get most out of stock
	router.post("/most_out_of_stock", async (req, res) => {
		controller.getMostOutOfStockItem(req, res);
	});

	app.use("/log", router);
};
