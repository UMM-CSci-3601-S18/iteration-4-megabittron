package umm3601.database;

import com.google.gson.Gson;
import com.mongodb.MongoException;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.util.JSON;
import org.bson.Document;
import org.bson.types.ObjectId;

import java.util.Iterator;
import java.util.Map;

import static com.mongodb.client.model.Filters.eq;


// Controller that manages information about people's items.
public class ItemController {

    private final Gson gson;
    private final ItemControllerUtility itemControllerUtility = new ItemControllerUtility(this);
    private MongoDatabase database;
    private final MongoCollection<Document> itemCollection;
    private final MongoCollection<Document> emojiCollection;
    // Goals data has not been setup yet
    // private final MongoCollection<Document> goalCollection;

    // Construct controller for items.
    public ItemController(MongoDatabase database) {
        gson = new Gson();
        this.database = database;
        itemCollection = database.getCollection("items");
        // goalCollection = database.getCollection("goals");
        emojiCollection = database.getCollection("emoji");
    }

    private MongoCollection<Document> getCollectionByName(String nameOfCollection) {
        return itemControllerUtility.getCollectionByName(nameOfCollection);
    }

    private String[] getKeysByCollectionName(String name) {
        return ItemControllerUtility.getKeysByCollectionName(name);
    }

    public String getItem(String id, String collection) {
        FindIterable<Document> jsonItems
            = itemControllerUtility.getCollectionByName(collection)
            .find(eq("_id", new ObjectId(id)));

        Iterator<Document> iterator = jsonItems.iterator();
        if (iterator.hasNext()) {
            Document item = iterator.next();
            return item.toJson();
        } else {
            // We didn't find the desired item
            return null;
        }
    }

    // Helper method which iterates through the collection, receiving all
    // documents if no query parameter is specified. If the goal parameter is
    // specified, then the collection is filtered so only documents of that
    // specified goal are found.
    public String getItems(Map<String, String[]> queryParams, String collection) {

        Document filterDoc = new Document();

        // We will need more statements here for different objects,
        // such as emoji, category, etc.

        // This bit of code parametrizes the queryParams.containsKey code that we
        // will no longer need
        String[] keys = getKeysByCollectionName(collection);
        for(int i = 0; i < keys.length; i++) {
            if(queryParams.containsKey(keys[i])) {
                String targetContent = (queryParams.get(keys[i])[0]);
                Document contentRegQuery = new Document();
                contentRegQuery.append("$regex", targetContent);
                contentRegQuery.append("$options", "i");
                filterDoc = filterDoc.append(keys[i], contentRegQuery);
            }
        }

        /*// "goal" will be a key to a string object, where the object is
        // what we get when people enter their goals as a text body.
        if (queryParams.containsKey("goal")) {
            String targetContent = (queryParams.get("goal")[0]);
            Document contentRegQuery = new Document();
            contentRegQuery.append("$regex", targetContent);
            contentRegQuery.append("$options", "i");
            filterDoc = filterDoc.append("goal", contentRegQuery);
        }

        if (queryParams.containsKey("category")) {
            String targetContent = (queryParams.get("category")[0]);
            Document contentRegQuery = new Document();
            contentRegQuery.append("$regex", targetContent);
            contentRegQuery.append("$options", "i");
            filterDoc = filterDoc.append("category", contentRegQuery);
        }

        if (queryParams.containsKey("name")) {
            String targetContent = (queryParams.get("name")[0]);
            Document contentRegQuery = new Document();
            contentRegQuery.append("$regex", targetContent);
            contentRegQuery.append("$options", "i");
            filterDoc = filterDoc.append("name", contentRegQuery);
        }*/

        // FindIterable comes from mongo, Document comes from Gson
        FindIterable<Document> matchingItems = itemControllerUtility.getCollectionByName(collection).find(filterDoc);

        return JSON.serialize(matchingItems);
    }

    /**
     * Helper method which appends received user information to the to-be added document
     *
     * @param name
     * @param goal
     * @return boolean after successfully or unsuccessfully adding a user
     */
    // As of now this only adds the goal, but you can separate multiple arguments
    // by commas as we add them.
    public String addNewItem(String name, String category, String goal) {

        Document newItem = new Document();
        newItem.append("name", name);
        newItem.append("category", name);
        newItem.append("goal", goal);
        // Append new items here

        try {
            itemCollection.insertOne(newItem);
            ObjectId id = newItem.getObjectId("_id");
            System.err.println("Successfully added new item [name=" + name + ", category=" + category + " goal=" + goal + ']');
            // return JSON.serialize(newItem);
            return JSON.serialize(id);
        } catch(MongoException me) {
            me.printStackTrace();
            return null;
        }
    }

    public MongoCollection<Document> getItemCollection() {
        return itemCollection;
    }

    public MongoCollection<Document> getEmojiCollection() {
        return emojiCollection;
    }
}
