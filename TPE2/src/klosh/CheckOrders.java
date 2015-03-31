
package klosh;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Timer;
import java.util.TimerTask;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import user.InformacionActivity;
import user.UserManager;
import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.AsyncTask;
import android.os.IBinder;

import com.example.klosh.R;

public class CheckOrders extends Service {

	private Timer timer;
	private final String SHARED_PREFS_FILE = "HMPrefs";

	@Override
	public IBinder onBind(Intent intent) {
		return null;
	}

	@Override
	public void onCreate() {
		super.onCreate();
		timer = new Timer();
	}

	@Override
	public void onStart(final Intent intent, final int startId) {
		super.onStart(intent, startId);
		timer.scheduleAtFixedRate(new TimerTask() {
			@Override
			public void run() {
				UserManager data = new UserManager(getApplicationContext());
				if (data.getAuthenticationToken() != null) {
					CheckOrders.this.checkNotification();
				}
			}
		}, 0, 30000);
	}

	public void checkNotification() {
		UserManager data = new UserManager(getApplicationContext());
		String aux = "http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=GetAllOrders&username="
				+ data.getUser()
				+ "&authentication_token="
				+ data.getAuthenticationToken();
		new GetOrders().execute(aux);
	}

	private class GetOrders extends AsyncTask<String, Void, JSONObject> {

		public JSONObject InputStreamToJSONObject(InputStream is) {
			BufferedReader streamReader = new BufferedReader(
					new InputStreamReader(is));
			StringBuilder responseStrBuilder = new StringBuilder();

			String inputStr;
			try {
				while ((inputStr = streamReader.readLine()) != null)
					responseStrBuilder.append(inputStr);
			} catch (IOException e1) {
				e1.printStackTrace();
			}

			JSONObject jsonObject = null;
			try {
				jsonObject = new JSONObject(responseStrBuilder.toString());
			} catch (JSONException e) {
				e.printStackTrace();
			}
			return jsonObject;
		}

		@Override
		protected void onPreExecute() {
			super.onPreExecute();
		}

		@Override
		protected JSONObject doInBackground(String... params) {
			URL aux = null;
			try {
				aux = new URL(params[0]);
			} catch (MalformedURLException e1) {
				e1.printStackTrace();
			}
			try {
				return InputStreamToJSONObject(aux.openStream());
			} catch (Exception e) {
				e.printStackTrace();
				return null;
			}
		}

		@Override
		protected void onProgressUpdate(Void... values) {
			// TODO Auto-generated method stub
			super.onProgressUpdate(values);
		}

		@Override
		protected void onPostExecute(JSONObject result) {
			JSONObject fatal = result.optJSONObject("error");
			if (fatal != null) {
			} else {
				JSONArray orders = null;
				JSONObject order = null;
				int i;
				String orderId;
				String status;
				String latitude;
				String longitude;
				try {
					orders = result.getJSONArray("orders");
				} catch (JSONException e) {
					e.printStackTrace();
				}
				for (i = 0; i < orders.length(); i++) {
					try {

						order = orders.getJSONObject(i);
						orderId = order.getString("id");

						String oldStat = getApplicationContext()
								.getSharedPreferences(SHARED_PREFS_FILE, 0)
								.getString(orderId + "s", null);
						String oldLat = getApplicationContext()
								.getSharedPreferences(SHARED_PREFS_FILE, 0)
								.getString(orderId + "la", null);
						String oldLong = getApplicationContext()
								.getSharedPreferences(SHARED_PREFS_FILE, 0)
								.getString(orderId + "lo", null);

						status = order.getString("status");
						latitude = order.getString("latitude");
						longitude = order.getString("longitude");

						SharedPreferences.Editor editor = getApplicationContext()
								.getSharedPreferences(SHARED_PREFS_FILE, 0)
								.edit();
						if (oldStat == null) {

							editor.putString((orderId + "s"), status);
							editor.commit();
						}
						if (oldLat == null) {

							editor.putString((orderId + "la"), latitude);
							editor.commit();
						}
						if (oldLong == null) {
							editor.putString((orderId + "lo"), longitude);
							editor.commit();
						}
						if (!getApplicationContext()
								.getSharedPreferences(SHARED_PREFS_FILE, 0)
								.getString(orderId + "s", null).equals(status)) {
							editor.putString((orderId + "s"), status);
							editor.commit();
							sendNotification(orderId, -1, orderId);
						}
						if (!getApplicationContext()
								.getSharedPreferences(SHARED_PREFS_FILE, 0)
								.getString(orderId + "la", null)
								.equals(latitude)
								|| !getApplicationContext()
										.getSharedPreferences(
												SHARED_PREFS_FILE, 0)
										.getString(orderId + "lo", null)
										.equals(longitude)) {
							editor.putString((orderId + "la"), latitude);
							editor.commit();
							editor.putString((orderId + "lo"), longitude);
							editor.commit();
							sendNotification(orderId, 1, orderId);
						}
					} catch (JSONException e) {
						e.printStackTrace();
					}
				}

			}
		}
	}

	public void sendNotification(String numero, int reason, String orderId) {
		String ns = Context.NOTIFICATION_SERVICE;
		long[] pattern = new long[4];
		pattern[0] = 500;
		pattern[1] = 500;
		pattern[2] = 500;
		pattern[3] = 500;
		NotificationManager mNotificationManager = (NotificationManager) getSystemService(ns);
		int icon = R.drawable.klosh;
		Intent notificationIntent = new Intent(this, InformacionActivity.class);
		notificationIntent.putExtra("notif", true);
		PendingIntent contentIntent = PendingIntent.getActivity(this, 0,
				notificationIntent, Intent.FLAG_ACTIVITY_NEW_TASK);
		Context context = getApplicationContext();
		Notification.Builder builder = new Notification.Builder(context);
		if (reason == -1) {
			builder.setContentTitle(this.getString(R.string.notification_title)
					+ orderId);
			builder.setContentText(this
					.getString(R.string.notification_chgstatus));
			builder.setSmallIcon(icon);
		} else {
			builder.setContentTitle(this.getString(R.string.notification_title)
					+ orderId);
			builder.setContentText(this.getString(R.string.notification_chgloc));
			builder.setSmallIcon(icon);
		}
		builder.setLights(80, 1000, 3000);
		builder.setAutoCancel(true);
		builder.setTicker(this.getString(R.string.notification_ticker));
		builder.setContentIntent(contentIntent);
		builder.setVibrate(pattern);
		mNotificationManager.notify(Integer.valueOf(orderId) * reason,
				builder.getNotification());
	}

}
