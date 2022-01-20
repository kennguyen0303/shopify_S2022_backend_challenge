export const inventoryQueries = {
	CREATE_INVENTORY_TABLE_IF_NOT_EXISTS: `CREATE TABLE IF NOT EXISTS "Inventory"(
        name CHAR(100) references "Items"(name), 
        qty integer,
        last_modified_at timestamp not null
    )`,

	CREATE_ITEM: `INSERT INTO "Inventory"(name, qty, last_modified_at) VALUES `,
};
