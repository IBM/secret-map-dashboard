package secretApp.testApp;

import java.io.BufferedReader;
import java.io.Closeable;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;

public abstract class Task implements Runnable {

	public String get(String getUrl) throws IOException {
		URL url = new URL(getUrl);
		HttpURLConnection con = (HttpURLConnection) url.openConnection();
		con.setRequestMethod("GET");

		return this.read(con.getInputStream());
	}

	public String post(String postUrl, String data) throws IOException {
		URL url = new URL(postUrl);
		HttpURLConnection con = (HttpURLConnection) url.openConnection();
		con.setRequestMethod("POST");

		con.setDoOutput(true);

		this.sendData(con, data);

		return this.read(con.getInputStream());
	}

	protected void sendData(HttpURLConnection con, String data) throws IOException {
		DataOutputStream wr = null;
		try {
			wr = new DataOutputStream(con.getOutputStream());
			wr.writeBytes(data);
			wr.flush();
			wr.close();
		} catch (IOException exception) {
			throw exception;
		} finally {
			this.closeQuietly(wr);
		}
	}

	protected String read(InputStream is) throws IOException {
		BufferedReader in = null;
		String inputLine;
		StringBuilder body;
		try {
			in = new BufferedReader(new InputStreamReader(is));

			body = new StringBuilder();

			while ((inputLine = in.readLine()) != null) {
				body.append(inputLine);
			}
			in.close();

			return body.toString();
		} catch (IOException ioe) {
			throw ioe;
		} finally {
			this.closeQuietly(in);
		}
	}

	protected void closeQuietly(Closeable closeable) {
		try {
			if (closeable != null) {
				closeable.close();
			}
		} catch (IOException ex) {

		}
	}

	public static DBCollection getDBCollection(DB database, String collectionName) {
		if (!database.collectionExists(collectionName)) {
			database.createCollection(collectionName, new BasicDBObject());
			System.out.println("Collection created successfully : " + collectionName);
		}
		return database.getCollection(collectionName);
	}
}
