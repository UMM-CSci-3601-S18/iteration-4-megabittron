package umm3601.database.resource;

import com.mongodb.BasicDBObject;
import com.mongodb.util.JSON;
import spark.Request;
import spark.Response;


public class LinksRequestHandler {
    private final LinksController linksController;
    public LinksRequestHandler(LinksController linksController){
        this.linksController = linksController;
    }
    /**Method called from Server when the 'api/links/:id' endpoint is received.
     * Get a JSON response with a list of all the links in the database.
     *
     * @param req the HTTP request
     * @param res the HTTP response
     * @return one contact in JSON formatted string and if it fails it will return text with a different HTTP status code
     */
    public String getLinksJSON(Request req, Response res){
        res.type("application/json");
        String id = req.params("id");
        String links;
        try {
            links = linksController.getLink(id);
        } catch (IllegalArgumentException e) {
            // This is thrown if the ID doesn't have the appropriate
            // form for a Mongo Object ID.
            // https://docs.mongodb.com/manual/reference/method/ObjectId/
            res.status(400);
            res.body("The requested link id " + id + " wasn't a legal Mongo Object ID.\n" +
                "See 'https://docs.mongodb.com/manual/reference/method/ObjectId/' for more info.");
            return "";
        }
        if (links != null) {
            return links;
        } else {
            res.status(404);
            res.body("The requested link with id " + id + " was not found");
            return "";
        }
    }



    /**Method called from Server when the 'api/links' endpoint is received.
     * This handles the request received and the response
     * that will be sent back.
     *@param req the HTTP request
     * @param res the HTTP response
     * @return an array of contacts in JSON formatted String
     */
    public String getLinks(Request req, Response res)
    {
        res.type("application/json");
        return linksController.getLinks(req.queryMap().toMap());
    }


    /**Method called from Server when the 'api/links/new'endpoint is recieved.
     * Gets specified links info from request and package umm3601.database.links;

     public class LinksRequestHandler {
     }
     lls addNewLinks helper method
     * to append that info to a document
     *
     * @param req the HTTP request
     * @param res the HTTP response
     * @return a boolean as whether the contact was added successfully or not
     */
    public String addNewLinks(Request req, Response res)
    {

        res.type("application/json");
        Object o = JSON.parse(req.body());
        try {
            if(o.getClass().equals(BasicDBObject.class))
            {
                try {
                    BasicDBObject dbO = (BasicDBObject) o;
                    String id = dbO.getString("_id");
                    String userID = dbO.getString("userID");
                    String name = dbO.getString("name");
                    String email = dbO.getString("subname");
                    String phone = dbO.getString("url");


//
//                    System.err.println("Adding new contact [id=" + id + ", name=" + name + " subname=" + subname + "url" + url  + ']');
                    return linksController.addNewLinks( id, userID, name, email, phone).toString();
                }
                catch(NullPointerException e)
                {
                    System.err.println("A value was malformed or omitted, new link request failed.");
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

    public String deleteLink(Request req, Response res){

        System.out.println("Deleting link with ID: " + req.params(":id"));

        res.type("application/json");

        try {
            String id = req.params(":id");
            linksController.deleteLink(id);
            return req.params(":id");
        }
        catch(RuntimeException ree)
        {
            ree.printStackTrace();
            return null;
        }
    }

}
