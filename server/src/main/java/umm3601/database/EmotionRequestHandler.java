package umm3601.database;

import com.mongodb.BasicDBObject;
import com.mongodb.util.JSON;
import spark.Request;
import spark.Response;

import java.util.Date;

public class EmotionRequestHandler {
    private final EmotionController emotionController;
    public EmotionRequestHandler(EmotionController emotionController){
        this.emotionController = emotionController;
    }
    /**Method called from Server when the 'api/goals/:id' endpoint is received.
     * Get a JSON response with a list of all the users in the database.
     *
     * @param req the HTTP request
     * @param res the HTTP response
     * @return one user in JSON formatted string and if it fails it will return text with a different HTTP status code
     */

    // gets one goal using its ObjectId--didn't use, just for potential future functionality
    public String getEmotionJSON(Request req, Response res){
        res.type("application/json");
        String id = req.params("id");
        String emotion;
        try {
            emotion = emotionController.getEmotion(id);
        } catch (IllegalArgumentException e) {
            // This is thrown if the ID doesn't have the appropriate
            // form for a Mongo Object ID.
            // https://docs.mongodb.com/manual/reference/method/ObjectId/
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



    /**Method called from Server when the 'api/goals' endpoint is received.
     * This handles the request received and the response
     * that will be sent back.
     *@param req the HTTP request
     * @param res the HTTP response
     * @return an array of users in JSON formatted String
     */

    // Gets the goals from the DB given the query parameters
    public String getEmotions(Request req, Response res)
    {
        res.type("application/json");
        return emotionController.getEmotions(req.queryMap().toMap());
    }

    /**Method called from Server when the 'api/users/new'endpoint is recieved.
     * Gets specified user info from request and calls addNewUser helper method
     * to append that info to a document
     *
     * @param req the HTTP request
     * @param res the HTTP response
     * @return a boolean as whether the user was added successfully or not
     */
    public String addNewEmotion(Request req, Response res)
    {

        res.type("application/json");
        Object o = JSON.parse(req.body());
        try {
            // if the object that is the JSON representation of the request body's class is the class BasicDBObject
            // then try to add the goal with goalController's addNewGoal method
            if(o.getClass().equals(BasicDBObject.class))
            {
                try {
                    BasicDBObject dbO = (BasicDBObject) o;

                    String mood = dbO.getString("mood");
                    Integer intensity = dbO.getInt("intensity");
                    String description = dbO.getString("description");
                    String date = dbO.getString("date");

                    System.err.println("Adding new emotion [mood=" + mood + ", intensity="
                        + intensity + ", description=" + description + ", date=" + date + ']');
                    return emotionController.addNewEmotion(mood, intensity, description, date).toString();
                }
                catch(NullPointerException e)
                {
                    System.err.println("A value was malformed or omitted, new goal request failed.");
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
