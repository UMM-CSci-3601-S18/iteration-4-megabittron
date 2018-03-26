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

public class JournalControllerBasicSpec {
    private JournalController journalController;
    private ObjectId journalsID;

    @Before
    public void clearAndPopulateDB() throws IOException {
        MongoClient mongoClient = new MongoClient();
        MongoDatabase db = mongoClient.getDatabase("test");
        MongoCollection<Document> journalDocuments = db.getCollection("journals");

        journalDocuments.drop();

        List<Document> testJournals = new ArrayList<>();
        testJournals.add(Document.parse("{\n" +
            "                    title: \"The art of recovery: outcomes from participatory arts activities for people using mental health services\",\n" +
            "                    body: \"Abstract\n" +
            "Background: There is a growing evidence base for the use of participatory arts for the purposes of health promotion. In recent years, recovery approaches in mental healthcare have become commonplace in English speaking countries amongst others. There are few studies that bring together these two fields of practice.\n" +
            "\n" +
            "Aims: The two aims of this study were (a) to investigate the validity of the CHIME framework for characterising the experience of Participatory Arts and (b) to use the CHIME framework to investigate the relationship between participatory arts and mental health recovery.\n" +
            "\n\",\n" +
            "                    link: \"https://www.tandfonline.com/doi/full/10.1080/09638237.2018.1437609\",\n" +
            "                }"));
        testJournals.add(Document.parse("{\n" +
            "                   title: \"The Associations of Area-Level Violent Crime Rates and Self-Reported Violent Crime Exposure with Adolescent Behavioral Health\",\n" +
            "                    body: \"The effects of witnessing and experiencing crime have seldom been disaggregated. Little research has assessed the effect of multiple exposures to crime. We assess independent contributions of self-reported crime and area-level crime to adolescent behavioral health outcomes. Cross sectional data on 5519 adolescents from the Comprehensive Community Mental Health Services for Children and their Families Program was linked to FBI crime rate data to assess associations of mutually exclusive categories of self-reported crime exposure and area-level crime rates with mental health and substance abuse. Self-reported crime exposure was significantly associated with poorer behavioral health. Violent victimization had the largest association with all outcomes except internalizing scores. All self-reported crime variables were significantly associated with three of the outcomes. Area-level crime rates were associated with one mental health outcome. Providers should assess direct and indirect crime exposure rather than only focusing on violent victimization.\n" +
            "\n!\",\n" +
            "                    link: \"https://link.springer.com/article/10.1007/s10597-017-0159-y\",\n" +
            "                }"));
        testJournals.add(Document.parse("{\n" +
            "                    title: \"Effect of Khat Use During Pregnancy on the Birth Weight of Newborn in Jimma\",\n" +
            "                    body: \"Today, drug misuse and abuse is becoming a major problem worldwide. Birth weight of a newborn remains an important predictor of infant and child morbidity and mortality. In 2006, approximately one in four newborns in Jimma Zone, Ethiopia, had low birth weight. About 19% of pregnant women attending antenatal care in heath institutions of Jimma Zone were using khat during pregnancy. However, there is a lack of research on predictors of low birth weight especially the potential effect of khat use during pregnancy. To examine the effect of khat use during pregnancy on birth weight of newborn in Jimma town, Ethiopia. \",\n" +
            "                    link: \"https://link.springer.com/article/10.1007/s11469-018-9888-6\",\n" +
            "                }"));

        journalsID = new ObjectId();
        BasicDBObject journal = new BasicDBObject("_id", journalsID);
        journal = journal.append("title", "Item Response Theory Analysis of the Recoded Internet Gaming Disorder Scale-Short-Form (IGDS9-SF)")
            .append("body", "Based on the nine criteria for Internet gaming disorder (IGD) in DSM-5, the Internet Gaming Disorder Scale 9-Short Form (IGDS9-SF; Pontes and Griffiths 2015) is the most widely used questionnaire for assessing IGD. The present study examined support for the unidimensional factor structure of the instrument, with a group of 868 adolescent and adult gamers from the USA, with criteria recoded as present or absent.")
            .append("link", "https://link.springer.com/article/10.1007/s11469-018-9890-z");

        journalDocuments.insertMany(testJournals);
        journalDocuments.insertOne(Document.parse(journal.toJson()));

        journalController = new JournalController(db);
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

    private static String getlink(BsonValue val) {
        BsonDocument doc = val.asDocument();
        return ((BsonString) doc.get("link")).getValue();
    }

    private static String getTitle(BsonValue val) {
        BsonDocument doc = val.asDocument();
        return ((BsonString) doc.get("title")).getValue();
    }

    @Test
    public void getAllJournals() {
        Map<String, String[]> emptyMap = new HashMap<>();
        String jsonResult = journalController.getItems(emptyMap);
        BsonArray docs = parseJsonArray(jsonResult);

        assertEquals("Should be 4 journals", 4, docs.size());
        List<String> journals = docs
            .stream()
            .map(JournalControllerBasicSpec::getlink)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedLinks = Arrays.asList("https://www.tandfonline.com/doi/full/10.1080/09638237.2018.1437609", "https://link.springer.com/article/10.1007/s10597-017-0159-y", "https://link.springer.com/article/10.1007/s11469-018-9890-z", "https://link.springer.com/article/10.1007/s11469-018-9890-z");
        assertEquals("Journals should match", expectedLinks, journals);
    }

    /* @Test
     public void getJournalByCategory(){
         Map<String, String[]> argMap = new HashMap<>();
         // Mongo in JournalController is doing a regex search so can just take a Java Reg. Expression
         // This will search the category for letters 'f' and 'c'.
         argMap.put("category", new String[] { "[f, c]" });
         String jsonResult = journalController.getItems(argMap);
         BsonArray docs = parseJsonArray(jsonResult);
         assertEquals("Should be 3 journals", 3, docs.size());
         List<String> name = docs
             .stream()
             .map(JournalControllerBasicSpec::getName)
             .sorted()
             .collect(Collectors.toList());
         List<String> expectedName = Arrays.asList("Aurora","John","Kai");
         assertEquals("Names should match", expectedName, name);
     }

     @Test
     public void getJournalsByID() {
         String jsonResult = journalController.getItem(journalsID.toHexString());
         Document journalDoc = Document.parse(jsonResult);
         assertEquals("Name should match", "Hunter", journalDoc.get("name"));
         String noJsonResult = journalController.getJournal(new ObjectId().toString());
         assertNull("No name should match",noJsonResult);
     }
 */
    @Test
    public void addJournalTest() {
        String newId = journalController.addNewItem("Health", "Health: is an interdisciplinary journal that engages with and interrogates health and healthcare from the perspectives of the social sciences and the humanities. Focusing on critique of norms and power relationships, the journal provides an international forum for articles reporting on original research, theoretical pieces and review essays from around the world. It offers the breadth of outlook required by sociologists, social psychologists, social and cultural theorists and others who are addressing healthcare issues that cross disciplinary boundaries.",
            "https://us.sagepub.com/en-us/nam/journal/health#description","","");

        assertNotNull("Add new journal should return true when journal is added,", newId);
        Map<String, String[]> argMap = new HashMap<>();
        String jsonResult = journalController.getItems(argMap);
        BsonArray docs = parseJsonArray(jsonResult);

        List<String> title = docs
            .stream()
            .map(JournalControllerBasicSpec::getlink)
            .sorted()
            .collect(Collectors.toList());
        // name.get(0) says to get the name of the first person in the database,
        // so "Aaron" will probably always be first because it is sorted alphabetically.
        // 3/4/18: Not necessarily: it is likely that that is how they're stored but we don't know. Find a different way of doing this.
        assertEquals("Should return the title of new journal", "Health", title.get(0));
    }

}

