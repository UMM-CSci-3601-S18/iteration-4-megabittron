package umm3601.database;

import com.google.gson.Gson;
import com.mongodb.MongoException;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.util.JSON;
import org.bson.Document;
import org.bson.types.ObjectId;

import java.util.Date;
import java.util.Iterator;
import java.util.Map;

import static com.mongodb.client.model.Filters.eq;

public class UserController {

    private final Gson gson;
    private MongoDatabase database;
    // goalCollection is the collection that the goals data is in.
    private final MongoCollection<Document> userCollection;

    // Construct controller for items.
    public UserController(MongoDatabase database) {
        gson = new Gson();
        this.database = database;
        userCollection = database.getCollection("users");
    }
    //    /**
    // WE ARE GOING TO NOT HAVE FILTERING FOR USER COLLECTION FOR THE TIME BEING.
//     * Helper method that gets a single user specified by the `id`
//     * parameter in the request.
//     *
//     * @param id the Mongo ID of the desired user
//     * @return the desired user as a JSON object if the user with that ID is found,
//     * and `null` if no user with that ID is found
//     */
//    public String getUser(String id) {
//        FindIterable<Document> jsonUsers
//            = collection
//            .find(eq("_id", new ObjectId(id)));
//
//        Iterator<Document> iterator = jsonUsers.iterator();
//        if (iterator.hasNext()) {
//            Document user = iterator.next();
//            return user.toJson();
//        } else {
//            // We didn't find the desired user
//            return null;
//        }
//    }
    //
//
//    /** Helper method which iterates through the collection, receiving all
//     * documents if no query parameter is specified. If the age query parameter
//     * is specified, then the collection is filtered so only documents of that
//     * specified age are found.
//     *
//     * @param queryParams
//     * @return an array of Users in a JSON formatted string
//     */
//    public String getUsers(Map<String, String[]> queryParams) {
//
//        Document filterDoc = new Document();
//
//        if (queryParams.containsKey("age")) {
//            int targetAge = Integer.parseInt(queryParams.get("age")[0]);
//            filterDoc = filterDoc.append("age", targetAge);
//        }
//
//        if (queryParams.containsKey("company")) {
//            String targetContent = (queryParams.get("company")[0]);
//            Document contentRegQuery = new Document();
//            contentRegQuery.append("$regex", targetContent);
//            contentRegQuery.append("$options", "i");
//            filterDoc = filterDoc.append("company", contentRegQuery);
//        }
//
//        //FindIterable comes from mongo, Document comes from Gson
//        FindIterable<Document> matchingUsers = collection.find(filterDoc);
//
//        return JSON.serialize(matchingUsers);
//    }

    public String addNewUser(String _id, String SubjectID, String FirstName, String LastName) {

        Document newUser = new Document();
        newUser.append("_id", _id);
        newUser.append("SubjectID", SubjectID);
        newUser.append("FirstName", FirstName);
        newUser.append("LastName", LastName);

        try {
            userCollection.insertOne(newUser);
            ObjectId id = newUser.getObjectId("_id");
            System.err.println("Successfully added new user [_id=" + id + ", SubjectID=" + SubjectID + " FirstName=" + FirstName + " LastName=" + LastName + ']');
            // return JSON.serialize(newUser);
            return JSON.serialize(id);
        } catch(MongoException me) {
            me.printStackTrace();
            return null;
        }
    }


}

