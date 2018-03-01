package umm3601.goal;

import com.mongodb.BasicDBObject;
import com.mongodb.util.JSON;
import spark.Request;
import spark.Response;

public class GoalRequestHandler {
    private final GoalController goalController;
    public GoalRequestHandler(GoalController goalController){
        this.goalController = goalController;
    }
    /**Method called from Server when the 'api/todos/:id' endpoint is received.
     * Get a JSON response with a list of all the todos in the database.
     *
     * @param req the HTTP request
     * @param res the HTTP response
     * @return one todo in JSON formatted string and if it fails it will return text with a different HTTP status code
     */
    public String getGoalJSON(Request req, Response res){
        res.type("application/json");
        String id = req.params("id");
        String goal;
        try {
            goal = goalController.getGoal(id);
        } catch (IllegalArgumentException e) {
            // This is thrown if the ID doesn't have the appropriate
            // form for a Mongo Object ID.
            // https://docs.mongodb.com/manual/reference/method/ObjectId/
            res.status(400);
            res.body("The requested goal id " + id + " wasn't a legal Mongo Object ID.\n" +
                "See 'https://docs.mongodb.com/manual/reference/method/ObjectId/' for more info.");
            return "";
        }
        if (goal != null) {
            return goal;
        } else {
            res.status(404);
            res.body("The requested goal with id " + id + " was not found");
            return "";
        }
    }

    /**Method called from Server when the 'api/todos' endpoint is received.
     * This handles the request received and the response
     * that will be sent back.
     *@param req the HTTP request
     * @param res the HTTP response
     * @return an array of todos in JSON formatted String
     */
    public String getGoals(Request req, Response res)
    {
        res.type("application/json");
        return goalController.getGoals(req.queryMap().toMap());
    }


    /**Method called from Server when the 'api/todos/new'endpoint is recieved.
     * Gets specified todo info from request and calls addNewTodo helper method
     * to append that info to a document
     *
     * @param req the HTTP request
     * @param res the HTTP response
     * @return a boolean as whether the todo was added successfully or not
     */
    public boolean addNewGoal(Request req, Response res)
    {

        res.type("application/json");
        Object o = JSON.parse(req.body());
        try {
            if(o.getClass().equals(BasicDBObject.class))
            {
                try {
                    BasicDBObject dbO = (BasicDBObject) o;

                    String body = dbO.getString("body");
                    String category = dbO.getString("category");

                    System.err.println("Adding new goal [body=" + body + " category=" + category + ']');
                    return goalController.addNewGoal(body, category);
                }
                catch(NullPointerException e)
                {
                    System.err.println("A value was malformed or omitted, new goal request failed.");
                    return false;
                }

            }
            else
            {
                System.err.println("Expected BasicDBObject, received " + o.getClass());
                return false;
            }
        }
        catch(RuntimeException ree)
        {
            ree.printStackTrace();
            return false;
        }
    }
}
