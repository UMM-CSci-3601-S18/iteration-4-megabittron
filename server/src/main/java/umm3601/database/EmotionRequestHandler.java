package umm3601.database;


import com.mongodb.BasicDBObject;
import com.mongodb.util.JSON;
import org.bson.types.ObjectId;
import spark.Request;
import spark.Response;
import java.util.Date;

public class EmotionRequestHandler {
    private final EmotionController emotionController;
    public EmotionRequestHandler(EmotionController emotionController){
        this.emotionController = emotionController;
    }

    public String getEmotionJSON(Request req, Response res){
        res.type("application/json");
        String id = req.params("id");
        String emotion;
        try {
            emotion = emotionController.getEmotion(id);
        } catch (IllegalArgumentException e) {
            res.status(400);
            res.body("The requested emotion id " + id + " wasn't a legal Mongo Object ID.\n" +
                "See 'https://docs.mongodb.com/manual/reference/method/ObjectId/' for more info.");
            return "";
        }
        if (emotion != null) {
            return emotion;
        } else {
            res.status(404);
            res.body("The requested emotion with id " + id + " was not found");
            return "";
        }
    }

    public String addNewEmotion(Request req, Response res)
    {
        res.type("application/json");
        Object o = JSON.parse(req.body());
        System.err.println(o);
        try {
            if(o.getClass().equals(BasicDBObject.class))
            {
                try {
                    BasicDBObject dbO = (BasicDBObject) o;
                    String mood = dbO.getString("mood");
                    Number intensity = dbO.getInt("intensity");
                    String description = dbO.getString("description");
                    String date = dbO.getString("date");

                    /*Double time = dbO.getDouble("time");
                    Integer day = dbO.getInt("day");
                    Integer month = dbO.getInt("month");
                    Integer year = dbO.getInt("year");
                    System.err.println("Adding new user [mood=" + mood + ", time=" + time + " day=" + day + " month=" + month +  " year=" + year + ']');
                    return emotionController.addNewEmotion(mood, time, day, month, year).toString();*/

                    System.err.println("Adding new emotion [mood=" + mood + "intensity= " + intensity + "description= " + description + ", date= " + date + ']');
                    return emotionController.addNewEmotion(mood, intensity, description, date).toString();
                }
                catch(NullPointerException e)
                {
                    System.err.println("A value was malformed or omitted, new emotion request failed.");
                    return null;
                }
            }
            else
            {
                System.err.println("Expected BasicDBObject, received " + o.getClass());
                return null;
            }
        }
        catch(RuntimeException ree)
        {
            ree.printStackTrace();
            return null;
        }
    }
}
