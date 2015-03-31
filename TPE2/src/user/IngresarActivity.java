package user;

import java.io.IOException;

import klosh.SuperActivity;

import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.BasicResponseHandler;
import org.json.JSONException;
import org.json.JSONObject;

import android.net.http.AndroidHttpClient;
import android.os.AsyncTask;
import android.os.Bundle;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import com.example.klosh.R;

public class IngresarActivity extends SuperActivity {

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		setContentView(R.layout.activity_ingresar);
		super.onCreate(savedInstanceState);
	}

	public void logIn(View view) {
		TextView user = (TextView) findViewById(R.id.usuarioText);
		TextView password = (TextView) findViewById(R.id.contrasenaText);
		if (user.getText().length() < 6 || user.getText().length() > 15
				|| password.getText().length() < 8
				|| password.getText().length() > 15) {
			Toast.makeText(IngresarActivity.this, R.string.invalido,
					Toast.LENGTH_LONG).show();
		} else {
			String url = "http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=SignIn&username="
					+ user.getText() + "&password=" + password.getText();
			new Ingresar().execute(url);
		}
	}

	private class Ingresar extends AsyncTask<String, Void, String> {

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
			JSONObject res = null, err;
			if (client != null)
				client.close();
			try {
				res = new JSONObject(result);
			} catch (JSONException e) {
				e.printStackTrace();
			}
			err = res.optJSONObject("error");
			if (err != null) {
				int code = 0;
				try {
					code = err.getInt("code");
				} catch (JSONException e) {
					e.printStackTrace();
				}
				switch (code) {
				case 100:
				case 101:
				case 104: {
					Toast.makeText(IngresarActivity.this, R.string.usuarioinvalido, Toast.LENGTH_LONG).show();
					break;
				}
				case 105: {
					Toast.makeText(IngresarActivity.this, R.string.contrasenainvalida, Toast.LENGTH_LONG).show();
					break;
				}
				default:
					break;
				}

			} else {
				String authentication = null;
				String user = null;
				String firstname = null;
				String lastname = null;
				String email = null;
				String createddate = null;
				String lastdate = null;
				JSONObject account = null;
				try {
					authentication = res.getString("authenticationToken");
					account = res.optJSONObject("account");
					user = account.getString("username");
					firstname = account.getString("firstName");
					lastname = account.getString("lastName");
					email = account.getString("email");
					createddate = account.getString("createdDate");
					lastdate = account.getString("lastLoginDate");
				} catch (JSONException e) {
					e.printStackTrace();
				}
				UserManager data = new UserManager(getApplicationContext());
				data.setData(authentication, user, firstname, lastname, email, createddate, lastdate);
				IngresarActivity.this.finish();
			}

		}
	}
}
