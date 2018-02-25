package secretApp.testApp;

import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.InputMismatchException;
import java.util.List;
import java.util.Scanner;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.MongoClient;

public class ExecutionApp {
	private static String executionURL = "http://localhost:3000/api/execute";
	private static String dbName = "testResults";
	private static int count = 0;

	public static void main(String[] args) {
		try {

			ExecutorService executorService = Executors.newFixedThreadPool(10);
			Scanner scan = new Scanner(System.in);
			int number = 0;
			do {
				System.out.println("Select user option ");
				System.out.println("1. Enroll Users");
				System.out.println("2. Perform Invoke Operation");
				System.out.println("3. Perform Query Operation");
				System.out.println("Enter 0 to exit");
				try {
					number = scan.nextInt();
					switch (number) {
					case 1:
						enrollUsers(scan, executorService);
						System.out.println("Total number of request : " + count);
						break;
					case 2:
						performInvokeOpertion(scan, executorService);
						System.out.println("Total number of request : " + count);
						break;
					case 3:
						performQueryOpertion(scan, executorService);
						System.out.println("Total number of request : " + count);
						break;
					default:
						break;
					}
				} catch (InputMismatchException e) {
					System.out.println("Input has to be a number. ");
				}
			} while (number != 0);
			scan.close();
			// while (!executorService.isTerminated()) {
			// }
			System.out.println("Finished all threads");
		} catch (Exception ioe) {
			ioe.printStackTrace();
		}
	}

	private static List<DBObject> getUserObjects() {
		List<DBObject> users = new ArrayList<>();
		MongoClient mongo;
		try {
			mongo = new MongoClient("localhost", 27017);
			DB database = mongo.getDB(dbName);
			DBCollection collection = Task.getDBCollection(database, "users");
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

	private static void performQueryOpertion(Scanner scan, ExecutorService executorService) {
		List<DBObject> users = getUserObjects();
		for (DBObject dbObject : users) {
			count++;
			String userId = dbObject.get("user").toString();
			String query = "type=query&queue=user_queue&params={\"userId\":\"" + userId
					+ "\" , \"fcn\":\"getState\" ,\"args\":[\"" + userId + "\"]}";
			//System.out.println(query);
			executorService.execute(new ExecutionTask(query, executionURL, dbName));
		}
	}

	private static void performInvokeOpertion(Scanner scan, ExecutorService executorService) {
		System.out.println("Enter users step count");
		String steps = scan.next();
		List<DBObject> users = getUserObjects();
		for (DBObject dbObject : users) {
			count++;
			String userId = dbObject.get("user").toString();
			String query = "type=invoke&queue=user_queue&params={ \"userId\":\"" + userId
					+ "\",\"fcn\":\"generateFitcoins\",\"args\":[\"" + userId + "\",\"" + steps + "\"]}";
			//System.out.println(query);
			executorService.execute(new ExecutionTask(query, executionURL, dbName));
		}
	}

	private static void enrollUsers(Scanner scan, ExecutorService executorService) {
		System.out.println("Enter number of users");
		int number = scan.nextInt();
		for (int i = 0; i < number; i++) {
			count++;
			executorService.execute(new ExecutionTask("type=enroll&queue=user_queue&params={}", executionURL, dbName));
		}
	}
}
