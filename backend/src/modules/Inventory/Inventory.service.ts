import { Item } from "../Item/Item.service";
import postgresInstance, { CustomQueryResult, GetInput } from "../../database/postgres/db.instance";
import ItemService from "../Item/Item.service";
import { inventoryQueries } from "./inventory.query";

export interface InventoryItem {
	item_id: number;
	qty: number;
	last_modified_at?: string;
}

interface CreateInventoryItemInput {
	item: InventoryItem;
	index: number;
	paramCount: number;
	params: (string | number)[];
	queryArr: string[];
}

export interface BatchOperationInventoryOutput {
	position: number;
	item: InventoryItem;
	success: boolean;
	message: string;
}
class InventoryService {
	constructor() {}

	async getItems(input: GetInput): Promise<CustomQueryResult> {
		return await postgresInstance.getFromTable("Inventory", input);
	}

	/**
	 * Add many items to the inventory
	 * @param items
	 */
	async addItems(items: InventoryItem[]): Promise<BatchOperationInventoryOutput[]> {
		const addReport: BatchOperationInventoryOutput[] = [];
		for (let i = 0; i < items.length; i++) {
			const { success, message } = await this.addItem(items[i]);
			const reportElement = { item: items[i], message: message, position: i + 1, success: success };
			addReport.push(reportElement);
		}

		return addReport;
	}

	/**
	 * Add an item to the inventory
	 * @param item
	 * @returns
	 */
	async addItem(item: InventoryItem): Promise<CustomQueryResult> {
		// if already exist, we update the qty
		const { success, data } = await this.getItems({ searchQuery: `item_id = ${item.item_id}` });
		if (success && data.length == 1) {
			const updateInput: InventoryItem = data[0]; // take the item
			updateInput.qty += item.qty; // update the quantity
			return await this.updateItem(updateInput);
		}
		// if does not exist, create a new entry
		return await this.createItems([item]);
		// update into record
	}

	/**
	 * Create one or more items
	 * @param body An array of items [{name, price}]
	 * @returns \{success, message}
	 */
	async createItems(items: InventoryItem[]): Promise<CustomQueryResult> {
		let queryArr = [inventoryQueries.CREATE_ITEM];
		let params: (string | number)[] = [];

		if (items === undefined || items?.length === undefined || items.length == 0) {
			return {
				success: false,
				message:
					"no item was provided, please provide an array with each element in the format {item_id: number, qty: number}",
			};
		}

		// Batch creation can be implemented here
		let count = 1;
		for (let i = 0; i < items.length; i++) {
			let input: CreateInventoryItemInput = {
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

	makeQueryForCreateItemAtIndex(input: CreateInventoryItemInput) {
		// value check
		let isValid =
			input.item.qty !== undefined &&
			Number.isInteger(input.item.qty) &&
			input.item.qty > 0 &&
			input.item.item_id !== undefined &&
			Number.isInteger(input.item.item_id);

		if (!isValid) {
			// return error without creating any item
			throw new Error(`Invalid input at element ${input.index}`);
		}

		input.params.push(input.item.item_id, input.item.qty);

		// don't add comma for the first item
		if (input.index != 0) {
			input.queryArr.push(", ");
		}

		// query for adding values
		input.queryArr.push(`($${input.paramCount},$${input.paramCount + 1},now())`);
	}

	/**
	 * Remove in batch
	 * @param items a list of InventoryItem
	 * @returns an array of element in the format {success, position, message}
	 */
	async removeItems(items: InventoryItem[]): Promise<BatchOperationInventoryOutput[]> {
		const removeReport: BatchOperationInventoryOutput[] = [];
		for (let i = 0; i < items.length; i++) {
			const { success, message } = await this.removeItem(items[i]);
			const reportElement = { item: items[i], message: message, position: i + 1, success: success };
			removeReport.push(reportElement);
		}

		return removeReport;
	}

	async removeItem(item: InventoryItem) {
		// get and compare the quantity
		const { success, data } = await this.getItems({ searchQuery: `item_id = ${item.item_id}` });
		if (success && data.length == 1 && Number.isInteger(item.qty)) {
			const remainQty = data[0].qty - item.qty;
			if (remainQty >= 0) {
				const tempItem: InventoryItem = {
					item_id: item.item_id,
					qty: remainQty,
				};
				return await this.updateItem(tempItem);
				// update into record
			} else {
				return { success: false, message: "not enough quantity to remove" };
			}
		}

		return { success: false, message: "the item_id cannot be found in the inventory" };
	}

	async updateItem(body: InventoryItem): Promise<CustomQueryResult> {
		let result: CustomQueryResult = {
			success: false,
			message: "",
		};
		let originalParams: InventoryItem = {
			item_id: body.item_id,
			qty: 0,
			last_modified_at: "now()",
		};

		// value check
		if (!body.item_id || !Number.isInteger(body.item_id)) {
			result.message = "Invalid ID";
			return result;
		}

		const isValidInput = body.qty !== undefined && Number.isInteger(body.qty);
		if (!isValidInput) {
			result.message =
				"Invalid data for update. Valid input's format has at least {name:string} or {price:number}";
			return result;
		}

		// Filter params to take only the updatable fields
		originalParams.qty = body.qty;

		// make update query
		const searchQuery = `item_id = ${body.item_id}`;
		const { query, params } = postgresInstance.makeQueryAndParamsForUpdateByQuery(
			searchQuery,
			"Inventory",
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
		return await postgresInstance.deleteFromTable("Inventory", input);
	}
}

export default InventoryService;
