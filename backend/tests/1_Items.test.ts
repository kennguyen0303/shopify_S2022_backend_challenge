import { expect } from "chai";
import { GetInput } from "../src/database/postgres/db.instance";
import ItemService, { Item } from "../src/modules/Item/Item.service";

describe("ItemService can ", () => {
	let itemService: ItemService;
	let mockedItemInput = {
		name: "test",
		price: 10,
	};
	let mockedItemInputArr = [
		{ name: "test1", price: 10 },
		{ name: "test2", price: 20 },
		{ name: "test3", price: 30 },
	];

	it("be setup", () => {
		itemService = new ItemService();
		expect(itemService).not.equal(undefined);
	});

	it("Initiate the Item table", async () => {
		const res = await itemService.createTable();
		expect(res.success).to.be.true;
	});

	describe("create items", () => {
		it("create a new item ", async () => {
			const res = await itemService.createItems([mockedItemInput]);
			expect(res.success).to.be.true;
			expect(res.message).equal("Done");
		});

		it("create many items at once ", async () => {
			const res = await itemService.createItems(mockedItemInputArr);
			expect(res.success).to.be.true;
			expect(res.message).equal("Done");
		});
	});

	describe("get items", () => {
		it("get an item by name", async () => {
			const input: GetInput = {
				searchQuery: `name = '${mockedItemInput.name}'`,
			};
			const res = await itemService.getItems(input);
			expect(res.success).to.be.true;
			expect(res.data).not.equal(undefined);
		});

		it("get many items by conditions", async () => {
			const input: GetInput = {
				searchQuery: `price > 10`,
				limit: 3,
			};
			const res = await itemService.getItems(input);
			expect(res.success).to.be.true;
			expect(res.data).not.equal(undefined);
			expect(res.data).to.be.an("array");
			expect(res.data.length).to.be.greaterThan(0).and.lessThan(4);
		});
	});

	describe("Update an item by id", () => {
		it("reject if no id is provided", async () => {
			const input: Item = { ...mockedItemInput }; // make a copy
			input.price = 100;
			const res = await itemService.updateItem(input);
			expect(res.success).to.be.false;
			expect(res.message).to.include("Invalid ID");
		});

		it("update with a valid id", async () => {
			const { success, data } = await itemService.getItems({
				searchQuery: `name = '${mockedItemInput.name}'`,
			});

			expect(success).to.be.true;
			expect(data).not.equal(undefined);

			// update
			const updateInput: Item = { ...data[0] }; // [0] since data is an array
			updateInput.price = 1000;
			const res = await itemService.updateItem(updateInput);
			expect(res.success).to.be.true;

			const verifyRes = await itemService.getItems({
				searchQuery: `id = '${updateInput.id}'`,
			});
			expect(verifyRes.data[0].price).equal(updateInput.price);
		});
	});

	describe("delete items", () => {
		it("Delete an item by name", async () => {
			const input: GetInput = {
				searchQuery: `name = '${mockedItemInput.name}'`,
			};
			const res = await itemService.deleteItems(input);
			expect(res.success).to.be.true;
		});

		it("Delete many items by conditions", async () => {
			const input: GetInput = {
				searchQuery: `name ~ 'test'`,
			};
			const res = await itemService.deleteItems(input);
			expect(res.success).to.be.true;
		});
	});
});
