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
public class JournalController {

    private final Gson gson;
    private MongoDatabase database;
    // itemCollection is the collection that the journals data is in.
    private final MongoCollection<Document> itemCollection;

    // Construct controller for items.
    public JournalController(MongoDatabase database) {
        gson = new Gson();
        this.database = database;
        itemCollection = database.getCollection("journals");
    }

    // get an item by its ObjectId, not used by client, for potential future use
    public String getItem(String id) {
        FindIterable<Document> jsonItems
            = itemCollection
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
    // documents if no query parameter is specified. If the journal parameter is
    // specified, then the collection is filtered so only documents of that
    // specified journal are found.
    public String getItems(Map<String, String[]> queryParams) {

        Document filterDoc = new Document();

        // We will need more statements here for different objects,
        // such as emoji, category, etc.

        // "journal" will be a key to a string object, where the object is
        // what we get when people enter their journals as a text body.
        // "journal" is the purpose of the journal
        if (queryParams.containsKey("journal")) {
            String targetContent = (queryParams.get("journal")[0]);
            Document contentRegQuery = new Document();
            contentRegQuery.append("$regex", targetContent);
            contentRegQuery.append("$options", "i");
            filterDoc = filterDoc.append("journal", contentRegQuery);
        }

        // category is the category of the journal, also a String
        if (queryParams.containsKey("category")) {
            String targetContent = (queryParams.get("category")[0]);
            Document contentRegQuery = new Document();
            contentRegQuery.append("$regex", targetContent);
            contentRegQuery.append("$options", "i");
            filterDoc = filterDoc.append("category", contentRegQuery);
        }

        // name is the title of the journal
        if (queryParams.containsKey("name")) {
            String targetContent = (queryParams.get("name")[0]);
            Document contentRegQuery = new Document();
            contentRegQuery.append("$regex", targetContent);
            contentRegQuery.append("$options", "i");
            filterDoc = filterDoc.append("name", contentRegQuery);
        }

        // FindIterable comes from mongo, Document comes from Gson
        FindIterable<Document> matchingItems = itemCollection.find(filterDoc);

        return JSON.serialize(matchingItems);
    }

    /**
     * Helper method which appends received user information to the to-be added document
     *
     * @param title
     * @param category
     * @param body
     * @param time
     * @param link

     * @return boolean after successfully or unsuccessfully adding a user
     */
    // As of now this only adds the journal, but you can separate multiple arguments
    // by commas as we add them.
    public String addNewItem(String title, String category, String body, String time, String link) {

        // makes the search Document key-pairs
        Document newItem = new Document();
        newItem.append("title", title);
        newItem.append("category", category);
        newItem.append("body", body);
        newItem.append("time", time);
        newItem.append("link", link);
        // Append new items here

        try {
            itemCollection.insertOne(newItem);
            ObjectId id = newItem.getObjectId("_id");
            System.err.println("Successfully added new item [title=" + title + ", category=" + category + ", body=" + body +", time=" + time + ", link = " + link + ']');
            // return JSON.serialize(newItem);
            return JSON.serialize(id);
        } catch(MongoException me) {
            me.printStackTrace();
            return null;
        }
    }

}
