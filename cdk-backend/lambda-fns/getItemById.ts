import db from "./db";

async function getItemById(itemId: string) {
  try {
    const query = `SELECT * FROM items WHERE id = :itemId`;
    const results = await db.query(query, { itemId });
    return results.records[0];
  } catch (err) {
    console.log("Postgres error: ", err);
    return null;
  }
}

export default getItemById;
