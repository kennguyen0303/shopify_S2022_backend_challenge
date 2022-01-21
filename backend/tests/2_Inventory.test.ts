import { expect } from "chai";
import { GetInput } from "../src/database/postgres/db.instance";
import InventoryService, { InventoryItem } from "../src/modules/Inventory/Inventory.service";
import ItemService, { Item } from "../src/modules/Item/Item.service";
import LogService from "../src/modules/log/LogService";

describe("Inventory service can", () => {
	let inventoryService: InventoryService;
	let logService: LogService;
	let mockedItemsInput: InventoryItem[] = [];
	let mockedInventoryInput: InventoryItem | undefined;
	let itemService: ItemService;
	let logIDs: number[] = [];

	describe("be setup", () => {
		it("initiate the classes", async () => {
			logService = new LogService();
			inventoryService = new InventoryService(logService);
			itemService = new ItemService();
			expect(inventoryService).not.equal(undefined);
			expect(itemService).not.equal(undefined);
			expect(logService).not.equal(undefined);
		});

		it("initiate mocked items", async () => {
			// create some definitions for items
			let mockedItemInputArr: Item[] = [
				{ name: "test5", price: 10 },
				{ name: "test6", price: 20 },
				{ name: "test7", price: 30 },
			];

			const res = await itemService.createItems(mockedItemInputArr);
			expect(res.success).to.be.true;
			expect(res.message).equal("Done");

			// collect the ids
			const searchQuery = `name ~ 'test'`;
			const collectRes = await itemService.getItems({ searchQuery: searchQuery });
			expect(collectRes.success).to.be.true;
			expect(collectRes.data.length).to.equal(3);

			for (const item of collectRes.data as Item[]) {
				// define an inventory input
				let inventoryInput: InventoryItem = {
					item_id: item.id || -1,
					qty: 20,
				};

				mockedItemsInput.push(inventoryInput);
			}
		});
	});

	describe("add new items to the inventory", () => {
		it("add one item and record to log", async () => {
			mockedInventoryInput = mockedItemsInput.pop();
			expect(mockedInventoryInput).not.equal(undefined);
			if (mockedInventoryInput !== undefined) {
				const { success, message } = await inventoryService.addItem(mockedInventoryInput);
				expect(success).to.be.true;
				expect(message).to.include("Done");

				// check log
				const searchQuery = `item_id = ${mockedInventoryInput.item_id} and qty = ${mockedInventoryInput.qty}`;
				const logResponse = await logService.getItems({ searchQuery: searchQuery });
				expect(logResponse.success).to.be.true;
				expect(logResponse.data[0].total_qty).equal(mockedInventoryInput.qty);
				logIDs.push(logResponse.data[0].log_id); // first test log
			}
		});

		it("add many items", async () => {
			const res = await inventoryService.addItems(mockedItemsInput);
			for (const report of res.details) {
				expect(report.success).to.be.true;
				expect(report.message).to.include("Done");
			}
		});
	});

	describe("get a list of items in the inventory", () => {
		it("get one by item_id", async () => {
			const searchQuery = `item_id = ${mockedInventoryInput?.item_id}`;
			const { success, data } = await inventoryService.getItems({ searchQuery: searchQuery });
			expect(success).to.be.true;
			expect(data.length).equal(1);
			expect(data[0].item_id).to.equal(mockedInventoryInput?.item_id);
		});

		it("get many by limit", async () => {
			const searchQuery = ``;
			const { success, data } = await inventoryService.getItems({
				searchQuery: searchQuery,
				limit: 2,
			});
			expect(success).to.be.true;
			expect(data.length).equal(2);
		});
	});

	describe("remove items from the inventory", () => {
		it("remove one item by item_id", async () => {
			expect(mockedInventoryInput).not.equal(undefined);
			if (mockedInventoryInput !== undefined) {
				// update qty, remove by 10
				let expectedQty = mockedInventoryInput.qty - 10;
				mockedInventoryInput.qty = 10;
				const { success, message } = await inventoryService.removeItem(mockedInventoryInput);
				expect(success).to.be.true;
				expect(message).to.include("Done");

				// verify qty
				const searchQuery = `item_id = ${mockedInventoryInput.item_id}`;
				const { data } = await inventoryService.getItems({ searchQuery });
				expect(data).not.equal(undefined);
				expect(data[0].qty).equal(expectedQty);
			}
		});

		it("remove one item with invalid item_id", async () => {
			expect(mockedInventoryInput).not.equal(undefined);
			if (mockedInventoryInput !== undefined) {
				let invalidInput = { ...mockedInventoryInput }; // make a copy
				invalidInput.item_id = -12;
				const { success } = await inventoryService.removeItem(invalidInput);
				expect(success).to.be.false;
			}
		});

		it("remove many items by item_id", async () => {
			const res = await inventoryService.addItems(mockedItemsInput);
			for (const report of res.details) {
				if (!report.success) console.log(report.message);
				expect(report.success).to.be.true;
				expect(report.message).to.include("Done");
			}
		});
	});

	describe("clean up", () => {
		it("delete mocked inventory items by query", async () => {
			expect(mockedInventoryInput).not.equal(undefined);
			if (mockedInventoryInput !== undefined) {
				mockedItemsInput.push(mockedInventoryInput);
				for (const inventoryItem of mockedItemsInput) {
					const searchQuery = `item_id = ${inventoryItem.item_id}`;
					const { success, message } = await inventoryService.deleteItems({
						searchQuery: searchQuery,
					});
					expect(success).to.be.true;
				}
			}
		});

		it("delete items in logs", async () => {
			const res = await logService.getLastItem();
			expect(res.success).to.be.true;
			logIDs.push(res.data[0].log_id);

			// delete many
			const searchQuery = `log_id between ${logIDs[0]} and ${logIDs[1]}`;
			const deleteRes = await logService.deleteItems({ searchQuery });
			expect(deleteRes.success).to.be.true;
		});

		it("delete mocked Items", async () => {
			const input: GetInput = {
				searchQuery: `name ~ 'test'`,
			};
			const res = await itemService.deleteItems(input);
			expect(res.success).to.be.true;
		});
	});
});
