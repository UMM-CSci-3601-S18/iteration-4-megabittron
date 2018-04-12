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

    import java.util.*;
    import java.util.stream.Collectors;

    import static org.junit.Assert.assertEquals;
    import static org.junit.Assert.assertNotNull;
    import static org.junit.Assert.assertNull;

public class UserControllerSpec {
    private UserController userController;
    private ObjectId kylesId;
    @Before
    public void clearAndPopulateDB() {
        MongoClient mongoClient = new MongoClient();
        MongoDatabase db = mongoClient.getDatabase("test");
        MongoCollection<Document> userDocuments = db.getCollection("users");
        userDocuments.drop();
        List<Document> testUsers = new ArrayList<>();
        testUsers.add(Document.parse("{\n" +
            "                    SubjectID: \"121212\",\n" +
            "                    FirstName: \"Ahnaf\",\n" +
            "                    LastName: \"Prio\",\n" +
            "                }"));
        testUsers.add(Document.parse("{\n" +
            "                    SubjectID: \"131313\",\n" +
            "                    FirstName: \"Aurora\",\n" +
            "                    LastName: \"Corde\",\n" +
            "                }"));
        testUsers.add(Document.parse("{\n" +
            "                    SubjectID: \"141414\",\n" +
            "                    FirstName: \"Matt\",\n" +
            "                    LastName: \"Munns\",\n" +
            "                }"));
        testUsers.add(Document.parse("{\n" +
            "                    SubjectID: \"151515\",\n" +
            "                    FirstName: \"Charles\",\n" +
            "                    LastName: \"Menne\",\n" +
            "                }"));

        kylesId = new ObjectId();
        BasicDBObject kyle = new BasicDBObject("_id", kylesId);
        kyle = kyle.append("SubjectID", "161616")
            .append("FirstName", "Kyle")
            .append("LastName", "Debates");



        userDocuments.insertMany(testUsers);
        userDocuments.insertOne(Document.parse(kyle.toJson()));

        // It might be important to construct this _after_ the DB is set up
        // in case there are bits in the constructor that care about the state
        // of the database.
        userController = new UserController(db);
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


    private static String getSubjectID(BsonValue val) {
        BsonDocument doc = val.asDocument();
        return ((BsonString) doc.get("SubjectID")).getValue();
    }

    private static String get_id(BsonValue val) {
        BsonDocument doc = val.asDocument();
    return ((BsonString) doc.get("_id")).getValue();
    }


    @Test
    public void getAllUsers() {
        Map<String, String[]> emptyMap = new HashMap<>();
        String jsonResult = userController.getUsers(emptyMap);
        BsonArray docs = parseJsonArray(jsonResult);

        assertEquals("Should be 5 users", 5, docs.size());
        List<String> names = docs
            .stream()
            .map(UserControllerSpec::getSubjectID)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedNames = Arrays.asList("121212", "131313", "141414", "151515", "161616");
        assertEquals("SubjectIDs should match", expectedNames, names);
    }

    @Test
    public void getUserById() {
        String jsonResult = userController.getUser(kylesId.toHexString());
        System.out.println(jsonResult);
        Document kyle = Document.parse(jsonResult);

        assertEquals("SubjectID should match", "161616", kyle.getString("SubjectID"));
        String noJsonResult = userController.getUser(new ObjectId().toString());
        assertNull("No name should match",noJsonResult);

    }

    //@Test
    //public void addUserTest(){
    //    String newId = userController.addNewUser("171717","181818","Travis","Warling");

    //    assertNotNull("Adding new user should return true,", newId);
    //    Map<String, String[]> argMap = new HashMap<>();
    //    argMap.put("171717", new String[] { "171717" });
    //    String jsonResult = userController.getUsers(argMap);
    //    BsonArray docs = parseJsonArray(jsonResult);

    //    List<String> _id = docs
    //        .stream()
    //        .map(UserControllerSpec::get_id)
    //        .sorted()
    //        .collect(Collectors.toList());
    //    assertEquals("Should return the new user", "181818", _id.get(5));
    //}

}
