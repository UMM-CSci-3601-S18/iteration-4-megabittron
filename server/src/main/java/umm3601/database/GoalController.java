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
public class GoalController {

    private final Gson gson;
    private MongoDatabase database;
    // goalCollection is the collection that the goals data is in.
    private final MongoCollection<Document> goalCollection;

    // Construct controller for items.
    public GoalController(MongoDatabase database) {
        gson = new Gson();
        this.database = database;
        goalCollection = database.getCollection("goals");
    }

    // get a goal by its ObjectId, not used by client, for potential future use
    public String getGoal(String id) {
        FindIterable<Document> jsonItems
            = goalCollection
            .find(eq("_id", new ObjectId(id)));

        Iterator<Document> iterator = jsonItems.iterator();
        if (iterator.hasNext()) {
            Document goal = iterator.next();
            return goal.toJson();
        } else {
            // We didn't find the desired item
            return null;
        }
    }

    // Helper method which iterates through the collection, receiving all
    // documents if no query parameter is specified. If the goal parameter is
    // specified, then the collection is filtered so only documents of that
    // specified goal are found.
    public String getGoals(Map<String, String[]> queryParams) {

        System.out.println("It began getGoals() in GoalController");

        Document filterDoc = new Document();

        //Filter by userID
        //If there is no userID provided, return an empty result
        if (queryParams.containsKey("userID")) {
            String targetContent = (queryParams.get("userID")[0]);

            Document contentRegQuery = new Document();
            contentRegQuery.append("$regex", targetContent);
            contentRegQuery.append("$options", "i");
            filterDoc = filterDoc.append("userID", contentRegQuery);
        } else {
            System.out.println("It had no userID");
            return "";
        }

        // "goal" will be a key to a string object, where the object is
        // what we get when people enter their goals as a text body.
        // "goal" is the purpose of the goal
        if (queryParams.containsKey("purpose")) {
            String targetContent = (queryParams.get("purpose")[0]);
            Document contentRegQuery = new Document();
            contentRegQuery.append("$regex", targetContent);
            contentRegQuery.append("$options", "i");
            filterDoc = filterDoc.append("purpose", contentRegQuery);
        }

        // category is the category of the goal, also a String
        if (queryParams.containsKey("category")) {
            String targetContent = (queryParams.get("category")[0]);
            Document contentRegQuery = new Document();
            contentRegQuery.append("$regex", targetContent);
            contentRegQuery.append("$options", "i");
            filterDoc = filterDoc.append("category", contentRegQuery);
        }

        // name is the title of the goal
        if (queryParams.containsKey("name")) {
            String targetContent = (queryParams.get("name")[0]);
            Document contentRegQuery = new Document();
            contentRegQuery.append("$regex", targetContent);
            contentRegQuery.append("$options", "i");
            filterDoc = filterDoc.append("name", contentRegQuery);
        }

        if (queryParams.containsKey("status")) {
            boolean targetStatus = Boolean.parseBoolean(queryParams.get("status")[0]);
            filterDoc = filterDoc.append("status", targetStatus);
        }

        // FindIterable comes from mongo, Document comes from Gson
        FindIterable<Document> matchingGoals = goalCollection.find(filterDoc);

        return JSON.serialize(matchingGoals);
    }


    public String addNewGoal(String userID, String purpose, String category, String name,
                             Boolean status, String frequency, String start, String end, String next) {

        // makes the search Document key-pairs
        Document newGoal = new Document();
        newGoal.append("userID", userID);
        newGoal.append("purpose", purpose);
        newGoal.append("category", category);
        newGoal.append("name", name);
        newGoal.append("status", status);
        newGoal.append("frequency", frequency);
        newGoal.append("start", start);
        newGoal.append("end", end);
        newGoal.append("next", next);
        // Append new goals here

        try {
            goalCollection.insertOne(newGoal);
            ObjectId id = newGoal.getObjectId("_id");

            System.err.println("Successfully added new goal " + userID + " [_id=" + id + ", purpose=" + purpose +
                ", category=" + category + ", name=" + name + ", frequency= "+ frequency +  ", start=" + start +
                ", end=" + end + ", next=" + next +']');
            //return id.toHexString();
            return JSON.serialize(id);
        } catch(MongoException me) {
            me.printStackTrace();
            return null;
        }
    }

    public String completeGoal(String id, String purpose, String category,
                               String name, Boolean status, String frequency, String start,
                               String end, String next){
        Document newGoal = new Document();
        newGoal.append("purpose", purpose);
        newGoal.append("category", category);
        newGoal.append("name", name);
        newGoal.append("status", status);
        newGoal.append("frequency", frequency);
        newGoal.append("start", start);
        newGoal.append("end", end);
        newGoal.append("next", next);
        Document setQuery = new Document();
        setQuery.append("$set", newGoal);
        Document searchQuery = new Document().append("_id", new ObjectId(id));

        try {
            goalCollection.updateOne(searchQuery, setQuery);
            ObjectId theID = searchQuery.getObjectId("_id");
            System.out.println("Successfully completed goal [id: " + theID + ", purpose: " + purpose +
                ", category: " + category + ", name: " + name + ", status: " + status + ", frequency: " + frequency
            + ", start: " + start + ", end: " + end + ", next: " + next + ']');
            return JSON.serialize(theID);
        } catch(MongoException me) {
            me.printStackTrace();
            return null;
        }
    }

    public void deleteGoal(String id){
        Document searchQuery = new Document().append("_id", new ObjectId(id));
        System.out.println("Goal id: " + id);
        try {
            goalCollection.deleteOne(searchQuery);
            ObjectId theID = searchQuery.getObjectId("_id");
            System.out.println("Succesfully deleted goal with ID: " + theID);

        } catch(MongoException me) {
            me.printStackTrace();
            System.out.println("error");
        }
    }

}
