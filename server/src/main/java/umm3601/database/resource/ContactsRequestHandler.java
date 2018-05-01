package umm3601.database.resource;

import com.mongodb.BasicDBObject;
import com.mongodb.util.JSON;
import spark.Request;
import spark.Response;
import umm3601.database.resource.ContactsController;


public class ContactsRequestHandler {
    private final ContactsController contactsController;
    public ContactsRequestHandler(ContactsController contactsController){
        this.contactsController = contactsController;
    }
    /**Method called from Server when the 'api/contacts/:id' endpoint is received.
     * Get a JSON response with a list of all the contacts in the database.
     *
     * @param req the HTTP request
     * @param res the HTTP response
     * @return one contact in JSON formatted string and if it fails it will return text with a different HTTP status code
     */
    public String getContactsJSON(Request req, Response res){
        res.type("application/json");
        String id = req.params("id");
        String contacts;
        try {
            contacts = contactsController.getContacts(id);
        } catch (IllegalArgumentException e) {
            // This is thrown if the ID doesn't have the appropriate
            // form for a Mongo Object ID.
            // https://docs.mongodb.com/manual/reference/method/ObjectId/
            res.status(400);
            res.body("The requested contact id " + id + " wasn't a legal Mongo Object ID.\n" +
                "See 'https://docs.mongodb.com/manual/reference/method/ObjectId/' for more info.");
            return "";
        }
        if (contacts != null) {
            return contacts;
        } else {
            res.status(404);
            res.body("The requested contact with id " + id + " was not found");
            return "";
        }
    }



    /**Method called from Server when the 'api/contacts' endpoint is received.
     * This handles the request received and the response
     * that will be sent back.
     *@param req the HTTP request
     * @param res the HTTP response
     * @return an array of contacts in JSON formatted String
     */
    public String getContacts(Request req, Response res)
    {
        res.type("application/json");
        return contactsController.getContacts(req.queryMap().toMap());
    }


    /**Method called from Server when the 'api/contacts/new'endpoint is recieved.
     * Gets specified contacts info from request and capackage umm3601.database.contact;

public class ContactsRequestHandler {
}
lls addNewResources helper method
     * to append that info to a document
     *
     * @param req the HTTP request
     * @param res the HTTP response
     * @return a boolean as whether the contact was added successfully or not
     */
    public String addNewContacts(Request req, Response res)
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
                    String email = dbO.getString("email");
                    String phone = dbO.getString("phone");


//
//                    System.err.println("Adding new contact [id=" + id + ", userID=" + userID + name=" + name + " phonenumber=" + phonenumber + "email" + email  + ']');
                    return contactsController.addNewContacts( id, userID, name, email, phone).toString();
                }
                catch(NullPointerException e)
                {
                    System.err.println("A value was malformed or omitted, new contact request failed.");
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

    public String deleteContact(Request req, Response res){

        System.out.println("Deleting contact with ID: " + req.params(":id"));

        res.type("application/json");

        try {
            String id = req.params(":id");
            contactsController.deleteContact(id);
            return req.params(":id");
        }
        catch(RuntimeException ree)
        {
            ree.printStackTrace();
            return null;
        }
    }
}
