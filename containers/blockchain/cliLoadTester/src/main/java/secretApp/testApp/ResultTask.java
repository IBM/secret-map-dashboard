package secretApp.testApp;

import java.util.ArrayList;
import java.util.List;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.MongoClient;

public class ResultTask extends Task {
	String url;

	public ResultTask(String url) {
		// TODO Auto-generated constructor stub
		this.url = url;
	}

	@Override
	public void run() {
		// System.out.println("Executing Result Task At " + System.nanoTime());
		MongoClient mongo;
		try {
			mongo = new MongoClient("localhost", 27017);
			DB database = mongo.getDB("testResults");
			DBCollection collection = Task.getDBCollection(database, "results");
			DBCursor cursor = collection.find();
			List<DBObject> removelist = new ArrayList<>();
			while (cursor.hasNext()) {
				DBObject object = cursor.next();
				// System.out.println(object);
				String resultId = object.get("resultId").toString();
				// System.out.println(this.url + resultId);
				String resultsData = this.get(this.url + resultId);
				JsonObject jsonObj = new JsonParser().parse(resultsData).getAsJsonObject();
				if (jsonObj.get("status").getAsString().equals("done")) {
					String resultString = jsonObj.get("result").toString();
					resultString = resultString.substring(1, resultString.length() - 1);
					resultString = resultString.replaceAll("\\\\\"", "\"");
					resultString = resultString.replaceAll("\\\\\"", "\"");
					// System.out.println(resultString);
					JSONObject jsonObject = (JSONObject) new JSONParser().parse(resultString);
					String queryResultStatus = jsonObject.get("message").toString();
					DBCollection resultCollection;
					List<DBObject> list = new ArrayList<>();
					String query = object.get("query").toString();
					if (query.contains("enroll")) {
						BasicDBObject dataObject = new BasicDBObject();
						String db = "users";
						dataObject.append("queue", query.contains("user_queue") ? "user_queue" : "seller_queue");
						if (queryResultStatus.contains("success")) {
							resultCollection = Task.getDBCollection(database, db);
							JSONObject userObj = (JSONObject) jsonObject.get("result");
							if (userObj != null) {
								dataObject.append("user", userObj.get("user"));
							}
						} else {
							resultCollection = Task.getDBCollection(database, "failed" + db);
							dataObject.append("error", jsonObject.get("error"));
						}
						list.add(dataObject);
						resultCollection.insert(list);
						list.clear();
					} else {
						String db = "_query";
						if (query.contains("invoke")) {
							db = "_invoke";
						}
						BasicDBObject dataObject = new BasicDBObject();
						dataObject.append("query", query);
						if (queryResultStatus.contains("success")) {
							resultCollection = Task.getDBCollection(database, "success" + db);
							dataObject.append("results", jsonObject.get("result"));
						} else {
							resultCollection = Task.getDBCollection(database, "failed" + db);
							dataObject.append("error", jsonObject.get("error"));
						}
						list.add(dataObject);
						resultCollection.insert(list);
					}

					// collection.remove(object);
					removelist.add(object);
				}

			}
			if (removelist.size() > 0) {
				for (DBObject dbObject : removelist) {
					collection.remove(dbObject);
				}
			}
			mongo.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}
