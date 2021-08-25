import db from "./db";

async function deleteItem(itemId: string) {
  try {
    const query = `DELETE FROM items WHERE id = :itemId`;
    const result = await db.query(query, { itemId });
    if (result.numberOfRecordsUpdated === 1) return itemId;
    return null;
  } catch (err) {
    console.log("Postgres error: ", err);
    return null;
  }
}

export default deleteItem;
