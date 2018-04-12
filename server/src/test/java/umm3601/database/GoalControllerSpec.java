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

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;

public class GoalControllerSpec {
    private GoalController goalController;
    private ObjectId anID;
    @Before
    public void clearAndPopulateDB() throws IOException {
        MongoClient mongoClient = new MongoClient();
        MongoDatabase db = mongoClient.getDatabase("test");
        MongoCollection<Document> goalDocuments = db.getCollection("goals");

        goalDocuments.drop();

        List<Document> testGoals = new ArrayList<>();
        testGoals.add(Document.parse("{\n" +
            "                    name: \"Clean my room\",\n" +
            "                    userID: \"4cb56a89541a2d783595012c\",\n " +
            "                    purpose: \"To have a better environment\",\n" +
            "                    category: \"Living\",\n" +
            "                }"));
        testGoals.add(Document.parse("{\n" +
            "                    name: \"Wash dishes\",\n" +
            "                    userID: \"4cb56a89541a2d783595012c\",\n " +
            "                    purpose: \"Cleaner kitchen\",\n" +
            "                    category: \"Chores\",\n" +
            "                }"));
        testGoals.add(Document.parse("{\n" +
            "                    name: \"Make cookies\",\n" +
            "                    userID: \"4cb56a89541a2d783595012c\",\n " +
            "                    purpose: \"Get fatter\",\n" +
            "                    category: \"Food\",\n" +
            "                }"));

        anID = new ObjectId();
        BasicDBObject hunter = new BasicDBObject("_id", anID);
        hunter = hunter.append("name", "Call mom")
            .append("userID", "2cb45a89541a2d783595012b")
            .append("purpose", "Improve relationship")
            .append("category", "Family");

        goalDocuments.insertMany(testGoals);
        goalDocuments.insertOne(Document.parse(hunter.toJson()));

        goalController = new GoalController(db);
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

    private static String getPurpose(BsonValue val) {
        BsonDocument doc = val.asDocument();
        return ((BsonString) doc.get("purpose")).getValue();
    }

    private static String getName(BsonValue val) {
        BsonDocument doc = val.asDocument();
        return ((BsonString) doc.get("name")).getValue();
    }

    @Test
    public void getNoGoals() {
        Map<String, String[]> emptyMap = new HashMap<>();
        String jsonResult = goalController.getGoals(emptyMap);
        BsonArray docs = parseJsonArray(jsonResult);

        assertEquals("Should be 0 goals", 0, docs.size());
        List<String> goals = docs
            .stream()
            .map(GoalControllerSpec::getPurpose)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedNames = Arrays.asList();
        assertEquals("Goals should match", expectedNames, goals);
    }

    @Test
    public void getOneUsersGoals(){
        Map<String, String[]> argMap = new HashMap<>();
        // Mongo in GoalController is doing a regex search so can just take a Java Reg. Expression
        // This will search the category for letters 'f' and 'c'.
        argMap.put("userID", new String[] { "4cb56a89541a2d783595012c" });
        String jsonResult = goalController.getGoals(argMap);
        BsonArray docs = parseJsonArray(jsonResult);
        assertEquals("Should be 3 goals", 3, docs.size());
        List<String> name = docs
            .stream()
            .map(GoalControllerSpec::getName)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedName = Arrays.asList("Clean my room", "Make cookies","Wash dishes");
        assertEquals("Names should match", expectedName, name);
    }

    @Test
    public void getGoalByCategory(){
        Map<String, String[]> argMap = new HashMap<>();
        // Mongo in GoalController is doing a regex search so can just take a Java Reg. Expression
        // This will search the category for letters 'f' and 'c'.
        argMap.put("userID", new String[] { "4cb56a89541a2d783595012c" });
        argMap.put("category", new String[] { "[F, C]" });
        String jsonResult = goalController.getGoals(argMap);
        BsonArray docs = parseJsonArray(jsonResult);
        assertEquals("Should be 2 goals", 2, docs.size());
        List<String> name = docs
            .stream()
            .map(GoalControllerSpec::getName)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedName = Arrays.asList("Make cookies","Wash dishes");
        assertEquals("Names should match", expectedName, name);
    }

    @Test
    public void getGoalByID() {
        String jsonResult = goalController.getGoal(anID.toHexString());
        Document aDoc = Document.parse(jsonResult);
        assertEquals("Name should match", "Call mom", aDoc.get("name"));
        String noJsonResult = goalController.getGoal(new ObjectId().toString());
        assertNull("No name should match",noJsonResult);
    }

    @Test
    public void addGoalTest(){
        String newId = goalController.addNewGoal("4cb56a89541a2d783595012c","AAAAAA Self defense from Bobs", "Injury", "Kick Bob", false,
            "Daily", "2018-04-05T18:56:24.702Z", "2018-04-05T18:56:24.702Z", "2018-04-05T18:56:24.702Z");

        assertNotNull("Add new goal should return true when goal is added,", newId);
        Map<String, String[]> argMap = new HashMap<>();
        String jsonResult = goalController.getGoals(argMap);
        BsonArray docs = parseJsonArray(jsonResult);

        List<String> purpose = docs
            .stream()
            .map(GoalControllerSpec::getPurpose)
            .sorted()
            .collect(Collectors.toList());
        assertEquals("Should return purpose of new goal", "AAAAAA Self defense from Bobs", purpose.get(0));
    }

    @Test
    public void editGoalTest() {
        String newId = goalController.completeGoal("5ab53a8907d923f68d03e1a3", "To have a better environment", "Family", "Hug KK", true,
            "Daily", "2018-04-05T18:56:24.702Z", "2018-04-05T18:56:24.702Z", "2018-04-05T18:56:24.702Z");

        assertNotNull("Edit goal should return true when goal is edited,", newId);
        Map<String, String[]> argMap = new HashMap<>();
        String jsonResult = goalController.getGoals(argMap);
        BsonArray docs = parseJsonArray(jsonResult);
        List<String> purpose = docs
            .stream()
            .map(GoalControllerSpec::getPurpose)
            .sorted()
            .collect(Collectors.toList());
        assertEquals("Should return purpose of edited goal", "To have a better environment", purpose.get(3));
    }

    @Test
    public void deleteGoalTest(){
        System.out.println("anID " + anID.toHexString());
        goalController.deleteGoal(anID.toHexString());
        Map<String, String[]> argMap = new HashMap<>();
        String jsonResult = goalController.getGoals(argMap);
        BsonArray docs = parseJsonArray(jsonResult);
        assertEquals("Should be 3 goals", 3, docs.size());

    }
}
