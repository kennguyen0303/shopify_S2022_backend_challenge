import { queryItems } from "./Item.query";
import postgresInstance, { CustomQueryResult, GetInput } from "../../database/postgres/db.instance";

export interface Item {
	id?: number;
	name: string;
	price: number;
	created_at?: Date;
}

class ItemService {
	constructor() {
		// Initiate the table
	}

	async createTable(): Promise<CustomQueryResult> {
		return await postgresInstance.executeQueryInTransaction(
			queryItems.CREATE_ITEM_TABLE_IF_NOT_EXISTS
		);
	}

	async getItems(input: GetInput): Promise<CustomQueryResult> {
		return await postgresInstance.getFromTable("Items", input);
	}

	/**
	 * Create one or more items
	 * @param body An array of items
	 * @returns \{success, message}
	 */
	async createItems(items: Item[]): Promise<CustomQueryResult> {
		let queryArr = [queryItems.CREATE_ITEM];
		let params: (string | number)[] = [];

		// Batch creation can be implemented here
		let count = 1;
		for (let i = 0; i < items.length; i++) {
			let item = items[i];
			// value check
			let isValid =
				item.name !== undefined && item.name !== "" && item.price !== undefined && item.price > 0;
			if (!isValid) {
				// return error without creating any item
				return { success: false, message: `Invalid input at element ${i + 1}` };
			}

			params.push(item.name, item.price);

			// don't add comma for the first item
			if (i != 0) {
				queryArr.push(", ");
			}

			// query for adding values
			queryArr.push(`($${count++},$${count++},now())`);
		}
		return await postgresInstance.executeQueryInTransaction(queryArr.join(" "), params);
	}

	async updateItem(body: Item): Promise<CustomQueryResult> {
		let result: CustomQueryResult = {
			success: false,
			message: "",
		};
		let originalParams = {
			price: 0,
			name: "",
		};

		// value check
		if (!body.id || !Number.isInteger(body.id)) {
			result.message = "Invalid ID";
			return result;
		}
		const isValidInput =
			(body.name !== undefined && body.name !== "") || (body.price !== undefined && body.price > 0);
		if (!isValidInput) {
			result.message = "Invalid data for update";
			return result;
		}

		// Filter params to take only the updatable fields
		if (body.name !== undefined && body.name !== "") originalParams.name = body.name;
		if (body.price !== undefined && body.price > 0) originalParams.price = body.price;

		// make update query
		const { query, params } = postgresInstance.makeQueryAndParamsForUpdateByID(
			body.id,
			"Items",
			originalParams
		);

		// execute and return value
		return await postgresInstance.executeQueryInTransaction(query, params);
	}

	/**
	 * Delete one or many items based on given condition
	 * @param input
	 * @returns
	 */
	async deleteItems(input: GetInput): Promise<CustomQueryResult> {
		return await postgresInstance.deleteFromTable("Items", input);
	}
}

export default ItemService;
