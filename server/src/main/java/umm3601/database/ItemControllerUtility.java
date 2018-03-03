package umm3601.database;

import com.mongodb.client.MongoCollection;
import org.bson.Document;

public class ItemControllerUtility {
    private final ItemController itemController;

    public ItemControllerUtility(ItemController itemController) {
        this.itemController = itemController;
    }

    public MongoCollection<Document> getCollectionByName(String nameOfCollection) {
        if (nameOfCollection.equals("items")) {
            return itemController.getItemCollection();
        } else if (nameOfCollection.equals("emoji")) {
            return itemController.getEmojiCollection();
        } else {
            return null;
        }
    }

    public static String[] getKeysByCollectionName(String name) {
        if (name.equals("emoji")) {
            return new String[]{"user_id", "emoji", "datetime"};
        } else if (name.equals("goals")) {
            return null;
        } else if (name.equals("items")) {
            return new String[]{"name", "goal", "category"};
        } else {
            return null;
        }
    }
}
