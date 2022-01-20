export const inventoryQueries = {
	CREATE_INVENTORY_TABLE_IF_NOT_EXISTS: `CREATE TABLE IF NOT EXISTS "Inventory"(
        item_id integer references "Items"(id) primary key, 
        qty integer,
        last_modified_at timestamp not null
    )`,

	CREATE_ITEM: `INSERT INTO "Inventory"(item_id, qty, last_modified_at) VALUES `,
};
