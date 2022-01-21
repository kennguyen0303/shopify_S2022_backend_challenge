import { logQueries } from "./Log.query";
import postgresInstance, { CustomQueryResult, GetInput } from "../../database/postgres/db.instance";

export interface LogItem {
	item_id: number;
	qty: number;
	total_qty: number;
	made_at?: string;
}

export interface ReportInput {
	from: Date;
	to: Date;
}

class LogService {
	constructor() {
		// Initiate the table
	}

	async getItems(input: GetInput): Promise<CustomQueryResult> {
		return await postgresInstance.getFromTable("Log", input);
	}

	/**
	 * Create one log item
	 * @param body An item {item_id, qty}
	 * @returns \{success, message}
	 */
	async createItem(item: LogItem): Promise<CustomQueryResult> {
		let queryArr = [logQueries.CREATE_ITEM];
		let params: (string | number)[] = [];
		params.push(item.item_id, item.qty, item.total_qty);

		// query for adding values
		queryArr.push(`($1, $2, $3, now())`);
		return await postgresInstance.executeQueryInTransaction(queryArr.join(" "), params);
	}

	/**
	 * Delete one or many items based on given condition
	 * @param input
	 * @returns
	 */
	async deleteItems(input: GetInput): Promise<CustomQueryResult> {
		return await postgresInstance.deleteFromTable("Log", input);
	}

	/**
	 * Return the list of most out of stock items
	 * @param input
	 * @returns \{success, data, message}
	 */
	async getMostOutOfStockItem(input: ReportInput) {
		// double check the data type of inputs from users
		let from: Date = input.from instanceof Date ? input.from : new Date(input.from);
		let to: Date = input.to instanceof Date ? input.to : new Date(input.to);

		if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
			return {
				success: false,
				message: "Invalid from/to format. Please enter YYYY-MM-DD",
			};
		}

		const params = [from.toISOString(), to.toISOString()];
		const query = logQueries.MOST_OUT_OF_STOCK;
		return await postgresInstance.executeQuery(query, params);
	}

	/**
	 * Return the last item
	 * @param input
	 * @returns \{success, data, message}
	 */
	async getLastItem() {
		const query = logQueries.GET_LAST_LOG;
		return await postgresInstance.executeQuery(query);
	}
}

export default LogService;
