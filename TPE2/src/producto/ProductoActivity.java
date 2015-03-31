package producto;

import java.io.IOException;

import klosh.SuperActivity;

import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.BasicResponseHandler;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.Intent;
import android.net.http.AndroidHttpClient;
import android.os.AsyncTask;
import android.os.Bundle;
import android.widget.ImageView;
import android.widget.TextView;

import com.example.klosh.R;

public class ProductoActivity extends SuperActivity {

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		setContentView(R.layout.activity_producto);
		super.onCreate(savedInstanceState);
		Intent myIntent = getIntent();
		int id = myIntent.getIntExtra("id", 0);
		String t = myIntent.getStringExtra("title");
		setTitle(t);
		String url = "http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=GetProductById&id="
				+ id;
		new GetProduct().execute(url);
	}

	private class GetProduct extends AsyncTask<String, Void, String> {

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
			if (err == null) {

				JSONArray attributes = null, talles = null;
				JSONObject product = null;
				String marca = null, mat = null, gen = null, ed = null, oc = null, tallesStr = "";
				int j;
				try {
					product = res.getJSONObject("product");
					attributes = product.getJSONArray("attributes");
					for (j = 0; j < attributes.length(); j++) {
						if (attributes.getJSONObject(j).get("name")
								.equals("Marca")) {
							marca = attributes.getJSONObject(j)
									.getJSONArray("values").getString(0);
						} else if (attributes.getJSONObject(j)
								.getString("name").contains("Material")) {
							mat = attributes.getJSONObject(j)
									.getJSONArray("values").getString(0);
						} else if (attributes.getJSONObject(j)
								.getString("name").contains("Genero")) {
							gen = attributes.getJSONObject(j)
									.getJSONArray("values").getString(0);
						} else if (attributes.getJSONObject(j)
								.getString("name").contains("Edad")) {
							ed = attributes.getJSONObject(j)
									.getJSONArray("values").getString(0);
						} else if (attributes.getJSONObject(j)
								.getString("name").contains("Ocasion")) {
							oc = attributes.getJSONObject(j)
									.getJSONArray("values").getString(0);
						} else if (attributes.getJSONObject(j)
								.getString("name").contains("Talle")) {
							talles = attributes.getJSONObject(j)
									.getJSONArray("values");
							for(int l = 0; l < talles.length(); l++){
								if ( l != 0 ){
									tallesStr += " - ";
								}
								tallesStr += talles.getString(l);
							}
						}
					}
					ImageView iv = (ImageView) findViewById(R.id.images);
					new DownloadImage(iv).execute(product.getJSONArray("imageUrl").getString(0));
					
					TextView nombre = (TextView) findViewById(R.id.nombreP);
					nombre.setText(product.getString("name") + " - " + marca);
					TextView precio = (TextView) findViewById(R.id.precioP);
					precio.setText("$" + product.getString("price"));
					TextView material = (TextView) findViewById(R.id.materialP);
					material.setText(getResources()
							.getString(R.string.material) + " " + mat);
					TextView genero = (TextView) findViewById(R.id.generoP);
					genero.setText(getResources().getString(R.string.genero)
							+ " " + gen);
					TextView edad = (TextView) findViewById(R.id.edadP);
					edad.setText(getResources().getString(R.string.edad) + " "
							+ ed);
					TextView ocasion = (TextView) findViewById(R.id.ocasionP);
					if (oc == null)
						oc = "Casual";
					ocasion.setText(getResources().getString(R.string.ocasion)
							+ " " + oc);
					TextView tallesView = (TextView) findViewById(R.id.tallesP);
					if (tallesStr.equals("")){
						tallesStr = "Unico";
					}
					tallesView.setText(getResources()
							.getString(R.string.talles) + " " + tallesStr);
				} catch (JSONException e) {
					e.printStackTrace();
				}
			}
		}
	}

}
