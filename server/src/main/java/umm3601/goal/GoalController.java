package umm3601.goal;

import com.google.gson.Gson;
import com.mongodb.*;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.util.JSON;
import org.bson.Document;
import org.bson.types.ObjectId;
import java.util.Iterator;
import java.util.Map;

import static com.mongodb.client.model.Filters.eq;

/**
 * Controller that manages requests for info about users.
 */
public class GoalController {

    private final Gson gson;
    private MongoDatabase database;
    private final MongoCollection<Document> goalCollection;

    /**
     * Construct a controller for users.
     *
     * @param database the database containing user data
     */
    public GoalController(MongoDatabase database) {
        gson = new Gson();
        this.database = database;
        goalCollection = database.getCollection("goals");
    }

    /**
     * Helper method that gets a single user specified by the `id`
     * parameter in the request.
     *
     * @param id the Mongo ID of the desired user
     * @return the desired user as a JSON object if the user with that ID is found,
     * and `null` if no user with that ID is found
     */
    public String getGoal(String id) {
        FindIterable<Document> jsonGoals
            = goalCollection
            .find(eq("_id", new ObjectId(id)));

        Iterator<Document> iterator = jsonGoals.iterator();
        if (iterator.hasNext()) {
            Document goal = iterator.next();
            return goal.toJson();
        } else {
            // We didn't find the desired user
            return null;
        }
    }


    /** Helper method which iterates through the collection, receiving all
     * documents if no query parameter is specified. If the age query parameter
     * is specified, then the collection is filtered so only documents of that
     * specified age are found.
     *
     * @param queryParams
     * @return an array of Users in a JSON formatted string
     */
    public String getGoals(Map<String, String[]> queryParams) {

        Document filterDoc = new Document();

        if (queryParams.containsKey("category")) {
            String targetContent = (queryParams.get("category")[0]);
            Document contentRegQuery = new Document();
            contentRegQuery.append("$regex", targetContent);
            contentRegQuery.append("$options", "i");
            filterDoc = filterDoc.append("category", contentRegQuery);
        }

        if (queryParams.containsKey("body")) {
            String targetContent = (queryParams.get("body")[0]);
            Document contentRegQuery = new Document();
            contentRegQuery.append("$regex", targetContent);
            contentRegQuery.append("$options", "i");
            filterDoc = filterDoc.append("body", contentRegQuery);
        }
        //FindIterable comes from mongo, Document comes from Gson
        FindIterable<Document> matchingGoals = goalCollection.find(filterDoc);

        return JSON.serialize(matchingGoals);
    }


    public boolean addNewGoal(String body, String category) {

        Document newGoal = new Document();
        newGoal.append("body", body);
        newGoal.append("category", category);

        try {
            goalCollection.insertOne(newGoal);
        }
        catch(MongoException me)
        {
            me.printStackTrace();
            return false;
        }
        return true;
    }

    public static void main(String[] args) {
        MongoClient mongoClient = new MongoClient();
        MongoDatabase goalDatabase = mongoClient.getDatabase("dev");
        GoalController goalController = new GoalController(goalDatabase);
    }
}










