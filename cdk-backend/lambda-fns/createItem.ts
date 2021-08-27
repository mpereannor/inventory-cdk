import Item from "./Item";
import db from "./db";
const { v4: uuid } = require("uuid");

async function createItem(item: Item) {
  if (!item.id) item.id = uuid();
  const { id, name, desc } = item;
  try {
    const query = `
    INSERT INTO items (id, name, "desc")
    VALUES(:id, :name, :desc)
    `;
    await db.query(query, { id, name, desc });
    return item;
  } catch (err) {
    console.log("Postgres error: ", err);
    return null;
  }
}

export default createItem;
