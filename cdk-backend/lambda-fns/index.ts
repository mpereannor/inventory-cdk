import createItem from "./createItem";
import listItems from "./listItems";
import updateItem from "./updateItem";
import deleteItem from "./deleteItem";
import getItemById from "./getItemById";
import Item from "./Item";

type AppSyncEvent = {
  info: {
    fieldName: string
  },
  arguments: {
    item: Item,
    itemId: string
  }
}

exports.handler = async (event:AppSyncEvent) => {
  switch (event.info.fieldName) {
    case "createItem":
      return await createItem(event.arguments.item);

    case "listItems":
      return await listItems();

    case "updateItem":
      return await updateItem(event.arguments.item);

    case "deleteItem":
      return await deleteItem(event.arguments.itemId);

    case "getItemById":
      return await getItemById(event.arguments.itemId);

    default:
      return null;
  }
};
