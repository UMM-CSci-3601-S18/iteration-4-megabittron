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


// Controller that manages information about people's emotions.
public class EmotionController {

    private final Gson gson;
    private MongoDatabase database;
    // emotionCollection is the collection that the emotions data is in.
    private final MongoCollection<Document> emotionCollection;

    // Construct controller for emotions.
    public EmotionController(MongoDatabase database) {
        gson = new Gson();
        this.database = database;
        emotionCollection = database.getCollection("emotions");
    }

    // get an emotion by its ObjectId, not used by client, for potential future use
    public String getEmotion(String id) {
        FindIterable<Document> jsonEmotions
            = emotionCollection
            .find(eq("_id", new ObjectId(id)));

        Iterator<Document> iterator = jsonEmotions.iterator();
        if (iterator.hasNext()) {
            Document emotion = iterator.next();
            return emotion.toJson();
        } else {
            // We didn't find the desired emotion
            return null;
        }
    }

    // Helper method which iterates through the collection, receiving all
    // documents if no query parameter is specified. If the emotion parameter is
    // specified, then the collection is filtered so only documents of that
    // specified emotion are found.
    public String getEmotions(Map<String, String[]> queryParams) {

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
            return JSON.serialize("[ ]");
        }

        // "emotion" will be a key to a string object, where the object is
        // what we get when people enter their emotions as a text body.
        // "emotion" is the purpose of the emotion
        if (queryParams.containsKey("mood")) {
            String targetContent = (queryParams.get("mood")[0]);
            Document contentRegQuery = new Document();
            contentRegQuery.append("$regex", targetContent);
            contentRegQuery.append("$options", "i");
            filterDoc = filterDoc.append("mood", contentRegQuery);
        }


        // FindIterable comes from mongo, Document comes from Gson
        FindIterable<Document> matchingEmotions = emotionCollection.find(filterDoc);

        return JSON.serialize(matchingEmotions);
    }

    /**
     * Helper method which appends received user information to the to-be added document
     *
     * @param mood
     * @param description
     * @return boolean after successfully or unsuccessfully adding a user
     */
    // As of now this only adds the emotion, but you can separate multiple arguments
    // by commas as we add them.
    public String addNewEmotion(String userID, String mood, Integer intensity, String description, String date) {

        // makes the search Document key-pairs
        Document newEmotion = new Document();
        newEmotion.append("userID", userID);
        newEmotion.append("mood", mood);
        newEmotion.append("description", description);
        newEmotion.append("intensity", intensity);
        newEmotion.append("date", date);
        // Append new emotions here

        try {
            emotionCollection.insertOne(newEmotion);
            ObjectId id = newEmotion.getObjectId("_id");
            System.err.println("Successfully added new emotion [_id=" + id + ", mood=" + mood + ", intensity=" + intensity
                + " description=" + description + ", date=" + date + ']');
            // return JSON.serialize(newGoal);
            return JSON.serialize(id);
        } catch(MongoException me) {
            me.printStackTrace();
            return null;
        }
    }
}
