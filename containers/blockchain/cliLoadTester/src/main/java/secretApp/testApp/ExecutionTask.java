package secretApp.testApp;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBObject;
import com.mongodb.MongoClient;

public class ExecutionTask extends Task {
	String data;
	String url;

	public ExecutionTask(String data, String url) {
		// TODO Auto-generated constructor stub
		this.data = data;
		this.url = url;
	}

	@Override
	public void run() {
		// System.out.println("Executing Execution Task At " +
		// System.nanoTime());
		String body;
		try {
			body = post(this.url, this.data);
			JsonObject jsonObj = new JsonParser().parse(body).getAsJsonObject();
			// System.out.println(jsonObj.get("resultId") + " " +
			// jsonObj.get("status"));
			if (jsonObj.get("status").toString().equals("\"success\"")) {
				MongoClient mongo = new MongoClient("localhost", 27017);
				DB database = mongo.getDB("testResults1");
				DBCollection collection = Task.getDBCollection(database, "results");
				List<DBObject> list = new ArrayList<>();
				BasicDBObject dataObject = new BasicDBObject();
				dataObject.append("resultId", jsonObj.get("resultId").getAsString());
				dataObject.append("query", this.data);
				list.add(dataObject);
				collection.insert(list);
				mongo.close();
			}
		} catch (IOException e) {
			e.printStackTrace();
		}

	}

}
