package umm3601.database.journal;

import com.mongodb.BasicDBObject;
import com.mongodb.util.JSON;
import spark.Request;
import spark.Response;

public class JournalRequestHandler {

    private final JournalController journalController;

    /**
     * journal request handler constructor
     *
     * @param journalController
     */
    public JournalRequestHandler(JournalController journalController){
        this.journalController = journalController;
    }

    public String getJournalJSON(Request req, Response res){
        res.type("application/json");
        String id = req.params("id");
        String journal;
        try {
            journal = journalController.getJournal(id);
        } catch (IllegalArgumentException e) {
            // This is thrown if the ID doesn't have the appropriate
            // form for a Mongo Object ID.
            // https://docs.mongodb.com/manual/reference/method/ObjectId/
            res.status(400);
            res.body("The requested user id " + id + " wasn't a legal Mongo Object ID.\n" +
                "See 'https://docs.mongodb.com/manual/reference/method/ObjectId/' for more info.");
            return "";
        }
        if (journal != null) {
            return journal;
        } else {
            res.status(404);
            res.body("The requested journal with id " + id + " was not found");
            return "";
        }
    }

    public String getJournals(Request req, Response res)
    {
        res.type("application/json");
        return journalController.getJournals(req.queryMap().toMap());
    }

    public String addNewJournal(Request req, Response res)
    {

        res.type("application/json");
        Object o = JSON.parse(req.body());
        try {
            if(o.getClass().equals(BasicDBObject.class))
            {
                try {
                    BasicDBObject dbO = (BasicDBObject) o;

                    String userID = dbO.getString("userID");
                    String title = dbO.getString("title");
                    String content = dbO.getString("content");

                    System.err.println("Adding new journal for user " + userID + " [title=" + title + ", content=" + content + ']');
                    return journalController.addNewJournal(userID, title, content).toString();
                }
                catch(NullPointerException e)
                {
                    System.err.println("A value was malformed or omitted, new journal request failed.");
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

    public String editJournal(Request req, Response res)
    {
        System.out.println("Right here");
        res.type("application/json");
        Object o = JSON.parse(req.body());
        try {
            if(o.getClass().equals(BasicDBObject.class))
            {
                try {
                    BasicDBObject dbO = (BasicDBObject) o;

                    String id = dbO.getString("_id");
                    String title = dbO.getString("title");
                    String content = dbO.getString("content");



                    System.err.println("Editing journal [ id=" + id + ", title=" + title + ", content=" + content + ']');
                    return journalController.editJournal(id, title, content).toString();
                }
                catch(NullPointerException e)
                {
                    System.err.println("A value was malformed or omitted, new journal request failed.");
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

    public String deleteJournal(Request req, Response res){

        System.out.println("Deleting journal with ID: " + req.params(":id"));

        res.type("application/json");

        try {
            String id = req.params(":id");
            journalController.deleteJournal(id);
            return req.params(":id");
        }
        catch(RuntimeException ree)
        {
            ree.printStackTrace();
            return null;
        }
    }

}
