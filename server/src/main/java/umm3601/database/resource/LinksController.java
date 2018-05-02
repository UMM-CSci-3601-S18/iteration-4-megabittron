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

public class LinksController {
    private final Gson gson;
    private MongoDatabase database;
    private final MongoCollection<Document> linksCollection;

    /**
     * Construct a controller for links.
     *
     * @param database the database containing links data
     */
    public LinksController(MongoDatabase database) {
        gson = new Gson();
        this.database = database;
        linksCollection = database.getCollection("links");
    }

    public String getLink(String id) {

        FindIterable<Document> jsonContacts
            = linksCollection
            .find(eq("_id", new ObjectId(id)));

        Iterator<Document> iterator = jsonContacts.iterator();
        if (iterator.hasNext()) {
            Document link = iterator.next();
            return link.toJson();
        } else {
            // We didn't find the desired Contact
            return null;
        }
    }


    public String getLinks(Map<String, String[]> queryParams) {
        Document filterDoc = new Document();

        if (queryParams.containsKey("name")) {
            String targetName = (queryParams.get("name")[0]);
            Document contentRegQuery = new Document();
            contentRegQuery.append("$regex", targetName);
            contentRegQuery.append("$options", "i");
            filterDoc = filterDoc.append("name", targetName);
        }

        FindIterable<Document> matchingLinks = linksCollection.find(filterDoc);


        return JSON.serialize(matchingLinks);
    }


    public String addNewLinks(String id, String userID, String name, String subname, String url) {

        Document newLinks = new Document();
        newLinks.append("name", name);
        newLinks.append("userID", userID);
        newLinks.append("subname", subname);
        newLinks.append("url", url);




        try {
            linksCollection.insertOne(newLinks);

            ObjectId Id = newLinks.getObjectId("_id");
            System.err.println("Successfully added new link for" + userID + "[_id=" + id + ", name=" + name + ", subname=" + subname + " url=" + url + ']');

            return JSON.serialize(Id);
        } catch (MongoException me) {
            me.printStackTrace();
            return null;
        }
    }

    public void deleteLink(String id){
        Document searchQuery = new Document().append("_id", new ObjectId(id));
        System.out.println("Link id: " + id);
        try {
            linksCollection.deleteOne(searchQuery);
            ObjectId theID = searchQuery.getObjectId("_id");
            System.out.println("Succesfully deleted link with ID: " + theID);

        } catch(MongoException me) {
            me.printStackTrace();
            System.out.println("error");
        }
    }

}
