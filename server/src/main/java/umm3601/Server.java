package umm3601;



import com.mongodb.MongoClient;
import com.mongodb.client.MongoDatabase;
import spark.Request;
import spark.Response;


import java.io.IOException;


import static spark.Spark.*;
import static spark.debug.DebugScreen.enableDebugScreen;


import umm3601.database.GoalController;
import umm3601.database.GoalRequestHandler;
import umm3601.database.JournalController;
import umm3601.database.JournalRequestHandler;
import umm3601.database.EmotionController;
import umm3601.database.EmotionRequestHandler;
import umm3601.database.ResourceController;
import umm3601.database.ResourceRequestHandler;
import umm3601.database.SummaryController;
import umm3601.database.SummaryRequestHandler;


import com.google.api.client.googleapis.auth.oauth2.*;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;

import org.json.*;

public class Server {
    private static final String databaseName = "dev";

    private static final int serverPort = 4567;

    public static void main(String[] args) throws IOException {

        MongoClient mongoClient = new MongoClient();
        MongoDatabase database = mongoClient.getDatabase(databaseName);

        GoalController goalController = new GoalController(database);
        GoalRequestHandler goalRequestHandler = new GoalRequestHandler(goalController);

        EmotionController emotionController = new EmotionController(database);
        EmotionRequestHandler emotionRequestHandler = new EmotionRequestHandler(emotionController);

        SummaryController summaryController = new SummaryController(database);
        SummaryRequestHandler summaryRequestHandler = new SummaryRequestHandler(summaryController);

        ResourceController resourceController = new ResourceController(database);
        ResourceRequestHandler resourceRequestHandler = new ResourceRequestHandler(resourceController);

        JournalController journalController = new JournalController(database);
        JournalRequestHandler journalRequestHandler = new JournalRequestHandler(journalController);


        //Configure Spark
        port(serverPort);
        enableDebugScreen();


        // Specify where assets like images will be "stored"
        staticFiles.location("/public");

        options("/*", (request, response) -> {

            String accessControlRequestHeaders = request.headers("Access-Control-Request-Headers");
            if (accessControlRequestHeaders != null) {
                response.header("Access-Control-Allow-Headers", accessControlRequestHeaders);
            }

            String accessControlRequestMethod = request.headers("Access-Control-Request-Method");
            if (accessControlRequestMethod != null) {
                response.header("Access-Control-Allow-Methods", accessControlRequestMethod);
            }

            return "OK";
        });

        before((request, response) -> response.header("Access-Control-Allow-Origin", "*"));


        // Simple example route
        get("/hello", (req, res) -> "Hello World");

        // Redirects for the "home" page
        redirect.get("", "/");

        redirect.get("/", "http://localhost:9000");

        /////////////// Endpoints ///////////////////
        /////////////////////////////////////////////

        //List goals, filtered using query parameters
        get("api/emotions", emotionRequestHandler::getEmotions);
        get("api/emotions/:id", emotionRequestHandler::getEmotionJSON);
        post("api/emotions/new", emotionRequestHandler::addNewEmotion);

        get("api/goals", goalRequestHandler::getGoals);
        get("api/goals/:id", goalRequestHandler::getGoalJSON);
        post("api/goals/new", goalRequestHandler::addNewGoal);
        post("api/goals/edit", goalRequestHandler::completeGoal);
        delete("api/goals/delete/:id", goalRequestHandler::deleteGoal);

        //List summary page
        get("api/summaries", summaryRequestHandler::getSummaries);

        //Resources for appropriate response
        get("api/resources", resourceRequestHandler::getResources);


        //List journals, filtered using query parameters

        get("api/journals", journalRequestHandler::getJournals);
        get("api/journals/:id", journalRequestHandler::getJournalJSON);
        post("api/journals/new", journalRequestHandler::addNewJournal);
        post("api/journals/edit", journalRequestHandler::editJournal);




        post("api/login", (req, res) -> {
            System.out.println("first");


            // Tryed seeing if converting json of req to string would work
            JSONObject obj = new JSONObject(req.body());
            String authCode = obj.getString("code");


            // We can create this later to keep our secret safe
            String CLIENT_SECRET_FILE = "";

            /*GoogleClientSecrets clientSecrets =
                GoogleClientSecrets.load(
                    JacksonFactory.getDefaultInstance(), new FileReader(CLIENT_SECRET_FILE));*/
            System.out.println("second");

            // After this point error occurs


            try {
                GoogleTokenResponse tokenResponse =
                    new GoogleAuthorizationCodeTokenRequest(
                        new NetHttpTransport(),
                        JacksonFactory.getDefaultInstance(),
                        "https://www.googleapis.com/oauth2/v4/token",
                        "1080043572259-h3vk6jgc4skl3uav3g0l13qvlcqpebvu.apps.googleusercontent.com",

                        // Replace clientSecret with the localhost one if testing
                        "Use3FzYENcjF7zvx5CA3HfjD",
                        authCode,
                        "http://localhost:9000/")
                        //Not sure if we have a redirectUri

                        // Specify the same redirect URI that you use with your web
                        // app. If you don't have a web version of your app, you can
                        // specify an empty string.
                        .execute();

                // Doesn't reach this area of code

                System.out.println("third");
                GoogleIdToken idToken = tokenResponse.parseIdToken();
                GoogleIdToken.Payload payload = idToken.getPayload();
                String userId = payload.getSubject();  // Use this value as a key to identify a user.
                String email = payload.getEmail();
                boolean emailVerified = Boolean.valueOf(payload.getEmailVerified());
                String name = (String) payload.get("name");
                String pictureUrl = (String) payload.get("picture");
                String locale = (String) payload.get("locale");
                String familyName = (String) payload.get("family_name");
                String givenName = (String) payload.get("given_name");
            } catch (Exception e) {
                System.out.println(e);
            }




            return "";
        });




        // An example of throwing an unhandled exception so you can see how the
        // Java Spark debugger displays errors like this.
        get("api/error", (req, res) -> {
            throw new RuntimeException("A demonstration error");
        });

        // Called after each request to insert the GZIP header into the response.
        // This causes the response to be compressed _if_ the client specified
        // in their request that they can accept compressed responses.
        // There's a similar "before" method that can be used to modify requests
        // before they they're processed by things like `get`.
        after("*", Server::addGzipHeader);

        // Handle "404" file not found requests:
        notFound((req, res) -> {
            res.type("text");
            res.status(404);
            return "Sorry, we couldn't find that!";
        });
    }

    // Enable GZIP for all responses
    private static void addGzipHeader(Request request, Response response) {
        response.header("Content-Encoding", "gzip");
    }
}
