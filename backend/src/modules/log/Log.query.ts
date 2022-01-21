export const logQueries = {
	CREATE_ITEM_TABLE_IF_NOT_EXISTS: `CREATE TABLE IF NOT EXISTS "Log"(
		log_id serial primary key,
        item_id integer references "Items"(id), 
        qty integer not null,
		total_qty integer not null,
        made_at timestamp not null
    )`,

	CREATE_ITEM: `INSERT INTO "Log"(item_id, qty, total_qty,made_at) VALUES `,
	MOST_OUT_OF_STOCK: `select item_id, count(*) as out_stock_numb  from "Log"
	where made_at between  $1 and $2
	and total_qty = 0
	group by item_id 
	order by out_stock_numb desc`,
	GET_LAST_LOG: `select * from "Log" where log_id = (select max(log_id) from "Log")`,
};
