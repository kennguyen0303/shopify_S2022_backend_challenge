import { Request, Response } from "express";
import { GetInput } from "../../database/postgres/db.instance";
import ItemService, { Item } from "./Item.service";

class ItemController {
	private itemService: ItemService;
	constructor() {
		this.itemService = new ItemService();
	}

	/**
	 * Get one or more item without filter
	 * @param req
	 * @param res
	 * @returns
	 */
	public async getItems(req: Request, res: Response) {
		const input: GetInput = {
			searchQuery: "",
			skip: Number.parseInt(req.query?.skip as string),
			limit: Number.parseInt(req.query?.limit as string),
		};
		let response = await this.itemService.getItems(input);

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

		let response = await this.itemService.getItems(input);
		return response.success ? res.send(response) : res.status(400).send(response);
	}

	/**
	 * Create one ore more items
	 * @param req
	 * @param res
	 * @returns
	 */
	public async createItems(req: Request, res: Response) {
		const input: Item[] = req.body?.items; // make a copy of data
		let response = await this.itemService.createItems(input);
		return response.success ? res.send(response) : res.status(400).send(response);
	}

	/**
	 * Update only one item
	 * @param req
	 * @param res
	 * @returns
	 */
	public async updateItem(req: Request, res: Response) {
		const input: Item = { ...req.body };
		input.id = Number.parseInt(req.params?.id);
		console.log(input);
		let response = await this.itemService.updateItem(input);
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
		let response = await this.itemService.deleteItems(input);
		return response.success ? res.send(response) : res.status(400).send(response);
	}
}

export default ItemController;
