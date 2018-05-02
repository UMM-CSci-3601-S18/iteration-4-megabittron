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
import umm3601.database.resource.LinksController;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

import static org.junit.Assert.*;

/**
 * JUnit tests for the LinkController.
 */
public class LinkControllerSpec {
    private LinksController linkController;
    private ObjectId anID;

    @Before
    public void clearAndPopulateDB() throws IOException {
        MongoClient mongoClient = new MongoClient();
        MongoDatabase db = mongoClient.getDatabase("test");
        MongoCollection<Document> linkDocuments = db.getCollection("links");
        linkDocuments.drop();
        List<Document> testLinks = new ArrayList<>();
        testLinks.add(Document.parse("{\n" +
            "                    _id: \"5ab88ab16148ec7b0f6b6fa4\",\n" +
            "                    userID: \"4cb56a89541a2d783595012c\",\n " +
            "                    name: \"Chuck Menne\",\n" +
            "                    subname: \"chuck@umn.edu\",\n" +
            "                    url: \"https://www.youtube.com/watch?v=IcDI1iWmIp8\",\n" +
            "                }"));
        testLinks.add(Document.parse("{\n" +
            "                    _id: \"5ab88ab17205545c679992e4\",\n" +
            "                    userID: \"4cb56a89541a2d783595012c\",\n " +
            "                    name: \"John Hoff\",\n" +
            "                    subname: \"john@umn.edu\",\n" +
            "                    url: \"https://www.youtube.com/watch?v=JrYNSCEHLlI\",\n" +
            "                }"));
        testLinks.add(Document.parse("{\n" +
            "                    _id: \"5ab88ab1543afe51da42359e\",\n" +
            "                    userID: \"4cb56a89541a2d783595012c\",\n " +
            "                    name: \"Dustin Blake\",\n" +
            "                    subname: \"dustin@umn.edu\",\n" +
            "                    url: \"https://www.youtube.com/watch?v=WuuhqpRmb_o\",\n" +
            "                }"));
        testLinks.add(Document.parse("{\n" +
            "                    _id: \"5ab88ab1a5b4ebf66df44c40\",\n" +
            "                    userID: \"4cb56a89541a2d783595012c\",\n " +
            "                    name: \"Abe Monjor\",\n" +
            "                    subname: \"abe@umn.edu\",\n" +
            "                    url: \"https://www.youtube.com/watch?v=WlRlgTT5Q-M\",\n" +
            "                }"));

        anID = new ObjectId();
        BasicDBObject sam = new BasicDBObject("_id", anID);
        sam = sam.append("userID", "2cb45a89541a2d783595012b")
            .append("name", "Sam Score")
            .append("subname", "sam@umn.edu")
            .append("url", "https://www.youtube.com/watch?v=_x36zxUSwdc");


        linkDocuments.insertMany(testLinks);
        linkDocuments.insertOne(Document.parse(sam.toJson()));

        // It might be important to construct this _after_ the DB is set up
        // in case there are bits in the constructor that care about the state
        // of the database.
        linkController = new LinksController(db);
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

    private static String getSubname(BsonValue val) {
        BsonDocument doc = val.asDocument();
        return ((BsonString) doc.get("subname")).getValue();
    }

    @Test
    public void getLinksOfOneUser() {
        Map<String, String[]> argMap = new HashMap<>();
        argMap.put("userID", new String[]{"4cb56a89541a2d783595012c"});
        String jsonResult = linkController.getLinks(argMap);
        BsonArray docs = parseJsonArray(jsonResult);

        assertEquals("Should be 5 links", 5, docs.size());
        List<String> names = docs
            .stream()
            .map(LinkControllerSpec::getName)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedNames = Arrays.asList("Abe Monjor", "Chuck Menne", "Dustin Blake", "John Hoff", "Sam Score");
        assertEquals("Names should match", expectedNames, names);
    }

    @Test
    public void getLinkById() {
        String jsonResult = linkController.getLink(anID.toHexString());
        Document sam = Document.parse(jsonResult);
        assertEquals("Name should match", anID, sam.get("_id"));
        String noJsonResult = linkController.getLink(new ObjectId().toString());
        assertNull("No Link should match", noJsonResult);

    }

    @Test
    public void addLinkTest() {
        String newId = linkController.addNewLinks("4cb56a89541a2d783595012c","defaultUserID", "Aaron Bass", "aaron@umn.edu", "https://www.youtube.com/watch?v=IcDI1iWmIp8");
        assertNotNull("Add new links should return true,", newId);
        Map<String, String[]> argMap = new HashMap<>();
        argMap.put("userID", new String[]{"4cb56a89541a2d783595012c"});
        argMap.put("link", new String[]{"defaultUserID"});
        String jsonResult = linkController.getLinks(argMap);
        BsonArray docs = parseJsonArray(jsonResult);

        List<String> links = docs
            .stream()
            .map(LinkControllerSpec::getSubname)
            .sorted()
            .collect(Collectors.toList());
        System.out.println(links);
        assertEquals("Should return name of new link", "aaron@umn.edu", links.get(0));
    }

    @Test
    public void deleteLinkTest(){
        System.out.println("ID: " + anID.toHexString());
        linkController.deleteLink(anID.toHexString());
    }

}

