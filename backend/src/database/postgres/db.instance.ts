import { Pool } from "pg";
import dotenv from "dotenv";
import { sleep } from "../../utils/utils";

dotenv.config();

interface DatabaseConfig {
	user: string;
	host: string;
	database: string;
	password: string;
	port: number;
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
	 */
	async executeQueryInTransaction(query: string, params = new Array()) {
		const client = await this.pool.connect();
		let response = {
			success: false,
			message: "",
		};
		try {
			await client.query("BEGIN"); // begin transaction
			await client.query(query, params);
			await client.query("COMMIT");
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

	async executeQuery(query: string, params = new Array()) {
		const client = await this.pool.connect();
		let response = {
			success: false,
			message: "",
		};
		try {
			const result = await client.query(query, params);
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
