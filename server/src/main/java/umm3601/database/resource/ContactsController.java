package umm3601.database.resource;

import com.google.gson.Gson;
import com.mongodb.*;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.util.JSON;
import org.bson.Document;
import org.bson.types.ObjectId;
import java.util.Iterator;
import java.util.Map;


import static com.mongodb.client.model.Filters.eq;

public class ContactsController {
    private final Gson gson;
    private MongoDatabase database;
    private final MongoCollection<Document> contactsCollection;

    /**
     * Construct a controller for resources.
     *
     * @param database the database containing resources data
     */
    public ContactsController(MongoDatabase database) {
        gson = new Gson();
        this.database = database;
        contactsCollection = database.getCollection("contacts");
    }

    public String getContacts(String id) {

        FindIterable<Document> jsonContacts
            = contactsCollection
            .find(eq("_id", new ObjectId(id)));

        Iterator<Document> iterator = jsonContacts.iterator();
        if (iterator.hasNext()) {
            Document contact = iterator.next();
            return contact.toJson();
        } else {
            // We didn't find the desired Contact
            return null;
        }
    }


    public String getContacts(Map<String, String[]> queryParams) {
        Document filterDoc = new Document();

        if (queryParams.containsKey("name")) {
            String targetName = (queryParams.get("name")[0]);
            Document contentRegQuery = new Document();
            contentRegQuery.append("$regex", targetName);
            contentRegQuery.append("$options", "i");
            filterDoc = filterDoc.append("name", targetName);
        }

        FindIterable<Document> matchingContacts = contactsCollection.find(filterDoc);


        return JSON.serialize(matchingContacts);
    }


    public String addNewContacts(String id, String name, String email, String phone) {

        Document newContacts = new Document();
        newContacts.append("name", name);
        newContacts.append("email", email);
        newContacts.append("phone", phone);




        try {
            contactsCollection.insertOne(newContacts);

            ObjectId Id = newContacts.getObjectId("_id");
            System.err.println("Successfully added new contact [_id=" + id + ", name=" + name + ", email=" + email + " phone=" + phone + ']');

            return JSON.serialize(Id);
        } catch (MongoException me) {
            me.printStackTrace();
            return null;
        }
    }
}
