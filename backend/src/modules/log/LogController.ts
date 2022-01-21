import { GetInput } from "../../database/postgres/db.instance";
import { Request, Response } from "express";
import LogService, { LogItem } from "./LogService";

class LogController {
	private logService: LogService;
	constructor() {
		this.logService = new LogService();
	}

	/**
	 * Create one log item {item_id, qty}
	 * @param req
	 * @param res
	 * @returns
	 */
	public async createItem(req: Request, res: Response) {
		const input: LogItem = req.body?.item; // make a copy of data
		let response = await this.logService.createItem(input);
		return res.send(response);
	}

	/**
	 * Get either by id or all
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

		if (req.params.id !== undefined) {
			input.searchQuery = `log_id = ${Number.parseInt(req.params.id)}`;
		}

		let response = await this.logService.getItems(input);

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
			searchQuery: req.body?.searchQuery || "",
			skip: req.body?.skip,
			limit: req.body?.limit,
		};

		let response = await this.logService.getItems(input);
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
			input.searchQuery = `log_id = ${Number.parseInt(req.params.id)}`;
		}

		let response = await this.logService.deleteItems(input);
		return response.success ? res.send(response) : res.status(400).send(response);
	}

	public async getMostOutOfStockItem(req: Request, res: Response) {
		let response = await this.logService.getMostOutOfStockItem(req.body);
		return response.success ? res.send(response) : res.status(400).send(response);
	}
}

export default LogController;
