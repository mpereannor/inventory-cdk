import db from "./db";

async function listItems() {
  try {
    const result = await db.query(`SELECT * FROM items`);
    return result.records;
  } catch (err) {
    console.log("Postgres error: ", err);
    return null;
  }
}

export default listItems; 
