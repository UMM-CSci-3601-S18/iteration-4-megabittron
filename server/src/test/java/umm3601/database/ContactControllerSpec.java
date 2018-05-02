package umm3601.database;

import com.mongodb.BasicDBObject;
import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.util.JSON;
import org.bson.*;
import org.bson.codecs.*;
import org.bson.codecs.configuration.CodecRegistries;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.json.JsonReader;
import org.bson.types.ObjectId;
import org.junit.Before;
import org.junit.Test;
import umm3601.database.resource.ContactsController;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

import static org.junit.Assert.*;

/**
 * JUnit tests for the ContactController.
 */
public class ContactControllerSpec {
    private ContactsController contactController;
    private ObjectId anID;

    @Before
    public void clearAndPopulateDB() throws IOException {
        MongoClient mongoClient = new MongoClient();
        MongoDatabase db = mongoClient.getDatabase("test");
        MongoCollection<Document> contactDocuments = db.getCollection("contacts");
        contactDocuments.drop();
        List<Document> testContacts = new ArrayList<>();
        testContacts.add(Document.parse("{\n" +
            "                    _id: \"5ab88ab16148ec7b0f6b6fa4\",\n" +
            "                    userID: \"4cb56a89541a2d783595012c\",\n " +
            "                    name: \"Chuck Menne\",\n" +
            "                    email: \"chuck@umn.edu\",\n" +
            "                    phone: \"555-555-5555\",\n" +
            "                }"));
        testContacts.add(Document.parse("{\n" +
            "                    _id: \"5ab88ab17205545c679992e4\",\n" +
            "                    userID: \"4cb56a89541a2d783595012c\",\n " +
            "                    name: \"John Hoff\",\n" +
            "                    email: \"john@umn.edu\",\n" +
            "                    phone: \"444-444-4444\",\n" +
            "                }"));
        testContacts.add(Document.parse("{\n" +
            "                    _id: \"5ab88ab1543afe51da42359e\",\n" +
            "                    userID: \"4cb56a89541a2d783595012c\",\n " +
            "                    name: \"Dustin Blake\",\n" +
            "                    email: \"dustin@umn.edu\",\n" +
            "                    phone: \"333-333-3333\",\n" +
            "                }"));
        testContacts.add(Document.parse("{\n" +
            "                    _id: \"5ab88ab1a5b4ebf66df44c40\",\n" +
            "                    userID: \"4cb56a89541a2d783595012c\",\n " +
            "                    name: \"Abe Monjor\",\n" +
            "                    email: \"abe@umn.edu\",\n" +
            "                    phone: \"222-222-2222\",\n" +
            "                }"));

        anID = new ObjectId();
        BasicDBObject sam = new BasicDBObject("_id", anID);
        sam = sam.append("userID", "2cb45a89541a2d783595012b")
            .append("name", "Sam Score")
            .append("email", "sam@umn.edu")
            .append("phone", "111-111-1111");


        contactDocuments.insertMany(testContacts);
        contactDocuments.insertOne(Document.parse(sam.toJson()));

        // It might be important to construct this _after_ the DB is set up
        // in case there are bits in the constructor that care about the state
        // of the database.
        contactController = new ContactsController(db);
    }

    // http://stackoverflow.com/questions/34436952/json-parse-equivalent-in-mongo-driver-3-x-for-java
    private BsonArray parseJsonArray(String json) {
        final CodecRegistry codecRegistry
            = CodecRegistries.fromProviders(Arrays.asList(
            new ValueCodecProvider(),
            new BsonValueCodecProvider(),
            new DocumentCodecProvider()));

        JsonReader reader = new JsonReader(json);
        BsonArrayCodec arrayReader = new BsonArrayCodec(codecRegistry);

        return arrayReader.decode(reader, DecoderContext.builder().build());
    }

    private static String getName(BsonValue val) {
        BsonDocument doc = val.asDocument();
        return ((BsonString) doc.get("name")).getValue();
    }

    private static String getEmail(BsonValue val) {
        BsonDocument doc = val.asDocument();
        return ((BsonString) doc.get("email")).getValue();
    }

    @Test
    public void getContactsOfOneUser() {
        Map<String, String[]> argMap = new HashMap<>();
        argMap.put("userID", new String[]{"4cb56a89541a2d783595012c"});
        String jsonResult = contactController.getContacts(argMap);
        BsonArray docs = parseJsonArray(jsonResult);

        assertEquals("Should be 5 contacts", 5, docs.size());
        List<String> names = docs
            .stream()
            .map(ContactControllerSpec::getName)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedNames = Arrays.asList("Abe Monjor", "Chuck Menne", "Dustin Blake", "John Hoff", "Sam Score");
        assertEquals("Names should match", expectedNames, names);
    }

    @Test
    public void getContactById() {
        String jsonResult = contactController.getContact(anID.toHexString());
        Document sam = Document.parse(jsonResult);
        assertEquals("Name should match", anID, sam.get("_id"));
        String noJsonResult = contactController.getContact(new ObjectId().toString());
        assertNull("No Contact should match", noJsonResult);

    }

    @Test
    public void addContactTest() {
        String newId = contactController.addNewContacts("4cb56a89541a2d783595012c","defaultUserID", "Aaron Bass", "aaron@umn.edu", "555-555-5555");
        assertNotNull("Add new contacts should return true,", newId);
        Map<String, String[]> argMap = new HashMap<>();
        argMap.put("userID", new String[]{"4cb56a89541a2d783595012c"});
        argMap.put("contact", new String[]{"defaultUserID"});
        String jsonResult = contactController.getContacts(argMap);
        BsonArray docs = parseJsonArray(jsonResult);

        List<String> contacts = docs
            .stream()
            .map(ContactControllerSpec::getEmail)
            .sorted()
            .collect(Collectors.toList());
        System.out.println(contacts);
        assertEquals("Should return name of new contact", "aaron@umn.edu", contacts.get(0));
    }

    @Test
    public void deleteContactTest(){
        System.out.println("ID: " + anID.toHexString());
        contactController.deleteContact(anID.toHexString());
    }

}

