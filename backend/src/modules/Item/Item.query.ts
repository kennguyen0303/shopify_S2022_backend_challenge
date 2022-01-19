export const queryItems = {
	CREATE_ITEM_TABLE_IF_NOT_EXISTS: `CREATE TABLE IF NOT EXISTS "Items"(
        id serial primary key,
        item_name CHAR(100), 
        price integer,
        created_at timestamp not null
    )`,

	CREATE_ITEM: `INSERT INTO "Items"(item_name, price, created_at) VALUES ($1,$2,now())`,
};
