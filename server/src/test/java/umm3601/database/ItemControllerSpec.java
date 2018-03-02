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
import umm3601.user.UserController;
import umm3601.user.UserControllerSpec;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;

public class ItemControllerSpec {
    private ItemController itemController;
    private ObjectId huntersID;
    @Before
    public void clearAndPopulateDB() throws IOException {
        MongoClient mongoClient = new MongoClient();
        // !!! RENAME "test" TO SOMETHING USEFUL !!!
        MongoDatabase db = mongoClient.getDatabase("test");
        // End rename "test" to something useful.
        MongoCollection<Document> itemDocuments = db.getCollection("items");
        itemDocuments.drop();
        List<Document> testItems = new ArrayList<>();
        testItems.add(Document.parse("{\n" +
            "                    name: \"Aurora\",\n" +
            "                    goal: \"To get an A in software design!\",\n" +
            "                    category: \"School\",\n" +
            "                }"));
        testItems.add(Document.parse("{\n" +
            "                    name: \"Kai\",\n" +
            "                    goal: \"To take more than 12 credits.\",\n" +
            "                    category: \"Courses\",\n" +
            "                }"));
        testItems.add(Document.parse("{\n" +
            "                    name: \"John\",\n" +
            "                    goal: \"To get some pizza.\",\n" +
            "                    category: \"Food\",\n" +
            "                }"));

        huntersID = new ObjectId();
        BasicDBObject hunter = new BasicDBObject("_id", huntersID);
        hunter = hunter.append("name", "Hunter")
            .append("goal", "To finish his math homework.")
            .append("category", "Homework");



        itemDocuments.insertMany(testItems);
        itemDocuments.insertOne(Document.parse(hunter.toJson()));

        itemController = new ItemController(db);
    }

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

    private static String getGoal(BsonValue val) {
        BsonDocument doc = val.asDocument();
        return ((BsonString) doc.get("goal")).getValue();
    }

    private static String getName(BsonValue val) {
        BsonDocument doc = val.asDocument();
        return ((BsonString) doc.get("name")).getValue();
    }

    @Test
    public void getAllItems() {
        Map<String, String[]> emptyMap = new HashMap<>();
        String jsonResult = itemController.getItems(emptyMap);
        BsonArray docs = parseJsonArray(jsonResult);

        assertEquals("Should be 4 goals", 4, docs.size());
        List<String> goals = docs
            .stream()
            .map(ItemControllerSpec::getGoal)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedNames = Arrays.asList("To finish his math homework.", "To get an A in software design!", "To get some pizza.", "To take more than 12 credits.");
        assertEquals("Goals should match", expectedNames, goals);
    }

    @Test
    public void getItemByCategory(){
        Map<String, String[]> argMap = new HashMap<>();
        // Mongo in ItemController is doing a regex search so can just take a Java Reg. Expression
        // This will search the category for letters 'f' and 'c'.
        argMap.put("category", new String[] { "[f, c]" });
        String jsonResult = itemController.getItems(argMap);
        BsonArray docs = parseJsonArray(jsonResult);
        assertEquals("Should be 3 items", 3, docs.size());
        List<String> name = docs
            .stream()
            .map(ItemControllerSpec::getName)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedName = Arrays.asList("Aurora","John","Kai");
        assertEquals("Names should match", expectedName, name);
    }

    @Test
    public void getHuntersByID() {
        String jsonResult = itemController.getItem(huntersID.toHexString());
        Document sam = Document.parse(jsonResult);
        assertEquals("Name should match", "Hunter", sam.get("name"));
        String noJsonResult = itemController.getItem(new ObjectId().toString());
        assertNull("No name should match",noJsonResult);
    }

    @Test
    public void addItemTest(){
        String newId = itemController.addNewItem("Aaron", "Avoid stabbing knee on old keyboard holder.");

        assertNotNull("Add new item should return true when item is added,", newId);
        Map<String, String[]> argMap = new HashMap<>();
        String jsonResult = itemController.getItems(argMap);
        BsonArray docs = parseJsonArray(jsonResult);

        List<String> name = docs
            .stream()
            .map(ItemControllerSpec::getName)
            .sorted()
            .collect(Collectors.toList());
        // name.get(0) says to get the name of the first person in the database,
        // so "Aaron" will probably always be first because it is sorted alphabetically.
        assertEquals("Should return name of new user", "Aaron", name.get(0));
    }

}
