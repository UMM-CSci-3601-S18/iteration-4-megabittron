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
            "                    category: \"UMM\",\n" +
            "                }"));
        testItems.add(Document.parse("{\n" +
            "                    name: \"Kai\",\n" +
            "                    goal: \"To take more than 12 credits.\",\n" +
            "                    category: \"UMM\",\n" +
            "                }"));
        testItems.add(Document.parse("{\n" +
            "                    name: \"John\",\n" +
            "                    goal: \"To get some pizza.\",\n" +
            "                    category: \"UMM\",\n" +
            "                }"));

        huntersID = new ObjectId();
        BasicDBObject hunter = new BasicDBObject("_id", huntersID);
        hunter = hunter.append("name", "Hunter")
            .append("goal", "To finish his math homework.");



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
        List<String> expectedNames = Arrays.asList("To get an A in software design!", "To take more than 12 credits.", "To get some pizza.", "To finish his math homework.");
        assertEquals("Goals should match", expectedNames, goals);
    }

}
