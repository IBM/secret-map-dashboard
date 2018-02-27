package secretApp.testApp;

import java.net.UnknownHostException;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.MongoClient;

/**
 *
 *
 */
public class ExecutionApp {
	private static String executionURL = "http://localhost:3000/api/execute";
	private static String dbName = "testResults";
	private static int count = 0;
	private static int steps = 100;
	private static int fixOperations = 100;
	private static int totalUsers = 10000;
	private static int queuedOperations = 5000;

	public static void main(String[] args) {
		try {
			ExecutorService executorService = Executors.newFixedThreadPool(10);
			// int pause = 0;
			while (true) {
				Set<DBObject> dbobj = getUserObjects("results");
				if (dbobj.size() > queuedOperations) {
					System.out.println("Wait for 5 min to finsh execution of queued request");
					Thread.currentThread().sleep(300000);
				} else {
					dbobj = getUserObjects("users");
					if (dbobj.size() < totalUsers) {
						System.out.println("Enrolling users");
						enrollUsers(fixOperations, executorService);
					}
					Thread.currentThread().sleep(30000);
					steps += 10;
					performQueryOpertion(executorService, fixOperations);
					performInvokeOpertion(executorService, fixOperations, String.valueOf(steps));
					performQueryOpertion(executorService, fixOperations);
					Thread.currentThread().sleep(30000);
					System.out.println("Total Operations queue : " + count);
				}

			}

		} catch (Exception ioe) {
			ioe.printStackTrace();
		}
	}

	//
	private static Set<DBObject> getUserObjects(String collectionName) {
		Set<DBObject> users = new HashSet<>();
		MongoClient mongo;
		try {
			mongo = new MongoClient("localhost", 27017);
			DB database = mongo.getDB(dbName);
			DBCollection collection = Task.getDBCollection(database, collectionName);
			DBCursor cursor = collection.find();
			while (cursor.hasNext()) {
				users.add(cursor.next());
			}
			mongo.close();
		} catch (UnknownHostException e) {
			e.printStackTrace();
		}
		return users;
	}

	private static void performQueryOpertion(ExecutorService executorService, int number) {
		Set<DBObject> users = getUserObjects("users");
		int temp = 0;
		for (DBObject dbObject : users) {
			count++;

			String userId = dbObject.get("user").toString();
			String query = "type=query&queue=user_queue&params={\"userId\":\"" + userId
					+ "\" , \"fcn\":\"getState\" ,\"args\":[\"" + userId + "\"]}";
			// System.out.println(query);
			executorService.execute(new ExecutionTask(query, executionURL, dbName));
			if (temp >= number) {
				break;
			}
		}
	}

	private static void performInvokeOpertion(ExecutorService executorService, int number, String steps) {
		Set<DBObject> users = getUserObjects("users");
		int temp = 0;
		for (DBObject dbObject : users) {
			count++;
			String userId = dbObject.get("user").toString();
			String query = "type=invoke&queue=user_queue&params={ \"userId\":\"" + userId
					+ "\",\"fcn\":\"generateFitcoins\",\"args\":[\"" + userId + "\",\"" + steps + "\"]}";
			executorService.execute(new ExecutionTask(query, executionURL, dbName));
			if (temp >= number) {
				break;
			}
		}
	}

	private static void enrollUsers(int number, ExecutorService executorService) {
		for (int i = 0; i < number; i++) {
			count++;
			executorService.execute(new ExecutionTask("type=enroll&queue=user_queue&params={}", executionURL, dbName));
		}
	}
}
