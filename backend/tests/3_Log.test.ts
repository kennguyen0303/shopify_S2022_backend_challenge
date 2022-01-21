import { expect } from "chai";
import LogService, { ReportInput } from "../src/modules/log/LogService";

describe("Log service can", () => {
	let service: LogService;
	it("be setup", () => {
		service = new LogService();
	});

	describe("report", () => {
		it("Most out of stock items for a given time", async () => {
			let currTime = new Date();
			let lastMonth = new Date(currTime.getTime() - 1000 * 60 * 60 * 24 * 30);
			const input: ReportInput = {
				from: lastMonth,
				to: currTime,
			};
			const res = await service.getMostOutOfStockItem(input);
			expect(res.success).to.be.true;
		});
	});
});
