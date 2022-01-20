import { GetInput } from "../../database/postgres/db.instance";
import { Request, Response } from "express";
import InventoryService, { InventoryItem } from "./Inventory.service";

class InventoryController {
	private inventoryService: InventoryService;
	constructor() {
		this.inventoryService = new InventoryService();
	}

	public async addItems(req: Request, res: Response) {
		const input: InventoryItem[] = req.body?.items; // make a copy of data
		let response = await this.inventoryService.addItems(input);
		return res.send(response);
	}

	public async removeItems(req: Request, res: Response) {
		const input: InventoryItem[] = req.body?.items; // make a copy of data
		let response = await this.inventoryService.removeItems(input);
		return res.send(response);
	}

	public async getItems(req: Request, res: Response) {
		const input: GetInput = {
			searchQuery: "",
			skip: Number.parseInt(req.query?.skip as string),
			limit: Number.parseInt(req.query?.limit as string),
		};

		if (req.params.id !== undefined) {
			input.searchQuery = `item_id = ${Number.parseInt(req.params.id)}`;
		}

		let response = await this.inventoryService.getItems(input);

		return response.success ? res.send(response) : res.status(400).send(response);
	}

	/**
	 * Search for items with filter
	 * @param req
	 * @param res
	 * @returns
	 */
	public async searchItems(req: Request, res: Response) {
		const input: GetInput = {
			searchQuery: req.body?.searchQuery,
			skip: req.body?.skip,
			limit: req.body?.limit,
		};

		let response = await this.inventoryService.getItems(input);
		return response.success ? res.send(response) : res.status(400).send(response);
	}

	/**
	 * Delete one or more items based on the filter
	 * @param req
	 * @param res
	 * @returns
	 */
	public async deleteItems(req: Request, res: Response) {
		const input: GetInput = {
			searchQuery: req.body?.searchQuery,
		};

		if (req.params.id !== undefined) {
			input.searchQuery = `item_id = ${Number.parseInt(req.params.id)}`;
		}

		let response = await this.inventoryService.deleteItems(input);
		return response.success ? res.send(response) : res.status(400).send(response);
	}
}

export default InventoryController;
