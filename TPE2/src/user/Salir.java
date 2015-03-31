package user;

import java.io.IOException;

import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.BasicResponseHandler;

import android.app.Activity;
import android.net.http.AndroidHttpClient;
import android.os.AsyncTask;

public class Salir {
	private UserManager data;

	public void cerrar(Activity act) {
		data = new UserManager(act.getApplicationContext());
		String url = "http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=SignOut&username="
				+ data.getUser()
				+ "&authentication_token="
				+ data.getAuthenticationToken();
		new S().execute(url);
	}

	private class S extends AsyncTask<String, Void, String> {

		AndroidHttpClient client = AndroidHttpClient.newInstance("");

		@Override
		protected String doInBackground(String... params) {

			HttpGet request = new HttpGet(params[0]);
			ResponseHandler<String> responseHandler = new BasicResponseHandler();

			try {
				return client.execute(request, responseHandler);
			} catch (ClientProtocolException exception) {
				exception.printStackTrace();
			} catch (IOException exception) {
				exception.printStackTrace();
			}

			return null;
		}

		@Override
		protected void onPostExecute(String result) {
			data.setData(null, null, null, null, null, null, null);
		}

	}
}
