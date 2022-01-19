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

	async testConnectivity(numOfRetry: number, timeInterval: number) {
		let isConnect: boolean = false;

		for (let count = 0; count < numOfRetry && !isConnect; count++) {
			try {
				const client = await this.pool.connect();
				client.release();
				isConnect = true;
				console.log("Postgres is connected");
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
