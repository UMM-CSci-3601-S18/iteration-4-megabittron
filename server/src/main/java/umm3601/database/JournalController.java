package umm3601.database;

import com.google.gson.Gson;
import com.mongodb.MongoException;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.util.JSON;
import org.bson.Document;
import org.bson.types.ObjectId;

import java.util.Iterator;
import java.util.Map;

import static com.mongodb.client.model.Filters.eq;


// Controller that manages information about people's journals.
public class JournalController {

    private final Gson gson;
    private MongoDatabase database;
    // journalCollection is the collection that the journals data is in.
    private final MongoCollection<Document> journalCollection;

    // Construct controller for journals.
    public JournalController(MongoDatabase database) {
        gson = new Gson();
        this.database = database;
        journalCollection = database.getCollection("journals");
    }

    // get an journal by its ObjectId, not used by client, for potential future use
    public String getJournal(String id) {
        FindIterable<Document> jsonJournals
            = journalCollection
            .find(eq("_id", new ObjectId(id)));

        Iterator<Document> iterator = jsonJournals.iterator();
        if (iterator.hasNext()) {
            Document journal = iterator.next();
            return journal.toJson();
        } else {
            // We didn't find the desired journal
            return null;
        }
    }

    // Helper method which iterates through the collection, receiving all
    // documents if no query parameter is specified. If the journal parameter is
    // specified, then the collection is filtered so only documents of that
    // specified journal are found.
    public String getJournals(Map<String, String[]> queryParams) {

        Document filterDoc = new Document();

        // We will need more statements here for different objects,
        // such as emoji, category, etc.

        // "journal" will be a key to a string object, where the object is
        // what we get when people enter their journals as a text body.
        // "journal" is the purpose of the journal
        if (queryParams.containsKey("journal")) {
            String targetContent = (queryParams.get("journal")[0]);
            Document contentRegQuery = new Document();
            contentRegQuery.append("$regex", targetContent);
            contentRegQuery.append("$options", "i");
            filterDoc = filterDoc.append("journal", contentRegQuery);
        }



        // name is the title of the journal
        if (queryParams.containsKey("title")) {
            String targetContent = (queryParams.get("title")[0]);
            Document contentRegQuery = new Document();
            contentRegQuery.append("$regex", targetContent);
            contentRegQuery.append("$options", "i");
            filterDoc = filterDoc.append("name", contentRegQuery);
        }

        // FindIterable comes from mongo, Document comes from Gson
        FindIterable<Document> matchingJournals = journalCollection.find(filterDoc);

        return JSON.serialize(matchingJournals);
    }

    /**
     * Helper method which appends received user information to the to-be added document
     *
     * @param title
     * @param category
     * @param body
     * @param time
     * @param link

     * @return boolean after successfully or unsuccessfully adding a user
     */
    // As of now this only adds the journal, but you can separate multiple arguments
    // by commas as we add them.
    public String addNewJournal(String title, String category, String body, String time, String link) {

        // makes the search Document key-pairs
        Document newJournal = new Document();
        newJournal.append("title", title);
        newJournal.append("category", category);
        newJournal.append("body", body);
        newJournal.append("time", time);
        newJournal.append("link", link);
        // Append new journals here

        try {
            journalCollection.insertOne(newJournal);
            ObjectId id = newJournal.getObjectId("_id");
            System.err.println("Successfully added new journal [title=" + title + ", category=" + category + ", body=" + body +", time=" + time + ", link = " + link + ']');
            // return JSON.serialize(newJournal);
            return JSON.serialize(id);
        } catch(MongoException me) {
            me.printStackTrace();
            return null;
        }
    }

}
