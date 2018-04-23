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

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

import static org.junit.Assert.*;

/**
 * JUnit tests for the JournalController.
 */
public class JournalControllerSpec {
    private JournalController journalController;
    private ObjectId anID;

    @Before
    public void clearAndPopulateDB() throws IOException {
        MongoClient mongoClient = new MongoClient();
        MongoDatabase db = mongoClient.getDatabase("test");
        MongoCollection<Document> journalDocuments = db.getCollection("journals");
        journalDocuments.drop();
        List<Document> testJournals = new ArrayList<>();
        testJournals.add(Document.parse("{\n" +
            "                    _id: \"5ab88ab16148ec7b0f6b6fa4\",\n" +
            "                    userID: \"4cb56a89541a2d783595012c\",\n " +
            "                    subject: \"Tuesday\",\n" +
            "                    body: \"Tuesday it rain a lot\",\n" +
            "                    date: \"Sat Aug 21 1976 06:05:06 GMT-0500 (CDT)\",\n" +
            "                }"));
        testJournals.add(Document.parse("{\n" +
            "                    _id: \"5ab88ab17205545c679992e4\",\n" +
            "                    userID: \"4cb56a89541a2d783595012c\",\n " +
            "                    subject: \"Bad day\",\n" +
            "                    body: \"My dog died\",\n" +
            "                    date: \"Tues Aug 17 1980 06:05:06 GMT-0500 (CDT)\",\n" +
            "                }"));
        testJournals.add(Document.parse("{\n" +
            "                    _id: \"5ab88ab1543afe51da42359e\",\n" +
            "                    userID: \"4cb56a89541a2d783595012c\",\n " +
            "                    subject: \"Fun Day\",\n" +
            "                    body: \"I went to the park\",\n" +
            "                    date: \"Wed Aug 27 1976 06:05:06 GMT-0600 (CDT)\",\n" +
            "                }"));
        testJournals.add(Document.parse("{\n" +
            "                    _id: \"5ab88ab1a5b4ebf66df44c40\",\n" +
            "                    userID: \"4cb56a89541a2d783595012c\",\n " +
            "                    subject: \"Birthday\",\n" +
            "                    body: \"I spent the day alone\",\n" +
            "                    date: \"Sat Aug 14 1976 06:05:06 GMT-0900 (CDT)\",\n" +
            "                }"));

        anID = new ObjectId();
        BasicDBObject sam = new BasicDBObject("_id", anID);
        sam = sam.append("subject", "Food")
            .append("userID", "2cb45a89541a2d783595012b")
            .append("body", "I went taco johns")
            .append("date", "Tue Jan 14 2014 18:35:56 GMT-0600");


        journalDocuments.insertMany(testJournals);
        journalDocuments.insertOne(Document.parse(sam.toJson()));

        // It might be important to construct this _after_ the DB is set up
        // in case there are bits in the constructor that care about the state
        // of the database.
        journalController = new JournalController(db);
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

    private static String getSubject(BsonValue val) {
        BsonDocument doc = val.asDocument();
        return ((BsonString) doc.get("subject")).getValue();
    }

    private static String getBody(BsonValue val) {
        BsonDocument doc = val.asDocument();
        return ((BsonString) doc.get("body")).getValue();
    }

    @Test
    public void getNoJournals() {
        Map<String, String[]> emptyMap = new HashMap<>();
        String jsonResult = journalController.getJournals(emptyMap);

        assertEquals("Should be 0 journals", jsonResult, JSON.serialize("[ ]"));
    }

    @Test
    public void getJournalsOfOneUser() {
        Map<String, String[]> argMap = new HashMap<>();
        argMap.put("userID", new String[]{"4cb56a89541a2d783595012c"});
        String jsonResult = journalController.getJournals(argMap);
        BsonArray docs = parseJsonArray(jsonResult);

        assertEquals("Should be 4 journals", 4, docs.size());
        List<String> subjects = docs
            .stream()
            .map(JournalControllerSpec::getSubject)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedSubjects = Arrays.asList("Bad day", "Birthday", "Fun Day", "Tuesday");
        assertEquals("Subjects should match", expectedSubjects, subjects);
    }

    @Test
    public void getJournalsOnBadDay() {
        Map<String, String[]> argMap = new HashMap<>();
        argMap.put("userID", new String[]{"4cb56a89541a2d783595012c"});
        argMap.put("subject", new String[]{"Tuesday"});
        String jsonResult = journalController.getJournals(argMap);
        BsonArray docs = parseJsonArray(jsonResult);

        assertEquals("Should be 1 journal", 1, docs.size());
        List<String> subjects = docs
            .stream()
            .map(JournalControllerSpec::getSubject)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedSubjects = Arrays.asList("Tuesday");
        assertEquals("Subjects should match", expectedSubjects, subjects);
    }

    @Test
    public void getJournalByBody() {
        Map<String, String[]> argMap = new HashMap<>();
        argMap.put("userID", new String[]{"4cb56a89541a2d783595012c"});
        argMap.put("body", new String[]{"I went to the park"});
        String jsonResult = journalController.getJournals(argMap);
        BsonArray docs = parseJsonArray(jsonResult);

        assertEquals("Should be 1 journal", 1, docs.size());
        List<String> subjects = docs
            .stream()
            .map(JournalControllerSpec::getBody)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedSubjects = Arrays.asList("I went to the park");
        assertEquals("Subjects should match", expectedSubjects, subjects);
    }

    @Test
    public void getJournalById() {
        String jsonResult = journalController.getJournal(anID.toHexString());
        Document sam = Document.parse(jsonResult);
        assertEquals("Name should match", anID, sam.get("_id"));
        String noJsonResult = journalController.getJournal(new ObjectId().toString());
        assertNull("No Journal should match", noJsonResult);

    }

    @Test
    public void addJournalTest() {
        String newId = journalController.addNewJournal("4cb56a89541a2d783595012c","I'm sad", "I ate all my food");
        assertNotNull("Add new journals should return true,", newId);
        Map<String, String[]> argMap = new HashMap<>();
        argMap.put("userID", new String[]{"4cb56a89541a2d783595012c"});
        argMap.put("journal", new String[]{"I'm sad"});
        String jsonResult = journalController.getJournals(argMap);
        BsonArray docs = parseJsonArray(jsonResult);

        List<String> journals = docs
            .stream()
            .map(JournalControllerSpec::getBody)
            .sorted()
            .collect(Collectors.toList());
        System.out.println(journals);
        assertEquals("Should return subject of new journal", "I ate all my food", journals.get(0));
    }

    @Test
    public void editJournalTest() {
        journalController.editJournal(anID.toHexString(), "Friday", "It's Friday");
        Map<String, String[]> argMap = new HashMap<>();
        argMap.put("userID", new String[]{"2cb45a89541a2d783595012b"});
        argMap.put("body", new String[]{"It's Friday"});
        String jsonResult = journalController.getJournals(argMap);
        BsonArray docs = parseJsonArray(jsonResult);
        List<String> subjects = docs
            .stream()
            .map(JournalControllerSpec::getBody)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedSubjects = Arrays.asList("It's Friday");
        assertEquals("Subjects should match", expectedSubjects, subjects);
    }

    @Test
    public void deleteJournalTest(){
        System.out.println("ID: " + anID.toHexString());
        journalController.deleteJournal(anID.toHexString());
    }

}

