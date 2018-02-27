package secretApp.testApp;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public class ResultGenerator {
	private static String resultURL = "http://localhost:3000/api/results/";
	private static String dbName = "testResults";

	public static void main(String[] args) {
		ScheduledExecutorService scheduledExecutorService = Executors.newScheduledThreadPool(5);
		System.out.println("scheduling task to be executed every 5 seconds with an initial delay of 0 seconds");
		scheduledExecutorService.scheduleAtFixedRate(new ResultTask(resultURL, dbName), 0, 5, TimeUnit.SECONDS);
	}
}
