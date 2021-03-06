import { expect } from "chai";
import postgresInstance from "../src/database/postgres/db.instance";

describe("Setup env", () => {
	it("connect to postgres database", async () => {
		const result = await postgresInstance.testConnectivity(5, 10000);
		expect(result).to.be.true;
	});

	it("Create tables if not exists", async () => {
		const result = await postgresInstance.initiateTables();
		expect(result.success).to.be.true;
	});
});
