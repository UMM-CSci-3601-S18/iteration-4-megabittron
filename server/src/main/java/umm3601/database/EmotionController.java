package umm3601.database;

import com.google.gson.Gson;
import com.mongodb.*;
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

public class EmotionController {
    private final Gson gson;
    private MongoDatabase database;
    private final MongoCollection<Document> emotionCollection;

    public EmotionController(MongoDatabase database) {
        gson = new Gson();
        this.database = database;
        emotionCollection = database.getCollection("emotions");
    }

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

    public String getEmotions(Map<String, String[]> queryParams) {

        Document filterDoc = new Document();

        if (queryParams.containsKey("mood")) {
            String targetMood = queryParams.get("mood")[0];
            filterDoc = filterDoc.append("mood", targetMood);
        }

        if(queryParams.containsKey("date")){
            String targetDate = queryParams.get("date")[0];
            filterDoc = filterDoc.append("date", targetDate);
        }

        //FindIterable comes from mongo, Document comes from Gson
        FindIterable<Document> matchingEmotions = emotionCollection.find(filterDoc);

        return JSON.serialize(matchingEmotions);
    }

    public String addNewEmotion(String mood, Number intensity, String description, String date) {
        Document newEmotion = new Document();
        newEmotion.append("mood", mood);
        newEmotion.append("intensity", intensity);
        newEmotion.append("description", description);
        newEmotion.append("date", date);
        try {
            emotionCollection.insertOne(newEmotion);
            ObjectId id = newEmotion.getObjectId("_id");
            //System.err.println("Successfully added new emotion [_id=" + id + ", mood=" + mood + ", time=" + time + " day=" + day + " month=" + month +  " year=" + year + ']');
            System.err.println("Successfully added new emotion [_id=" + id + ", mood=" + mood + ", intensity= " + intensity + ", description= " + description + ", date=" + date + ']');
            return JSON.serialize(id);
        } catch(MongoException me) {
            me.printStackTrace();
            return null;
        }
    }
}
