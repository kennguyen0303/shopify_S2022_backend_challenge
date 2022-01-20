import { ItemQueries } from "./Item.query";
import postgresInstance, { CustomQueryResult, GetInput } from "../../database/postgres/db.instance";

export interface Item {
	id?: number;
	name: string;
	price: number;
	created_at?: Date;
}

interface CreateItemInput {
	item: Item;
	index: number;
	paramCount: number;
	params: (string | number)[];
	queryArr: string[];
}
class ItemService {
	constructor() {
		// Initiate the table
	}

	async createTable(): Promise<CustomQueryResult> {
		return await postgresInstance.executeQueryInTransaction(
			ItemQueries.CREATE_ITEM_TABLE_IF_NOT_EXISTS
		);
	}

	async getItems(input: GetInput): Promise<CustomQueryResult> {
		return await postgresInstance.getFromTable("Items", input);
	}

	/**
	 * Create one or more items
	 * @param body An array of items [{name, price}]
	 * @returns \{success, message}
	 */
	async createItems(items: Item[]): Promise<CustomQueryResult> {
		let queryArr = [ItemQueries.CREATE_ITEM];
		let params: (string | number)[] = [];

		if (items === undefined || items?.length === undefined || items.length == 0) {
			return {
				success: false,
				message:
					"no item was provided, please provide an array with each element in the format {name: string, price: number}",
			};
		}

		// Batch creation can be implemented here
		let count = 1;
		for (let i = 0; i < items.length; i++) {
			let input: CreateItemInput = {
				index: i,
				item: items[i],
				paramCount: count,
				params: params,
				queryArr: queryArr,
			};
			try {
				this.makeQueryForCreateItemAtIndex(input);
				count = count + 2;
			} catch (error: any) {
				return { success: false, message: error.message };
			}
		}
		return await postgresInstance.executeQueryInTransaction(queryArr.join(" "), params);
	}

	makeQueryForCreateItemAtIndex(input: CreateItemInput) {
		// value check
		let isValid =
			input.item.name !== undefined &&
			input.item.name !== "" &&
			input.item.price !== undefined &&
			input.item.price > 0;
		if (!isValid) {
			// return error without creating any item
			throw new Error(`Invalid input at element ${input.index}`);
		}

		input.params.push(input.item.name, input.item.price);

		// don't add comma for the first item
		if (input.index != 0) {
			input.queryArr.push(", ");
		}

		// query for adding values
		input.queryArr.push(`($${input.paramCount},$${input.paramCount + 1},now())`);
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
			result.message =
				"Invalid data for update. Valid input's format has at least {name:string} or {price:number}";
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
