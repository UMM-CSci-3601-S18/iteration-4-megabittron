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
import umm3601.database.resource.LinksController;

import static org.junit.Assert.*;


import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

import static org.junit.Assert.assertEquals;

public class LinkControllerSpec {
    private LinksController linksController;
    private ObjectId floraId;

    @Before
    public void clearAndPopulateDB() throws IOException {
        MongoClient mongoClient = new MongoClient();
        MongoDatabase db = mongoClient.getDatabase("test");
        MongoCollection<Document> linkDocuments = db.getCollection("links");
        linkDocuments.drop();
        List<Document> testLink = new ArrayList<>();
        testLink.add(Document.parse("{\n" +
            "                    name: \"Rubber Video\",\n" +
            "                    subname: \"Just Rubber\",\n" +
            "                    url: \"rubber.com\",\n" +
            "                }"));
        testLink.add(Document.parse("{\n" +
            "                    name: \"Time Video\",\n" +
            "                    subname: \"Just Time\",\n" +
            "                    url: \"time.com\",\n" +
            "                }"));
        testLink.add(Document.parse("{\n" +
            "                    name: \"Wood Video\",\n" +
            "                    subname: \"Just Wood\",\n" +
            "                    url: \"wood.com\",\n" +
            "                }"));

        floraId = new ObjectId();
        BasicDBObject flora = new BasicDBObject("_id", floraId);
        flora = flora.append("name", "Flower Video")
            .append("subname", "Just Flowers")
            .append("url", "flower.com");


        linkDocuments.insertMany(testLink);
        linkDocuments.insertOne(Document.parse(flora.toJson()));

        // It might be important to construct this _after_ the DB is set up
        // in case there are bits in the constructor that care about the state
        // of the database.
        linksController = new LinksController(db);
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
    public void getAllLinks() {
        Map<String, String[]> emptyMap = new HashMap<>();
        String jsonResult = linksController.getLinks(emptyMap);
        BsonArray docs = parseJsonArray(jsonResult);

        assertEquals("Should be 4 links", 4, docs.size());
        List<String> names = docs
            .stream()
            .map(LinkControllerSpec::getName)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedNames = Arrays.asList("Flower Video", "Rubber Video", "Time Video", "Wood Video");
        assertEquals("Names should match", expectedNames, names);
    }

    @Test
    public void getLinkById() {
        String jsonResult = linksController.getLink(floraId.toHexString());
        System.out.println(jsonResult);
        Document flora = Document.parse(jsonResult);

        assertEquals("Name should match", "Flower Video", flora.getString("name"));
        String noJsonResult = linksController.getLink(new ObjectId().toString());
        assertNull("No name should match", noJsonResult);

    }

}
