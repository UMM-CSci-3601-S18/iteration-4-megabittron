package umm3601.database;

import com.mongodb.BasicDBObject;
import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.*;
import org.bson.codecs.*;
import org.bson.codecs.configuration.CodecRegistries;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.json.JsonReader;
import org.bson.types.ObjectId;
import org.junit.Before;
import org.junit.Test;
import umm3601.database.resource.ContactsController;

import static org.junit.Assert.*;


import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

import static org.junit.Assert.assertEquals;

public class ContactControllerSpec {
    private ContactsController contactsController;
    private ObjectId floraId;

    @Before
    public void clearAndPopulateDB() throws IOException {
        MongoClient mongoClient = new MongoClient();
        MongoDatabase db = mongoClient.getDatabase("test");
        MongoCollection<Document> contactDocuments = db.getCollection("contacts");
        contactDocuments.drop();
        List<Document> testContact = new ArrayList<>();
        testContact.add(Document.parse("{\n" +
            "                    name: \"Robert Ward\",\n" +
            "                    email: \"Ladonna@ Benson.com\",\n" +
            "                    phone: \"(891) 411-3124\",\n" +
            "                }"));
        testContact.add(Document.parse("{\n" +
            "                    name: \"Thomas Franco\",\n" +
            "                    email: \"Lila@ Browning.com\",\n" +
            "                    phone: \"(803) 525-2495\",\n" +
            "                }"));
        testContact.add(Document.parse("{\n" +
            "                    name: \"Wood Aguirre\",\n" +
            "                    email: \"Alford@ Beard.com\",\n" +
            "                    phone: \"(862) 433-3136\",\n" +
            "                }"));

        floraId = new ObjectId();
        BasicDBObject flora = new BasicDBObject("_id", floraId);
        flora = flora.append("name", "Flora Hull")
            .append("email", "Daniel@ Bass.com")
            .append("phone", "(922) 486-2948");


        contactDocuments.insertMany(testContact);
        contactDocuments.insertOne(Document.parse(flora.toJson()));

        // It might be important to construct this _after_ the DB is set up
        // in case there are bits in the constructor that care about the state
        // of the database.
        contactsController = new ContactsController(db);
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

    @Test
    public void getAllContacts() {
        Map<String, String[]> emptyMap = new HashMap<>();
        String jsonResult = contactsController.getContacts(emptyMap);
        BsonArray docs = parseJsonArray(jsonResult);

        assertEquals("Should be 4 contacts", 4, docs.size());
        List<String> names = docs
            .stream()
            .map(ContactControllerSpec::getName)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedNames = Arrays.asList("Flora Hull", "Robert Ward", "Thomas Franco", "Wood Aguirre");
        assertEquals("Names should match", expectedNames, names);
    }

    @Test
    public void getContactById() {
        String jsonResult = contactsController.getContacts(floraId.toHexString());
        System.out.println(jsonResult);
        Document flora = Document.parse(jsonResult);

        assertEquals("Name should match", "Flora Hull", flora.getString("name"));
        String noJsonResult = contactsController.getContacts(new ObjectId().toString());
        assertNull("No name should match", noJsonResult);

    }

}
