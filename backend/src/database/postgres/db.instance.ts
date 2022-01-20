import { Pool } from "pg";
import dotenv from "dotenv";
import { sleep } from "../../utils/utils";
import { ItemQueries } from "../../modules/Item/Item.query";
import { inventoryQueries } from "../../modules/Inventory/inventory.query";

dotenv.config();

interface DatabaseConfig {
	user: string;
	host: string;
	database: string;
	password: string;
	port: number;
}

export interface CustomQueryResult {
	success: boolean;
	message: string;
	data?: any;
}

export interface GetInput {
	searchQuery: string;
	limit?: number;
	skip?: number;
}

class PostGrestInstance {
	private pool: Pool;
	constructor(config: DatabaseConfig) {
		this.pool = new Pool(config);
	}

	/**
	 * Test the connectivity between PostgresDB and server
	 * @param numOfRetry Number of retries allowed
	 * @param timeInterval Time between the retry
	 * @returns
	 */
	async testConnectivity(numOfRetry: number, timeInterval: number) {
		let isConnect: boolean = false;

		for (let count = 0; count < numOfRetry && !isConnect; count++) {
			try {
				const client = await this.pool.connect();
				await client.release();
				isConnect = true;
				console.log("Postgres connectivity is good");
				break;
			} catch (error: any) {
				console.log(error.message);
				console.log("Failed to connect. Retry after " + timeInterval / 1000 + " seconds...");
				await sleep(timeInterval);
			}
		}

		if (!isConnect) {
			console.log("Cannot connect to Postgres after " + numOfRetry + " retries. Terminated now.");
			process.exit(-1);
		}

		// successfully connected
		return true;
	}

	/**
	 * Execute a query
	 * @param query Query as a string
	 * @param params An array of the parameter, empty by default
	 * @returns \{ success , message}
	 */
	async executeQueryInTransaction(query: string, params = new Array()): Promise<CustomQueryResult> {
		const client = await this.pool.connect();
		let response: CustomQueryResult = {
			success: false,
			message: "",
		};
		try {
			await client.query("BEGIN"); // begin transaction
			await client.query(query, params);
			await client.query("COMMIT"); // commit transaction
			response.success = true;
			response.message = "Done";
		} catch (error: any) {
			await client.query("ROLLBACK");
			response.message = error.message;
		} finally {
			await client.release();
		}
		return response;
	}

	/**
	 * Execute a simple query for reading purpose
	 * @param query a string
	 * @param params an array
	 * @returns \{ success , data, message}
	 */
	async executeQuery(query: string, params = new Array()): Promise<CustomQueryResult> {
		const client = await this.pool.connect();
		let response: CustomQueryResult = {
			success: false,
			message: "",
		};
		try {
			const result = await client.query(query, params);
			response.success = true;
			response.message = "Done";
			response.data = result.rows;
		} catch (error: any) {
			response.message = error.message;
		} finally {
			await client.release();
		}
		return response;
	}

	makeQueryAndParamsForUpdateByID(id: number, tableName: string, body: any) {
		// Setup static beginning of query
		var query = [`UPDATE "${tableName}"`];
		var params: (string | number)[] = [];
		query.push("SET");

		// Create another array storing each set command
		// and assigning a number value for parameterized query
		var set = [""];
		Object.keys(body).map((key, i) => {
			if (i != 0) set.push(", ");
			set.push(key + " = ($" + (i + 1) + ")");
			params.push(body[key]);
		});
		query.push(set.join(" "));

		// Add the WHERE statement to look up by id
		query.push("WHERE id = " + id);

		// Return a complete query string
		return { query: query.join(" "), params: params };
	}

	async getFromTable(tableName: string, input: GetInput): Promise<CustomQueryResult> {
		let queryArr = [`SELECT * FROM "${tableName}"`];
		// detect if there is a condition
		if (input.searchQuery && input.searchQuery !== "") {
			queryArr.push("WHERE ");
			queryArr.push(input.searchQuery);
		}

		// add limit and skip
		queryArr.push(`OFFSET ${input.skip || 0} LIMIT ${input.limit || 10}`);
		const query = queryArr.join(" ");
		return await this.executeQuery(query);
	}

	async deleteFromTable(tableName: string, input: GetInput): Promise<CustomQueryResult> {
		let queryArr = [`DELETE FROM "${tableName}"`];
		// detect if there is a condition
		if (input.searchQuery && input.searchQuery !== "") {
			queryArr.push("WHERE ");
			queryArr.push(input.searchQuery);
		}

		const query = queryArr.join(" ");
		return await this.executeQueryInTransaction(query);
	}

	/**
	 * Initiate tables for the database
	 */
	async initiateTables() {
		// collect available tables .. manually
		const CREATE_QUERY = [
			ItemQueries.CREATE_ITEM_TABLE_IF_NOT_EXISTS,
			inventoryQueries.CREATE_INVENTORY_TABLE_IF_NOT_EXISTS,
		];

		let noError = true;
		let responseMessage = "Done";

		for (const query of CREATE_QUERY) {
			const { success, message } = await this.executeQuery(query);
			if (!success) {
				noError = false;
				responseMessage = message;
				break;
			}
		}

		console.log("Status for initiating tables: " + responseMessage);
		return { success: noError, message: responseMessage };
	}
}

const config: DatabaseConfig = {
	user: process.env.POSTGRES_USER || "shopify",
	database: process.env.POSTGRES_DATABASE || "shopify",
	host: process.env.POSTGRES_HOST || "localhost",
	password: process.env.POSTGRES_PASSWORD || "shopify",
	port: parseInt(process.env.POSTGRES_PORT || "5432"),
};

const instance = new PostGrestInstance(config);
export default instance;
