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


// Controller that manages information about people's goals.
public class ResourceController {

    private final Gson gson;
    private MongoDatabase database;
    // goalCollection is the collection that the goals data is in.
    private final MongoCollection<Document> resourceCollection;

    // Construct controller for goals.
    public ResourceController(MongoDatabase database) {
        gson = new Gson();
        this.database = database;
        resourceCollection = database.getCollection("resources");
    }

    // Helper method which iterates through the collection, receiving all
    // documents if no query parameter is specified.
    public String getResources(Map<String, String[]> queryParams) {

        //in preparation for the future where responses may be separated by emotion selected
        Document filterDoc = new Document();

        // FindIterable comes from mongo, Document comes from Gson
        FindIterable<Document> matchingResources = resourceCollection.find(filterDoc);

        return JSON.serialize(matchingResources);
    }

}
