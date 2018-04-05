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

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

import static org.junit.Assert.*;

/**
 * JUnit tests for the JournalController.
 */
public class JournalControllerSpec {
    private JournalController journalController;
    private ObjectId samsId;

    @Before
    public void clearAndPopulateDB() throws IOException {
        MongoClient mongoClient = new MongoClient();
        MongoDatabase db = mongoClient.getDatabase("test");
        MongoCollection<Document> journalDocuments = db.getCollection("journals");
        journalDocuments.drop();
        List<Document> testJournals = new ArrayList<>();
        testJournals.add(Document.parse("{\n" +
            "                    _id: \"5ab88ab16148ec7b0f6b6fa4\",\n" +
            "                    subject: \"Tuesday\",\n" +
            "                    body: \"Tuesday it rain a lot\",\n" +
            "                    date: \"Sat Aug 21 1976 06:05:06 GMT-0500 (CDT)\",\n" +
            "                }"));
        testJournals.add(Document.parse("{\n" +
            "                    _id: \"5ab88ab17205545c679992e4\",\n" +
            "                    subject: \"Bad day\",\n" +
            "                    body: \"My dog died\",\n" +
            "                    date: \"Tues Aug 17 1980 06:05:06 GMT-0500 (CDT)\",\n" +
            "                }"));
        testJournals.add(Document.parse("{\n" +
            "                    _id: \"5ab88ab1543afe51da42359e\",\n" +
            "                    subject: \"Fun Day\",\n" +
            "                    body: \"I went to the park\",\n" +
            "                    date: \"Wed Aug 27 1976 06:05:06 GMT-0600 (CDT)\",\n" +
            "                }"));
        testJournals.add(Document.parse("{\n" +
            "                    _id: \"5ab88ab1a5b4ebf66df44c40\",\n" +
            "                    subject: \"Birthday\",\n" +
            "                    body: \"I spent the day alone\",\n" +
            "                    date: \"Sat Aug 14 1976 06:05:06 GMT-0900 (CDT)\",\n" +
            "                }"));

        samsId = new ObjectId();
        BasicDBObject sam = new BasicDBObject("_id", samsId);
        sam = sam.append("subject", "Food")
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
    public void getAllJournals() {
        Map<String, String[]> emptyMap = new HashMap<>();
        String jsonResult = journalController.getJournals(emptyMap);
        BsonArray docs = parseJsonArray(jsonResult);

        assertEquals("Should be 5 journals", 5, docs.size());
        List<String> subjects = docs
            .stream()
            .map(JournalControllerSpec::getSubject)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedSubjects = Arrays.asList("Bad day", "Birthday", "Food", "Fun Day", "Tuesday");
        assertEquals("Subjects should match", expectedSubjects, subjects);
    }

    @Test
    public void getJournalsOnBadDay() {
        Map<String, String[]> argMap = new HashMap<>();
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
    public void getJounralById() {
        String jsonResult = journalController.getJournal(samsId.toHexString());
        Document sam = Document.parse(jsonResult);
        assertEquals("Name should match", samsId, sam.get("_id"));
        String noJsonResult = journalController.getJournal(new ObjectId().toString());
        assertNull("No Journal should match", noJsonResult);

    }

    @Test
    public void addJounralTest() {
        String newId = journalController.addNewJournal("I'm sad", "I ate all my food");
        assertNotNull("Add new journals should return true,", newId);
        Map<String, String[]> argMap = new HashMap<>();
        argMap.put("jounral", new String[]{"I'm sad"});
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
    public void editJounralTest() {
        journalController.editJournal(samsId.toHexString(), "Friday", "It's Friday");
        Map<String, String[]> argMap = new HashMap<>();
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

}

