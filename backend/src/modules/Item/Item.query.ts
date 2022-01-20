export const queryItems = {
	CREATE_ITEM_TABLE_IF_NOT_EXISTS: `CREATE TABLE IF NOT EXISTS "Items"(
        id serial primary key,
        name CHAR(100) not null unique, 
        price integer not null,
        created_at timestamp not null
    )`,

	CREATE_ITEM: `INSERT INTO "Items"(name, price, created_at) VALUES `,
	GET_ITEM: `SELECT * FROM "Items"`,
	DELETE_ITEM: `DELETE FROM `,
};
