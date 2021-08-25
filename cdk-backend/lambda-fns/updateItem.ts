import Item from "./Item";
import db from "./db";

async function updateItem(item: Item) {
  if (Object.entries(item).length === 1) return;
  let query = `UPDATE items SET`;
  const updateVariables: { [key: string]: string } = { id: item.id };
  Object.entries(item).forEach((i) => {
    if (i[0] === "id") return;
    updateVariables[i[0]] = i[1];
    if (Object.keys(updateVariables).length > 2) {
      query = `${query},`;
    }
    query = `${query} ${i[0]} = :${i[0]}`;
  });
  query = query + "where id = :id";
  try {
    await db.query(query, updateVariables);
    return item;
  } catch (err) {
    console.log("Postgres error: ", err);
    return null;
  }
}

export default updateItem;
