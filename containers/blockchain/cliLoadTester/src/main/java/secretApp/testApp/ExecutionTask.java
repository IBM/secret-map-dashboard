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
	String dbName;

	public ExecutionTask(String data, String url, String dbName) {
		this.data = data;
		this.url = url;
		this.dbName = dbName;
	}

	@Override
	public void run() {
		String body;
		try {
			body = post(this.url, this.data);
			JsonObject jsonObj = new JsonParser().parse(body).getAsJsonObject();
			if (jsonObj.get("status").toString().equals("\"success\"")) {
				MongoClient mongo = new MongoClient("localhost", 27017);
				DB database = mongo.getDB(this.dbName);
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
